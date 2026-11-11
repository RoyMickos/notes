/**
 * screen.ts: pre-screen long YouTube videos (conference talks and the like)
 * against an interest profile, so you only watch what is worth your time.
 *
 * One run screens one batch: a playlist, or one or more videos.
 *
 *   fetch   English captions via yt-dlp
 *   score   Claude Haiku reads each transcript and returns a structured verdict
 *           (direct calls for a few videos; the Message Batches API, at half
 *           price, for many)
 *   write   one Markdown note per video, plus a ranked report.md for the batch
 *
 * The notes describe the content (summary, tags, key points, concepts,
 * highlights with deep links). They're meant to be compared against an
 * existing knowledge base. The verdict (score, reason) goes in the report.
 *
 * Standalone: this file doesn't depend on anything else in the repo it came
 * from. Requirements:
 *   - Node 24+ (runs .ts directly), in a folder with "type": "module"
 *   - npm install @anthropic-ai/sdk zod
 *   - yt-dlp on PATH
 *   - ANTHROPIC_API_KEY in the environment
 *
 * Inputs:
 *   --profile  Markdown description of your interests (default ./profile.md)
 *   --tags     tag vocabulary (default ./_tags.md): under "# Tags", one
 *              "## <tag>" heading per tag, with a one-line description
 *              directly below it. Everything from "# Review notes" on is ignored.
 *
 * Output (default ./out/batch/):
 *   <video title>.md   one note per video
 *   report.md          the batch, ranked by relevance
 *   .cache/            transcripts and verdicts, so a re-run costs nothing.
 *                      Verdicts are keyed by a hash of model, prompt, profile
 *                      and tags, so changing either one triggers a re-score.
 *
 * Usage:
 *   node screen.ts <url> [<url> ...] [--profile p.md] [--tags t.md] [--out dir]
 *                  [--limit n] [--direct | --batch]
 *
 *   --limit   only the first n videos of each playlist
 *   --direct  score with direct calls, even for many videos
 *   --batch   score through the Batch API, even for a few videos (it usually
 *             finishes within an hour; Ctrl-C is safe, re-run to resume)
 */

import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { parseArgs } from "node:util";

const MODEL = "claude-haiku-5-5";
/** More unscored videos than this go through the Batch API, unless --direct. */
const BATCH_THRESHOLD = 10;
const FETCH_DELAY_MS = 3000;
const BACKOFF_MS = [30_000, 60_000, 120_000];
const POLL_MS = 30_000;

// ─── Arguments ──────────────────────────────────────────────────────────────

const { values: opts, positionals: urls } = parseArgs({
  allowPositionals: true,
  options: {
    profile: { type: "string", default: "profile.md" },
    tags: { type: "string", default: "_tags.md" },
    out: { type: "string", default: join("out", "batch") },
    limit: { type: "string" },
    direct: { type: "boolean", default: false },
    batch: { type: "boolean", default: false },
  },
});

function fail(message: string): never {
  console.error(message);
  console.error(
    "\nUsage: node screen.ts <url> [<url> ...] [--profile p.md] [--tags t.md] [--out dir] [--limit n] [--direct | --batch]",
  );
  process.exit(1);
}

if (urls.length === 0) fail("Give at least one playlist or video URL.");
for (const url of urls) if (!URL.canParse(url)) fail(`Not a URL: ${url}`);
if (opts.direct && opts.batch) fail("Use --direct or --batch, not both.");
const limit = opts.limit === undefined ? undefined : Number(opts.limit);
if (limit !== undefined && !(Number.isInteger(limit) && limit > 0)) fail("--limit must be a positive integer.");
for (const path of [opts.profile, opts.tags]) if (!existsSync(path)) fail(`File not found: ${path}`);

const OUT_DIR = resolve(opts.out);
const CACHE_DIR = join(OUT_DIR, ".cache");
const BATCH_STATE_PATH = join(CACHE_DIR, "batch-state.json");
mkdirSync(CACHE_DIR, { recursive: true });

// ─── Tags, schema and prompt ────────────────────────────────────────────────

function loadTags(path: string): { name: string; description: string }[] {
  const section = readFileSync(path, "utf8").split(/^# Review notes\s*$/m)[0];
  const tags = [...section.matchAll(/^## (\S+)\s*\n(.+)$/gm)].map(([, name, description]) => ({
    name,
    description: description.trim(),
  }));
  if (tags.length === 0) fail(`No "## <tag>" sections found in ${path}`);
  return tags;
}

const TAGS = loadTags(opts.tags);
const TAG_NAMES = TAGS.map((t) => t.name);
const PROFILE = readFileSync(opts.profile, "utf8");

// `summary` to `concepts` describe the content, the same for every viewer.
// `reason`, `relevance`, `verdict` and `highlights` judge it against the profile.
const Verdict = z.object({
  title: z.string().describe("Video title, from the transcript header"),
  speaker: z.string().describe("Speaker name(s), from the title or the talk itself; empty if unknown"),
  summary: z.string().describe("2-3 sentences on what the video actually covers"),
  tags: z
    .array(z.enum(TAG_NAMES as [string, ...string[]]))
    .describe("1-3 content tags from the tag list, most fitting first"),
  key_points: z.array(z.string()).describe("3-6 takeaways or claims the video actually makes, one sentence each"),
  concepts: z
    .array(z.string())
    .describe("Named patterns, techniques, tools, products and standards discussed, e.g. 'outbox pattern', 'CloudEvents'"),
  level: z.enum(["intro", "intermediate", "advanced"]),
  reason: z.string().describe("1-2 sentences tying the verdict to the viewer profile"),
  relevance: z.number().int().describe("0-10, how well the video matches the viewer profile"),
  verdict: z.enum(["WATCH", "MAYBE", "SKIP"]),
  highlights: z
    .array(
      z.object({
        timestamp: z.string().describe("As written in the transcript, e.g. 18:22"),
        note: z.string().describe("What is worth seeing there"),
      }),
    )
    .describe("2-5 segments worth watching; empty for SKIP"),
});
type Verdict = z.infer<typeof Verdict>;

const SCORING_PROMPT = `You pre-screen long technical videos, such as conference talks, for a busy viewer, so they only watch what is worth their time.

${PROFILE}

You will receive an auto-generated YouTube transcript (with timestamps, no punctuation, occasional mis-heard words). Judge the video against the viewer profile, by substance rather than by title or speaker reputation.

Score relevance with this rubric:
- 9-10: squarely on one or more interests, with depth or ideas a senior practitioner would not already know
- 7-8: clearly on an interest; worth the time even if parts are familiar
- 4-6: touches an interest only partly or superficially
- 0-3: off-profile, introductory, or a product pitch
Verdict: WATCH for 7+, MAYBE for 4-6, SKIP below 4. Use the full range; do not hedge toward the middle.

Describe the content (summary, tags, key points, concepts) as it is, independent of the viewer profile. Pick tags from this list by what the video is mainly about:
${TAGS.map((t) => `- ${t.name}: ${t.description}`).join("\n")}`;

/** Changes with model, prompt (including profile and tags) or schema: a new hash means re-scoring. */
const PROMPT_HASH = createHash("sha256")
  .update(MODEL + SCORING_PROMPT + JSON.stringify(z.toJSONSchema(Verdict)))
  .digest("hex")
  .slice(0, 12);

// zodOutputFormat returns { type, schema, parse }. Batch requests are sent as
// JSON, so keep only the plain part and validate responses in parseVerdict().
const { parse: _parse, ...VERDICT_FORMAT } = zodOutputFormat(Verdict);

function scoringParams(transcript: string): Anthropic.MessageCreateParamsNonStreaming {
  return {
    model: MODEL,
    max_tokens: 16000,
    system: [{ type: "text", text: SCORING_PROMPT, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: `<transcript>\n${transcript}\n</transcript>` }],
    output_config: { format: VERDICT_FORMAT },
  };
}

function parseVerdict(message: Anthropic.Message): Verdict {
  if (message.stop_reason === "refusal") throw new Error(`model declined: ${message.stop_details?.explanation}`);
  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  const raw = `stop_reason: ${message.stop_reason}, raw output: ${text.slice(0, 500)}`;
  let json: { tags?: unknown };
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`output is not JSON (${raw})`);
  }
  // The model occasionally picks a tag outside the list; drop it rather than the verdict.
  if (Array.isArray(json.tags)) {
    const dropped = json.tags.filter((t) => !TAG_NAMES.includes(t));
    if (dropped.length > 0) console.warn(`  dropped unknown tags ${JSON.stringify(dropped)}`);
    const known = json.tags.filter((t) => TAG_NAMES.includes(t));
    json.tags = known.length > 0 ? known : [TAG_NAMES.includes("other") ? "other" : TAG_NAMES[0]];
  }
  const parsed = Verdict.safeParse(json);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`invalid verdict: ${issues} (${raw})`);
  }
  return parsed.data;
}

// ─── Cache ──────────────────────────────────────────────────────────────────

const transcriptPath = (videoId: string) => join(CACHE_DIR, `${videoId}.txt`);
const verdictPath = (videoId: string, hash = PROMPT_HASH) => join(CACHE_DIR, `${videoId}.${hash}.json`);

function loadVerdict(videoId: string): Verdict | undefined {
  const path = verdictPath(videoId);
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")).verdict : undefined;
}

function saveVerdict(videoId: string, verdict: Verdict, usage: Anthropic.Usage, hash = PROMPT_HASH): void {
  writeFileSync(verdictPath(videoId, hash), JSON.stringify({ promptHash: hash, verdict, usage }, null, 2));
}

const totals = { input: 0, cacheWrite: 0, cacheRead: 0, output: 0 };
function addUsage(u: Anthropic.Usage): void {
  totals.input += u.input_tokens;
  totals.cacheWrite += u.cache_creation_input_tokens ?? 0;
  totals.cacheRead += u.cache_read_input_tokens ?? 0;
  totals.output += u.output_tokens;
}

// ─── YouTube (yt-dlp) ───────────────────────────────────────────────────────

interface Video {
  videoId: string;
  title: string;
  /** Seconds, if YouTube reports it. */
  duration?: number;
}

const videoUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`;

/** Every entry of a playlist, or the single video. */
function listVideos(url: string): Video[] {
  const out = execFileSync("yt-dlp", ["--flat-playlist", "--print", "%(id)s\t%(duration)s\t%(title)s", url], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return out
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [videoId, duration, ...title] = line.split("\t");
      const seconds = Number(duration);
      return { videoId, title: title.join("\t"), duration: Number.isFinite(seconds) ? seconds : undefined };
    });
}

/** English captions (uploaded if present, else auto-generated) as timestamped text, or undefined if none. */
function fetchTranscript(video: Video): string | undefined {
  const dir = mkdtempSync(join(tmpdir(), "screen-vtt-"));
  try {
    execFileSync(
      "yt-dlp",
      [
        "--skip-download",
        "--write-subs",
        "--write-auto-subs",
        "--sub-langs", "en,en-orig",
        "--sub-format", "vtt",
        "--sleep-subtitles", "1",
        "-o", join(dir, "%(id)s.%(ext)s"),
        videoUrl(video.videoId),
      ],
      { stdio: ["ignore", "ignore", "pipe"] },
    );
    const vttPath = [`${video.videoId}.en.vtt`, `${video.videoId}.en-orig.vtt`].map((f) => join(dir, f)).find(existsSync);
    if (!vttPath) return undefined;
    const lines = vttToSegments(readFileSync(vttPath, "utf8")).map((s) => `(${s.timestamp}) ${s.text}\n`);
    return [`Title: ${video.title}`, `URL: ${videoUrl(video.videoId)}`, "", ...lines].join("\n");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Auto-generated captions "roll": each cue repeats the previous line above the
 * new one, and new words carry inline timing tags. Stripping the tags and
 * dropping lines equal to the last emitted one leaves each spoken line once.
 */
function vttToSegments(vtt: string): { timestamp: string; text: string }[] {
  const segments: { timestamp: string; text: string }[] = [];
  let last = "";
  for (const cue of vtt.split(/\n\n+/)) {
    const timing = cue.match(/^(\d+):(\d+):(\d+)\.\d+ -->/m);
    if (!timing) continue;
    const [, h, m, s] = timing;
    const timestamp = Number(h) > 0 ? `${Number(h)}:${m}:${s}` : `${Number(m)}:${s}`;
    const lines = cue
      .slice(cue.indexOf("\n", timing.index) + 1)
      .split("\n")
      .map((l) =>
        l
          .replace(/<[^>]+>/g, "")
          .replace(/&nbsp;/g, " ")
          .replace(/&gt;/g, ">")
          .replace(/&lt;/g, "<")
          .replace(/&amp;/g, "&")
          .trim(),
      )
      .filter(Boolean);
    for (const line of lines) {
      if (line === last) continue;
      segments.push({ timestamp, text: line });
      last = line;
    }
  }
  return segments;
}

// ─── 1. Resolve the batch and fetch transcripts ─────────────────────────────

const videos: Video[] = [];
for (const url of urls) {
  const entries = listVideos(url).slice(0, limit);
  console.log(`${url}: ${entries.length} video${entries.length === 1 ? "" : "s"}`);
  for (const v of entries) if (!videos.some((x) => x.videoId === v.videoId)) videos.push(v);
}

const label = (i: number, v: Video) => `[${i + 1}/${videos.length}] ${v.title}`;
const noCaptions = new Set<string>();

for (const [i, video] of videos.entries()) {
  if (existsSync(transcriptPath(video.videoId))) continue;
  for (let attempt = 0; ; attempt++) {
    try {
      const transcript = fetchTranscript(video);
      if (transcript) writeFileSync(transcriptPath(video.videoId), transcript);
      else noCaptions.add(video.videoId);
      console.log(`${transcript ? "fetched " : "no subs "} ${label(i, video)}`);
      break;
    } catch (error) {
      const stderr = (error as { stderr?: Buffer }).stderr?.toString().trim().split("\n").pop();
      // HTTP 429 means "slow down": back off and retry the same video.
      if (stderr?.includes("HTTP Error 429") && attempt < BACKOFF_MS.length) {
        console.log(`429      ${label(i, video)}: backing off ${BACKOFF_MS[attempt] / 1000}s`);
        await sleep(BACKOFF_MS[attempt]);
        continue;
      }
      console.log(`FAILED   ${label(i, video)}: ${stderr ?? error}`);
      break;
    }
  }
  await sleep(FETCH_DELAY_MS);
}

// ─── 2. Score ───────────────────────────────────────────────────────────────

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

interface BatchState {
  batchId: string;
  promptHash: string;
  submittedAt: string;
}

/** Waits for a submitted batch and saves its verdicts. custom_id is the video id. */
async function collectBatch(state: BatchState): Promise<void> {
  let batch = await client.messages.batches.retrieve(state.batchId);
  while (batch.processing_status !== "ended") {
    const c = batch.request_counts;
    console.log(
      `${new Date().toLocaleTimeString()}  batch ${batch.processing_status}: ${c.processing} processing, ` +
        `${c.succeeded} succeeded, ${c.errored} errored  (Ctrl-C is safe; re-run to resume)`,
    );
    await sleep(POLL_MS);
    batch = await client.messages.batches.retrieve(state.batchId);
  }
  for await (const item of await client.messages.batches.results(state.batchId)) {
    const { result } = item;
    if (result.type === "succeeded") {
      addUsage(result.message.usage);
      try {
        // Saved under the hash the batch was submitted with; stale if the prompt changed since.
        saveVerdict(item.custom_id, parseVerdict(result.message), result.message.usage, state.promptHash);
      } catch (error) {
        console.log(`invalid  ${item.custom_id}: ${error instanceof Error ? error.message : error}`);
      }
    } else if (result.type === "errored") {
      console.log(`errored  ${item.custom_id}: ${result.error.error.type}: ${result.error.error.message}`);
    } else {
      console.log(`${result.type}  ${item.custom_id}`);
    }
  }
  rmSync(BATCH_STATE_PATH);
}

// A batch from an earlier, interrupted run is collected first, so it isn't paid for twice.
if (existsSync(BATCH_STATE_PATH)) {
  const state: BatchState = JSON.parse(readFileSync(BATCH_STATE_PATH, "utf8"));
  console.log(`\nResuming batch ${state.batchId} (submitted ${state.submittedAt})`);
  await collectBatch(state);
}

const todo = videos.filter((v) => existsSync(transcriptPath(v.videoId)) && !loadVerdict(v.videoId));
const useBatch = opts.batch || (!opts.direct && todo.length > BATCH_THRESHOLD);

if (todo.length > 0 && useBatch) {
  const batch = await client.messages.batches.create({
    requests: todo.map((v) => ({
      custom_id: v.videoId, // video ids fit custom_id's [a-zA-Z0-9_-]{1,64}
      params: scoringParams(readFileSync(transcriptPath(v.videoId), "utf8")),
    })),
  });
  const state: BatchState = { batchId: batch.id, promptHash: PROMPT_HASH, submittedAt: new Date().toISOString() };
  writeFileSync(BATCH_STATE_PATH, JSON.stringify(state, null, 2));
  console.log(`\nSubmitted batch ${batch.id} with ${todo.length} videos (billed at 50%)`);
  await collectBatch(state);
} else if (todo.length > 0) {
  console.log("");
  // Sequential on purpose: the first request writes the prompt cache, the rest read it.
  for (const [i, video] of todo.entries()) {
    process.stdout.write(`scoring  [${i + 1}/${todo.length}] ${video.title} ... `);
    try {
      const response = await client.messages.create(scoringParams(readFileSync(transcriptPath(video.videoId), "utf8")));
      addUsage(response.usage);
      const verdict = parseVerdict(response);
      saveVerdict(video.videoId, verdict, response.usage);
      console.log(`${verdict.verdict} ${verdict.relevance}/10`);
    } catch (error) {
      console.log(`FAILED: ${error instanceof Error ? error.message : error}`); // retried on the next run
    }
  }
}

// ─── 3. Write notes and report ──────────────────────────────────────────────

const yamlString = (s: string) => JSON.stringify(s); // a JSON string is a valid YAML scalar

function formatDuration(seconds: number | undefined): string {
  if (seconds === undefined) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}

/** Timestamp "1:02:03" → a link to that second of the video. */
function linkAt(videoId: string, timestamp: string): string {
  const parts = timestamp.match(/^\d+(?::\d+)+/)?.[0].split(":").map(Number);
  if (!parts) return `**${timestamp}**`;
  const seconds = parts.reduce((total, n) => total * 60 + n, 0);
  return `[**${timestamp}**](${videoUrl(videoId)}&t=${seconds}s)`;
}

/** Note file name from the title, without characters that file systems or Obsidian links reject. */
function noteName(title: string, taken: Set<string>): string {
  const base = title.replace(/[\\/:*?"<>|#^[\]]/g, "-").replace(/\s+/g, " ").trim().slice(0, 150) || "untitled";
  let name = base;
  for (let n = 2; taken.has(name.toLowerCase()); n++) name = `${base} (${n})`;
  taken.add(name.toLowerCase());
  return `${name}.md`;
}

function renderNote(video: Video, v: Verdict): string {
  return [
    "---",
    `title: ${yamlString(v.title)}`,
    `speaker: ${yamlString(v.speaker)}`,
    `url: ${videoUrl(video.videoId)}`,
    `video_id: ${video.videoId}`,
    `duration: ${yamlString(formatDuration(video.duration))}`,
    `screened: ${new Date().toISOString().slice(0, 10)}`,
    `level: ${v.level}`,
    `relevance: ${v.relevance}`,
    `verdict: ${v.verdict}`,
    `tags: [${v.tags.join(", ")}]`,
    "---",
    "",
    `# ${v.title}`,
    "",
    v.tags.map((t) => `#${t}`).join(" "),
    "",
    "## Summary",
    "",
    v.summary,
    "",
    "## Key points",
    "",
    ...v.key_points.map((p) => `- ${p}`),
    "",
    "## Concepts",
    "",
    v.concepts.join(", "),
    "",
    "## Highlights",
    "",
    ...v.highlights.map((h) => `- ${linkAt(video.videoId, h.timestamp)} ${h.note}`),
    "",
  ].join("\n");
}

const taken = new Set<string>();
const screened = videos
  .map((video) => ({ video, verdict: loadVerdict(video.videoId) }))
  .filter((s): s is { video: Video; verdict: Verdict } => s.verdict !== undefined)
  .map((s) => ({ ...s, note: noteName(s.verdict.title, taken) }))
  .sort((a, b) => b.verdict.relevance - a.verdict.relevance);

for (const { video, verdict, note } of screened) writeFileSync(join(OUT_DIR, note), renderNote(video, verdict));

const cell = (s: string) => s.replace(/\|/g, "\\|");
const noteLink = (title: string, note: string) => `[${title}](<${note}>)`;
const unscreened = videos.filter((v) => !screened.some((s) => s.video.videoId === v.videoId));

const report = [
  "# Screening report",
  "",
  `Screened ${new Date().toISOString().slice(0, 10)} against \`${opts.profile}\` and \`${opts.tags}\`, ` +
    `${screened.length} of ${videos.length} videos. Model ${MODEL}, prompt ${PROMPT_HASH}.`,
  "",
  "| Score | Verdict | Level | Length | Video |",
  "|---:|---|---|---:|---|",
  ...screened.map(
    ({ video, verdict: v, note }) =>
      `| ${v.relevance} | ${v.verdict} | ${v.level} | ${formatDuration(video.duration)} | ${noteLink(cell(v.title), note)} |`,
  ),
  "",
  ...screened.flatMap(({ video, verdict: v, note }) => [
    `## ${v.relevance}/10 ${v.verdict}: ${noteLink(v.title, note)}`,
    "",
    `*${v.level}* · ${v.tags.map((t) => `#${t}`).join(" ")} · [YouTube](${videoUrl(video.videoId)})`,
    "",
    v.summary,
    "",
    `**Why:** ${v.reason}`,
    "",
    ...v.highlights.map((h) => `- ${linkAt(video.videoId, h.timestamp)} ${h.note}`),
    "",
  ]),
  ...(unscreened.length > 0
    ? [
        "## Not screened",
        "",
        ...unscreened.map(
          (v) =>
            `- [${v.title}](${videoUrl(v.videoId)}): ${noCaptions.has(v.videoId) ? "no English captions" : "fetch or scoring failed; re-run to retry"}`,
        ),
        "",
      ]
    : []),
].join("\n");
writeFileSync(join(OUT_DIR, "report.md"), report);

console.log(`\n${screened.length} of ${videos.length} videos screened → ${OUT_DIR}`);
for (const { verdict: v } of screened.slice(0, 10)) console.log(`  ${String(v.relevance).padStart(2)} ${v.verdict.padEnd(5)} ${v.title}`);
if (totals.input + totals.cacheRead + totals.output > 0) {
  console.log(
    `Tokens this run: ${totals.input} uncached in / ${totals.cacheWrite} cache write / ` +
      `${totals.cacheRead} cache read / ${totals.output} out` +
      (useBatch ? " (batch: billed at 50%)" : ""),
  );
}

---
name: video-screener
description: Pre-screen long YouTube videos (conference talks, playlists of a whole conference, single long videos) against the user's interest profile, to decide which are worth watching. Use when the user gives YouTube video or playlist URLs and asks whether they're worth watching, wants a conference playlist filtered, or wants summary notes of talks for their knowledge base. Produces one Markdown note per video in `raw/video`, and a ranked report as a `videos` entry in `journal`.
---

# Screen videos

`screen.sh` decides whether long videos are worth the user's time before they watch them. It fetches each video's English captions, has Claude Haiku read the full transcript, scores it against the user's interest profile, and writes the results as Markdown.

It works one **batch** at a time: a playlist, or one or more videos. It doesn't keep a catalog across batches. Discovery is handled elsewhere (YouTube search). Whether the knowledge base already covers a talk is checked afterwards with the `kb-rank` skill (see below).

## When to use

- The user shares a conference playlist and asks which talks to watch.
- The user shares one or more long videos and asks whether they're worth it, or what they cover.
- The user wants summary notes of talks so they can be compared with existing notes in the knowledge base.

It is not for short videos, videos without English captions, or searching YouTube.

## Requirements

- Node 24 or newer (runs `.ts` directly), in a folder whose `package.json` has `"type": "module"`, with `@anthropic-ai/sdk` and `zod` installed.
- `yt-dlp` on PATH.
- `ANTHROPIC_API_KEY` in the environment.
- An interest profile and a tag vocabulary. In this repo they are `_profile.md` and `_tags.md` in the root.
- `op` (1Password CLI): `screen.sh` reads the API key from 1Password.

## Usage

`screen.sh` is the wrapper for this repo. It runs from any folder and passes the repo defaults below to `scripts/screen.ts`; options you give override them. It requires `--out`, because the batch folder also holds the state for resuming an interrupted run. Relative paths resolve against the current directory.

```sh
.agents/skills/video-screener/screen.sh <url> [<url> ...] [--profile p.md] [--tags t.md] [--out dir] [--limit n] [--direct | --batch]
```

| Option | Default | Meaning |
|---|---|---|
| `<url>` | (required) | YouTube playlist or video URLs, in any mix; duplicates are screened once |
| `--profile` | `_profile.md` in the repo root | The viewer's interests and what they want to avoid, in free Markdown |
| `--tags` | `_tags.md` in the repo root | Tag vocabulary; see the format below |
| `--out` | (required) | Output folder: `raw/video/<entry name>`, see below |
| `--limit` | all | Only the first n videos of each playlist |
| `--direct` | | Score with direct API calls, even for many videos |
| `--batch` | | Score through the Message Batches API, even for a few videos |

Examples:

```sh
screen.sh "https://youtu.be/VIDEO_ID" --out "raw/video/2026-11-10 videos"
screen.sh "https://www.youtube.com/playlist?list=PLAYLIST_ID" --out "raw/video/2026-11-10 videos 2"
screen.sh "https://www.youtube.com/playlist?list=PLAYLIST_ID" --out "raw/video/2026-11-10 videos 2" --limit 5 --direct
```

### Tag file format

Only the `# Tags` section is read. Each tag is a `## <tag>` heading with a one-line description directly below it. That line tells the model where the tag's boundaries are. Anything from `# Review notes` on is ignored.

```markdown
# Tags

## distributed-systems
Event-driven systems, messaging, queues, sagas, workflows and durable execution, idempotency, resilience patterns.
- Tag: #distributed-systems
```

## Output

In the `--out` folder (raw material for ingest, not part of the knowledge base):

- **`<video title>.md`**, one note per video:
  - Frontmatter: title, speaker, url, video_id, duration, screened date, level, relevance (0–10), verdict (WATCH, MAYBE or SKIP), tags.
  - Body: the `#tags`, then a Summary, Key points, Concepts (named patterns, tools and standards), and Highlights, each linking to its timestamp in the video.
  - The body describes the content only, independent of the profile. That makes it suitable for similarity checks against the knowledge base.
- **`report.md`**: the batch ranked by relevance. It has a table with score, verdict, level and length, then for each video the summary, the reason for its score, and the highlights. Videos that couldn't be screened are listed at the end, with the reason.
- **`.cache/`**: transcripts and verdicts.

The tool's `report.md` ranks by the profile score only. The entry you write to `journal` (see below) is the report for the user.

### Scoring rubric

- **9–10:** squarely on an interest, with depth a senior practitioner wouldn't already know.
- **7–8:** clearly on an interest.
- **4–6:** touches an interest only partly.
- **0–3:** off-profile, introductory, or a product pitch.

The verdict is WATCH for 7 or more, MAYBE for 4–6, and SKIP below 4.

## How to run it for the user

1. **Read the brief.** Read `_intent.md` and `_objectives.md` in the repository root. The tool scores against `_profile.md` only; the objectives are applied by you in step 5.
2. **Name the batch.** The batch becomes a journal entry of the kind `videos`, named by the journal convention in `AGENTS.md`: `<date> videos`, or `<date> videos 2` (and so on) if `journal/` already has a videos entry for today. Use the same name for the output folder, `raw/video/<entry name>`, so that the entry and its notes pair up. When resuming an interrupted batch, reuse its folder and name instead of taking the next number. Run the commands from the repository root.
3. **Check the size and cost before running.** Every scoring call is billed.
   - One hour-long talk costs well under a cent at direct prices (about $0.15 for 60 talks).
   - Batches of more than 10 unscored videos go through the Batch API automatically, at half price. A batch usually finishes within an hour (24 hours at most).
   - For a large playlist, tell the user the number of videos first. Offer `--limit` if they want a sample, and `--direct` if they need results within minutes.
4. **Run it.** If a batch run is interrupted (Ctrl-C, timeout), run the same command again. It collects the batch already in flight instead of paying for a second one.
5. **Rank against the knowledge base and the objectives.** Run the `kb-rank` skill (`.agents/skills/kb-rank/SKILL.md`) on the notes, which costs no tokens:

   ```sh
   node .agents/skills/kb-rank/scripts/rank.ts raw/video/<entry name>/ --top 0 -o "$TMPDIR/video-ranked.json"
   ```

   Then adjust the tool's verdicts with your own judgement, following "What concerns me" in `_intent.md`:
   - A talk that serves an objective moves up, even if the profile score is MAYBE or the knowledge base has nothing on the topic yet.
   - A WATCH or MAYBE talk flagged `possibly_covered` moves down, unless its key points add something that the matching notes (`kb_matches`) lack. Open the matching notes to check.
   - Talks that relate to existing notes but are not covered by them are the best picks after the objectives.
6. **Write the journal entry** `journal/<entry name>.md`, from `report.md` and the ranking. Use the same frontmatter as the news entries, with the batch instead of the period:

   ```markdown
   ---
   kind: journal
   batch: <conference or playlist name, or "single videos"> (<n> videos)
   tags:
     - journal
   ---
   # <entry name>
   ```

   - Start with a short paragraph on the batch and its theme.
   - Name the talks worth watching with their one-line reasons, the objective each serves (if any), the related notes as `[[wikilinks]]`, the best timestamps, and links to the video and to its note in `raw/video/<entry name>/`. Then list the MAYBEs briefly. Leave out the SKIPs.
   - Say where and why you changed a verdict, for example "WATCH, but already covered by [[Buses and Queues]]", so the user can tune the profile.
   - List the videos that were not screened, and any objective that got no matching talk.

   Append `## [<date>] journal <entry name>` to `_log.md`. Then reply to the user with the picks in a few lines and the entry's name; don't paste the whole entry.
7. **Offer the follow-up.** Covered talks may still have details worth merging into the matching note, and talks the user has watched can be ingested with the `ingest` skill, with the video as the reference. The user decides what to keep.

## Behaviour to know

- **Caching:** re-running the same batch costs nothing. Verdicts are cached under a hash of the model, prompt, profile and tag list, so editing the profile or tags re-scores everything on the next run. Old verdicts stay in the cache.
- **Notes are overwritten** on every run from the cached verdicts. Don't edit notes in the output folder; copy them elsewhere first.
- **No English captions:** those videos are listed as not screened, and are tried again on the next run.
- **YouTube rate limits** (HTTP 429): the tool waits and retries automatically. A large playlist takes a few seconds per video to fetch.
- **Unknown tags:** a tag outside the vocabulary is dropped with a warning. If none are left, the video gets `other`.
- **Privacy:** the transcripts, the profile and the tag descriptions are sent to the Anthropic API. Keep personal or client-specific details out of the profile and tag descriptions.

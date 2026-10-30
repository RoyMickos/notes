#!/usr/bin/env node
/**
 * Rank articles produced by fetch_feeds.py against the knowledge base using qmd.
 *
 * Usage:
 *   uv run journal/fetch_feeds.py | node journal/rank_articles.ts [--top 10] [-o ranked.json]
 *   node journal/rank_articles.ts feeds.json
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { parseArgs } from "node:util";
import { createStore, type HybridQueryResult } from "@tobilu/qmd";

const ROOT = dirname(import.meta.dirname);
const CONFIG_PATH = join(ROOT, ".qmd", "index.yml");
const DB_PATH = join(ROOT, ".qmd", "index.sqlite");

type FeedItem = {
  feed: string;
  title: string | null;
  url: string | null;
  summary: string | null;
  content: string | null;
  [key: string]: unknown;
};

type FeedDocument = {
  generated_at: string;
  since: string;
  feeds: unknown[];
  items: FeedItem[];
};

type KbMatch = { path: string; title: string; score: number; similarity: number; rerank: number | null };

const HELP = `Rank fetched feed articles by relevance to the knowledge base.

Usage: node journal/rank_articles.ts [input.json] [options]
Reads fetch_feeds.py output from the file or stdin and writes ranked JSON.

Options:
  --top N                  keep full content for the N highest ranked items (default 10)
  --matches N              knowledge base matches to report per item (default 3)
  --min-score X            drop items with relevance below X (default 0)
  --covered-threshold X    flag items at or above X as possibly_covered
                           (default 0.75, or 0.65 with --no-rerank)
  --lead-words N           words of article text used as a search query (default 200)
  --excerpt-words N        words kept for items beyond --top (default 60)
  --no-rerank              skip LLM reranking, score by vector similarity only
  --no-update              skip re-indexing the knowledge base before ranking
  -o, --output FILE        write JSON to FILE instead of stdout
  -h, --help               show this help`;

function log(msg: string): void {
  process.stderr.write(`${msg}\n`);
}

function words(text: string | null | undefined, count: number): string {
  if (!text) return "";
  return text.split(/\s+/).filter(Boolean).slice(0, count).join(" ");
}

function stripMarkdown(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|]+/g, " ");
}

// qmd treats a leading "-" as negation, which vec/hyde queries reject.
function queryText(text: string): string {
  return text.replace(/(^|\s)-+(?=\S)/g, "$1");
}

function relativePath(result: HybridQueryResult): string {
  return result.displayPath.replace(/^[^/]+\//, "");
}

// The blended qmd score is position-based and not comparable across queries,
// so score with absolute signals: vector similarity, averaged with the
// reranker's relevance probability when reranking is on.
function toMatch(result: HybridQueryResult, rerank: boolean): KbMatch {
  const explain = result.explain;
  const similarity = round(Math.max(0, ...(explain?.vectorScores ?? [])));
  const rerankScore = rerank && explain ? round(explain.rerankScore) : null;
  const score = rerankScore === null ? similarity : round((similarity + rerankScore) / 2);
  return { path: relativePath(result), title: result.title, score, similarity, rerank: rerankScore };
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

async function readInput(file: string | undefined): Promise<FeedDocument> {
  if (file) return JSON.parse(readFileSync(file, "utf-8"));
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return JSON.parse(Buffer.concat(chunks).toString("utf-8"));
}

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      top: { type: "string", default: "10" },
      matches: { type: "string", default: "3" },
      "min-score": { type: "string", default: "0" },
      "covered-threshold": { type: "string" },
      "lead-words": { type: "string", default: "200" },
      "excerpt-words": { type: "string", default: "60" },
      "no-rerank": { type: "boolean", default: false },
      "no-update": { type: "boolean", default: false },
      output: { type: "string", short: "o" },
      help: { type: "boolean", short: "h", default: false },
    },
  });
  if (values.help) {
    console.log(HELP);
    return;
  }

  const top = Number(values.top);
  const matchCount = Number(values.matches);
  const minScore = Number(values["min-score"]);
  const rerank = !values["no-rerank"];
  const coveredThreshold = Number(values["covered-threshold"] ?? (rerank ? 0.75 : 0.65));
  const leadWords = Number(values["lead-words"]);
  const excerptWords = Number(values["excerpt-words"]);

  const input = await readInput(positionals[0]);

  // Collection paths in .qmd/index.yml are relative to the repository root.
  process.chdir(ROOT);
  const store = await createStore({ dbPath: DB_PATH, configPath: CONFIG_PATH });

  try {
    if (!values["no-update"]) {
      const updated = await store.update();
      log(`[index] ${updated.indexed} new, ${updated.updated} updated, ${updated.removed} removed`);
      if (updated.needsEmbedding > 0) {
        const embedded = await store.embed();
        log(`[index] embedded ${embedded.chunksEmbedded} chunks from ${embedded.docsProcessed} documents`);
      }
    }

    const ranked = [];
    for (const [i, item] of input.items.entries()) {
      const title = item.title ?? "";
      const summary = stripMarkdown(item.summary);
      const lead = queryText(words(stripMarkdown(item.content), leadWords));

      const queries = [
        { type: "vec" as const, query: queryText([title, words(summary, 60)].filter(Boolean).join(". ")) || lead },
      ];
      if (lead) queries.push({ type: "hyde" as const, query: lead });

      let matches: KbMatch[] = [];
      let error: string | null = null;
      if (queries[0].query) {
        try {
          const results = await store.search({ queries, limit: matchCount, rerank, explain: true });
          matches = results.map((r) => toMatch(r, rerank)).sort((a, b) => b.score - a.score);
        } catch (err) {
          error = err instanceof Error ? err.message : String(err);
          log(`[rank] ${title}: ${error}`);
        }
      }

      const relevance = matches[0]?.score ?? 0;
      log(`[rank] ${i + 1}/${input.items.length} ${relevance.toFixed(2)} ${title}`);
      ranked.push({
        ...item,
        relevance,
        possibly_covered: relevance >= coveredThreshold,
        kb_matches: matches,
        ...(error ? { rank_error: error } : {}),
      });
    }

    const kept = ranked
      .filter((item) => item.relevance >= minScore)
      .sort(
        (a, b) => Number(a.possibly_covered) - Number(b.possibly_covered) || b.relevance - a.relevance,
      )
      .map((item, index) => {
        if (index < top || !item.content) return item;
        return { ...item, content: null, excerpt: words(item.content, excerptWords) };
      });

    const output = {
      ...input,
      ranking: {
        ranked_at: new Date().toISOString(),
        score: rerank ? "rerank" : "vector",
        top,
        min_score: minScore,
        covered_threshold: coveredThreshold,
        dropped: ranked.length - kept.length,
      },
      items: kept,
    };

    const payload = JSON.stringify(output, null, 2);
    if (values.output) {
      writeFileSync(values.output, `${payload}\n`, "utf-8");
      log(`wrote ${kept.length} ranked items to ${values.output}`);
    } else {
      process.stdout.write(`${payload}\n`);
    }
  } finally {
    await store.close();
  }
}

await main();

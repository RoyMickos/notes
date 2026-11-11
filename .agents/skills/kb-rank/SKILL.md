---
name: kb-rank
description: Rank new material (fetched articles, video screening notes, other Markdown notes) by similarity to the existing knowledge base notes, using the local qmd index. Used by the journal, video-screener and ingest skills to find what is new, what is already covered, and which existing notes to link to.
---

# Ranking against the knowledge base

Rank new material by how closely it relates to the existing notes, so that only the most relevant items need to be read in full, and so that material the knowledge base already covers can be spotted.

The ranking runs locally with [qmd](https://github.com/tobi/qmd) and uses no LLM tokens. The qmd index lives in `.qmd/` (`index.yml` defines which notes are indexed; the SQLite index is not committed). `raw/`, `journal/` and the special `_*.md` files are not indexed, so material waiting in `raw` does not match itself. The script re-indexes changed notes before ranking. On first run qmd downloads its local models (~1 GB) to `~/.cache/qmd/models/`. If `scripts/node_modules` in this folder is missing, run `npm install` in `.agents/skills/kb-rank/scripts/` first.

## Input

Run from the repository root. The script takes either of:

- **Feed JSON** from the journal's `fetch_feeds.py`, as a file or on stdin:

  ```sh
  uv run .agents/skills/journal/scripts/fetch_feeds.py --since 7d | node .agents/skills/kb-rank/scripts/rank.ts --top 10 -o "$TMPDIR/ranked.json"
  ```

- **Markdown notes**, as files or directories (a directory means the `*.md` files directly in it, except `report.md`):

  ```sh
  node .agents/skills/kb-rank/scripts/rank.ts raw/video/2026-11-10/ --top 0 -o "$TMPDIR/ranked.json"
  ```

  The title comes from the frontmatter `title` or the first `#` heading, the summary from a `## Summary` section, and the content from the body. Notes with a short summary and a list of key points, like the video screener's, rank best.

## Options

- `--top N` keep full `content` for the N highest ranked items (default 10); the rest get a short `excerpt` instead. Use `--top 0` for notes you will read from disk anyway.
- `--min-score X` drop items with relevance below X
- `--covered-threshold X` relevance at which an item is flagged `possibly_covered` (default 0.75)
- `--matches N` knowledge base matches to report per item (default 3)
- `--no-rerank` faster, vector similarity only (covered threshold then defaults to 0.65)
- `--no-update` skip re-indexing, when the notes have not changed since the last run

## Output

The input document (for Markdown input, `{ generated_at, source: "markdown", items }` with each item's `path`, `title`, `url` and `summary`) with a `ranking` block added and each item extended with:

- `relevance`: 0–1, the best match's score. Roughly: above 0.75 the knowledge base already covers the topic, 0.4–0.75 clearly related, 0.2–0.4 loosely related, below 0.2 unrelated.
- `possibly_covered`: true when the item closely matches an existing note. These items are sorted last; they may still contain updates worth merging into the matching note, but should not be presented as new topics.
- `kb_matches[]`: the closest notes (`path`, `title`, `score`, `similarity`, `rerank`). Use these as the candidate connections when discussing an item with the user or ingesting it.

Items are sorted with new material first, by relevance.

## Interpreting the scores

Relevance measures overlap with existing notes, not quality or importance, and it knows nothing about `_objectives.md`. Use it to set priorities, then apply judgement:

- Material that serves an objective stays high priority even when it scores low (the knowledge base may have nothing on the objective yet) or when related notes exist, as long as its specific content is not already in the notes. Check `kb_matches` to tell the two apart.
- `possibly_covered` items are noise unless they change something in the matching note.
- Skim the titles of low-ranked items for interesting new topics; a low score alone is no reason to drop something.

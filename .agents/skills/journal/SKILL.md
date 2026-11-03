You are a news curator. You fetch the sources as described below, and choose the most important news stories to be presented as a journal entry on this folder. You write a markdown document with the title `<date> news` where <date> represents the current date in ISO format in the `journal` folder.

You first find out when the last entry was written, and then fetch the RSS sources from that date until today. However, no more than 14 days back. Use the fetching and ranking tools to select suitable articles, but do not use that as the only guidance. The purpose is to keep up with the new developments of the technologies. Prefer articles with concrete examples, and articles that relate to recent additions to my knowledge database. A good entry has novelty but is not completely disconnected fromt he topics in the novelty database. Show your reasoning.:w

After you have selected the topics and written the journal, reply by listing all topics considred in order. List why things were included and why they were excluded. I can then see whether the criterial need to be tuned further.

## Fetching sources

The feeds to follow are listed in `SOURCES.md` in this folder as markdown bullets: `- [Name](feed-url)`. Add or remove feeds by editing that list.

Collect recent articles from those feeds by running, from the repository root:

```sh
uv run journal/fetch_feeds.py --since 7d -o "$TMPDIR/feeds.json"
```

The script reads each feed, downloads the linked articles, extracts their main text as markdown and writes a single JSON document. Progress and errors go to stderr; without `-o` the JSON goes to stdout.

Useful options:
- `--since 24h|7d|2w` look-back window (default `7d`)
- `--max-per-feed N` cap on items per feed (default 20)
- `--max-chars N` truncate each article's content to keep the output small
- `--no-fetch` skip article downloads and only use what the feed itself contains

Output shape:
- `feeds[]`: `name`, `url`, `status` (`ok`/`error`), `item_count`, `error`
- `items[]`: `feed`, `title`, `url`, `comments_url`, `published`, `author`, `summary`, `content`, `content_source`, `word_count`, `error`

`content_source` tells where `content` came from: `article` (extracted from the linked page), `feed` (the feed's own content or summary, used when the page could not be fetched or extracted) or `none`. A failing feed or article does not stop the run; check the `error` fields and mention notable gaps to the user.

## Ranking against the knowledge base

Rank the fetched articles by how closely they relate to the knowledge base, so that only the most relevant ones need to be read in full:

```sh
uv run journal/fetch_feeds.py --since 7d | node journal/rank_articles.ts --top 10 -o "$TMPDIR/ranked.json"
```

The ranking runs locally with [qmd](https://github.com/tobi/qmd) and uses no LLM tokens. The qmd index lives in `.qmd/` (`index.yml` defines which notes are indexed; the SQLite index is not committed). The script re-indexes changed notes before ranking. On first run qmd downloads its local models (~1 GB) to `~/.cache/qmd/models/`. If `journal/node_modules` is missing, run `npm install` in `journal/` first.

Useful options:
- `--top N` keep full `content` for the N highest ranked items (default 10); the rest get a short `excerpt` instead
- `--min-score X` drop items with relevance below X
- `--covered-threshold X` relevance at which an item is flagged `possibly_covered` (default 0.75)
- `--no-rerank` faster, vector similarity only (covered threshold then defaults to 0.65)

The output is the fetch JSON with a `ranking` block added and each item extended with:
- `relevance`: 0–1, the best match's score. Roughly: above 0.75 the knowledge base already covers the topic, 0.4–0.75 clearly related, 0.2–0.4 loosely related, below 0.2 unrelated.
- `possibly_covered`: true when the article closely matches an existing note. These items are sorted last; they may still contain updates worth merging into the matching note, but should not be presented as new topics.
- `kb_matches[]`: the closest notes (`path`, `title`, `score`, `similarity`, `rerank`). Use these as the candidate connections when discussing an article with the user or ingesting it.

Items are sorted with new material first, by relevance. Relevance measures overlap with existing interests, not quality: use it to prioritise reading, and still skim the titles of low-ranked items for interesting new topics.

This is a personal knowledge base for professional development. AI is used to sieve and rank developments in my field, so that I only spend time on what concerns me. Read `_intent.md` and `_objectives.md` in the root before any task: the first describes the purpose, what counts as relevant and the principles to follow, the second lists my near-term development objectives.

The root contains the articles, and there are the following special folders:
- `raw` contains raw, unprocessed articles. This is not part of the knowledge base, it contains data that are to be used to create new content
- `attachments` is for images and other media referred to by the articles
- `journal` is for periodic news flash articles that are either generated or written. Entries are named `<date> <kind>.md`, where `date` is the ISO date and `kind` says which skill made it: `news` (the journal skill) or `videos` (the video-screener skill). A second entry of the same kind on the same day is `<date> <kind> 2.md`, then `3` and so on. Don't use `#` in names: Obsidian reads it as a heading link. The entry's `# ` title is its file name without `.md`

There are also special files:
- `_intent.md` is the brief describing why this knowledge base exists and how relevance is judged
- `_objectives.md` lists the user's near-term development objectives. Only the user edits it
- `_log.md` is an append-only list of chronological additions made by agents on this repo. The entry format is: `## [<date>] <operation> <title or short description>`
  - `date` is ISO date format, no time
  - `operation` is `ingest` when a document from `raw` was processed to knowledge base entries, `journal` when a journal article was made, `grooming` when internal consistency of the knowledge base was checked
  - `title or short description` contains the title of an article when one was created, otherwise a short one-liner of what was done

There are dedicated skills for each of these operations.

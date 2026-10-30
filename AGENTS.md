This is a knowledge base. The root contains the articles, and there are the following special folders:
- `raw` contains raw, unprocessed articles. This is not part of the knowledge base, it contains data that are to be used to create new content
- `attachments` is for images and other media referred to by the articles
- `journal` is for periodic news flash articles that are either generated or written
There's also a special file: `_log.md` that is an append-only list of chronological additions made by agents on this repo. The entry format is: `## [<date>] <operation> <title or short description>`
- `date` is ISO date format, no time
- `operation` is `ingest` whe a document from `raw` was processed to knowledge base entries, `journal` when a journal article was made, `grooming` when interal consistency of the knowledge base was checked
- `title or short description` contains the title of an article when one was created, otherwise a short one-liner of what was done
There are dedicated skills for each of these operations.

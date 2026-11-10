# Intent

This knowledge base supports my personal development. Its main job is to save my time. I use AI to sieve and rank what is happening in my field. If the AI can find the developments that concern me, I don't have to read the news only to find out that most of it is of no interest.

## How it works

- **The knowledge base is my interest profile.** The notes in the root show what I know and care about. As the notes grow, the filter gets sharper.
- **The objectives are where I want to grow.** `_objectives.md` lists my near-term development objectives. They point at topics I want in the knowledge base, even where it has little or nothing on them yet.
- **The journal is the sieve.** Feeds are fetched, ranked against the knowledge base, and condensed into a short journal entry. I read the journal, not the feeds.
- **Ingest makes knowledge compound.** Anything worth keeping is merged into existing notes and linked to related ones. Only content that doesn't fit an existing note becomes a new note.
- **Grooming keeps the profile accurate.** Notes that are stale, duplicated or contradictory weaken the ranking.

## What "concerns me" means

- It **serves an objective**. Material that advances one of my objectives ranks highest, as long as its specific content is not already in my notes. The knowledge base already having notes on the topic does not lower its priority.
- It is **new to me but related to what I know**. Developments next to existing notes are the next most valuable. Material the knowledge base already covers is noise unless it changes something. Topics with no link to my notes or my objectives rarely matter.
- It is **concrete**: examples, code, configs, incidents and numbers, not announcements or opinion.
- It is **actionable**: it changes how I build, operate or secure things, or what I should learn next.
- **Security issues** in tools and platforms I use always qualify.

## Principles for agents

- **Prefer signal over coverage.** Five relevant items beat twenty that might be relevant. Leaving something out is fine as long as you say why.
- **Show your reasoning.** List what you included and excluded, and why. This is how I tune the criteria.
- **Use judgement, not only scores.** Ranking scores measure overlap with my notes, not importance, and they know nothing about my objectives. Use them to set priorities, then apply judgement.
- **Link everything.** Connect new material to existing notes with `[[wikilinks]]`. A note without links is a weak note.
- **Let me decide.** Propose changes to the knowledge base and make them after I approve, unless I have asked you to go ahead.
- **Tune the process.** When my feedback shows a pattern, such as a topic I keep rejecting or a source that is mostly noise, suggest changes to the sources, skills or this file. When an objective gets no matching material from the sources, say so. The objectives themselves are mine to change: point out ones that look done or stale, but don't edit them.

#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "feedparser>=6.0",
#     "httpx>=0.27",
#     "trafilatura>=1.12",
# ]
# ///
"""Fetch RSS/Atom feeds, download the linked articles and emit JSON for an LLM.

Usage:
    uv run journal/fetch_feeds.py [--since 7d] [--max-per-feed 20] [-o out.json]
"""

from __future__ import annotations

import argparse
import asyncio
import calendar
import json
import re
import sys
from dataclasses import asdict, dataclass, field
from datetime import datetime, timedelta, timezone
from pathlib import Path

import feedparser
import httpx
import trafilatura

DEFAULT_SOURCES = (
    Path(__file__).resolve().parent.parent / ".agents" / "skills" / "journal" / "SOURCES.md"
)
USER_AGENT = "notes-journal-fetcher/1.0 (personal feed reader)"
MIN_ARTICLE_WORDS = 50

SOURCE_LINE = re.compile(
    r"^\s*[-*+]\s*(?:\[(?P<name>[^\]]+)\]\((?P<url>https?://[^)\s]+)\)|(?P<bare>https?://\S+))"
)
DURATION = re.compile(r"^(\d+)\s*([mhdw])$")
DURATION_UNITS = {"m": "minutes", "h": "hours", "d": "days", "w": "weeks"}


@dataclass
class Source:
    name: str
    url: str


@dataclass
class FeedResult:
    name: str
    url: str
    status: str = "ok"
    item_count: int = 0
    error: str | None = None


@dataclass
class Item:
    feed: str
    title: str | None
    url: str | None
    comments_url: str | None
    published: str | None
    author: str | None
    summary: str | None
    content: str | None = None
    content_source: str = "none"
    word_count: int = 0
    error: str | None = None
    _feed_content: str | None = field(default=None, repr=False)


def log(msg: str) -> None:
    print(msg, file=sys.stderr, flush=True)


def parse_duration(value: str) -> timedelta:
    m = DURATION.match(value.strip().lower())
    if not m:
        raise argparse.ArgumentTypeError(f"invalid duration {value!r}, use e.g. 30m, 24h, 7d, 2w")
    return timedelta(**{DURATION_UNITS[m.group(2)]: int(m.group(1))})


def read_sources(path: Path) -> list[Source]:
    sources = []
    for line in path.read_text(encoding="utf-8").splitlines():
        m = SOURCE_LINE.match(line)
        if not m:
            continue
        url = m.group("url") or m.group("bare")
        sources.append(Source(name=m.group("name") or url, url=url))
    return sources


def html_to_text(html: str | None) -> str | None:
    if not html:
        return None
    text = trafilatura.html2txt(html)
    return text.strip() or None


def entry_datetime(entry) -> datetime | None:
    parsed = entry.get("published_parsed") or entry.get("updated_parsed")
    if not parsed:
        return None
    return datetime.fromtimestamp(calendar.timegm(parsed), tz=timezone.utc)


def entry_feed_content(entry) -> str | None:
    for content in entry.get("content") or []:
        text = html_to_text(content.get("value"))
        if text:
            return text
    return None


async def fetch_feed(
    client: httpx.AsyncClient, source: Source, since: datetime, max_items: int
) -> tuple[FeedResult, list[Item]]:
    result = FeedResult(name=source.name, url=source.url)
    try:
        resp = await client.get(source.url)
        resp.raise_for_status()
        parsed = feedparser.parse(resp.content)
        if parsed.bozo and not parsed.entries:
            raise ValueError(f"unparseable feed: {parsed.get('bozo_exception')}")
    except Exception as exc:  # noqa: BLE001
        result.status = "error"
        result.error = f"{type(exc).__name__}: {exc}"
        log(f"[feed] {source.name}: {result.error}")
        return result, []

    items = []
    for entry in parsed.entries:
        published = entry_datetime(entry)
        if published and published < since:
            continue
        items.append(
            Item(
                feed=source.name,
                title=entry.get("title"),
                url=entry.get("link"),
                comments_url=entry.get("comments"),
                published=published.isoformat() if published else None,
                author=entry.get("author"),
                summary=html_to_text(entry.get("summary")),
                _feed_content=entry_feed_content(entry),
            )
        )
        if len(items) >= max_items:
            break

    result.item_count = len(items)
    log(f"[feed] {source.name}: {len(items)} items")
    return result, items


async def fetch_article(client: httpx.AsyncClient, item: Item, sem: asyncio.Semaphore) -> None:
    extracted = None
    if item.url:
        async with sem:
            try:
                resp = await client.get(item.url)
                resp.raise_for_status()
                ctype = resp.headers.get("content-type", "")
                if "html" not in ctype:
                    raise ValueError(f"unsupported content-type {ctype!r}")
                extracted = await asyncio.to_thread(
                    trafilatura.extract,
                    resp.text,
                    url=str(resp.url),
                    output_format="markdown",
                    include_links=True,
                    include_comments=False,
                )
                if not extracted:
                    raise ValueError("no article content extracted")
            except Exception as exc:  # noqa: BLE001
                item.error = f"{type(exc).__name__}: {exc}"
                log(f"[article] {item.url}: {item.error}")

    feed_text = item._feed_content or item.summary
    if extracted and len(extracted.split()) >= MIN_ARTICLE_WORDS:
        item.content, item.content_source = extracted, "article"
    elif feed_text:
        item.content, item.content_source = feed_text, "feed"
    elif extracted:
        item.content, item.content_source = extracted, "article"


async def run(args: argparse.Namespace) -> dict:
    now = datetime.now(timezone.utc)
    since = now - args.since
    sources = read_sources(args.sources)
    if not sources:
        raise SystemExit(f"no feed URLs found in {args.sources}")

    async with httpx.AsyncClient(
        headers={"User-Agent": USER_AGENT},
        timeout=args.timeout,
        follow_redirects=True,
    ) as client:
        feed_results = await asyncio.gather(
            *(fetch_feed(client, s, since, args.max_per_feed) for s in sources)
        )

        feeds, items, seen = [], [], set()
        for result, feed_items in feed_results:
            feeds.append(result)
            for item in feed_items:
                key = item.url or f"{item.feed}:{item.title}"
                if key in seen:
                    continue
                seen.add(key)
                items.append(item)

        if args.no_fetch:
            for item in items:
                text = item._feed_content or item.summary
                if text:
                    item.content, item.content_source = text, "feed"
        else:
            sem = asyncio.Semaphore(args.concurrency)
            await asyncio.gather(*(fetch_article(client, item, sem) for item in items))

    out_items = []
    for item in items:
        if item.content and args.max_chars and len(item.content) > args.max_chars:
            item.content = item.content[: args.max_chars] + "\n\n[truncated]"
        item.word_count = len(item.content.split()) if item.content else 0
        data = asdict(item)
        data.pop("_feed_content")
        out_items.append(data)

    out_items.sort(key=lambda i: i["published"] or "", reverse=True)

    return {
        "generated_at": now.isoformat(),
        "since": since.isoformat(),
        "feeds": [asdict(f) for f in feeds],
        "items": out_items,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--sources", type=Path, default=DEFAULT_SOURCES, help="markdown file listing feeds")
    parser.add_argument("--since", type=parse_duration, default=timedelta(days=7), help="look-back window, e.g. 24h, 7d (default 7d)")
    parser.add_argument("--max-per-feed", type=int, default=20, help="max items per feed (default 20)")
    parser.add_argument("--concurrency", type=int, default=8, help="parallel article downloads (default 8)")
    parser.add_argument("--timeout", type=float, default=20.0, help="HTTP timeout in seconds (default 20)")
    parser.add_argument("--max-chars", type=int, default=None, help="truncate each article's content to N characters")
    parser.add_argument("--no-fetch", action="store_true", help="skip article downloads, use feed content only")
    parser.add_argument("-o", "--output", type=Path, help="write JSON to file instead of stdout")
    args = parser.parse_args()

    result = asyncio.run(run(args))
    payload = json.dumps(result, ensure_ascii=False, indent=2)
    if args.output:
        args.output.write_text(payload + "\n", encoding="utf-8")
        log(f"wrote {len(result['items'])} items to {args.output}")
    else:
        print(payload)


if __name__ == "__main__":
    main()

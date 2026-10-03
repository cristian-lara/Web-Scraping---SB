## Why

Milestone 1 needs an offline Hacker News scrape path so top-30 extraction and Zod validation can be proven without live HTTP (intake §1.3, §5). Without `HnScraperPort` + `CheerioScraperAdapter` and a local fixture, later filter/API work has no stable Entry source (backlog F1-3).

## What Changes

- Introduce `HnScraperPort` and `CheerioScraperAdapter` in `apps/backend` (Nest BFF owns scraping).
- Add offline fixture `hn_sample.html` under the backend test fixtures path.
- Parse HN row pairs (`tr.athing` + `.subtext`), keep first 30 entries, default missing points/comments to `0`, validate each entry with `EntrySchema.parse()` from `@repo/shared-types`.
- Cover behavior with Vitest against the fixture only (no Axios, no network).
- Do **not** implement live HN fetch, filters, auth, UI, or Prisma in this change.

## Capabilities

### New Capabilities
- `hn-scraper`: Port + Cheerio adapter, offline fixture parsing, top-30 / defaults / EntrySchema validation, and offline Vitest contract.

### Modified Capabilities
<!-- None — new scraping capability; shared-types EntrySchema already exists (F1-1). -->

## Impact

- App: `apps/backend` (port, adapter, fixture, Vitest)
- Dependency: Cheerio for HTML parsing; **no Axios** in this change
- Soft dependency: `@repo/shared-types` `EntrySchema` (F1-1 done)
- Does **not** depend on F1-2 `countWords`
- Story: `docs/backlog/F1-domain-user-stories.md` F1-3
- Scope card: `projects/web-scraping-sb/_local/mvp-hn/ALCANCE-add-hn-scraper-fixture.md`
- Next consumers: filter strategies / BFF endpoints (later stories) inject the port

## Purpose

Defines offline Hacker News top-30 extraction behind a scraper port so the backend can produce Zod-validated Entry objects from a local HTML fixture without live network access.

## ADDED Requirements

### Requirement: Scraper port and Cheerio adapter
The backend MUST provide an `HnScraperPort` abstraction and a `CheerioScraperAdapter` that implements it. The adapter MUST accept HTML as a string (or load a local fixture in tests) and MUST NOT perform live HTTP fetches in this capability slice.

#### Scenario: Port returns validated entries from HTML
- **WHEN** the adapter is given HN list HTML
- **THEN** it MUST return Entry-shaped objects through the scraper port without calling an external HTTP client

### Requirement: Offline fixture for HN HTML
A local fixture file `hn_sample.html` MUST exist under the backend test fixtures path. Automated scraper tests MUST load HTML from that fixture (or an equivalent on-disk fixture path) with no live network calls.

#### Scenario: Tests load fixture from disk
- **WHEN** scraper unit tests run
- **THEN** they MUST read `hn_sample.html` from the local filesystem and MUST NOT request news.ycombinator.com or any remote URL

### Requirement: Top-30 extraction from HN row pairs
The adapter MUST map HN row pairs (`tr.athing` and the corresponding `.subtext` row) into entry candidates and MUST return exactly the first 30 entries (equivalent to `.slice(0, 30)`).

#### Scenario: Exactly thirty entries
- **WHEN** the fixture contains at least thirty list rows
- **THEN** the adapter result length MUST be exactly `30`

### Requirement: Defensive defaults for missing metrics
When an entry is missing points or comments (for example Ask HN or jobs-style rows), the adapter MUST default those metrics to `0`.

#### Scenario: Missing points or comments become zero
- **WHEN** a mapped row lacks a parseable points or comments value
- **THEN** the resulting entry MUST use `0` for each missing metric

### Requirement: EntrySchema validation at scrape time
Every mapped object MUST be validated with `EntrySchema.parse()` from `@repo/shared-types` before it is returned. Each parsed entry MUST include `rank` (number), `title` (string), `points` (number), and `comments` (number).

#### Scenario: Validated entry shape
- **WHEN** extraction completes successfully
- **THEN** every returned entry MUST have passed `EntrySchema.parse()` and expose rank, title, points, and comments with the required types

### Requirement: Offline Vitest coverage
Scraper behavior MUST be covered by Vitest tests that pass without Axios or any network dependency in the test path.

#### Scenario: Vitest green offline
- **WHEN** the backend scraper Vitest suite runs against the fixture
- **THEN** tests MUST pass with no network dependency

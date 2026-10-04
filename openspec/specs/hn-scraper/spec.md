## Purpose

Defines offline Hacker News top-30 extraction behind a scraper port so the backend can produce Zod-validated Entry objects from a local HTML fixture without live network access.

## Requirements

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

### Requirement: Runtime live HN HTML via Axios behind scraper port
For live application runtime, the backend MUST obtain Hacker News list HTML through an HTTP client (Axios) wired behind `HnScraperPort` (as an Axios-backed adapter or fetch collaborator that supplies HTML to the existing Cheerio parse path). Runtime live fetch MUST NOT replace or remove the HTML-string / fixture injection path used by automated tests.

#### Scenario: Runtime path fetches HN HTML with Axios
- **WHEN** the application runs the live scrape path (not an automated unit test)
- **THEN** HN list HTML MUST be retrieved via Axios behind `HnScraperPort` before Cheerio extraction produces validated entries

#### Scenario: Port still accepts injected HTML for non-live use
- **WHEN** a caller supplies HN list HTML as a string (or an equivalent injectable scraper implementation)
- **THEN** the scraper port MUST still be usable without performing a live HTTP request

### Requirement: Automated scraper unit tests stay offline on fixture HTML
Automated unit tests for the scraper (and any suite that exercises scrape through the port in unit scope) MUST continue to use `hn_sample.html` or injected HTML. Those tests MUST NOT call Axios against a remote host and MUST NOT require network access.

#### Scenario: Unit tests use fixture or injected HTML with no network
- **WHEN** automated scraper unit tests run
- **THEN** they MUST load fixture or injected HTML and MUST NOT request news.ycombinator.com or any remote URL

#### Scenario: Unit test path has no live Axios dependency
- **WHEN** the backend scraper Vitest unit suite runs
- **THEN** tests MUST pass without a live Axios network call

### Requirement: Offline Vitest asserts ranks one through thirty and surplus exclusion
When the offline fixture contains more than thirty HN list rows, scraper Vitest coverage MUST assert that returned entries have ranks exactly `1` through `30` in order (one entry per rank) and MUST assert that titles (or equivalent identity) belonging only to surplus rows beyond the top-30 slice are absent from the result. Length `30` alone is not sufficient evidence for this requirement.

#### Scenario: Ranks one through thirty
- **WHEN** scraper unit tests run against a fixture with at least thirty list rows
- **THEN** the result MUST contain exactly thirty entries whose ranks are `1..30` in ascending order with no gaps or duplicates

#### Scenario: Surplus rows excluded
- **WHEN** the fixture contains additional list rows beyond the first thirty
- **THEN** the scraper result MUST NOT include entries that exist only in those surplus rows

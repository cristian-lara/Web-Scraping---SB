## ADDED Requirements

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

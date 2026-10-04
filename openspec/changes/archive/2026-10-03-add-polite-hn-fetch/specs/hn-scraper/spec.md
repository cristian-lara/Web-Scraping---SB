## ADDED Requirements

### Requirement: Polite live HTML fetch policy
When the application uses the live HN HTML retrieval path (not the offline fixture or injected-HTML unit path), the backend MUST apply an in-process polite fetch policy before returning HTML for Cheerio parsing. The policy MUST include: (1) a short-lived in-memory HTML cache keyed by the configured HN list URL with a positive TTL; (2) a minimum interval between live upstream HTTP GETs to that URL; (3) at most one automatic retry when a live GET fails due to timeout or an HTTP 5xx response. The policy MUST NOT retry when the upstream responds with HTTP 403 or 429. The offline fixture path (`E2E_SCRAPE_FIXTURE`) and HTML-string injection used by automated unit tests MUST remain free of live network calls.

#### Scenario: Cache hit avoids second live GET
- **WHEN** two live scrape HTML retrievals for the same HN list URL occur within the configured cache TTL after a successful live GET
- **THEN** the second retrieval MUST return the cached HTML and MUST NOT perform another upstream HTTP GET

#### Scenario: Minimum interval between live GETs
- **WHEN** a live HTML retrieval needs a fresh upstream GET and a prior live GET to the same URL completed more recently than the configured minimum interval
- **THEN** the backend MUST delay until the minimum interval has elapsed before issuing the next upstream GET (unless a valid cache entry can satisfy the request)

#### Scenario: Single retry on timeout or 5xx only
- **WHEN** a live upstream GET fails with a timeout or an HTTP 5xx status
- **THEN** the backend MUST attempt at most one retry of that GET
- **AND** when the upstream fails with HTTP 403 or 429, the backend MUST NOT retry

#### Scenario: Fixture path stays offline
- **WHEN** `E2E_SCRAPE_FIXTURE` enables the fixture HTML supplier
- **THEN** scrape HTML retrieval MUST NOT call the live upstream HTTP client

### Requirement: Structured stages for polite fetch outcomes
On the live HTML retrieval path, the backend MUST emit structured log stages (via the existing correlation-aware structured logger when a request id is present) that distinguish at least: cache hit, live upstream fetch, and retry attempt. Stage names MUST be stable string identifiers suitable for demo and log inspection. Automated unit tests of the polite policy MUST prove cache-hit and retry behavior without requiring a live network.

#### Scenario: Cache hit emits stage
- **WHEN** a live-path retrieval is satisfied from the in-memory cache within TTL and a request correlation id is present
- **THEN** a structured log stage identifying a cache hit MUST be emitted

#### Scenario: Live fetch and retry emit stages
- **WHEN** a live upstream GET runs, and when a timeout or 5xx triggers the single retry
- **THEN** structured log stages identifying the live fetch and the retry MUST be emitted when a request correlation id is present

#### Scenario: Policy unit tests stay offline
- **WHEN** automated Vitest coverage for the polite fetch policy runs
- **THEN** tests MUST use a fake or stubbed inner HTML supplier and MUST NOT request news.ycombinator.com

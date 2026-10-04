## Purpose

Makes polite Hacker News fetch outcomes (cache hit, live upstream fetch, retry) visible on OpenTelemetry `scrape.live` spans and in the local Grafana/Tempo stack so demos and operators can distinguish them from duration alone.

## ADDED Requirements

### Requirement: scrape.live span records polite fetch outcome
When tracing is enabled and the live HN HTML retrieval path runs under an active `scrape.live` span, the backend MUST set a stable string attribute identifying the polite-fetch outcome for that retrieval. Outcome values MUST include at least: `cache` when HTML is served from the in-memory TTL cache without a new upstream GET; `live` when a successful upstream GET completes without a retry; `retry` when a successful result required the single safe retry after a timeout or 5xx. When tracing is not configured, scrape behavior MUST remain unchanged (attributes are a no-op). Offline fixture scrape MUST NOT invent live-upstream outcomes that imply a network call.

#### Scenario: Cache hit sets outcome cache
- **WHEN** a live-path HTML retrieval is satisfied from the in-memory cache within TTL under an active `scrape.live` span with tracing enabled
- **THEN** that span MUST include an attribute whose value is `cache`

#### Scenario: Fresh live GET sets outcome live
- **WHEN** a live-path HTML retrieval performs a successful upstream GET with no retry under an active `scrape.live` span with tracing enabled
- **THEN** that span MUST include an attribute whose value is `live`

#### Scenario: Successful retry sets outcome retry
- **WHEN** a live-path HTML retrieval succeeds only after the single timeout/5xx retry under an active `scrape.live` span with tracing enabled
- **THEN** that span MUST include an attribute whose value is `retry`

#### Scenario: No tracing remains safe
- **WHEN** OpenTelemetry export is not configured
- **THEN** live scrape MUST still succeed without requiring span attribute APIs to be present

### Requirement: scrape.live span records outbound wait when applied
When tracing is enabled and the polite policy delays before a live upstream GET to honor the minimum interval, the backend MUST record a numeric (or decimal-string) attribute on the active `scrape.live` span for the wait duration in milliseconds. When no wait occurs, the attribute MAY be omitted or set to `0`.

#### Scenario: Min-interval wait attributed
- **WHEN** a cache-miss live retrieval waits for the configured minimum interval under an active `scrape.live` span with tracing enabled
- **THEN** that span MUST include a wait-duration attribute reflecting the delay applied before the upstream GET

### Requirement: Offline Vitest proves span attributes
Automated Vitest coverage MUST assert polite-fetch outcome attributes on `scrape.live` (or an equivalent active span under the in-memory OTel test exporter) for cache and live paths without calling news.ycombinator.com. Retry outcome MUST be covered with a stubbed inner fetcher.

#### Scenario: In-memory exporter sees cache and live outcomes
- **WHEN** Vitest runs with the in-memory OTel test exporter and stubbed HTML retrieval
- **THEN** recorded spans MUST show outcome `cache` on a TTL hit and `live` on a fresh upstream stub call
- **AND** tests MUST NOT request news.ycombinator.com

### Requirement: Grafana Tempo surfaces fetch outcomes
The provisioned local Grafana dashboards that list or chart `scrape.live` MUST document and/or query polite-fetch outcome attributes so an operator can distinguish cache vs live vs retry without reading backend stdout. TraceQL examples or panel descriptions MUST name the attribute key and outcome values.

#### Scenario: Dashboard documents outcome filter
- **WHEN** an operator opens the provisioned BFF request timings (or overview) dashboard
- **THEN** the dashboard MUST include guidance or a TraceQL query referencing the polite-fetch outcome attribute and the values `cache`, `live`, and `retry`

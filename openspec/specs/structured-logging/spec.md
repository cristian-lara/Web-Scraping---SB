## Purpose

Gives operators machine-readable per-request logs so a single HTTP call can be reconstructed across auth, scrape, filter, and UsageLog persistence without treating correlation IDs as business analytics.

## Requirements

### Requirement: Inbound requests carry a correlation request ID in and out
Every inbound HTTP request MUST receive a correlation/request ID. The system MUST accept a client-supplied standard inbound header `x-request-id` when present and non-empty; otherwise it MUST generate an ID. The same ID MUST be returned on the HTTP response (response header `x-request-id`). Correlation/request IDs MUST be distinct from `UsageLog` primary keys and MUST NOT be required as a persisted `UsageLog` column for MVP.

#### Scenario: Generated ID when client omits header
- **WHEN** a client sends an HTTP request without `x-request-id`
- **THEN** the server MUST generate a correlation/request ID
- **AND** the response MUST include that ID in the `x-request-id` header

#### Scenario: Inbound header is reused
- **WHEN** a client sends a non-empty `x-request-id` header
- **THEN** the server MUST use that value as the correlation/request ID for the request
- **AND** the response MUST echo the same value in `x-request-id`

### Requirement: Structured logs share one ID across the filter pipeline
Structured log lines (JSON or equivalent key/value fields, not free-form concatenation only) for a successful authenticated filter flow MUST include the same correlation/request ID on at least: the auth/guard boundary, scrape adapter entry/exit or duration, filter strategy application, and persistence of `UsageLog`. Log records MUST include enough context to distinguish stages (stage or module name or equivalent). Log payloads in tests and documented examples MUST NOT include passwords, raw JWT, or Sentry DSNs.

#### Scenario: Successful filter flow logs one ID across stages
- **WHEN** an authenticated filter request succeeds
- **THEN** structured log records for auth/guard, scrape, filter apply, and UsageLog persist MUST share one correlation/request ID
- **AND** each of those records MUST identify its stage

#### Scenario: Logs omit secrets
- **WHEN** structured logs are emitted for auth or filter handling
- **THEN** payloads MUST NOT contain passwords, raw JWT strings, or Sentry DSNs

### Requirement: Automated test proves correlation attachment
A unit or integration test (Vitest) MUST prove that a request through a protected filter endpoint yields logs (or a test-double logger) sharing one correlation/request ID across the required stages, or that middleware/interceptor attaches the ID before handlers run and persistence can observe it.

#### Scenario: Vitest proves shared correlation ID
- **WHEN** the correlation logging test suite runs
- **THEN** it MUST demonstrate one ID attached for the request and used across the required stages (or equivalent interceptor-before-handler proof)
- **AND** the test MUST NOT require a live Hacker News network call

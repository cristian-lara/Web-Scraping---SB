## Purpose

Centralizes backend and frontend failures for MVP demos via optional Sentry while preserving typed HTTP errors and a controlled React fallback when render fails.

## Requirements

### Requirement: Sentry initializes only when DSN is configured
The backend MUST initialize Sentry when a documented DSN (or equivalent env var) is present. When the DSN is absent, the application MUST still boot and serve traffic. Documented env vars for backend and frontend Sentry MUST appear in README or `.env.example`. Real secrets MUST NOT be committed.

#### Scenario: Boot without DSN
- **WHEN** Sentry DSN env vars are unset
- **THEN** the backend MUST start and serve HTTP traffic
- **AND** the frontend MUST still render its normal UI

#### Scenario: Env vars documented without secrets
- **WHEN** an evaluator reads README or `.env.example`
- **THEN** Sentry-related variable names MUST be documented
- **AND** committed examples MUST NOT contain a real DSN secret

### Requirement: Global Exception Filter reports to Sentry without changing typed HTTP mapping
A NestJS Global Exception Filter MUST capture exceptions escaping controllers/services and report them to Sentry (or a testable Sentry client wrapper) when Sentry is configured. Typed domain exceptions MUST still return their appropriate HTTP status and body. Success and error JSON MUST NOT leak stack traces.

#### Scenario: Unhandled error is captured
- **WHEN** an unhandled or thrown error escapes a controller/service and Sentry is configured
- **THEN** the Global Exception Filter MUST invoke the Sentry capture path
- **AND** the HTTP response MUST still be a mapped status/body (not a generic replacement of typed errors with only 500s)

#### Scenario: Typed domain exception still maps
- **WHEN** a typed domain exception is thrown on a failure path
- **THEN** the client MUST receive the existing mapped HTTP status/body
- **AND** Sentry reporting MUST NOT replace that mapping

### Requirement: React ErrorBoundary fallback and optional Sentry report
The client app MUST wrap the root UI in a React ErrorBoundary that shows a controlled fallback UI on render failure and reports the error to Sentry when frontend DSN/config is present.

#### Scenario: Render failure shows fallback
- **WHEN** a child component throws during render
- **THEN** the user MUST see a controlled fallback UI
- **AND** the app MUST NOT remain a blank white screen with no explanation

### Requirement: Correlation ID attached to Sentry events
When a correlation/request ID from structured-logging is available, Sentry events MUST include it (tag or extra context) so an error can be joined to structured logs.

#### Scenario: Event includes correlation ID
- **WHEN** Sentry captures an event during a request that has a correlation/request ID
- **THEN** that ID MUST be present on the event as a tag or extra context

### Requirement: Capture path is tested with a mock
At least one automated test (unit or integration) MUST prove the Global Exception Filter invokes the Sentry capture path for an unhandled/thrown error with the Sentry client mocked.

#### Scenario: Mocked Sentry capture
- **WHEN** the exception-filter test runs with a mocked Sentry client
- **THEN** a thrown error MUST cause the capture function to be invoked

### Requirement: MVP timing context for crawler or filter
Crawler and/or filter processing MUST emit timing context usable for monitoring (structured log duration fields and/or Sentry breadcrumbs/spans). This MUST be MVP-level, not a full APM suite.

#### Scenario: Duration is observable
- **WHEN** a filter or scrape stage completes
- **THEN** duration or timing context MUST be present on a structured log and/or a Sentry breadcrumb/span

### Requirement: Sentry events omit secrets
Sentry event payloads MUST NOT include passwords, raw JWT strings, `Authorization` header values, or Sentry DSNs. The client MUST disable default PII sending (`sendDefaultPii: false` or equivalent) and/or scrub those fields before send.

#### Scenario: Capture does not include Bearer or password
- **WHEN** Sentry captures an exception from an authenticated or login request
- **THEN** the event MUST NOT contain the password, raw JWT, or `Authorization` header value

## Purpose

Provides a one-command local Docker Compose ecosystem (app + OpenTelemetry export into Loki/Tempo/Grafana) so evaluators can start the stack, run tests against the live BFF, and optionally inspect scrape/filter traces and logs without manual multi-process setup.

## ADDED Requirements

### Requirement: Single Make target starts the local observability stack
The repository MUST provide a Makefile target `up` that builds and starts the local Compose stack in detached mode. After `make up` succeeds, the BFF HTTP API and the Grafana UI MUST be reachable on documented local ports. The target MUST NOT run the unit or Bruno test suites as part of bringing services up.

#### Scenario: make up exposes API and Grafana
- **WHEN** an operator with Docker available runs `make up` from the repository root
- **THEN** the Compose stack MUST start successfully
- **AND** the BFF API MUST be reachable on its documented local port
- **AND** Grafana MUST be reachable on its documented local port
- **AND** unit/Bruno suites MUST NOT be required to complete for `up` to succeed

### Requirement: Make down and logs targets
The repository MUST provide Makefile targets `down` (stop/remove the Compose stack) and `logs` (follow backend container logs, or an equivalently documented Compose logs command). Existing targets `install`, `dev`, `test`, `test-e2e`, and `lint` MUST remain available for host-based workflows.

#### Scenario: down stops the stack
- **WHEN** an operator runs `make down` after `make up`
- **THEN** the Compose stack services MUST stop

#### Scenario: logs follows backend output
- **WHEN** an operator runs `make logs` while the stack is up
- **THEN** backend container log output MUST stream to the terminal (or the README MUST document the exact Compose logs equivalent)

### Requirement: Compose includes app and observability services
The Compose stack MUST include services for the backend BFF, the frontend client, an OpenTelemetry Collector (or equivalent receiver), Loki, Tempo, and Grafana. SQLite for UsageLog/saved results MUST remain a file-backed store (volume-mounted as needed) and MUST NOT be replaced by an external database service for this capability.

#### Scenario: Stack composition
- **WHEN** the Compose file is inspected or started
- **THEN** it MUST define backend, frontend, OpenTelemetry collector, Loki, Tempo, and Grafana services
- **AND** UsageLog/saved-result persistence MUST continue to use SQLite file storage (not Postgres/MySQL as a required dependency)

### Requirement: Backend exports telemetry to the local collector
When the backend runs in the Compose stack with the documented OTel endpoint configured, it MUST export traces for authenticated filter handling that include distinct spans (or equivalent timed stages) for scrape and for UsageLog persistence. Telemetry MUST carry the request correlation ID (`x-request-id`) as a trace/span attribute when present. Structured JSON stdout logging MUST remain available.

#### Scenario: Filter request produces scrape-linked telemetry
- **WHEN** an authenticated filter request succeeds against the Compose backend with OTel export enabled
- **THEN** exported traces MUST include scrape and persist stages (as spans or equivalent)
- **AND** the correlation/request ID MUST be attached to the telemetry for that request when available
- **AND** structured stdout logs MUST still be emitted

### Requirement: README documents one-command local path
The root README MUST document Docker Desktop (or equivalent) as a prerequisite for the Compose path, the `make up` / `make down` / `make logs` flow, local ports for API/UI/Grafana, and that CI remains host/PNPM-based without requiring Grafana for green builds.

#### Scenario: README one-command path
- **WHEN** an evaluator follows the README local Docker section
- **THEN** they MUST find prerequisites, `make up`, ports, optional Grafana inspection, and the note that CI does not require Compose/Grafana

### Requirement: CI MUST NOT require Grafana or Compose
GitHub Actions CI quality gates MUST continue to run without starting the Grafana/Loki/Tempo Compose stack. Absence of Compose in CI MUST NOT fail this capability.

#### Scenario: CI independent of obs stack
- **WHEN** CI runs unit, lint, and Bruno gates
- **THEN** those gates MUST NOT require Grafana, Loki, Tempo, or `make up` to pass
)
## ADDED Requirements

### Requirement: Collection asserts correlation request ID
The Bruno collection MUST assert that relevant HTTP responses include a correlation/request ID in the `x-request-id` header (generated or echoed by the BFF). Happy-path authenticated filter requests MUST be included in that assertion coverage.

#### Scenario: Filter happy path asserts x-request-id
- **WHEN** Happy Path 2 or Happy Path 3 runs against the live local or CI server
- **THEN** the response MUST include a non-empty `x-request-id` header

## MODIFIED Requirements

### Requirement: Plain-text Bruno collection with local environment
The repository MUST include a Bruno collection of plain-text `.bru` files under `apps/backend/bruno/` with a `local` environment suitable for runs against a live local BFF. Collection files MUST be committed as text (not a proprietary binary export). The collection MUST remain manually runnable against that local server and MUST remain structurally runnable via `@usebruno/cli` (e.g. `npx @usebruno/cli run apps/backend/bruno --env local`). GitHub Actions and Makefile E2E wiring for this collection MUST be provided by the `ci-quality-gates` and `docs-makefile-release` capabilities; this capability MUST keep the collection CLI-compatible for those runners.

#### Scenario: Collection layout and local env
- **WHEN** the Bruno collection is present in the repository
- **THEN** requests MUST live as plain-text `.bru` files under `apps/backend/bruno/`
- **AND** a `local` environment MUST be available for targeting a live local server
- **AND** the collection MUST be manually runnable without requiring a proprietary Postman binary

#### Scenario: Collection stays CLI-runnable for CI
- **WHEN** CI or `make test-e2e` runs Bruno
- **THEN** the same collection under `apps/backend/bruno/` MUST be executable via `@usebruno/cli`
- **AND** the collection MUST still cover auth, Filter A/B, and edges 401 / 400 / 429

#### Scenario: CI Bruno automation deferred
- **WHEN** Milestone 3 delivery of this capability is evaluated
- **THEN** GitHub Actions / Makefile Bruno CI wiring MUST be supplied by sibling capabilities (`ci-quality-gates`, `docs-makefile-release`) rather than re-implemented inside this collection
- **AND** the collection MUST remain suitable for CLI runs under those siblings

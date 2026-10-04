## Purpose

Fails pull requests and default-branch pushes when unit tests, Bruno API E2E, or lint regressions land so the MVP cannot merge with a broken contract.

## Requirements

### Requirement: GitHub Actions workflow runs Vitest, Bruno CLI, and lint
The repository MUST include `.github/workflows/ci.yml` that runs on pull requests and pushes to the default branch (or documented equivalent). CI MUST install dependencies with PNPM and run workspace/turbo Vitest unit/integration tests, `@usebruno/cli` against `apps/backend/bruno` with a live backend and a CI/local env covering happy-path Auth + Filter A/B and edges 401/400/429, and lint (ESLint; Prettier check if already wired). Each of those steps MUST fail the workflow on non-zero exit. Sentry DSNs MUST NOT be required for a green CI run (Sentry disabled or mocked).

#### Scenario: Workflow exists on PR and push
- **WHEN** a pull request or a push to the default branch occurs
- **THEN** `.github/workflows/ci.yml` MUST run

#### Scenario: Vitest failure fails CI
- **WHEN** Vitest exits non-zero
- **THEN** the workflow MUST fail

#### Scenario: Bruno CLI runs against live API
- **WHEN** the CI Bruno step runs
- **THEN** it MUST execute `@usebruno/cli` against `apps/backend/bruno`
- **AND** a live backend MUST be available for that run
- **AND** the collection coverage from bruno-e2e (auth, Filter A/B, 401/400/429) MUST remain in scope

#### Scenario: Lint failure fails CI
- **WHEN** lint exits non-zero
- **THEN** the workflow MUST fail

#### Scenario: CI green without Sentry secrets
- **WHEN** CI runs without Sentry DSN secrets
- **THEN** the workflow MUST still be able to pass on a clean mainline MVP commit

#### Scenario: CI does not echo app secrets
- **WHEN** the workflow starts the backend using env secrets (JWT, demo password)
- **THEN** those secret values MUST NOT be printed in GitHub Actions logs

### Requirement: Local make targets stay aligned with CI commands
Makefile targets used locally for test, E2E, and lint MUST map to the same concerns as CI where practical. CI MUST NOT depend on undocumented one-off shell that only exists in a contributor's machine.

#### Scenario: Documented commands match CI intent
- **WHEN** an evaluator compares Makefile/`README` commands with `ci.yml`
- **THEN** Vitest, Bruno E2E, and lint MUST be invoked via documented repo scripts, not hidden one-offs

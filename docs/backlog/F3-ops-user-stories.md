# Phase F3 — Operability & release (user stories)

Source of truth: `cursor-intake-spec-v7.md` (Milestone 3; §1.7, §1.9, §1.10, §3 Observability/API E2E, §4 Testing & Observability Pipeline).  
Index: `docs/BACKLOG.md` Phase F3.  
Prerequisite: Phase F2 complete (auth, scrape, filters, persistence, Bruno collection present).

Each story SHOULD become its own OpenSpec change (`/opsx-propose` → audit → apply → archive).

---

## F3-1 — Structured logs and correlation / request IDs

**Title:** Trace auth → scrape → filter → persist with structured logs and correlation IDs

**As a** operator / on-call developer  
**I want** structured JSON (or equivalent machine-readable) logs with a per-request correlation/request ID propagated across the BFF pipeline  
**So that** I can reconstruct a single request’s path through auth, scrape, filter, and persistence without relying on console noise or business `UsageLog` rows

### Acceptance criteria

1. Every inbound HTTP request receives a correlation/request ID (generated if the client does not send one; accepted from a standard inbound header if present).
2. The correlation/request ID is returned on the response (e.g. response header) so clients and Bruno can assert it.
3. Structured log lines for a successful filter flow include the same correlation/request ID on at least: auth/guard boundary, scrape adapter entry/exit (or duration), filter strategy application, and persistence of `UsageLog`.
4. Logs are structured (key/value or JSON fields)—not free-form concatenation only—and include enough context to distinguish stages (stage/module name or equivalent).
5. Correlation/request IDs are **distinct** from `UsageLog` primary keys / business analytics fields; documentation or a short comment in the OpenSpec change states this separation.
6. A unit or integration test (Vitest) proves that a request through a protected filter endpoint yields logs (or a test double logger) sharing one correlation/request ID across the stages above, or that middleware/interceptor attaches the ID before handlers run and persistence sees it.
7. No PII/secrets (passwords, raw JWT, Sentry DSNs) appear in log payloads in tests or documented examples.

### Out of scope

- Sentry DSN wiring, Global Exception Filter, React ErrorBoundary (F3-2).
- Full distributed tracing product (OpenTelemetry collectors, Jaeger, APM dashboards).
- Log aggregation SaaS (Datadog, CloudWatch sinks) beyond local/stdout structured output.
- Changing `UsageLog` schema or treating correlation IDs as persisted analytics columns (unless a minimal optional field is explicitly justified later—not required for MVP).

### Proposed OpenSpec change name

`add-structured-logging`

### Intake references

- §1.7 Observability — structured logs + per-request correlation IDs; traceability auth → scrape → filter → persistence (distinct from `UsageLog`)
- §3 stack table — Observability: structured logs + correlation IDs
- §4 architecture — BFF: “Correlation ID + structured logs”
- Milestone 3 — “Sentry + structured logging + correlation IDs”

---

## F3-2 — Sentry, Global Exception Filter, and React ErrorBoundary

**Title:** Centralize backend and frontend failures via Sentry

**As a** operator  
**I want** unhandled and mapped exceptions reported to Sentry from NestJS via a Global Exception Filter, and React render failures caught by an ErrorBoundary that can report to Sentry  
**So that** production/MVP demos surface grouped errors and latency-related failures without flooding the server console

### Acceptance criteria

1. Backend initializes Sentry when a configured DSN (or equivalent env var) is present; when absent, the app still boots and serves traffic (no hard crash).
2. A NestJS **Global Exception Filter** captures exceptions escaping controllers/services and reports them to Sentry (or a testable Sentry client wrapper), while still returning the appropriate HTTP status/body for typed domain exceptions.
3. Client app wraps the root UI in a React **ErrorBoundary** that shows a controlled fallback UI and reports the error to Sentry when DSN/config is present.
4. Correlation/request ID from F3-1 is attached to Sentry events when available (tag or extra context) so an error can be joined to structured logs.
5. Documented env vars for Sentry (backend + frontend) appear in README or `.env.example` (no real secrets committed).
6. At least one automated test (unit/integration) proves the Global Exception Filter invokes the Sentry capture path for an unhandled/thrown error (Sentry client mocked).
7. Latency awareness from intake: crawler and/or filter processing can emit timing context usable for monitoring (structured log duration fields and/or Sentry breadcrumbs/spans)—MVP-level, not a full APM suite.

### Out of scope

- Implementing the structured logging middleware itself (F3-1) beyond consuming its correlation ID.
- CI workflow, Bruno CLI, Makefile, release tag (F3-3 / F3-4).
- Custom Sentry dashboards, alerting rules, or paid plan configuration.
- Replacing Nest typed exceptions / Zod validation error shaping with generic 500s.

### Proposed OpenSpec change name

`add-sentry-observability`

### Intake references

- §1.7 — Sentry + NestJS Global Exception Filter + React ErrorBoundary; centralized monitoring; latency metrics for crawler/filter
- §3 stack table — Observability: Sentry + filters + structured logs + correlation IDs
- §4 Testing & Observability Pipeline — “Sentry: global exception filters”
- Milestone 3 — Sentry + structured logging + correlation IDs

---

## F3-3 — CI quality gates: Vitest + Bruno CLI + lint

**Title:** Fail the pipeline on unit, E2E API, or lint regressions

**As a** CI system / maintainer  
**I want** GitHub Actions (`.github/workflows/ci.yml`) to run Vitest, `@usebruno/cli` against a live API, and ESLint/Prettier (lint)  
**So that** merges cannot land with broken units, broken API E2E, or formatting/lint debt

### Acceptance criteria

1. `.github/workflows/ci.yml` exists and runs on pull requests and pushes to the default branch (or documented equivalent).
2. CI installs dependencies with the repo package manager (PNPM) and runs **unit/integration tests** via Vitest (workspace/turbo script) — job fails on non-zero exit.
3. CI starts (or otherwise provides) a live backend suitable for E2E and runs **`@usebruno/cli`** against `apps/backend/bruno` with a CI/local env (happy paths Auth + Filter A/B and edge 401/400/429 remain covered by the collection from F2).
4. CI runs **lint** (ESLint; Prettier check if already wired in the monorepo) — job fails on violations.
5. Pipeline is green on a clean mainline MVP commit; a deliberately failing Vitest or Bruno assertion would fail the workflow (documented or demonstrated in change notes).
6. Secrets/DSNs required only for optional Sentry are not required for CI green (Sentry disabled or mocked in CI).
7. Makefile targets used locally for the same concerns remain aligned with CI commands where practical (`make test`, `make test-e2e`, `make lint` may land fully in F3-4 but CI must not depend on undocumented one-off shell).

### Out of scope

- Authoring the Bruno `.bru` collection from scratch (F2-5); CI only automates an existing collection.
- README narrative and git tag `v1.0.0-mvp` (F3-4).
- Deploying to a cloud host or running Playwright/Cypress UI E2E.
- Performance/load testing.

### Proposed OpenSpec change name

`add-ci-quality-gates`

### Intake references

- §1.9 — Bruno + `@usebruno/cli` in console and CI/CD; example `npx @usebruno/cli run apps/backend/bruno --env local`
- §1.10 — ESLint/Prettier in CI
- §3 — Vitest; Bruno (`@usebruno/cli`)
- §4 — Vitest + Bruno CLI in Testing & Observability Pipeline
- Milestone 3 — Automate E2E with `@usebruno/cli` in CI (`.github/workflows/ci.yml`); delivery: Vitest + Bruno green
- §6 directive 3 — Maintain Bruno E2E under `apps/backend/bruno/`
- §6 directive 5 — Vitest required for completed modules

---

## F3-4 — README, Makefile, and tag `v1.0.0-mvp`

**Title:** Evaluator-ready docs, make targets, and MVP release tag

**As an** evaluator / new developer  
**I want** a full English `README.md`, Makefile targets for install/dev/test/e2e/lint, and a git tag `v1.0.0-mvp`  
**So that** I can install, run, test, and identify the MVP release without tribal knowledge

### Acceptance criteria

1. Root `README.md` (English) covers: architecture overview, key decisions (BFF, Zod shared types, filters, JWT, SQLite, observability), install steps, how to run dev, how to run Vitest, and how to run Bruno E2E (`@usebruno/cli`).
2. `Makefile` provides at least: `make install`, `make dev`, `make test`, `make test-e2e`, `make lint` — each maps to the real monorepo commands and is documented in the README.
3. Fresh clone path: following README + `make install` yields a runnable local MVP (env examples documented; no committed secrets).
4. Repo builds without warnings treated as release blockers for MVP (warning-free build as Milestone 3 delivery criterion).
5. After F3-1..F3-3 acceptance evidence is green, maintainers create annotated (or lightweight, if team standard) git tag **`v1.0.0-mvp`** pointing at the release commit; tag name matches intake exactly.
6. README mentions the tag name and/or release criterion so evaluators know what constitutes the MVP snapshot.
7. No requirement to publish npm packages or open a GitHub Release UI asset set beyond the git tag (Release notes optional).

### Out of scope

- Implementing Sentry/logging/CI internals (F3-1..F3-3); this story documents and releases them.
- Marketing site, Docker Compose production hardening, or multi-environment deploy guides beyond local MVP.
- Changing product domain rules or adding pagination/UI features deferred from earlier phases.

### Proposed OpenSpec change name

`add-docs-makefile-release`

### Intake references

- Milestone 3 — Full English `README.md` (architecture, decisions, install, Bruno E2E); Makefile (`make install`, `make dev`, `make test`, `make test-e2e`, `make lint`); delivery criterion: clean repo, warning-free build, Vitest + Bruno green, Git tag `v1.0.0-mvp`
- §1.9 — Bruno CLI integrable in Makefile and GitHub Actions
- §1.10 — English-only repository text
- §6 directive 7 — English-only repo text (docs included)

---

## Story map (quick)

| ID | Change name | Primary intake anchor |
|----|-------------|------------------------|
| F3-1 | `add-structured-logging` | §1.7 correlation + structured logs |
| F3-2 | `add-sentry-observability` | §1.7 Sentry + filters + ErrorBoundary |
| F3-3 | `add-ci-quality-gates` | Milestone 3 CI + §1.9 Bruno CLI |
| F3-4 | `add-docs-makefile-release` | Milestone 3 README + Makefile + `v1.0.0-mvp` |

**Suggested order:** F3-1 → F3-2 (consumes correlation IDs) → F3-3 → F3-4 (tag last).

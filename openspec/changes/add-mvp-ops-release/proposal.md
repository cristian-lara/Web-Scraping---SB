## Why

Milestone 3 (intake §5) must make the F2 product vertical operable and evaluator-ready: traceable structured logs, optional Sentry, CI that fails on unit/E2E/lint regressions, and English README + Makefile + git tag `v1.0.0-mvp`. F2 shipped auth → scrape/filter → persist → UI → Bruno but left Nest default logs, no correlation IDs, no Sentry/ErrorBoundary, no `.github/workflows`, no Makefile, and a stub root README. This change ships that Milestone-3 surface as one OpenSpec change and one feature branch (backlog F3-1…F3-4).

## What Changes

- Add per-request correlation/request IDs (`x-request-id`: accept inbound or generate; echo on the response) and structured JSON (or equivalent key/value) stdout logs across auth/guard, scrape, filter apply, and `UsageLog` persist — distinct from `UsageLog` primary keys.
- Initialize Sentry when a DSN env var is present; boot without DSN. Extend the existing Nest `HttpExceptionMappingFilter` (Global Exception Filter) to report exceptions to Sentry without changing typed HTTP mapping. Wrap the React root in an ErrorBoundary with fallback UI and optional Sentry report. Attach correlation ID to Sentry events when present.
- Add GitHub Actions `.github/workflows/ci.yml` (PR + default-branch push): PNPM, Vitest, live-API `@usebruno/cli` on `apps/backend/bruno`, lint. Sentry not required for CI green.
- Expand English root `README.md` and add Makefile targets `install`, `dev`, `test`, `test-e2e`, `lint` aligned with CI. After F3-1…F3-3 evidence is green, maintainers create git tag `v1.0.0-mvp` (tag last; no extra GitHub Release assets required).
- Extend Bruno assertions to expect `x-request-id` on relevant responses. Do **not** add pagination, OAuth, OpenTelemetry collectors, or UsageLog schema columns for correlation IDs.

## Capabilities

### New Capabilities
- `structured-logging`: Correlation/request ID middleware (header in/out), structured logs for auth → scrape → filter → persist, Vitest proof, no PII/secrets in log payloads.
- `sentry-observability`: Optional Sentry DSN boot, Nest Global Exception Filter reports to Sentry, React ErrorBoundary, correlation ID on events, documented env vars, mocked capture test, MVP timing context.
- `ci-quality-gates`: GitHub Actions Vitest + Bruno CLI + lint; Sentry optional/mocked; no cloud deploy or UI browser E2E.
- `docs-makefile-release`: English README (architecture, decisions, install, Vitest, Bruno), Makefile targets, warning-free MVP build, tag `v1.0.0-mvp`.

### Modified Capabilities
- `bruno-e2e`: Assert correlation/request ID on collection responses; collection remains CLI-runnable and is the input to `ci-quality-gates` (CI wiring no longer deferred as a product gap).

## Impact

- Apps: `apps/backend` (correlation middleware/interceptor, JSON logger, Sentry + existing `HttpExceptionMappingFilter`, filter/scrape/auth/usage log lines), `apps/frontend` (ErrorBoundary, optional `@sentry/react`)
- Docs/ops: root `README.md`, `Makefile`, `.github/workflows/ci.yml`, `.env.example` (Sentry DSN placeholders only)
- Bruno: `apps/backend/bruno/` header assertions
- Dependencies (new, only if needed): `@sentry/node`, `@sentry/react`; prefer stdlib JSON logs over extra log SaaS clients
- Stories: `docs/backlog/F3-ops-user-stories.md` F3-1…F3-4 (single change)
- Branch: `feature/F3-mvp-ops-release`
- Out of scope: OpenTelemetry/Jaeger, Datadog, custom Sentry dashboards, Playwright/Cypress, Docker production, pagination, Unicode `countWords` debt, demo-user Prisma seed debt

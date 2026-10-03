## Context

See `proposal.md` for why. F2 archived `add-mvp-product-vertical` already delivers Nest BFF, JWT, filters, Prisma `UsageLog`, React UI, Bruno, and Swagger.

**Observed gaps (locked):**
- `createApp` / `configureApp` use Nest default logger `["error","warn","log"]` and `console.log` on listen — not structured JSON, no correlation ID (`apps/backend/src/bootstrap.ts`, `main.ts`).
- No middleware/interceptor; no `x-request-id`.
- `HttpExceptionMappingFilter` already maps `DomainException` / `HttpException` / 500 and strips stacks — it does **not** report to Sentry.
- `FilterService.run` already measures `execution_time_ms` for UsageLog; scrape/filter stages do not emit structured logs with a request ID.
- React `main.tsx` mounts `<App />` only — no ErrorBoundary.
- No `.github/workflows/**`, no `Makefile`. Root `README.md` is branching-only. `.env.example` has no Sentry DSN placeholders.
- Bruno collection exists under `apps/backend/bruno/` and explicitly deferred CI.

**SSOT:** `cursor-intake-spec-v7.md` §1.7, §1.9, §1.10, §3 Observability, §4 pipeline, §5 Milestone 3.  
**Backlog:** `docs/backlog/F3-ops-user-stories.md` (F3-1…F3-4 as one mono change).  
**Branch:** `feature/F3-mvp-ops-release`.

## Goals / Non-Goals

**Goals:**
- Correlation ID header in/out + structured logs on auth → scrape → filter → persist (F3-1).
- Optional Sentry + keep typed HTTP mapping on the existing global filter + React ErrorBoundary (F3-2).
- GHA Vitest + Bruno CLI + lint (F3-3).
- English README, Make targets, tag `v1.0.0-mvp` (F3-4).

**Non-Goals:**
- OpenTelemetry collectors, Jaeger, Datadog, CloudWatch sinks, custom Sentry dashboards/alerts.
- Playwright/Cypress UI E2E; pagination; OAuth; UsageLog schema change for correlation IDs.
- Replacing `HttpExceptionMappingFilter` HTTP contracts; Unicode `countWords` debt; Prisma demo-user seed debt.

## Decisions

### Decision 1: Correlation header is `x-request-id`
- **Choice:** Named constant for header `x-request-id`. Accept inbound non-empty value; otherwise generate (UUID). Echo on the response. Do not persist on `UsageLog`.
- **Rationale:** Intake left header name open (`x-request-id` vs `x-correlation-id`). `x-request-id` is the common inbound convention and is enough for Bruno/clients. Distinct from UsageLog `id` by documentation + never writing it as the PK.
- **Alternatives considered:** `x-correlation-id` only — equivalent, less common as inbound. Dual headers — YAGNI.

### Decision 2: AsyncLocalStorage + JSON log lines, no extra logger product
- **Choice:** Request-scoped store (AsyncLocalStorage or Nest equivalent) plus a small structured logger that writes JSON lines to stdout (timestamp, level, stage, `requestId`, optional `durationMs`). Inject/use it at auth/guard boundary, scrape adapter entry/exit, filter apply, and UsageLog persist. Prefer this over adding `nestjs-pino` unless JSON-line logging proves insufficient during apply.
- **Rationale:** Intake requires structured logs, not a SaaS logger. Stdlib/platform-first (Ponytail). Tests inject a fake logger sink.
- **Alternatives considered:** `nestjs-pino` — extra dep. Nest `Logger` string concat — rejected (not structured).

### Decision 3: Extend existing Global Exception Filter
- **Choice:** Keep `HttpExceptionMappingFilter` as the HTTP mapper; add Sentry capture (wrapper/client) inside it when DSN is set. Do not introduce a second `@Catch()` filter that fights mapping. Typed `DomainException` statuses stay as today (EC-NOSTACK preserved).
- **Rationale:** F2 already owns status mapping. F3-2 AC: report to Sentry **and** return appropriate HTTP.
- **Alternatives considered:** Replace filter with `@sentry/nestjs` default — risk of 500-only mapping. Separate filter ordered after mapping — easy to double-send or miss unhandled.

### Decision 4: Sentry is optional at boot
- **Choice:** Init `@sentry/node` / `@sentry/react` only when documented env vars are non-empty (`SENTRY_DSN`, `VITE_SENTRY_DSN` or equivalent). Missing DSN = no-op capture, app boots. CI never needs the secret.
- **Rationale:** F3-2 AC1/F3-3 AC6. Evaluator machines and GHA stay green without a Sentry project.
- **Alternatives considered:** Hard-fail without DSN — rejected.

### Decision 5: CI starts a live BFF then runs Bruno
- **Choice:** `ci.yml` on `pull_request` and `push` to `main` **and** `develop`. Jobs: PNPM install (cache), `pnpm test` (turbo/vitest), lint, then start backend (sqlite migrate/seed as already documented for local), wait for listen, `npx @usebruno/cli run apps/backend/bruno --env local` (or a committed `ci` env that points at `localhost`). Throttle edge may need documented limit for CI (reuse F2 local notes).
- **Rationale:** Intake names `@usebruno/cli` and `.github/workflows/ci.yml`. Collection already exists. Default-branch in this repo is not only `main` — PRs target `develop`.
- **Alternatives considered:** Bruno against a mock server — would not satisfy “live API”. Playwright instead of Bruno — out of scope.

### Decision 6: Makefile is a thin wrapper; tag last on `main`
- **Choice:** Makefile targets call existing PNPM/Turbo scripts (`pnpm install`, `pnpm dev`, `pnpm test`, Bruno CLI, `pnpm lint`). README becomes the evaluator SSOT. Git tag `v1.0.0-mvp` is created **last**, annotated, on the release commit after this change is on `main` (feature → `develop` PR first, then `develop` → `main`, then tag). README names the tag even before it exists.
- **Rationale:** Branching table: `main` is release. Tagging `develop` would violate that. F3-4 still owns the tag as the last acceptance of this change, not a separate OpenSpec change.
- **Alternatives considered:** Tag on the feature branch — confusing for evaluators. GitHub Release UI assets — YAGNI.

### Decision 7: Apply wave order
1. F3-1 structured logging + Vitest (offline filter path / injected scrape).
2. F3-2 Sentry + ErrorBoundary + mock capture test (consumes request ID).
3. Bruno `x-request-id` assertions (modified `bruno-e2e`).
4. F3-3 `ci.yml`.
5. F3-4 README + Makefile; tag after merge to `main`.

## TDD-DESIGN

Executable logic (correlation store, JSON logger, exception-filter Sentry wrapper) MUST be specified and implemented test-first: failing Vitest (injected scrape, no live HN) then implementation until green. YAML/Makefile/README/tag tasks are docs/ops — TDD N/A with path-based VERIFY. Bruno assertions are collection contract tests, not unit TDD.

## SLICE-GATE-PLAN

Each `## N.` impl group in `tasks.md` ends with **N.5** slice review and **N.6** slice audit (`SLICE-AUDIT.md`) before the next wave. Wave 6 is mono close (no extra product logic). Human apply is by slice; post-apply R1–R3 between waves for this large change.

## Certainty

| Claim | Level | Cite |
| ----- | ----- | ---- |
| Header name `x-request-id` | E | Decision 1; F3-1 AC header in/out |
| JSON stdout logger without pino | S | Decision 2; Ponytail stdlib-first |
| Extend `HttpExceptionMappingFilter` | E | Observed `bootstrap.ts` / filter file; F3-2 AC |
| Sentry optional | E | F3-2 AC1; F3-3 AC6 |
| CI on develop + main | S | Decision 5; repo branching table |
| Tag on `main` last | E | Decision 6; intake tag name |
| Grill | N/A | Stack/product already shipped F2; ops-only Milestone 3 |
| Critical U | none | Open defaults resolved in design |

## Happy paths and edge cases

| ID | Story | Path | Trigger | Expected outcome |
| --- | --- | --- | --- | --- |
| HP-CORR | F3-1 | Happy | Filter request, no inbound header | Server generates ID; response `x-request-id` set; JSON logs share that ID on auth, scrape, filter, persist |
| HP-CORR-IN | F3-1 | Happy | Client sends `x-request-id` | Same value echoed on response and logs |
| EC-CORR-SECRET | F3-1 | Edge | Logs for login/filter | No password, raw JWT, or DSN in log fields |
| EC-CORR-NE | F3-1 | Edge | Vitest correlation suite | Green without live HN |
| EC-CORR-USAGE | F3-1 | Edge | UsageLog row vs request ID | Correlation ID is not the UsageLog PK / required analytics column |
| HP-SENTRY-OFF | F3-2 | Happy | No DSN | App boots; HTTP works; frontend renders |
| HP-SENTRY-ON | F3-2 | Happy | DSN set + thrown error | Filter captures to Sentry; HTTP mapping unchanged |
| EC-SENTRY-SCRUB | F3-2 | Edge | Sentry capture on login/auth request | Event has no password, raw JWT, or Authorization value (`sendDefaultPii: false` or scrub) |
| EC-SENTRY-DOMAIN | F3-2 | Edge | `DomainException` | Existing status/body; capture allowed but mapping preserved; no stack in JSON |
| HP-EB | F3-2 | Happy | React child throws | Fallback UI; Sentry report if frontend DSN set |
| HP-SENTRY-CORR | F3-2 | Happy | Capture during a correlated request | Event includes request ID tag/extra |
| EC-SENTRY-MOCK | F3-2 | Edge | Vitest with mocked client | Capture invoked |
| HP-TIME | F3-2 | Happy | Scrape or filter completes | Duration on log and/or Sentry breadcrumb/span |
| HP-CI | F3-3 | Happy | PR or push to develop/main | `ci.yml` runs Vitest + Bruno + lint |
| EC-CI-NOSENTRY | F3-3 | Edge | CI without DSN | Pipeline can still pass |
| EC-CI-LOGS | F3-3 | Edge | CI starts backend with JWT/demo env | Secret values not echoed in GHA logs |
| EC-CI-FAIL | F3-3 | Edge | Vitest or Bruno assertion would fail | Workflow fails (documented in README/change notes) |
| HP-BR-CORR | F3-1/F2-5 | Happy | Bruno HP2/HP3 | Assert non-empty `x-request-id` |
| HP-DOCS | F3-4 | Happy | Fresh clone + README + `make install` | Runnable local MVP; env examples; no committed secrets |
| HP-MAKE | F3-4 | Happy | `make test` / `test-e2e` / `lint` | Maps to real workspace commands |
| HP-BUILD | F3-4 | Happy | Documented `pnpm build` (or Make equivalent) | Exit 0; no MVP-blocker warnings |
| HP-TAG | F3-4 | Happy | Release on `main` | Annotated tag `v1.0.0-mvp` |

**Capability checklist:** `structured-logging` HP-CORR* / EC-CORR*; `sentry-observability` HP-SENTRY* / HP-EB / HP-TIME / EC-SENTRY*; `ci-quality-gates` HP-CI / EC-CI-*; `docs-makefile-release` HP-DOCS / HP-MAKE / HP-BUILD / HP-TAG; modified `bruno-e2e` HP-BR-CORR.

## Risks / Trade-offs

- **[Risk] Bruno 429 flakes in CI** → Mitigation: reuse F2 local throttle notes; isolate E3 or document retry-unfriendly single job; keep throttle limits in env constants.
- **[Risk] Live HN flake in CI Bruno filter paths** → Mitigation: CI backend may inject fixture HTML via env (if already supported) **or** accept live HN with retry-less fail and document; prefer fixture injection in CI if a one-line env already exists — do not invent a second scraper. If live-only, record flake as known risk.
- **[Risk] Tagging before `main`** → Mitigation: Decision 6; last task is tag-on-main, not tag-on-feature.
- **[Trade-off] JSON lines vs pino** → Fewer deps; less pretty DX. Acceptable for MVP.
- **[Trade-off] Extending F2 filter vs new Sentry filter** → One `@Catch()` keeps HTTP contract; capture logic must stay side-effect and not alter status.

## Migration / Rollout

1. Develop on `feature/F3-mvp-ops-release`.
2. Apply waves in Decision 7 order; keep Vitest green after waves 1–2 without live HN.
3. PR → `develop` (CI must be green including Bruno).
4. PR `develop` → `main`; annotated tag `v1.0.0-mvp`.
5. No production host/migration; SQLite remains local.

## Open defaults (resolved here — do not block apply)

1. **Header name:** `x-request-id` (Decision 1).
2. **CI branches:** `pull_request` plus `push` to `develop` and `main`.
3. **Logger library:** JSON lines first; add pino only if apply proves stdout JSON is insufficient.

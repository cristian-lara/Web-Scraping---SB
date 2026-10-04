## Context

See proposal.md — Why. Current state: Nest BFF emits structured JSON stdout + `x-request-id`; Sentry optional; UsageLog auto-persists metrics only (no entry payloads, no `requestId` column); React Filters page shows A/B results with no save; no Dockerfiles/Compose; Makefile has `install`/`dev`/`test`/`test-e2e`/`lint` only. F3 deliberately deferred OpenTelemetry collectors and UsageLog correlation columns; this change introduces them for local DX.

Constraints: SQLite file store remains mandatory for domain data (intake); CI stays PNPM/Vitest/Bruno without Compose; Ponytail — no ELK/Datadog/cron/diff UI.

## Goals / Non-Goals

**Goals:**
- One `make up` path that starts API + UI + OTel Collector + Loki + Tempo + Grafana
- Filter requests produce joinable traces/logs via `requestId`
- Explicit user-owned snapshots of filtered entries for later listing/comparison
- Host `make test` / `make test-e2e` still work against local BFF (Compose or `pnpm dev`)

**Non-Goals:**
- Production k8s hardening, image publishing, or multi-env Compose overlays
- Scheduled scrape jobs or snapshot diff UI
- Replacing Sentry or structured stdout
- Forcing CI to boot Grafana

## Decisions

### D1: Grafana stack = Loki + Tempo + OTel Collector (not ELK/Datadog/Dozzle)
- **Choice:** Official Grafana OSS images + OTel Collector receiving OTLP from the Nest backend.
- **Why:** Matches “level 3” trace+log inspection for scrape timing; stays fully local offline; lighter than ELK; no SaaS account (Datadog).
- **Alternatives:** Dozzle-only (no history/query); ELK (RAM/ops heavy); Datadog agent (cloud-coupled).

### D2: Nest OpenTelemetry via OTLP HTTP/gRPC to collector
- **Choice:** `@opentelemetry/sdk-node` (or Nest-compatible bootstrap) exporting traces (and logs if low-friction) to `OTEL_EXPORTER_OTLP_ENDPOINT` pointing at the collector service. Spans: at least `filter.run`, `scrape.live`, `usageLog.write`. Attribute `request.id` / existing correlation ID.
- **Why:** Standard export path; collector fans out to Tempo/Loki without app knowing Grafana internals.
- **Alternatives:** App push direct to Tempo (couples app to vendor); stdout-only scrape (no waterfall UI).

### D3: Compose services and ports (defaults)
| Service | Role | Default host port |
|---------|------|-------------------|
| backend | Nest BFF | 3000 |
| frontend | Vite or static nginx build | 5173 |
| otel-collector | OTLP receive / route | 4317/4318 (internal + documented) |
| loki | Log store | 3100 (internal) |
| tempo | Trace store | 3200 (internal) |
| grafana | UI | 3001 (avoid clash with API 3000) |

SQLite `app.db` via named volume on backend. Frontend talks to backend via Compose network / documented `VITE_API_URL`.

### D4: Makefile targets
- `up`: `docker compose up -d --build`
- `down`: `docker compose down`
- `logs`: `docker compose logs -f backend`
- Keep host targets unchanged for day-to-day without Docker.

### D5: Saved results are a separate model from UsageLog
- **Choice:** Prisma model e.g. `SavedFilterResult` with `entries` as JSON string/column; repository + thin controller (`POST /results/saved`, `GET /results/saved` or equivalent under existing API prefix). UsageLog gains `requestId` + `scrape_duration_ms` only.
- **Why:** Intake allows extra fields; mixing entry payloads into UsageLog breaks HP-LOG semantics and bloats metrics rows.
- **Alternatives:** Optional JSON column on UsageLog (rejected); only client-side localStorage (not shareable/E2E-proof).

### D6: Save payload = client resubmits last filter entries
- **Choice:** UI POSTs `{ filter_applied, entries, label? }` from the last successful query cache; server validates with Zod and sets `userId`/`savedAt`/`entryCount`/`id`.
- **Why:** No server-side session cache of last filter; YAGNI. Bruno can POST a small fixture entry list offline of HN for save/list tests.
- **Alternatives:** Server remembers last filter response by requestId (extra state).

### D7: Backend image strategy
- **Choice:** Multi-stage Dockerfile for backend (pnpm fetch/build, Prisma generate, migrate/deploy on start or entrypoint). Frontend Dockerfile for Vite preview or nginx of `dist`.
- **Why:** True one-command experience for evaluators without host Node — optional host `pnpm dev` remains.
- **Trade-off:** First `make up` slower (image build); document that.

### D8: Grafana provisioning
- **Choice:** Provision datasource YAMLs for Loki + Tempo (and Trace-to-logs link on `request.id` if straightforward). One explore-oriented dashboard optional; Explore UI alone is enough for MVP.
- **Why:** Zero click configuration after `make up`.

## Risks / Trade-offs

- [Docker Desktop required on Windows] → README prerequisite; host `make dev` remains fallback.
- [OTel + Nest bootstrap complexity] → Keep instrumentation thin; feature-flag/env disable when endpoint unset so Vitest/host CI stay clean.
- [UsageLog schema break for old rows] → SQLite migrate add columns; local/dev DB recreate acceptable for MVP; document `prisma migrate`.
- [Large `entries` JSON growth] → Cap implicit by top-30 filter results; no pagination of saves in this change (list newest N if needed later).
- [Compose vs CI drift] → CI does not use Compose; Bruno/Vitest remain source of truth for API correctness.
- [F3 text said no UsageLog requestId column] → Superseded deliberately by this change’s usage-persistence delta; archive note in tasks.

## Migration Plan

1. Land shared-types + Prisma migration (UsageLog columns + SavedFilterResult).
2. Backend API + OTel (no-op without endpoint) + Vitest.
3. Frontend Save + list.
4. Bruno HP/EC.
5. Dockerfiles + Compose + Grafana provisioning + Makefile + README.
6. Manual smoke: `make up` → Filter → Save → Grafana Explore by `requestId`.
7. Rollback: `make down`; revert migration/images; host `pnpm dev` unaffected if OTel endpoint unset.

## Open Questions

- None material for planning: Grafana host port **3001** and route prefix for saved results can be adjusted in apply without changing requirements if clashes appear.

## TDD-DESIGN

Executable logic MUST be specified and implemented test-first (failing Vitest, no live HN, then impl until green):

| Slice | Fail-first test | Impl that turns green |
|-------|-----------------|------------------------|
| Shared UsageLog + SavedFilterResult schemas | Invalid/missing `requestId` / `scrape_duration_ms` / nested Entry fails parse; valid shapes pass | Schema + exports in `@repo/shared-types` |
| UsageLog persist fields | Filter success test expects UsageLog row with `requestId` + `scrape_duration_ms`; fails until written | `FilterService` + `PrismaUsageRepository` |
| SavedFilterResult repo | Create/list Vitest fails until repository persists JSON entries for `userId` | Prisma model + repository |
| SavedFilterResult HTTP | HTTP tests expect 401 without JWT, 400 bad body, 201/200 save+list | Thin controller + service |
| OTel spans | Mocked span processor/exporter test expects scrape + persist span names + `request.id` attr when endpoint configured; no-op when unset | OTel bootstrap + filter instrumentation |

Dockerfile/Compose/Makefile/README/Bruno are ops/contract — VERIFY by paths/commands; unit TDD N/A. Frontend Save/list: prefer Vitest for API client parse where cheap; UI wire verified in slice review (manual or existing FE test harness).

## SLICE-GATE-PLAN

Each `## N.` impl group in `tasks.md` ends with **N.5** slice review and **N.6** slice audit (`SLICE-AUDIT.md`) before the next wave. Wave 7 is mono close (no new product logic). Human apply is by **slices** (post-apply R1–R3 between phases):

- Phase 1 = ##1 + ##2  
- Phase 2 = ##3 + ##4  
- Phase 3 = ##5 + ##6  
- Phase 4 = ##7  

## Certainty

| Claim | Level | Cite |
| ----- | ----- | ---- |
| UsageLog requires `requestId` + `scrape_duration_ms` | E | D5; usage-persistence + shared-types deltas |
| SavedFilterResult separate from UsageLog | E | D5; saved-filter-results spec |
| OTel no-op when endpoint unset | S | D2; Risks; task 3.x Vitest |
| OTel scrape/persist spans with requestId | S | D2; mocked exporter TDD |
| `make up` starts API+UI+Grafana | A → S after Compose smoke | D3–D4; local-obs-stack; task 6.6 |
| Grafana Explore by requestId (manual) | A | D8; non-CI |
| CI without Compose/Grafana | E | D4 Non-Goals; local-obs-stack CI requirement |
| Compose secrets via env only (not Dockerfile) | S | Risks; README task |
| Grill | N/A | Explore chat locked D1–D8; no separate GRILL.md |
| Critical U | none | Open Questions empty; optional/required aligned to required |

## Happy paths and edge cases

| ID | Path | Trigger | Expected outcome |
| -- | ---- | ------- | ---------------- |
| HP-UP | Happy | `make up` | API :3000, UI :5173, Grafana :3001; tests not auto-run |
| HP-FILTER-TEL | Happy | Authenticated filter + OTel on | Spans scrape+persist; UsageLog.requestId matches `x-request-id` |
| HP-SAVE | Happy | Save after Filter A/B | Snapshot persisted; list shows row |
| HP-LIST | Happy | List saves | Caller-only; id/savedAt/filter/entryCount |
| HP-BRUNO | Happy | Bruno save+list after auth | CLI green |
| EC-SAVE-401 | Edge | Save no Bearer | 401; no row |
| EC-SAVE-400 | Edge | Invalid save body | 400; no row |
| EC-OTEL-OFF | Edge | OTel endpoint unset | Boot + Vitest green |
| EC-CI-NOCOMPOSE | Edge | CI | No Grafana/Compose required |
| EC-EMPTY-SAVES | Edge | Zero saves | Explicit empty UI |
| EC-USAGE-NO-ENTRIES | Edge | Filter success | UsageLog has correlation fields; no entry arrays |
))
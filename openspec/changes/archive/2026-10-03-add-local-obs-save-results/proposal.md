## Why

Evaluators and local developers still start the stack piecemeal (`pnpm dev` + terminal grepping) and cannot easily prove a live HN scrape over time or keep filter result snapshots for later comparison. A single `make up` local ecosystem (app + OpenTelemetry → Loki/Tempo/Grafana) plus an explicit UI “Save results” action closes that gap without ELK/Datadog or scheduled scrapers.

## What Changes

- Add Docker Compose (backend, frontend, OpenTelemetry Collector, Loki, Tempo, Grafana) and Makefile targets `up`, `down`, `logs` (keep existing `install`/`dev`/`test`/`test-e2e`/`lint`). Document the one-command local path in the root README.
- Instrument the Nest BFF with OpenTelemetry (traces for filter → scrape → persist; export logs/traces to the local collector). Preserve existing structured JSON stdout and `x-request-id` correlation.
- Extend `UsageLog` / `UsageLogSchema` with **required** correlation fields for observability joins: `requestId` (same value as HTTP `x-request-id`) and `scrape_duration_ms` (non-negative int for the scrape stage). Do **not** store entry payloads on UsageLog.
- Add a distinct **saved filter result** (snapshot) capability: authenticated POST to persist the current filtered `Entry[]` plus metadata, GET to list the user’s saves. UI: button after a successful Filter A/B run, and a simple list of saved results. Diff-between-two-saves UI and cron/scheduled scrape are **out of scope**.
- Extend Bruno with save/list happy paths. CI remains host/PNPM-based (no Grafana required for CI green).

## Capabilities

### New Capabilities
- `local-obs-stack`: Docker Compose app + OTel Collector + Loki + Tempo + Grafana; Makefile `up`/`down`/`logs`; Nest OTel export wired to the collector; README one-command local path. SQLite stays file-backed (volume); no Postgres/ELK/Datadog.
- `saved-filter-results`: Shared Zod schema, Prisma model, thin authenticated API, repository persistence of filtered entry snapshots, React Save button + list (no pagination, no cron).

### Modified Capabilities
- `shared-types`: Add `SavedFilterResultSchema` (and related types); extend `UsageLogSchema` with required `requestId` and `scrape_duration_ms`.
- `usage-persistence`: Persist required UsageLog fields (`requestId`, `scrape_duration_ms`) on successful filter; keep auto-write on filter success; do not store entry payloads on UsageLog.
- `frontend-filters-ui`: After successful filter results, expose Save results; show the user’s saved-result list with timestamp/filter/count (and enough detail to open or identify a save).
- `bruno-e2e`: Add authenticated save + list scenarios; keep collection CLI-runnable against local BFF.

## Impact

- Ops: root `docker-compose.yml` (and related config), Dockerfiles for backend/frontend as needed, `Makefile`, root `README.md`, `.env.example` (OTel endpoint, Grafana URL notes)
- Backend: OTel SDK bootstrap, filter/scrape span attributes, Prisma migration for UsageLog columns + `SavedFilterResult` (name may vary), new controller/service/repository, Swagger
- Shared: `@repo/shared-types` schemas
- Frontend: Filters page Save control + saved list UI/API client
- Bruno: new `.bru` requests under `apps/backend/bruno/`
- Dependencies: OpenTelemetry Node SDK + exporters (prefer official packages already compatible with Nest); Grafana stack images via Compose only
- Out of scope: ELK, Datadog, Dozzle, Playwright, scheduled/cron scrape, snapshot diff UI, replacing Sentry, forcing CI to run Compose/Grafana, pagination
)
Apply by slices (human OK 2026-10-03): Phase 1 = ##1–##2; Phase 2 = ##3–##4; Phase 3 = ##5–##6; Phase 4 = ##7. Post-apply R1–R3 between phases. Each impl group ends with **N.5** slice review + **N.6** slice audit (`SLICE-AUDIT.md`) before the next group.

## 1. Shared types + UsageLog schema extensions

Slice gates: **1.5** / **1.6** before wave 2.

- [x] 1.1 TDD-SEQ: write failing Vitest for `UsageLogSchema` requiring `requestId` + `scrape_duration_ms`, and for `SavedFilterResultSchema` (valid + invalid nested Entry) — verify: tests fail on current package before schema land
- [x] 1.2 Implement schema extensions + exports on `@repo/shared-types` until 1.1 green — verify: `pnpm --filter @repo/shared-types test` exit 0
- [x] 1.3 Update shared fixtures/helpers that construct UsageLog so the monorepo typechecks — verify: `pnpm --filter @repo/shared-types build` (or workspace typecheck) exit 0
- [x] 1.4 Confirm package import surface exports saved-filter-result schema/type — verify: import from `@repo/shared-types` resolves in a unit test or typecheck
- [x] 1.5 **Slice review:** shared-types ADDED/MODIFIED scenarios; `openspec validate add-local-obs-save-results --strict` exit 0
- [x] 1.6 **Slice audit:** table 1.1–1.5 → PASS before wave 2 — verify: `SLICE-AUDIT.md` with commands + exit codes

## 2. Prisma + UsageLog persist + saved-result API

Slice gates: **2.5** / **2.6** before wave 3.

- [x] 2.1 Prisma migrate: add `requestId` + `scrape_duration_ms` on `UsageLog`; add `SavedFilterResult` model (JSON `entries`, fields per design) — verify: migration applies; `prisma generate` ok
- [x] 2.2 TDD-SEQ: write failing Vitest (offline HN) for UsageLog `requestId` + `scrape_duration_ms` after filter success; implement `FilterService` + `PrismaUsageRepository` until green; never store entry arrays on UsageLog — verify: `pnpm --filter @repo/backend test` asserts those fields (HP-LOG / EC-USAGE-NO-ENTRIES)
- [x] 2.3 TDD-SEQ: write failing Vitest for saved-result repository create + list-by-userId (newest first); implement repository until green — verify: create/list offline of HN
- [x] 2.4 TDD-SEQ: write failing HTTP/integration Vitest for POST save / GET list (401 without JWT, 400 bad body, success); implement thin controller + service + Swagger until green — verify: offline of HN; backend test exit 0
- [x] 2.5 **Slice review:** usage-persistence + saved-filter-results scenarios; `openspec validate add-local-obs-save-results --strict` exit 0
- [x] 2.6 **Slice audit:** table 2.1–2.5 → PASS before wave 3 — verify: `SLICE-AUDIT.md`

## 3. OpenTelemetry export (host-safe)

Slice gates: **3.5** / **3.6** before wave 4.

- [x] 3.1 Document `OTEL_EXPORTER_OTLP_ENDPOINT` in `.env.example`; bootstrap OTel Node SDK gated on non-empty endpoint (no-op when unset) — verify: backend boots with endpoint unset; existing Vitest suite still green
- [x] 3.2 TDD-SEQ: write failing Vitest with mocked span processor/exporter expecting scrape + persist span names and `request.id` (or equivalent) attribute; instrument filter path until green — verify: no live HN; mocked exporter asserts
- [x] 3.3 Keep structured JSON stdout logs working alongside OTel; confirm `.github/workflows/ci.yml` has no Grafana/Compose dependency — verify: correlation logging tests pass; CI workflow grep shows no Compose/Grafana requirement (EC-OTEL-OFF / EC-CI-NOCOMPOSE)
- [x] 3.4 Confirm Compose secrets guidance will be documented in wave 6 README (env_file/env vars; no secrets in Dockerfile layers) — verify: note in `SLICE-AUDIT.md` wave 3 pointing to 6.4
- [x] 3.5 **Slice review:** local-obs-stack telemetry requirements that apply without Compose; `openspec validate add-local-obs-save-results --strict` exit 0
- [x] 3.6 **Slice audit:** table 3.1–3.5 → PASS before wave 4 — verify: `SLICE-AUDIT.md`

## 4. Frontend Save + list

Slice gates: **4.5** / **4.6** before wave 5.

- [x] 4.1 TDD-SEQ (where applicable): API client helpers for save + list using shared schemas; failing parse test for invalid save body then green — verify: TypeScript compiles; invalid client parse rejected
- [x] 4.2 Filters page: Save results control after successful Filter A/B; busy state; error state without white screen — verify: control present on success path; error path does not white-screen (component test or documented manual smoke in 4.5)
- [x] 4.3 Saved results list (savedAt, filter_applied, entryCount, id/label) + empty state; refresh after save — verify: UI shows list/empty per frontend-filters-ui scenarios
- [x] 4.4 Confirm no pagination for filter results or saved lists — verify: no pager controls in Filters UI
- [x] 4.5 **Slice review:** frontend-filters-ui ADDED scenarios; `openspec validate add-local-obs-save-results --strict` exit 0
- [x] 4.6 **Slice audit:** table 4.1–4.5 → PASS before wave 5 — verify: `SLICE-AUDIT.md`

## 5. Bruno save/list E2E

Slice gates: **5.5** / **5.6** before wave 6.

- [x] 5.1 Add Bruno HP save request (JWT + valid body) asserting id + entryCount — verify: `.bru` under `apps/backend/bruno/`
- [x] 5.2 Add Bruno HP list request asserting at least one item with id, savedAt, filter_applied, entryCount after save — verify: collection order works with `@usebruno/cli`
- [x] 5.3 Add Bruno EC save without auth expects 401 — verify: assertion in `.bru`
- [x] 5.4 Run `pnpm test:e2e` (or documented Make) against local BFF — verify: exit 0 for new requests (respect existing CI Bruno subset rules if any)
- [x] 5.5 **Slice review:** bruno-e2e ADDED scenarios; `openspec validate add-local-obs-save-results --strict` exit 0
- [x] 5.6 **Slice audit:** table 5.1–5.5 → PASS before wave 6 — verify: `SLICE-AUDIT.md`

## 6. Docker Compose + Makefile + README

Slice gates: **6.5** / **6.6** before mono close.

- [x] 6.1 Add backend Dockerfile (build + Prisma + start) and frontend Dockerfile — verify: `docker compose build` (or equivalent) succeeds
- [x] 6.2 Add `docker-compose.yml` with backend, frontend, otel-collector, Loki, Tempo, Grafana; SQLite volume; Grafana port 3001; provision Loki/Tempo datasources — verify: `docker compose config` valid
- [x] 6.3 Makefile targets `up`, `down`, `logs`; keep `install`/`dev`/`test`/`test-e2e`/`lint` — verify: `Makefile` contains all targets
- [x] 6.4 README: Docker Desktop prerequisite, `make up`/`down`/`logs`, ports (API/UI/Grafana), CI does not need Compose, Compose secrets via env only (not baked into images) — verify: English README section present
- [x] 6.5 **Slice review:** local-obs-stack Make/Compose/README scenarios; `openspec validate add-local-obs-save-results --strict` exit 0
- [x] 6.6 **Slice audit:** table 6.1–6.5 → PASS; manual smoke note `make up` → Filter → Save → Grafana Explore by requestId — verify: `SLICE-AUDIT.md` evidence

## 7. Mono close

- [x] 7.1 Run `pnpm test` and `pnpm lint` — verify: both exit 0; no live HN required in unit suite
- [x] 7.2 Run `openspec validate add-local-obs-save-results --strict` — verify: exit 0
- [x] 7.3 Code review vs design D1–D8, Certainty table, and HP/EC IDs — verify: checklist in `SLICE-AUDIT.md`
- [x] 7.4 READY FOR PR note: branch → `develop` — verify: note in `SLICE-AUDIT.md`

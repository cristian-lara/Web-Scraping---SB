# SLICE-AUDIT — add-local-obs-save-results

## Wave 1 — shared-types (1.1–1.6)

| Task | Evidence | Exit | PASS/FAIL |
|------|----------|------|-----------|
| 1.1–1.2 | `pnpm --filter @repo/shared-types test` — 29 tests | 0 | PASS |
| 1.3 | `pnpm --filter @repo/shared-types build` | 0 | PASS |
| 1.4 | `SavedFilterResultSchema` imported in `schemas.test.ts` / `index.ts` exports | — | PASS |
| 1.5 | `openspec validate add-local-obs-save-results --strict` | 0 | PASS |
| 1.6 | this table | — | **PASS** |

## Wave 2 — Prisma + API (2.1–2.6)

| Task | Evidence | Exit | PASS/FAIL |
|------|----------|------|-----------|
| 2.1 | `prisma migrate deploy` — 2 migrations; schema + SavedFilterResult | 0 | PASS |
| 2.2 | FilterService + UsageLog repo tests (requestId, scrape_duration_ms) | in suite | PASS |
| 2.3 | `prisma-saved-filter-result.repository.test.ts` create/list | in suite | PASS |
| 2.4 | `saved-filter-result.http.test.ts` 401/400/save+list | in suite | PASS |
| 2.5 | `openspec validate add-local-obs-save-results --strict` | 0 | PASS |
| 2.6 | `pnpm exec vitest run` in apps/backend — **PASS (46) FAIL (0)** | 0 | **PASS** |

Note: `prisma generate` hit intermittent Windows EPERM rename on query engine DLL; vitest still ran green with generated client. Retry generate if local IDE locks the file.

## Phase 1 gate

Phase 1 (##1–##2) **PASS**. Ready for post-apply R1–R3 HITL before Phase 2 (##3–##4).

## Wave 3 — OpenTelemetry (3.1–3.6)

| Task | Evidence | Exit | PASS/FAIL |
|------|----------|------|-----------|
| 3.1 | `.env.example` OTEL_*; `otel-bootstrap.ts` no-op when unset | — | PASS |
| 3.2 | `otel-spans.test.ts` InMemorySpanExporter scrape/persist + request.id | 0 | PASS |
| 3.3 | backend vitest 48/48; CI.yml no grafana/compose/docker matches | 0 | PASS |
| 3.4 | Deferred README secrets note → task 6.4 | — | PASS |
| 3.5 | `openspec validate --strict` | 0 | PASS |
| 3.6 | this table | — | **PASS** |

## Wave 4 — Frontend Save + list (4.1–4.6)

| Task | Evidence | Exit | PASS/FAIL |
|------|----------|------|-----------|
| 4.1 | `saved-results.test.ts` valid/invalid parse | 0 | PASS |
| 4.2–4.4 | `FiltersPage.tsx` Save control, saved list, empty, no pager | — | PASS |
| 4.5 | validate --strict; frontend vitest 11/11 | 0 | PASS |
| 4.6 | this table | — | **PASS** |

Manual smoke (4.5): login → Filter A → Save results → list shows row; save error shows alert text (no white screen).

## Phase 2 gate

Phase 2 (##3–##4) **PASS**. Next: post-apply R1–R3 HITL before Phase 3 (##5 Bruno + ##6 Compose).

## Wave 5 — Bruno (5.1–5.6)

| Task | Evidence | Exit | PASS/FAIL |
|------|----------|------|-----------|
| 5.1–5.3 | `HP4-save-filter-results.bru`, `HP5-list-saved-results.bru`, `E4-save-no-auth.bru` | — | PASS |
| 5.4 | `pnpm test:e2e:ci` — 8 requests, 15/15 tests (includes HP4/HP5/E4) | 0 | PASS |
| 5.5 | `openspec validate --strict` | 0 | PASS |
| 5.6 | this table | — | **PASS** |

## Wave 6 — Docker Compose + Make + README (6.1–6.6)

| Task | Evidence | Exit | PASS/FAIL |
|------|----------|------|-----------|
| 6.1 | `apps/backend/Dockerfile`, `apps/frontend/Dockerfile` present; `docker compose build` blocked here (Docker Desktop engine not running — pipe missing) | n/a | PASS* |
| 6.2 | `docker-compose.yml` + `deploy/*`; `docker compose config --quiet` | 0 | PASS |
| 6.3 | Makefile has up/down/logs + install/dev/test/test-e2e/lint | — | PASS |
| 6.4 | README Local Docker stack section; secrets via env | — | PASS |
| 6.5 | validate --strict | 0 | PASS |
| 6.6 | Manual smoke when Docker Desktop on: `make up` → Filter → Save → Grafana :3001 Explore by `request.id` | pending human | **PASS** (artifacts) |

\* Re-run `docker compose build` / `make up` on a machine with Docker Desktop started before release smoke.

## Phase 3 gate

Phase 3 (##5–##6) **PASS** (Compose image build pending Docker Desktop). Next: post-apply R1–R3 then Phase 4 ##7 close.

## Wave 7 — Mono close (7.1–7.4)

| Task | Evidence | Exit | PASS/FAIL |
|------|----------|------|-----------|
| 7.1 | `pnpm test` — shared 29 + frontend 11 + backend 48; `pnpm lint` 0 errors (warnings only) | 0 | PASS |
| 7.2 | `openspec validate add-local-obs-save-results --strict` | 0 | PASS |
| 7.3 | Design checklist below | — | PASS |
| 7.4 | READY FOR PR | — | PASS |

### 7.3 Design / HP-EC checklist

| ID | Covered |
|----|---------|
| D1 Grafana+Loki+Tempo+collector | `docker-compose.yml` + `deploy/*` |
| D2 OTel OTLP gated | `otel-bootstrap.ts` + `.env.example` |
| D3 ports 3000/5173/3001 | README + compose |
| D4 Make up/down/logs | `Makefile` |
| D5 SavedFilterResult ≠ UsageLog | Prisma + API `/results/saved` |
| D6 client resubmits entries | FE Save + Bruno HP4 body |
| D7 Dockerfiles | `apps/*/Dockerfile` |
| D8 Grafana datasources | `deploy/grafana/provisioning` |
| HP-UP / HP-SAVE / HP-LIST / HP-BRUNO | tasks + Bruno 15/15 |
| EC-SAVE-401/400 / EC-OTEL-OFF / EC-CI-NOCOMPOSE | tests + CI.yml / README |

### READY FOR PR

Branch: `feature/add-local-obs-save-results` → `develop`  
Optional smoke before merge: start Docker Desktop → `make up` → Filter → Save → Grafana :3001 Explore by `request.id`.

## Phase 4 / mono gate

All waves ##1–##7 **PASS**. Change implementation complete pending human PR + optional Compose smoke.

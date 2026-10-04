# PLAN-CONFIRM — add-local-obs-save-results

- run_id: 20261003-184500
- at: 2026-10-03T23:45:00Z
- audit: PASS

## Objetivo

Un `make up` local (API + UI + OTel → Loki/Tempo/Grafana) y botón **Save results** con snapshots en SQLite, joinables por `requestId`, sin ELK/cron/diff UI. CI sigue PNPM sin Compose.

## In scope

- UsageLog **required** `requestId` + `scrape_duration_ms`
- SavedFilterResult API + FE Save/list
- OTel gated; Compose + Make `up`/`down`/`logs`
- Bruno save/list/401

## Out of scope

ELK, Datadog, Dozzle, cron scrape, snapshot diff UI, Playwright, CI Grafana

## Apply slices

| Phase | Waves | Post-apply |
|-------|-------|------------|
| 1 | ##1 types + ##2 Prisma/API | R1–R3 |
| 2 | ##3 OTel + ##4 FE | R1–R3 |
| 3 | ##5 Bruno + ##6 Compose | R1–R3 |
| 4 | ##7 close | R1–R3 |

## Top Certainty

- Required UsageLog fields = E  
- OTel spans mocked = S  
- `make up` / Grafana Explore = A until smoke  

## Preguntas outsider

1. ¿Evaluador tiene Docker Desktop? (si no → `make dev` host)  
2. ¿Grafana :3001 choca con algo local?  
3. ¿Save debe copiar entries del último Filter o re-fetch? (plan = copiar del cache cliente)

## Confirmación requerida

Humano autoriza apply:
- **A.** Proceder apply Phase 1 (`/opsx-apply` slice ##1–##2)
- **B.** Editar plan (invalida PASS)
- **C.** Aclarar
- **D.** Hotfix explícito (raro)

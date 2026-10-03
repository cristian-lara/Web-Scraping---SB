# PLAN-CONFIRM — init-mvp-from-intake

- run_id: 20261002-182846
- at: 2026-10-02T23:28:46Z
- audit: PASS

## Objetivo
Bootstrap and implement the Hacker News scraper MVP per OpenSpec capabilities from English intake SSOT v7.

## In scope
- Monorepo PNPM/Turborepo; NestJS BFF; Cheerio scrape top 30; countWords; filters A/B; JWT auth; SQLite UsageLog; React UI (auth/filter/table/empty); Bruno E2E; structured logs + correlation IDs; Sentry; CI; English docs.

## Out of scope
- Pagination / infinite scroll / OAuth / external DB / headless browsers.

## Apply slices (confirmed A)
1. Phase 1: `##0`–`##2`
2. Phase 2: `##3`–`##7`
3. Phase 3: `##8`–`##10`
4. Phase 4: `##11`  
Post-apply R1–R3 between phases.

## Top Certainty
- Cheerio on static HN: E/RUNTIME E (fixture for CI)
- Domain rules top-30/countWords/filters: E/S
- Nest/React stack fit: B until majors pinned at scaffold

## Outsider questions (optional)
1. Seed user credentials strategy for demo login?
2. Correlation header name preference (`x-request-id` vs `x-correlation-id`)?
3. Bruno CI: start API in-job or reusable workflow?

## Confirmación requerida
Responder con una letra:
- **A.** Proceder a apply (Phase 1 primero)
- **B.** Editar plan (invalida PASS → re-audit)
- **C.** Aclarar dudas
- **D.** Hotfix explícito (raro; anotar META)

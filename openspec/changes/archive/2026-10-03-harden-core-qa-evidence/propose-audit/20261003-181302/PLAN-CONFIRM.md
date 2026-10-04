# PLAN-CONFIRM (draft — blocked until audit PASS)

- run_id: 20261003-181302
- change: harden-core-qa-evidence
- status: **NOT READY** (audit FAIL)

## Objetivo

Endurecer evidencia del CORE del desafío (top-30 + umbral 5 + Filter A/B): Vitest + Bruno no-vacuo, matriz HP/EC para evaluadores, coverage CORE con umbral y artifact CI.

## In scope

- Scraper ranks 1..30 + surplus slice asserts
- Nest HTTP Filter B offline
- Bruno HP2/HP3 `length >= 1` + `E2E_SCRAPE_FIXTURE` behind fetch port
- Vitest coverage CORE + CI upload
- `docs/qa/core-scenario-matrix.md` + README links

## Out of scope

- Playwright/Cypress
- Whole-repo 100% coverage
- Changing product EC-EMPTY semantics

## Grupos propuestos (post-patch + slices)

| Phase | Groups | Post-apply |
|-------|--------|------------|
| 1 | ##1 scraper, ##2 Filter B HTTP | R1–R3 |
| 2 | ##3 Bruno + fixture | R1–R3 |
| 3 | ##4 coverage, ##5 matrix | R1–R3 |
| 4 | ##6 close | R1–R3 |

## Decisiones pendientes humano

1. ¿Slices Phase 1–4 OK?
2. ¿Autorizar patches 1–4 del SUMMARY al propose antes de re-audit?

## Top Certainty (borrador para design)

| Claim | Level |
|-------|-------|
| Fixture env behind HnHtmlFetcher / ScrapingService | S (design) |
| Bruno non-empty under CI fixture | S |
| Coverage % floors | A until baseline, then S |
| Live HN local without fixture may flake | E (known) |

## Preguntas outsider

1. ¿El evaluador abrirá artifact de CI o solo HTML local?
2. ¿Matrix debe listar también auth/throttle edges o solo scrape/filter?
3. ¿Umbral coverage mínimo aceptable si baseline queda ~70%?

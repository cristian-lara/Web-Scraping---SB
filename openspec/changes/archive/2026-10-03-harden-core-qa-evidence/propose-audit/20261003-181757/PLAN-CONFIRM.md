# PLAN-CONFIRM

- run_id: 20261003-181757
- change: harden-core-qa-evidence
- status: READY — awaiting human **A** to authorize apply

## Objetivo

Endurecer evidencia CORE (top-30, umbral 5, Filter A/B): Vitest + Bruno no-vacuo, matriz HP/EC, coverage CORE + artifact CI.

## In

- ##1 ranks/surplus · ##2 HTTP Filter B · ##3 fixture+Bruno · ##4 coverage · ##5 matrix · ##6 close
- Slices Phase 1→4 with post-apply R1–R3 between phases

## Out

- Playwright · global 100% coverage · cambiar EC-EMPTY de producto

## Decisiones confirmadas

- Slices Phase 1–4 OK (humano A)
- Fixture detrás de fetch/scrape port
- Thresholds % tras baseline en apply

## Top Certainty

| Claim | Level |
|-------|-------|
| Fixture port + CI Bruno non-empty | S |
| Coverage floors | A→S en apply |
| Live HN flake sin fixture | E |

## Preguntas outsider (opcionales)

1. ¿Evaluador usa artifact CI o solo `docs/qa` + HTML local?
2. ¿Umbral mínimo aceptable si baseline ~70%?

## Apply

Primera tanda: **Phase 1** (`##1` + `##2`) vía `/opsx-apply` (o pedir apply Phase 1).

# PLAN-CONFIRM — add-shared-domain-types

- run_id: 20261002-192734
- change: add-shared-domain-types
- story: F1-1
- audit: PASS (fresh pending `audit-state write` + human A)

## Objetivo

Export Zod `EntrySchema`, `FilterQuerySchema`/`FilterAppliedSchema`, `UsageLogSchema` (+ `z.infer` types and filter enum constants) from `@repo/shared-types` with Vitest fail-first coverage. Keep `hello()`.

## In scope

- `zod` dependency on `@repo/shared-types`
- `schemas.ts` (or equivalent) + package exports
- Vitest valid/invalid cases; offline
- CHECKS OpenSpec row for this change
- Slice gates 1.5 / 1.6 + `SLICE-AUDIT.md`

## Out of scope

- Nest ZodValidationPipe, React resolvers, HTTP 400
- countWords, filter strategies, Cheerio, Prisma
- Nest BFF shell / Axios live (backlog GAPs, other changes)

## Groups

### ## 1. Shared Zod schemas (F1-1)

1.1 zod dep → 1.2 red tests → 1.3 impl+exports → 1.4 hello+CHECKS → 1.5 review → 1.6 audit

## Decisiones

- Keep `hello()`; add schemas additively
- `id`: string | number union for UsageLog
- Single apply slice (not multi-phase)

## Top Certainty

| Claim | Level |
|-------|-------|
| Zod as shared validation lib | S |
| Filter enum values match intake | E (RUNTIME S) |
| No network in unit tests | S |

## Preguntas outsider

1. ¿`FilterQuerySchema` es `{ filter: enum }` o el enum suelto? (plan: field `filter` per F1-1 AC)
2. ¿Defaults `0` en schema Entry o solo en scraper F1-3? (plan: F1-3)
3. ¿Se elimina `hello()` en este change? (plan: no)

## E-CONFIRM

- **A.** Proceder a `/opsx-apply` (autoriza apply)
- **B.** Editar plan (invalida PASS → re-audit)
- **C.** Aclarar pregunta
- **D.** Hotfix explícito (raro; anotar META)

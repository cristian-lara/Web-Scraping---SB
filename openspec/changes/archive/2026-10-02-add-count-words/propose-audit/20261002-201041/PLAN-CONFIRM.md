# PLAN-CONFIRM — add-count-words

- run_id: 20261002-201041
- change: add-count-words
- story: F1-2
- audit: PASS

## Objetivo
`countWords` + named symbol-only rule in `@repo/shared-types` (A1), TDD Vitest, canonical → 5.

## In / Out
In: function, constant, tests, exports, gates 1.5/1.6.  
Out: Filter A/B, threshold 5, Cheerio, Nest, UI, Zod edits.

## Groups
## 1. countWords — 1.1 red → 1.2 impl → 1.3 export → 1.4 regress → 1.5 review → 1.6 audit

## Decisiones
- Package: `@repo/shared-types`
- No filter threshold export

## E-CONFIRM
- **A.** `/opsx-apply`
- **B.** Editar plan (re-audit)
- **C.** Aclarar
- **D.** Hotfix

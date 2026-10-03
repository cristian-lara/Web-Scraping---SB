## 1. countWords (F1-2)

Slice gates: **1.5** (review: countWords + existing shared-types tests green, no network) and **1.6** (audit PASS in `SLICE-AUDIT.md`) before archive / next change.

- [x] 1.1 Write failing Vitest cases (canonical → 5; empty/whitespace; multi-space; isolated symbols; compounds) — verify: tests fail for the right reason
- [x] 1.2 Implement `countWords` + named symbol-only token constant/export in `@repo/shared-types` — verify: tests from 1.1 green
- [x] 1.3 Export from package index — verify: import resolves from `@repo/shared-types`
- [x] 1.4 Keep hello + Zod schema tests green — verify: full package suite still passes
- [x] 1.5 **Slice review:** `pnpm --filter @repo/shared-types test` exit 0; `openspec validate add-count-words --strict` exit 0 — verify: no network
- [x] 1.6 **Slice audit:** table 1.1–1.5 → PASS before archive — verify: note in change `SLICE-AUDIT.md`

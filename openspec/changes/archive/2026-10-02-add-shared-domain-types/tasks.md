## 1. Shared Zod schemas (F1-1)

Slice gates: **1.5** (review: schema+hello Vitest green, no network) and **1.6** (audit PASS in `SLICE-AUDIT.md`) before archive / next change.

- [x] 1.1 Add `zod` dependency to `@repo/shared-types` — verify: package.json lists zod; `pnpm install` succeeds
- [x] 1.2 Write failing Vitest cases for Entry / FilterQuery / UsageLog (valid + invalid) — verify: tests fail for the right reason
- [x] 1.3 Implement `EntrySchema`, `FilterAppliedSchema`/`FilterQuerySchema`, `UsageLogSchema` + enum constants + exports from package index — verify: tests from 1.2 green; imports resolve from `@repo/shared-types`
- [x] 1.4 Keep `hello()` export working; point `docs/CHECKS.md` OpenSpec validate at this change — verify: hello test still passes; CHECKS row names `add-shared-domain-types`
- [x] 1.5 **Slice review:** `pnpm --filter @repo/shared-types test` exit 0, no network; `openspec validate add-shared-domain-types --strict` exit 0 — verify: all schema + hello tests green
- [x] 1.6 **Slice audit:** table 1.1–1.5 → PASS before archive — verify: note in change `SLICE-AUDIT.md`

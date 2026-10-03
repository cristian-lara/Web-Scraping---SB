## Context

Foundation change archived; `@repo/shared-types` has `hello()` only. See proposal Why / F1-1 story. This change adds domain Zod schemas only.

## Goals / Non-Goals

**Goals:**
- Zod + `z.infer` for Entry, FilterQuery, UsageLog in `@repo/shared-types`.
- Vitest coverage for valid/invalid cases (TDD fail-first).
- English identifiers/comments; kebab-case files.

**Non-Goals:**
- Nest `ZodValidationPipe`, React Hook Form resolvers, HTTP 400.
- `countWords`, filter strategies, Cheerio, Prisma.

## TDD-DESIGN

| First failing tests | Implementation |
|---------------------|----------------|
| EntrySchema rejects missing title; accepts valid entry | `schemas.ts` EntrySchema |
| FilterQuery rejects OTHER; accepts two enums | FilterAppliedSchema + FilterQuerySchema |
| UsageLog rejects missing userId; accepts valid log | UsageLogSchema |

## Certainty

**Grill:** N/A — scoped to backlog F1-1 / intake §1.8–2.4.

| Claim | Level | RUNTIME |
|-------|-------|---------|
| Zod is the shared validation lib | S | S |
| Filter enum values match intake | E | S |
| No network in unit tests | S | S |

## Decisions

### Decision 1: Keep hello() alongside schemas
- **Choice:** Leave foundation `hello()` export; add schemas in `schemas.ts`.
- **Rationale:** Preserves monorepo-foundation hello smoke without coupling.

### Decision 2: Dependency zod in shared-types
- **Choice:** Add `zod` as a runtime dependency of `@repo/shared-types`.
- **Rationale:** Required for schemas; apps import types/schemas from one package.

## Risks / Trade-offs

- **[Risk] Overly strict ISO datetime** → Use Zod string datetime flexible enough for ISO 8601 strings used in tests.
- **[Trade-off] id as string | number** → Allow union to match intake Int/UUID wording.

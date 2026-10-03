## Why

`@repo/shared-types` only exports a hello-world smoke function. Backend and frontend need a single Zod contract for `Entry`, filter queries, and `UsageLog` before scraping, filters, or API work can proceed without duplicating DTOs (intake §1.8, backlog F1-1).

## What Changes

- Add Zod schemas `EntrySchema`, `FilterQuerySchema`, and `UsageLogSchema` (plus `z.infer` types) to `@repo/shared-types`.
- Export filter enum values `MORE_THAN_5_WORDS_COMMENTS` and `LESS_OR_EQUAL_5_WORDS_POINTS`.
- Cover schemas with Vitest (valid/invalid cases, no network).
- Keep `hello()` for foundation smoke unless it conflicts; domain schemas are additive.

## Capabilities

### New Capabilities
- `shared-types`: Shared Zod domain schemas and inferred TypeScript types for Entry, FilterQuery, and UsageLog consumed by future BFF/UI changes.

### Modified Capabilities
<!-- None — foundation specs unchanged -->

## Impact

- Package: `packages/shared-types`
- Story: `docs/backlog/F1-domain-user-stories.md` F1-1
- Does not wire Nest pipes, React resolvers, scraper, or persistence (out of scope for F1-1)
- Next backlog item after this: `add-count-words` (F1-2)

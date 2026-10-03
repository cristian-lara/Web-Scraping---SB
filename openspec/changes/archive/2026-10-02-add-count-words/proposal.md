## Why

Filter strategies (F2) need a single, tested `countWords(title)` rule. Without it in `@repo/shared-types`, word-count logic would be duplicated or invented ad hoc (intake §2.2, backlog F1-2).

## What Changes

- Add `countWords(title: string): number` to `@repo/shared-types`.
- Export a **named constant** used to detect symbol-only tokens (no magic inline checks at call sites).
- Cover canonical case `"This is - a self-explained example"` → `5` plus edge cases with Vitest (TDD fail-first, no network).
- Do **not** introduce the numeric filter threshold `5` used by Strategy A/B (owned by F2).

## Capabilities

### New Capabilities
<!-- None — extends shared-types package surface -->

### Modified Capabilities
- `shared-types`: Add word-count utility behavior and export contract for consumers (filters later).

## Impact

- Package: `packages/shared-types`
- Story: `docs/backlog/F1-domain-user-stories.md` F1-2
- HITL package decision: A1 — live in `@repo/shared-types`
- Does not implement filter strategies, Cheerio, Nest, or UI
- Next backlog item: `add-hn-scraper-fixture` (F1-3) or F2 filters after domain slice

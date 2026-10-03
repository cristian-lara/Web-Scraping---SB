## Context

F1-1 Zod schemas are archived. F1-2 adds `countWords` to the same package (`@repo/shared-types`, HITL A1) so filters and scraper can share one rule.

## Goals / Non-Goals

**Goals:**
- TDD fail-first Vitest for `countWords` + named symbol-token constant.
- Canonical case → 5; edges: empty/whitespace, multi-space, isolated symbols, compounds.
- English identifiers; kebab-case files.

**Non-Goals:**
- Filter A/B strategies and numeric threshold wiring (F2).
- Cheerio, Nest, UI, Prisma.
- Changing Entry/Filter/UsageLog schemas.

## TDD-DESIGN

| First failing tests | Implementation |
|---------------------|----------------|
| Canonical `"This is - a self-explained example"` → 5 | `count-words.ts` |
| Empty / whitespace-only → 0 | same |
| Isolated symbols excluded | named constant + filter |
| `"self-explained"` / `"Node.js"` → 1 each in phrases | tokenize on spaces only |

## Certainty

**Grill:** N/A — scoped to backlog F1-2 / intake §2.2.

| Claim | Level | RUNTIME |
|-------|-------|---------|
| Algorithm matches intake §2.2 | E | S |
| Named constant (no magic at call sites) | S | S |
| No network in unit tests | S | S |

## Decisions

### Decision 1: Package location
- **Choice:** `@repo/shared-types` (HITL A1).
- **Rationale:** Filters and future BFF/UI import one shared rule.

### Decision 2: Threshold `5` stays out
- **Choice:** Do not export filter threshold here.
- **Rationale:** F1-2 OOS; Strategy change owns `> 5` / `<= 5`.

## Risks / Trade-offs

- **[Risk] Unicode / punctuation edge cases** → Stick to intake examples; document that alphanumeric detection is the named rule’s responsibility.
- **[Trade-off] Constant vs helper** → Prefer a named predicate/constant exported beside `countWords` for reuse and testability.

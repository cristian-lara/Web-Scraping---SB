# INSPECTION — add-count-words (F1-2)

## A — Happy paths

| ID | Path | Expected |
|----|------|----------|
| A1 | Canonical `"This is - a self-explained example"` | `countWords` → 5 |
| A2 | Phrase with `"self-explained"` / `"Node.js"` | each compound = 1 word |
| A3 | Import `countWords` + named symbol rule from `@repo/shared-types` | exports available |
| A4 | Existing hello + Zod tests still pass | package suite green |

## B — Edges

| ID | Edge | Expected |
|----|------|----------|
| B1 | `""` / whitespace-only | 0 |
| B2 | Multiple consecutive spaces | no extra words |
| B3 | Isolated `-` `&` `/` `\|` | excluded |
| B4 | Leading/trailing trim | ignored for count |
| B5 | Offline Vitest | no network |

## C — Out of scope

- Filter A/B + threshold 5 (F2)
- Cheerio, Nest, UI, Prisma
- Zod schema edits

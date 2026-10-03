# INSPECTION — add-shared-domain-types (F1-1)

No prior ticket-audit INSPECTION; written for HAPPY/EDGE cite.

## A — Happy paths

| ID | Path | Expected |
|----|------|----------|
| A1 | Parse valid Entry `{rank,title,points,comments}` | `EntrySchema.parse` succeeds |
| A2 | Parse FilterQuery with `MORE_THAN_5_WORDS_COMMENTS` | succeeds |
| A3 | Parse FilterQuery with `LESS_OR_EQUAL_5_WORDS_POINTS` | succeeds |
| A4 | Parse valid UsageLog (id, ISO timestamp, filter_applied, counts, userId) | succeeds |
| A5 | Import schemas/types from `@repo/shared-types` | exports available |
| A6 | `hello()` still works | existing Vitest green |

## B — Edges

| ID | Edge | Expected |
|----|------|----------|
| B1 | Entry missing `title` or wrong type | Zod error |
| B2 | Filter value `OTHER` / unknown string | parse fails |
| B3 | UsageLog missing `userId` or bad timestamp | Zod error |
| B4 | UsageLog `id` as string UUID or number | accept per design Decision / intake Int/UUID |
| B5 | Schema tests run without network | Vitest offline |

## C — Out of scope (must not creep)

- Nest ZodValidationPipe, RHF resolvers, HTTP 400
- countWords, strategies, Cheerio, Prisma

## Packs

- Domain Zod contract only; no UI-SURFACES.

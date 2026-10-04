# CORE scenario matrix (evaluator evidence)

Maps challenge-core happy paths and edge cases to concrete tests.  
Status: `PASS` | `WEAK` | `GAP`. Update this file when CORE tests change.

**CORE** = HN top-30 scrape, `countWords` / `FILTER_WORD_THRESHOLD` (5), Filter A/B, Bruno API E2E for those contracts.

Coverage HTML (local): `pnpm test:coverage` → `packages/shared-types/coverage/index.html`, `apps/backend/coverage/index.html`.

| ID | Scenario | Expected | Test evidence | Status | Notes |
|----|----------|----------|---------------|--------|-------|
| HP-CW | Canonical `countWords` | Example → 5 | `packages/shared-types/src/count-words.test.ts` | PASS | |
| EC-CW-SYM | Symbol-only tokens | Not counted | same file | PASS | |
| HP-THRESH | Named threshold | `FILTER_WORD_THRESHOLD === 5` | `packages/shared-types/src/schemas.test.ts` | PASS | |
| HP-SCRAPE-30 | Top-30 from fixture | `length === 30`, Zod Entry | `apps/backend/src/scraping/cheerio-scraper.adapter.test.ts` | PASS | Offline |
| HP-RANK | Ranks 1..30 ordered | `map(rank) === [1..30]` | same file — `returns ranks exactly 1..HN_TOP_ENTRY_LIMIT` | PASS | |
| HP-SLICE | Surplus excluded | No story 31/32 titles | same file — `excludes surplus fixture rows` | PASS | Fixture has 32 rows |
| EC-DEFAULT-0 | Missing points/comments | Default `0` | same file | PASS | |
| HP-FA | Filter A unit | `countWords > 5`, comments DESC, rank ASC | `apps/backend/src/filtering/apply-filter.test.ts` | PASS | Boundary `==5` excluded |
| HP-FB | Filter B unit | `countWords <= 5`, points DESC, rank ASC | same file | PASS | Boundary `==5` included |
| EC-TIE-A/B | Tie-break rank ASC | Lower rank first | same file | PASS | |
| EC-EMPTY | Empty / all excluded | `[]` not error | same file | PASS | Product semantics |
| HP-HTTP-A | Nest JWT + Filter A | Non-empty filtered list | `apps/backend/src/filtering/filter.http.test.ts` | PASS | Mock scrape |
| HP-HTTP-B | Nest JWT + Filter B | Non-empty; ranks `[2,4]` tie | same file | PASS | Mock scrape |
| HP-FIX-ENV | Fixture scrape env | Env=1 → fixture, no Axios | `apps/backend/src/scraping/e2e-scrape-fixture.test.ts` | PASS | `E2E_SCRAPE_FIXTURE` |
| HP-BR1 | Auth JWT extract | 200 + `access_token` | `apps/backend/bruno/HP1-auth-login.bru` | PASS | |
| HP-BR2 | Filter A Bruno | Non-empty + A contract | `apps/backend/bruno/HP2-filter-a-comments.bru` | PASS | CI: fixture env |
| HP-BR3 | Filter B Bruno | Non-empty + B contract | `apps/backend/bruno/HP3-filter-b-points.bru` | PASS | CI: fixture env |
| EC-BR1 | No auth | 401 | `apps/backend/bruno/E1-filters-no-auth.bru` | PASS | In `test:e2e:ci` |
| EC-BR2 | Invalid filter | 400 | `apps/backend/bruno/E2-invalid-filter.bru` | PASS | In `test:e2e:ci` |
| EC-BR3 | Over throttle | 429 | `apps/backend/bruno/E3-over-throttle.bru` + Vitest | PASS | CI skips E3; Vitest covers 429 |
| HP-COV | CORE coverage floors | HTML+LCOV; under floor fails | `pnpm test:coverage` / CI `core-coverage` artifact | PASS | Thresholds in vitest configs |

## How to refresh

1. Add/rename a CORE test → update the matching row (path + status).
2. Close a `GAP`/`WEAK` → set `PASS` and drop the note.
3. Keep statuses honest: empty Bruno without fixture is no longer accepted for HP-BR2/3.

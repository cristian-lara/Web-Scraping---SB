# Slice audit — add-polite-hn-fetch

## ##1 Polite fetch policy (TDD)

| Task | Result | Evidence |
|------|--------|----------|
| 1.1 Constants + env readers + stage ids | PASS | `apps/backend/src/common/env.constants.ts`, `hn-fetch.constants.ts`, `apps/backend/.env.example` |
| 1.2 Fail-first Vitest | PASS | First run: missing `polite-hn-html.fetcher.js` (exit 1) |
| 1.3 `PoliteHnHtmlFetcher` | PASS | `pnpm --filter @repo/backend exec vitest run src/scraping/polite-hn-html.fetcher.test.ts` exit 0 |
| 1.4 Nest DI fixture XOR polite(Axios) | PASS | `e2e-scrape-fixture.test.ts`: fixture no Axios; live `HN_HTML_FETCHER` instanceof `PoliteHnHtmlFetcher` |
| 1.5 Slice review | PASS | vitest polite + e2e-fixture + axios fetcher exit 0; `openspec validate add-polite-hn-fetch --strict` exit 0 |

**HP/EC:** HP-CACHE, HP-INTERVAL, HP-RETRY-5XX, EC-403-429, EC-OFFLINE-TEST, HP-FIXTURE covered by Vitest (stub inner; no live HN).

**Veredicto ##1:** PASS

## ##2 Docs + close

| Task | Result | Evidence |
|------|--------|----------|
| 2.1 Bruno README TTL/interval + fixture unchanged | PASS | `apps/backend/bruno/README.md` Fixture scrape section |
| 2.2 Scrape/policy Vitest + validate | PASS | same vitest scrape files exit 0; openspec validate exit 0 |
| 2.5 Slice review | PASS | docs readable; 2.1–2.2 commands exit 0 |
| 2.6 Slice audit | PASS | this table |

**Veredicto ##2:** PASS

**Veredicto change apply:** PASS

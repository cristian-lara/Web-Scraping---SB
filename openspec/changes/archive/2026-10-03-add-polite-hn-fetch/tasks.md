## 1. Polite fetch policy (TDD)

Slice gates: **1.5** (review) and **1.6** (audit PASS in `SLICE-AUDIT.md`) before ##2.

- [x] 1.1 Add named constants (and optional env readers) for cache TTL default `30_000` ms, min interval default `2_000` ms, max live retries `1`, and stable stage ids `hn_fetch_cache_hit` / `hn_fetch_live` / `hn_fetch_retry` under `apps/backend/src/` — verify: constants exported; `.env.example` documents `HN_FETCH_CACHE_TTL_MS` and `HN_FETCH_MIN_INTERVAL_MS` placeholders
- [x] 1.2 Write failing Vitest for a polite `HnHtmlFetcher` wrapper with a stub inner fetcher covering: (a) second call within TTL does not call inner / after TTL calls again; (b) cache miss with recent live fetch delays then calls inner once; (c) timeout or 5xx-like failure retries exactly once + `hn_fetch_retry` when correlated; 403/429-like failure does not retry — verify: tests fail before implementation; no network
- [x] 1.3 Implement `PoliteHnHtmlFetcher` (cache, min interval, one safe retry, `logStage` stages) until 1.2 green — verify: `pnpm --filter @repo/backend exec vitest run` on the new test file exit 0; optional `requestContext.run` asserts stages
- [x] 1.4 Wire Nest DI: `HN_HTML_FETCHER` = fixture when `E2E_SCRAPE_FIXTURE` on, else polite wrapper around `AxiosHnHtmlFetcher` — verify: existing `e2e-scrape-fixture.test.ts` still green; live path uses polite provider in module factory
- [x] 1.5 **Slice review:** HP-CACHE, HP-INTERVAL, HP-RETRY-5XX, EC-403-429, EC-OFFLINE-TEST, HP-FIXTURE; `pnpm --filter @repo/backend exec vitest run` on polite + e2e-fixture scrape tests exit 0; `openspec validate add-polite-hn-fetch --strict` exit 0 — verify: commands + exit 0; fix gaps in-group
- [x] 1.6 **Slice audit:** table 1.1–1.5 → PASS in `SLICE-AUDIT.md` before ##2 — verify: `SLICE-AUDIT.md` with commands + exit codes; veredicto PASS

## 2. Docs + close

Slice gates: **2.5** (review) and **2.6** (audit PASS) before apply close.

- [x] 2.1 Note polite fetch env knobs and demo behavior (cache hit under rapid Filter) in `apps/backend/bruno/README.md` or root README scrape section — verify: docs mention TTL/interval and that CI fixture path is unchanged
- [x] 2.2 Run backend scrape/policy Vitest suite and `openspec validate add-polite-hn-fetch --strict` — verify: both exit 0; no test hits news.ycombinator.com
- [x] 2.5 **Slice review:** docs path readable; 2.1–2.2 criteria met; validate + vitest exit 0 — verify: commands + exit 0
- [x] 2.6 **Slice audit:** table 2.1–2.5 → PASS in `SLICE-AUDIT.md` — verify: evidence appended; veredicto PASS

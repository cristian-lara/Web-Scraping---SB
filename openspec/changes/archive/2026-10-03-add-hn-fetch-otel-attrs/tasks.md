## 1. OTel attributes on polite fetch (TDD)

Slice gates: **1.5** (review) and **1.6** (audit PASS in `SLICE-AUDIT.md`) before ##2.

- [x] 1.1 Add named constants for `hn.fetch.outcome` / `hn.fetch.wait_ms` and outcome values `cache` / `live` / `retry` under `apps/backend/src/` — verify: constants exported from otel or scrape constants module
- [x] 1.2 Write failing Vitest (in-memory OTel exporter): under `withSpan(scrape.live)`, polite fetcher stub paths set outcome `cache` on TTL hit, `live` on first success, `retry` after one retryable failure; wait path sets `hn.fetch.wait_ms` > 0 — verify: tests fail before impl; no news.ycombinator.com
- [x] 1.3 Implement active-span attribute writes in polite live HTML fetch until 1.2 green — verify: `pnpm --filter @repo/backend exec vitest run` on the new/extended OTel+polite tests exit 0
- [x] 1.4 Confirm existing polite-fetch and e2e-fixture Vitest still green (fixture does not claim live-upstream outcomes incorrectly) — verify: `pnpm --filter @repo/backend exec vitest run src/scraping/` exit 0
- [x] 1.5 **Slice review:** cache/live/retry/wait_ms attrs + no-network; `openspec validate add-hn-fetch-otel-attrs --strict` exit 0 — verify: commands + exit 0
- [x] 1.6 **Slice audit:** table 1.1–1.5 → PASS in `SLICE-AUDIT.md` before ##2 — verify: evidence with commands + exit codes; veredicto PASS

## 2. Grafana + docs close

Slice gates: **2.5** (review) and **2.6** (audit PASS) before apply close.

- [x] 2.1 Update provisioned Grafana dashboard JSON (`bff-request-timings` and/or `bff-overview`) with TraceQL examples or panels for `hn.fetch.outcome` values `cache` / `live` / `retry` — verify: committed JSON contains attribute key and those three values
- [x] 2.2 Document demo steps (two Filters → cache span in Tempo) in Bruno README or local-obs docs — verify: docs mention `hn.fetch.outcome` and that CI fixture path stays offline
- [x] 2.5 **Slice review:** dashboard JSON + docs criteria; validate + scraping/otel Vitest exit 0 — verify: commands + exit 0
- [x] 2.6 **Slice audit:** table 2.1–2.5 → PASS in `SLICE-AUDIT.md` — verify: evidence appended; veredicto PASS

## Context

See proposal.md — Why. Today `ScrapingModule` binds `HN_HTML_FETCHER` to either `FixtureHnHtmlFetcher` (`E2E_SCRAPE_FIXTURE`) or `AxiosHnHtmlFetcher` (single Axios GET, 15s timeout, identifiable User-Agent). `ScrapingService.scrapeLive()` and Cheerio parsing stay unchanged. Inbound Nest throttler protects our API clients, not upstream HN. Structured logs use `logStage` (no-op without request id).

## Goals / Non-Goals

**Goals:**
- Wrap the live Axios fetcher with an in-process polite policy implementing the hn-scraper delta (cache, min interval, one safe retry, stage logs).
- Keep the `HnHtmlFetcher` port and fixture DI branch intact so CI/Bruno offline path does not change.
- Prove policy with Vitest against a stub inner fetcher (TDD fail-first).

**Non-Goals:**
- Multi-site scrapers, proxies, UA rotation, browser stealth, Redis/shared cache, new OTel counters, Filter/Entry contract changes.
- Changing inbound `@nestjs/throttler` defaults.

## Decisions

### Decision 1: Decorator / collaborator implements `HnHtmlFetcher`
- **Choice:** Introduce a Nest provider (e.g. `PoliteHnHtmlFetcher`) that implements `HnHtmlFetcher`, holds in-memory cache + last-live timestamp, and delegates the actual HTTP to `AxiosHnHtmlFetcher` (or an injectable inner `HnHtmlFetcher`). Wire `HN_HTML_FETCHER` useFactory: fixture when env on, else polite wrapper around Axios.
- **Rationale:** Same port surface; `ScrapingService` untouched; easy to unit-test with a fake inner fetcher.
- **Alternatives considered:** Bake policy into `AxiosHnHtmlFetcher` — rejected (harder to stub HTTP; mixes transport and policy). Separate Redis cache — rejected (YAGNI, single-process MVP).

### Decision 2: Named constants + optional env overrides
- **Choice:** Defaults as named constants (proposed: cache TTL `30_000` ms, min interval `2_000` ms, max retries `1`). Optional env `HN_FETCH_CACHE_TTL_MS` and `HN_FETCH_MIN_INTERVAL_MS` documented in `.env.example`.
- **Rationale:** Demo-tunable without code edits; constants avoid magic numbers per engineering standards.
- **Alternatives considered:** Hard-code only — weaker for demos. Config service module — heavier than needed.

### Decision 3: Cache before interval; wait then fetch on miss
- **Choice:** On `fetchHtml()`: if cache entry for URL is within TTL → return + `hn_fetch_cache_hit` stage. Else wait until `now - lastLiveAt >= minInterval` (if needed), then live GET (+ one retry on timeout/5xx), store HTML, update `lastLiveAt`, emit `hn_fetch_live` / `hn_fetch_retry` stages.
- **Rationale:** Cache is the primary politeness under Filter spam; min interval covers cold/expired cache bursts.
- **Alternatives considered:** Serve stale past TTL while refreshing in background — more complex, deferred. Fail fast when interval not elapsed — worse UX for evaluators.

### Decision 4: Retry classification
- **Choice:** Retry once only for Axios timeout / network errors and HTTP status >= 500. Do not retry 403/429 (or other 4xx). After retry failure, let the error propagate so existing `HnScrapeFailedException` → 502 path remains.
- **Rationale:** Retries on client/rate-limit responses amplify pressure; timeout/5xx are transient.
- **Alternatives considered:** Exponential backoff loop — overkill for one retry. Retry all errors — rejected.

### Decision 5: Observability via existing `logStage`
- **Choice:** Stable stage strings: `hn_fetch_cache_hit`, `hn_fetch_live`, `hn_fetch_retry`. No new metrics backend. Unit tests assert behavior via call counts on the inner fetcher; optional assertion that stages fire inside `requestContext.run`.
- **Rationale:** Reuses correlation logger already in Filter path; YAGNI for Prometheus.
- **Alternatives considered:** OTel counters — deferred; Filter already has scrape spans.

### Decision 6: Fixture bypass
- **Choice:** Do not wrap `FixtureHnHtmlFetcher` with the polite decorator. Factory selects fixture XOR polite(Axios).
- **Rationale:** Spec requires fixture path offline; cache/interval on fixture adds noise and flaky sleeps in CI.

## TDD

Fail-first per code slice (apply order):

| Slice | Failing test first | Impl that turns green |
|-------|--------------------|------------------------|
| Cache TTL | Vitest: second `fetchHtml` within TTL does not call stub inner; after TTL calls again — fails until wrapper exists | `PoliteHnHtmlFetcher` in-memory cache + `hn_fetch_cache_hit` / `hn_fetch_live` |
| Min interval | Vitest with fake timers: cache miss + recent live → delay then one inner call — fails until wait logic | Await until `minInterval` elapsed before live GET |
| Retry class | Vitest: timeout/5xx → exactly one retry + `hn_fetch_retry`; 403/429 → no retry — fails until classifier | Single retry on timeout/5xx only |
| Nest DI | Existing `e2e-scrape-fixture` stays green; factory uses polite(Axios) when fixture off — fails if wiring wrong | `scraping.module.ts` useFactory: fixture XOR polite(Axios) |

Docs-only (README / Bruno note): no unit TDD; done = path + readable criteria.

## Slice gates

Each `tasks.md` group `## N.` with executable work ends with:

- **N.5 Slice review** — happy + edge for that group green; commands + exit 0; fix gaps in-group.
- **N.6 Slice audit** — table N.1–N.5 → PASS in `SLICE-AUDIT.md`; **forbidden** to start next group without N.6 PASS.

Single apply wave (small change): ##1 policy TDD+DI → ##2 docs/close. Post-apply R1–R3 once after both groups.

## Certainty

| Claim | Level | Notes |
|-------|-------|-------|
| In-process TTL cache + min interval behind `HnHtmlFetcher` | S | design D1–D3; Vitest stub |
| One retry on timeout/5xx; never 403/429 | S | design D4; Vitest |
| Fixture path bypasses polite wrapper | S | design D6; existing e2e-fixture test |
| Stage ids `hn_fetch_*` via `logStage` when request id present | S | design D5; optional correlated assert |
| Defaults TTL 30s / interval 2s / retries 1 | S | locked in design; env overrides optional |
| Process-local cache only (no Redis) | S | YAGNI; proposal assumption |
| Live HN upstream may flake / 403 | E | known; policy mitigates load, not ban war |
| RUNTIME: policy unit tests offline | S | stub inner fetcher; no news.ycombinator.com |

**Grill:** N/A — explore conversation locked polite package (cache + interval + one safe retry + stages; no proxies/multi-site/stealth); no separate `GRILL.md` workshop artifact. Re-grill only if decorator-behind-port approach is rejected during apply.

## Risks / Trade-offs

- **[Risk] In-process cache stale vs live HN** → Mitigation: short TTL (30s); acceptable for MVP demo freshness.
- **[Risk] Min-interval wait blocks Nest request thread** → Mitigation: short default (2s); single await sleep; document. Multi-worker shared spacing not required.
- **[Risk] `logStage` silent without request id** → Mitigation: document; Filter HTTP path has correlation; unit tests focus on fetch call counts.
- **[Trade-off] Process-local only** → Multi-instance duplicate GETs possible; YAGNI for local MVP.

## Migration Plan

1. Land policy + Vitest behind feature defaults (always on for live path).
2. Document env knobs in `.env.example` and briefly in `apps/backend/bruno/README.md` if scrape env section exists.
3. Rollback: revert change or set TTL/interval to `0` if implemented as disable switches (prefer revert; optional `0` = disable wait/cache during apply if cheap).

## Open Questions

None — defaults (30s TTL, 2s min interval, one retry) locked for apply; tune only if demo feedback demands.

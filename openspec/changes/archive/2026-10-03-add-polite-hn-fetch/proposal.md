## Why

Live HN fetch today is a bare Axios GET per filter request: no outbound spacing, no short-lived HTML cache, and no safe retry. That is fine for the MVP challenge, but it wastes upstream calls under rapid Filter clicks and offers little evidence of polite integration practice. With spare evaluation time, a thin fetch-policy layer behind the existing `HnHtmlFetcher` port demonstrates senior scrape hygiene without multi-site scope, stealth, or proxies.

## What Changes

- Add an in-process **polite live-fetch policy** wrapping the Axios HN HTML path: short TTL HTML cache, minimum interval between live upstream GETs, and at most one retry on timeout / 5xx only (never on 403/429).
- Emit structured log stages for `cache_hit`, `live_fetch`, and `retry` (reuse existing `logStage` / correlation when a request id is present).
- Keep `E2E_SCRAPE_FIXTURE` offline path unchanged (no live Axios when fixture env is on).
- Document env knobs and defaults in `.env.example` / Bruno README as needed; Vitest covers policy offline with a fake inner fetcher.
- Do **not** add proxies, UA rotation, browser stealth, CAPTCHA handling, Redis, or a second scrape target.

## Capabilities

### New Capabilities
- None. Behavior stays under the existing HN scrape capability.

### Modified Capabilities
- `hn-scraper`: Runtime live HTML retrieval behind `HnHtmlFetcher` MUST apply polite fetch policy (TTL cache, outbound min interval, single safe retry) with structured stage logs; fixture / injected HTML paths MUST remain network-free and policy-bypass or no-op for live-only rules.

## Impact

- Apps: `apps/backend` scraping module (`AxiosHnHtmlFetcher` collaborator or decorator; Nest DI wiring; Vitest)
- Env: optional `HN_FETCH_CACHE_TTL_MS`, `HN_FETCH_MIN_INTERVAL_MS` (named defaults in code)
- Observability: structured log stages only (no new Prometheus/OTel counters required)
- Out of scope: multi-site adapters, proxies, stealth, changing Filter A/B or `Entry` shape, changing Nest inbound `@nestjs/throttler` (that protects our API, not HN)
- Assumption: policy is process-local (single Nest instance); multi-instance shared cache is YAGNI

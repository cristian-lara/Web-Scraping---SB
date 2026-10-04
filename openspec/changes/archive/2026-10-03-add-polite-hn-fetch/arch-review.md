# Arch review — add-polite-hn-fetch

- at: 2026-10-04T03:28:28Z
- scope: plan-only (propose-audit ARCH lens); no implementation yet
- pillars: ml-arch-review / pillars.md (framework-agnostic)

## Pillar checklist

| Pillar | Assessment | Notes |
|--------|------------|-------|
| 1. Idiomatic patterns | PASS (plan) | Decorator `HnHtmlFetcher` + Nest useFactory matches existing Axios/fixture DI; Cheerio/Filter untouched |
| 2. Error handling | PASS (plan) | Retry only timeout/5xx; 403/429 no retry; failures propagate to existing `HnScrapeFailedException` → 502 |
| 3. Lifecycle & resources | PASS (plan) | In-memory cache + timestamps only; no new sockets; sleep is short await |
| 4. Reuse & composability | PASS (plan) | Reuses `HnHtmlFetcher`, `logStage`, fixture env branch; no new HTTP stack |
| 5. State & data flow | PASS (plan) | Process-local cache keyed by URL; Filter still scrapeLive → Entry[]; no UI/DB coupling |
| 6. Performance & security | PASS (plan) | Reduces upstream GETs; identifiable UA retained; no stealth/proxy; inbound throttler unchanged |

## Docs grounding

- Nest DI / providers: existing `scraping.module.ts` pattern (fixture vs Axios factory).
- Axios timeout already 15s in `axios-hn-html.fetcher.ts`.
- No new dependency claimed.

## Risks for apply

- Blocking sleep under load → keep default min interval small (design).
- Cache staleness → short TTL (design).

## Verdict

**PASS** for planned architecture (ponytail-compatible). Implementation must not fold policy into Cheerio or FilterController.

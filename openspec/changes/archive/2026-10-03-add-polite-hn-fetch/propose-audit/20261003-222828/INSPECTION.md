# INSPECTION (written — no ticket-audit cite)

- at: 2026-10-04T03:28:28Z
- change: add-polite-hn-fetch
- source: explore conversation + OpenSpec artifacts (no ticket INSPECTION.md)

## A — Happy paths

| ID | Path | Plan cite |
|----|------|-----------|
| HP-CACHE | Two live fetchHtml within TTL → second uses cache, no inner GET | specs hn-scraper · Cache hit; tasks 1.2–1.3 |
| HP-INTERVAL | Cache miss + recent live → wait min interval → one live GET | specs · Minimum interval; tasks 1.4 |
| HP-RETRY-5XX | Timeout/5xx → exactly one retry then success or propagate | specs · Single retry; tasks 1.5 |
| HP-STAGES | With request id: stages hn_fetch_cache_hit / live / retry | specs · Structured stages; design D5 |
| HP-FIXTURE | E2E_SCRAPE_FIXTURE=1 → fixture, no Axios/polite live | specs · Fixture offline; tasks 1.6 |
| HP-DI | Nest wires polite(Axios) when fixture off | design D1/D6; tasks 1.6 |

## B — Edges

| ID | Edge | Plan cite |
|----|------|-----------|
| EC-403-429 | Upstream 403/429 → no retry | specs · Single retry AND; tasks 1.5 |
| EC-RETRY-FAIL | Retry also fails → error propagates → existing 502 path | design D4 |
| EC-NO-CORR | No request id → logStage silent; behavior still correct | design Risks |
| EC-OFFLINE-TEST | Policy Vitest uses stub; no news.ycombinator.com | specs · Policy unit tests offline |
| EC-STALE-TTL | After TTL expiry → live GET again | tasks 1.2 |

## C — Out of scope (explicit)

Proxies, UA rotation, stealth, multi-site adapters, Redis, inbound Nest throttler changes, Filter/Entry shape.

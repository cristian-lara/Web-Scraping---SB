# Arch review — harden-core-qa-evidence

- at: 2026-10-03T23:13:02Z
- note: `/ml-arch-review` skill package not found on this machine; pillars applied manually for propose-audit ARCH lens.

## Scope under review

Env-gated fixture scrape for CI Bruno; Nest scraping orchestration; Vitest coverage tooling; docs matrix. No FE UI, no new public API routes planned.

## Pillars

| Pillar | Verdict | Notes |
|--------|---------|-------|
| Security | PASS (plan) | Fixture env must not weaken JWT/throttle; secrets stay in existing CI env; `.env.example` placeholders only (task 3.4) |
| DRY | PASS | Reuse `hn_sample.html` + Cheerio path; mirror Filter A HTTP test for B |
| Idiomatic Nest | WATCH | Prefer inject/config flag on `ScrapingService` / fetcher swap over scattered `if (process.env)` in controllers |
| Logging | PASS | No new PII; reuse correlation logs |
| YAGNI | PASS | No Playwright; CORE coverage only |
| Testability | FAIL → patch | Fixture path needs unit/integration fail-first (see UNIT lens) |
| Failure modes | PASS | Default live scrape; fixture opt-in; empty API still allowed |

## 🔴 blockers for apply

None architectural beyond plan patches already required by UNIT/VERIFY (TDD + slice gates). Prefer **fetcher/port swap** when `E2E_SCRAPE_FIXTURE=1` rather than branching inside FilterController.

## Recommendation

Proceed to patch propose (tasks/design) then re-audit; architecture of D3/D4/D5 is sound if fixture stays behind `HnHtmlFetcher` or equivalent port.

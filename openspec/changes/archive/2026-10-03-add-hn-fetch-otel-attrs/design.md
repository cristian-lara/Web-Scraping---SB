## Context

See proposal.md — Why. `PoliteHnHtmlFetcher` already applies cache / min-interval / one safe retry and emits `logStage` (`hn_fetch_*`). `FilterService` wraps scrape in `withSpan(SPAN_SCRAPE_LIVE, …)`. `withSpan` accepts initial string attributes and sets `request.id`. Grafana Tempo dashboards query `name = "scrape.live"` by duration only. Loki pipeline exists for OTLP logs but `logStage` writes stdout JSON — not in scope to re-plumb.

## Goals / Non-Goals

**Goals:**
- Set stable OTel attributes on the active `scrape.live` span from the polite fetch path.
- Prove attributes offline with InMemorySpanExporter Vitest.
- Update provisioned Grafana JSON so Tempo TraceQL/docs show outcomes.
- Preserve polite policy and fixture bypass behavior.

**Non-Goals:**
- Loki bridge for `logStage`; Prometheus counters; child spans per outcome; changing TTL/interval defaults; Filter/Entry contract changes.

## Decisions

### Decision 1: Attribute keys and values
- **Choice:** Named constants:
  - `hn.fetch.outcome` ∈ { `cache`, `live`, `retry` }
  - `hn.fetch.wait_ms` = non-negative number (milliseconds waited for min-interval; omit or `0` when no wait)
- **Rationale:** Clear TraceQL filters; aligns with existing `request.id` dotted style.
- **Alternatives considered:** Reuse log stage strings as attribute values — rejected (stages are event names; outcomes are result labels). Separate span per attempt — rejected (noisier traces).

### Decision 2: Set attributes from polite fetcher via active span
- **Choice:** Inside `PoliteHnHtmlFetcher.fetchHtml`, call `trace.getActiveSpan()?.setAttribute(...)` when an outcome is known (and wait when applied). FilterService stays unaware of cache/retry.
- **Rationale:** Policy owns the truth; works under existing `scrape.live` parent span; no-op when no active span / tracing off.
- **Alternatives considered:** Return outcome metadata from fetcher to FilterService — more API churn. Pass span into fetcher — couples Nest scraping to OTel types.

### Decision 3: Outcome semantics
- **Choice:**
  - `cache` — return from TTL cache (no inner fetchHtml call).
  - `live` — inner succeeds on first attempt.
  - `retry` — inner succeeds on the second attempt after a retryable failure (timeout/5xx).
  - On final failure after retry (or non-retryable error): set `hn.fetch.outcome` to `live` or `retry` reflecting attempts made **or** leave unset and rely on span exception — **prefer** set `retry` if a retry was attempted, else omit outcome on hard failure before any successful HTML (span already records exception).
- **Rationale:** Grafana demos care about successful Filter path; exceptions already marked on span.
- **Alternatives considered:** Always set outcome even on failure with `error` value — deferred YAGNI.

### Decision 4: Grafana updates
- **Choice:** Edit `bff-request-timings.json` (and overview help text if cheap): markdown “How to read” + example TraceQL  
  `{ resource.service.name = "hn-scraper-bff" && name = "scrape.live" && hn.fetch.outcome = "cache" }`  
  (and live/retry). Optional table panel duplicate filtered by outcome if JSON stays small.
- **Rationale:** Operators see attributes without Explore guesswork.
- **Alternatives considered:** New dashboard only — rejected (two places to discover). Loki log panels — out of scope.

### Decision 5: Vitest strategy
- **Choice:** Extend or add Vitest that enables `OTEL_TEST_INMEMORY`, runs scrape under `withSpan(SPAN_SCRAPE_LIVE)` with polite wrapper + stub inner; assert exporter spans have `hn.fetch.outcome`. Cover cache + live + retry; wait_ms with fake sleep/now.
- **Rationale:** Matches existing `otel-spans.test.ts` pattern; no Compose for unit gate.
- **Alternatives considered:** Manual Compose-only verification — not CI-proof.

## TDD

| Slice | Failing test first | Impl that turns green |
|-------|--------------------|------------------------|
| Outcome attrs | Vitest: cache hit → attr `cache`; live stub → `live`; retry stub → `retry` on `scrape.live` — fails until fetcher sets attrs | Active-span `setAttribute` in polite fetcher |
| wait_ms | Vitest: forced min-interval wait → `hn.fetch.wait_ms` > 0 | Set wait attr before live GET |
| Grafana docs/query | File assert or review: dashboard JSON contains outcome attribute key + TraceQL examples — fails until JSON updated | Patch provisioned dashboard JSON + short README note |

## Slice gates

Each `tasks.md` group `## N.` ends with **N.5 Slice review** and **N.6 Slice audit** (`SLICE-AUDIT.md`). Single apply wave: ##1 backend attrs+tests → ##2 Grafana/docs → close.

## Certainty

| Claim | Level | Notes |
|-------|-------|-------|
| Active span attrs from polite fetcher | S | OTel API `getActiveSpan`; design D2 |
| Outcome enum cache/live/retry | S | design D1/D3 |
| wait_ms on interval delay | S | design D1 |
| Vitest in-memory exporter | S | existing `OTEL_TEST_INMEMORY` |
| Grafana TraceQL shows attributes | A → S | A until panel verified in Compose once; JSON committed = S for presence |
| No Loki bridge this change | S | explicit non-goal |
| RUNTIME: attrs no-op without tracing | S | optional chaining on active span |

**Grill:** N/A — explore + prior polite-fetch change locked “attrs on scrape.live + Grafana, not Loki”; no separate `GRILL.md`. Re-grill only if product insists on Loki-first.

## Risks / Trade-offs

- **[Risk] Attribute not visible if scrape runs outside `scrape.live`** → Mitigation: production Filter path always wraps; unit tests use `withSpan`.
- **[Risk] Tempo attribute query syntax differs by Grafana version** → Mitigation: document Explore fallback; keep markdown examples.
- **[Trade-off] stdout stages still not in Loki** → Accept; Tempo is the demo surface.

## Migration Plan

1. Land backend attrs + Vitest.
2. Land dashboard JSON + docs.
3. Optional local Compose smoke: two Filters → one `cache` span.
4. Rollback: revert change; tracing without attrs remains valid.

## Open Questions

None — Loki deferred; outcome enum locked.

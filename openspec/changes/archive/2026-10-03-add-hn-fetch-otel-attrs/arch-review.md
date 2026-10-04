# Arch review — add-hn-fetch-otel-attrs

- at: 2026-10-04T03:45:01Z
- scope: plan-only (propose-audit ARCH lens)
- pillars: ml-arch-review / pillars.md

## Pillar checklist

| Pillar | Assessment | Notes |
|--------|------------|-------|
| 1. Idiomatic patterns | PASS (plan) | OTel active span attrs; reuse `withSpan` / InMemorySpanExporter; no new metrics stack |
| 2. Error handling | PASS (plan) | Attrs no-op without span; failures still `recordException` on scrape.live |
| 3. Lifecycle & resources | PASS (plan) | No new exporters; optional chaining on getActiveSpan |
| 4. Reuse & composability | PASS (plan) | Polite fetcher owns outcome; FilterService unchanged; Grafana JSON extend not fork |
| 5. State & data flow | PASS (plan) | Outcome derived at fetch time; not persisted to SQLite |
| 6. Performance & security | PASS (plan) | Enum attrs only; no PII; Loki/stdout left as-is |

## Docs grounding

- Existing `otel-bootstrap.ts` / `otel.constants.ts` / Compose OTEL→Tempo→Grafana.
- TraceQL examples in design D4 for provisioned dashboards.

## Verdict

**PASS** for planned architecture (ponytail: attrs on existing span, not Loki re-architecture).

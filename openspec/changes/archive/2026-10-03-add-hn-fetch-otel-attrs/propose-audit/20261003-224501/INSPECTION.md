# INSPECTION (written — no ticket-audit)

- at: 2026-10-04T03:45:01Z
- change: add-hn-fetch-otel-attrs

## A — Happy paths

| ID | Path | Plan cite |
|----|------|-----------|
| HP-ATTR-CACHE | TTL hit under scrape.live → hn.fetch.outcome=cache | specs · Cache hit; tasks 1.2–1.3 |
| HP-ATTR-LIVE | Fresh stub GET → outcome=live | specs · Fresh live; tasks 1.2–1.3 |
| HP-ATTR-RETRY | Retryable fail then success → outcome=retry | specs · Successful retry; tasks 1.2–1.3 |
| HP-WAIT | Min-interval delay → hn.fetch.wait_ms > 0 | specs · wait; design D1; tasks 1.2 |
| HP-GRAFANA | Dashboard docs/TraceQL for cache/live/retry | specs · Grafana; tasks 2.1–2.2 |
| HP-DEMO-DOCS | Two Filters → cache in Tempo documented | tasks 2.2 |

## B — Edges

| ID | Edge | Plan cite |
|----|------|-----------|
| EC-NO-OTEL | Tracing unset → scrape still works | specs · No tracing remains safe |
| EC-FIXTURE | Fixture path no fake live-upstream outcome | specs outcome req; tasks 1.4 |
| EC-FAIL-SPAN | Hard failure → exception on span; outcome omit or retry-if-attempted | design D3 |
| EC-OFFLINE-TEST | Vitest in-memory; no HN network | specs · Offline Vitest |

## C — Out of scope

Loki bridge for logStage; Prometheus; child spans; TTL/interval changes; Filter/Entry changes.

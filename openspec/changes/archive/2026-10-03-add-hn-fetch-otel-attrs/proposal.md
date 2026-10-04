## Why

Polite HN fetch (`add-polite-hn-fetch`) emits structured log stages (`hn_fetch_cache_hit` / `live` / `retry`) and shortens `scrape.live` on cache hits, but Grafana/Tempo only shows undifferentiated span duration. Evaluators and local demos cannot tell cache vs live vs retry from dashboards. Wiring outcome attributes onto the existing OpenTelemetry scrape span (and surfacing them in Grafana) closes that gap without a Loki log bridge.

## What Changes

- Record polite-fetch **outcome** (and wait duration when applicable) as attributes on the active `scrape.live` span during live HTML retrieval.
- Extend offline Vitest OTel coverage so span attributes are asserted with the in-memory exporter (no network / no Compose required for unit proof).
- Update provisioned Grafana Tempo dashboards (and short docs) so operators can filter or read `cache` vs `live` vs `retry` outcomes alongside duration.
- Keep existing `logStage` stages; do **not** require bridging stdout JSON to Loki in this change.
- Do **not** add Prometheus counters, new spans per cache hit, or change polite-fetch policy defaults.

## Capabilities

### New Capabilities
- `hn-fetch-telemetry`: Contract for polite HN fetch outcomes on OpenTelemetry `scrape.live` spans and Grafana/Tempo visibility for those attributes in the local observability stack.

### Modified Capabilities
- None. Behavior is additive telemetry; HN scrape/filter contracts stay unchanged.

## Impact

- Apps: `apps/backend` scraping polite fetcher + OTel helpers/constants; Vitest (`otel-spans` / polite fetch telemetry tests)
- Deploy: `deploy/grafana/provisioning/dashboards/json/*` (TraceQL / panel copy)
- Docs: Bruno README or local-obs README note on how to demo cache vs live in Grafana
- Out of scope: Loki ingestion of `logStage`, Redis metrics, multi-instance aggregation, changing cache TTL/interval defaults
- Assumption: Compose stack with OTEL → Tempo → Grafana already exists from local-obs; attributes are no-ops when tracing is unset

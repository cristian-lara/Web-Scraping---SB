# PLAN-CONFIRM — add-hn-fetch-otel-attrs

- run_id: 20261003-224501
- at: 2026-10-04T03:45:01Z
- audit: PASS

## Objetivo

Hacer visibles en Grafana/Tempo los outcomes del polite fetch (`cache` / `live` / `retry` + `wait_ms`) vía atributos OTel en `scrape.live`, sin puente Loki.

## In scope

- Constantes `hn.fetch.outcome` / `hn.fetch.wait_ms`
- `PoliteHnHtmlFetcher` → `trace.getActiveSpan()?.setAttribute`
- Vitest InMemorySpanExporter (cache/live/retry/wait)
- Grafana dashboard JSON TraceQL/docs + nota demo
- Slice gates 1.5/1.6 y 2.5/2.6

## Out of scope

Loki para `logStage`, Prometheus, child spans, cambiar TTL/interval, Filter/Entry.

## Grupos apply

| Grupo | Contenido |
|-------|-----------|
| ##1 | Constants → fail Vitest → impl attrs → scraping suite → 1.5/1.6 |
| ##2 | Grafana JSON → docs → 2.5/2.6 |

Post-apply: R1–R3 una vez.

## Decisiones clave

- Active span desde polite fetcher (FilterService intacto)
- Loki explícitamente fuera
- Demo: dos Filters → span `cache` en Tempo

## Top Certainty

| Claim | Nivel |
|-------|-------|
| Attrs + Vitest | S |
| Grafana JSON presence | S (Compose smoke A→S) |
| No Loki | S |

## Preguntas outsider

1. ¿Te basta markdown + TraceQL en el dashboard, o querés un panel tabla filtrado por outcome?
2. ¿Compose smoke manual post-apply es suficiente, o lo documentamos solo?
3. ¿Confirmás apply ##1+##2 en una ola?

## Confirmación (humano)

- [x] A — proceder a apply (`/opsx-apply`) — confirmed 2026-10-04 (chat)
- [ ] B — editar plan (invalida PASS)
- [ ] C — aclarar
- [ ] D — hotfix explícito (raro; anotar META)

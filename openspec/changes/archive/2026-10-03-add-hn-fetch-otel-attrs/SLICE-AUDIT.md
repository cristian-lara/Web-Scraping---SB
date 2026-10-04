# Slice audit — add-hn-fetch-otel-attrs

## ##1 OTel attributes on polite fetch (TDD)

| Task | Result | Evidence |
|------|--------|----------|
| 1.1 Constants | PASS | `otel.constants.ts` — `ATTR_HN_FETCH_OUTCOME`, `ATTR_HN_FETCH_WAIT_MS`, `cache`/`live`/`retry` |
| 1.2 Fail-first Vitest | PASS | First run: attrs undefined (exit 1) before impl |
| 1.3 Active-span attrs + NodeTracerProvider | PASS | `polite-hn-html.fetcher.ts` + `otel-bootstrap.ts` `NodeTracerProvider.register()`; `polite-hn-fetch-otel.test.ts` exit 0 |
| 1.4 Scraping suite green | PASS | `vitest run src/scraping/` + otel-spans exit 0 (21 tests) |
| 1.5 Slice review | PASS | same vitest exit 0; `openspec validate add-hn-fetch-otel-attrs --strict` exit 0 |

**Veredicto ##1:** PASS

## ##2 Grafana + docs close

| Task | Result | Evidence |
|------|--------|----------|
| 2.1 Dashboard JSON | PASS | `bff-request-timings.json` + `bff-overview.json` contain `hn.fetch.outcome` and `cache`/`live`/`retry` TraceQL |
| 2.2 Bruno README demo | PASS | `apps/backend/bruno/README.md` Grafana/Tempo section; fixture stays offline |
| 2.5 Slice review | PASS | JSON + docs + vitest + validate exit 0 |
| 2.6 Slice audit | PASS | this table |

**Veredicto ##2:** PASS

**Veredicto change apply:** PASS

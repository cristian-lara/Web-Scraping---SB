/** Env: non-empty OTLP base URL enables trace export (e.g. http://otel-collector:4318). */
export const ENV_OTEL_EXPORTER_OTLP_ENDPOINT = "OTEL_EXPORTER_OTLP_ENDPOINT";

/** When "1", register InMemorySpanExporter for Vitest (no network). */
export const ENV_OTEL_TEST_INMEMORY = "OTEL_TEST_INMEMORY";

export const OTEL_SERVICE_NAME = "hn-scraper-bff";
export const OTEL_TRACER_NAME = "hn-scraper-bff";

export const SPAN_FILTER_RUN = "filter.run";
export const SPAN_SCRAPE_LIVE = "scrape.live";
export const SPAN_USAGE_LOG_WRITE = "usageLog.write";

export const ATTR_REQUEST_ID = "request.id";

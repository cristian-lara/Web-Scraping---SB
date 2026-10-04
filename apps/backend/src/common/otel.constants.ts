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

/** Polite HN fetch outcome on scrape.live spans. */
export const ATTR_HN_FETCH_OUTCOME = "hn.fetch.outcome";
export const ATTR_HN_FETCH_WAIT_MS = "hn.fetch.wait_ms";

export const HN_FETCH_OUTCOME_CACHE = "cache";
export const HN_FETCH_OUTCOME_LIVE = "live";
export const HN_FETCH_OUTCOME_RETRY = "retry";

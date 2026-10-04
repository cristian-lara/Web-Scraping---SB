import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  ATTR_HN_FETCH_OUTCOME,
  ATTR_HN_FETCH_WAIT_MS,
  ENV_OTEL_TEST_INMEMORY,
  HN_FETCH_OUTCOME_CACHE,
  HN_FETCH_OUTCOME_LIVE,
  HN_FETCH_OUTCOME_RETRY,
  SPAN_SCRAPE_LIVE,
} from "../common/otel.constants.js";
import {
  getTestSpanExporter,
  initOtelIfConfigured,
  resetOtelForTests,
  withSpan,
} from "../common/otel-bootstrap.js";
import type { HnHtmlFetcher } from "./hn-html.fetcher.js";
import { PoliteHnHtmlFetcher } from "./polite-hn-html.fetcher.js";

function axiosLikeError(partial: {
  code?: string;
  status?: number;
}): Error {
  return Object.assign(new Error("hn-fetch-stub"), {
    isAxiosError: true,
    code: partial.code,
    response:
      partial.status === undefined ? undefined : { status: partial.status },
  });
}

function stubInner(
  impl: () => Promise<string>,
): HnHtmlFetcher & { calls: number } {
  const fetcher = {
    calls: 0,
    fetchHtml: async () => {
      fetcher.calls += 1;
      return impl();
    },
  };
  return fetcher;
}

function scrapeOutcome(): string | undefined {
  const scrape = getTestSpanExporter()
    ?.getFinishedSpans()
    .find((span) => span.name === SPAN_SCRAPE_LIVE);
  const value = scrape?.attributes[ATTR_HN_FETCH_OUTCOME];
  return typeof value === "string" ? value : undefined;
}

function scrapeWaitMs(): number | undefined {
  const scrape = getTestSpanExporter()
    ?.getFinishedSpans()
    .find((span) => span.name === SPAN_SCRAPE_LIVE);
  const value = scrape?.attributes[ATTR_HN_FETCH_WAIT_MS];
  return typeof value === "number" ? value : undefined;
}

describe("Polite HN fetch OTel attributes (offline)", () => {
  beforeEach(async () => {
    await resetOtelForTests();
    process.env[ENV_OTEL_TEST_INMEMORY] = "1";
    initOtelIfConfigured();
  });

  afterEach(async () => {
    await resetOtelForTests();
    delete process.env[ENV_OTEL_TEST_INMEMORY];
  });

  it("sets outcome cache on TTL hit under scrape.live", async () => {
    const inner = stubInner(async () => "<html>one</html>");
    let nowMs = 1_000;
    const polite = new PoliteHnHtmlFetcher(inner, {
      cacheTtlMs: 30_000,
      minIntervalMs: 0,
      now: () => nowMs,
      sleep: async () => undefined,
    });

    await withSpan(SPAN_SCRAPE_LIVE, async () => {
      await polite.fetchHtml();
    });
    expect(scrapeOutcome()).toBe(HN_FETCH_OUTCOME_LIVE);

    await resetOtelForTests();
    process.env[ENV_OTEL_TEST_INMEMORY] = "1";
    initOtelIfConfigured();

    await withSpan(SPAN_SCRAPE_LIVE, async () => {
      await polite.fetchHtml();
    });
    expect(inner.calls).toBe(1);
    expect(scrapeOutcome()).toBe(HN_FETCH_OUTCOME_CACHE);
  });

  it("sets outcome live on first successful upstream stub call", async () => {
    const inner = stubInner(async () => "<html>live</html>");
    const polite = new PoliteHnHtmlFetcher(inner, {
      cacheTtlMs: 30_000,
      minIntervalMs: 0,
      now: () => 0,
      sleep: async () => undefined,
    });

    await withSpan(SPAN_SCRAPE_LIVE, async () => {
      await polite.fetchHtml();
    });

    expect(scrapeOutcome()).toBe(HN_FETCH_OUTCOME_LIVE);
  });

  it("sets outcome retry after one retryable failure then success", async () => {
    let attempt = 0;
    const inner = stubInner(async () => {
      attempt += 1;
      if (attempt === 1) {
        throw axiosLikeError({ code: "ECONNABORTED" });
      }
      return "<html>ok</html>";
    });
    const polite = new PoliteHnHtmlFetcher(inner, {
      cacheTtlMs: 30_000,
      minIntervalMs: 0,
      now: () => 0,
      sleep: async () => undefined,
    });

    await withSpan(SPAN_SCRAPE_LIVE, async () => {
      await polite.fetchHtml();
    });

    expect(inner.calls).toBe(2);
    expect(scrapeOutcome()).toBe(HN_FETCH_OUTCOME_RETRY);
  });

  it("sets hn.fetch.wait_ms when min-interval delay applies", async () => {
    const inner = stubInner(async () => "<html>live</html>");
    let nowMs = 0;
    const polite = new PoliteHnHtmlFetcher(inner, {
      cacheTtlMs: 0,
      minIntervalMs: 2_000,
      now: () => nowMs,
      sleep: async () => undefined,
    });

    await withSpan(SPAN_SCRAPE_LIVE, async () => {
      await polite.fetchHtml();
    });

    await resetOtelForTests();
    process.env[ENV_OTEL_TEST_INMEMORY] = "1";
    initOtelIfConfigured();

    nowMs = 500;
    await withSpan(SPAN_SCRAPE_LIVE, async () => {
      await polite.fetchHtml();
    });

    expect(scrapeWaitMs()).toBe(1_500);
    expect(scrapeOutcome()).toBe(HN_FETCH_OUTCOME_LIVE);
  });
});

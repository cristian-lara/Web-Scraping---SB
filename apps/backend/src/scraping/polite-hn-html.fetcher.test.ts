import { afterEach, describe, expect, it, vi } from "vitest";
import {
  resetStructuredLogWriter,
  setStructuredLogWriter,
  type StructuredLogRecord,
} from "../common/structured-logger.js";
import { requestContext } from "../common/request-context.js";
import type { HnHtmlFetcher } from "./hn-html.fetcher.js";
import {
  HN_FETCH_STAGE_CACHE_HIT,
  HN_FETCH_STAGE_LIVE,
  HN_FETCH_STAGE_RETRY,
} from "./hn-fetch.constants.js";
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

describe("PoliteHnHtmlFetcher", () => {
  afterEach(() => {
    resetStructuredLogWriter();
    vi.useRealTimers();
  });

  it("returns cached HTML on second call within TTL without calling inner", async () => {
    const inner = stubInner(async () => "<html>one</html>");
    let nowMs = 1_000;
    const polite = new PoliteHnHtmlFetcher(inner, {
      cacheTtlMs: 30_000,
      minIntervalMs: 0,
      now: () => nowMs,
      sleep: async () => undefined,
    });

    await expect(polite.fetchHtml()).resolves.toBe("<html>one</html>");
    await expect(polite.fetchHtml()).resolves.toBe("<html>one</html>");
    expect(inner.calls).toBe(1);

    nowMs += 30_001;
    await expect(polite.fetchHtml()).resolves.toBe("<html>one</html>");
    expect(inner.calls).toBe(2);
  });

  it("delays on cache miss until min interval elapses then calls inner once", async () => {
    const inner = stubInner(async () => "<html>live</html>");
    const slept: number[] = [];
    let nowMs = 0;
    const polite = new PoliteHnHtmlFetcher(inner, {
      cacheTtlMs: 0,
      minIntervalMs: 2_000,
      now: () => nowMs,
      sleep: async (ms) => {
        slept.push(ms);
      },
    });

    await polite.fetchHtml();
    nowMs = 500;
    await polite.fetchHtml();

    expect(slept).toEqual([1_500]);
    expect(inner.calls).toBe(2);
  });

  it("retries once on timeout or 5xx and emits retry stage when correlated", async () => {
    const stages: string[] = [];
    setStructuredLogWriter((record: StructuredLogRecord) => {
      stages.push(record.stage);
    });

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

    await requestContext.run({ requestId: "corr-retry" }, async () => {
      await expect(polite.fetchHtml()).resolves.toBe("<html>ok</html>");
    });

    expect(inner.calls).toBe(2);
    expect(stages).toContain(HN_FETCH_STAGE_LIVE);
    expect(stages).toContain(HN_FETCH_STAGE_RETRY);

    const fiveXxInner = stubInner(async () => {
      throw axiosLikeError({ status: 503 });
    });
    const fiveXx = new PoliteHnHtmlFetcher(fiveXxInner, {
      cacheTtlMs: 30_000,
      minIntervalMs: 0,
      now: () => 10,
      sleep: async () => undefined,
    });
    await expect(fiveXx.fetchHtml()).rejects.toMatchObject({
      isAxiosError: true,
    });
    expect(fiveXxInner.calls).toBe(2);
  });

  it("does not retry on 403 or 429", async () => {
    const forbidden = stubInner(async () => {
      throw axiosLikeError({ status: 403 });
    });
    const polite403 = new PoliteHnHtmlFetcher(forbidden, {
      cacheTtlMs: 30_000,
      minIntervalMs: 0,
      now: () => 0,
      sleep: async () => undefined,
    });
    await expect(polite403.fetchHtml()).rejects.toMatchObject({
      isAxiosError: true,
    });
    expect(forbidden.calls).toBe(1);

    const tooMany = stubInner(async () => {
      throw axiosLikeError({ status: 429 });
    });
    const polite429 = new PoliteHnHtmlFetcher(tooMany, {
      cacheTtlMs: 30_000,
      minIntervalMs: 0,
      now: () => 0,
      sleep: async () => undefined,
    });
    await expect(polite429.fetchHtml()).rejects.toMatchObject({
      isAxiosError: true,
    });
    expect(tooMany.calls).toBe(1);
  });

  it("emits cache-hit stage when request id is present", async () => {
    const stages: string[] = [];
    setStructuredLogWriter((record: StructuredLogRecord) => {
      stages.push(record.stage);
    });
    const inner = stubInner(async () => "<html>cached</html>");
    const polite = new PoliteHnHtmlFetcher(inner, {
      cacheTtlMs: 30_000,
      minIntervalMs: 0,
      now: () => 1,
      sleep: async () => undefined,
    });

    await requestContext.run({ requestId: "corr-cache" }, async () => {
      await polite.fetchHtml();
      await polite.fetchHtml();
    });

    expect(stages).toContain(HN_FETCH_STAGE_CACHE_HIT);
    expect(inner.calls).toBe(1);
  });
});

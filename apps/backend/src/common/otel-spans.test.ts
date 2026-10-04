import {
  FILTER_MORE_THAN_5_WORDS_COMMENTS,
  type Entry,
} from "@repo/shared-types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FilterService } from "../filtering/filter.service.js";
import {
  ATTR_REQUEST_ID,
  ENV_OTEL_TEST_INMEMORY,
  SPAN_FILTER_RUN,
  SPAN_SCRAPE_LIVE,
  SPAN_USAGE_LOG_WRITE,
} from "./otel.constants.js";
import {
  getTestSpanExporter,
  initOtelIfConfigured,
  resetOtelForTests,
} from "./otel-bootstrap.js";
import { requestContext } from "./request-context.js";

const ENTRIES: Entry[] = [
  {
    rank: 1,
    title: "one two three four five six",
    points: 10,
    comments: 20,
  },
];

describe("OTel filter spans (offline, in-memory exporter)", () => {
  beforeEach(async () => {
    await resetOtelForTests();
    process.env[ENV_OTEL_TEST_INMEMORY] = "1";
    initOtelIfConfigured();
  });

  afterEach(async () => {
    await resetOtelForTests();
    delete process.env[ENV_OTEL_TEST_INMEMORY];
  });

  it("records scrape.live and usageLog.write with request.id", async () => {
    const create = vi.fn().mockResolvedValue({ id: "log-1" });
    const service = new FilterService(
      { scrapeLive: async () => ENTRIES } as never,
      { create } as never,
    );

    await requestContext.run({ requestId: "otel-corr-1" }, () =>
      service.run({ filter: FILTER_MORE_THAN_5_WORDS_COMMENTS }, "demo-user-1"),
    );

    const exporter = getTestSpanExporter();
    expect(exporter).toBeDefined();
    const names = exporter!.getFinishedSpans().map((span) => span.name);
    expect(names).toContain(SPAN_FILTER_RUN);
    expect(names).toContain(SPAN_SCRAPE_LIVE);
    expect(names).toContain(SPAN_USAGE_LOG_WRITE);

    const scrape = exporter!
      .getFinishedSpans()
      .find((span) => span.name === SPAN_SCRAPE_LIVE);
    expect(scrape?.attributes[ATTR_REQUEST_ID]).toBe("otel-corr-1");
  });
});

describe("OTel bootstrap no-op when unset", () => {
  it("does not register provider without endpoint or test flag", async () => {
    await resetOtelForTests();
    delete process.env[ENV_OTEL_TEST_INMEMORY];
    delete process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
    initOtelIfConfigured();
    expect(getTestSpanExporter()).toBeUndefined();
  });
});

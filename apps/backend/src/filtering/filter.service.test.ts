import {
  FILTER_MORE_THAN_5_WORDS_COMMENTS,
  type Entry,
} from "@repo/shared-types";
import { describe, expect, it, vi } from "vitest";
import { HnScrapeFailedException } from "../scraping/hn-scrape.exception.js";
import { FilterService } from "./filter.service.js";

const ENTRIES: Entry[] = [
  {
    rank: 1,
    title: "one two three four five six",
    points: 10,
    comments: 20,
  },
];

describe("FilterService UsageLog (offline, mock scraper)", () => {
  it("persists UsageLog after successful filter with JWT userId", async () => {
    const create = vi.fn().mockResolvedValue({ id: "log-1" });
    const service = new FilterService(
      { scrapeLive: async () => ENTRIES } as never,
      { create } as never,
    );

    const result = await service.run(
      { filter: FILTER_MORE_THAN_5_WORDS_COMMENTS },
      "demo-user-1",
    );

    expect(result).toHaveLength(1);
    expect(create).toHaveBeenCalledOnce();
    const payload = create.mock.calls[0][0];
    expect(payload.userId).toBe("demo-user-1");
    expect(payload.filter_applied).toBe(FILTER_MORE_THAN_5_WORDS_COMMENTS);
    expect(payload.processed_items).toBe(1);
    expect(typeof payload.execution_time_ms).toBe("number");
    expect(payload.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("does not invent a UsageLog when scrape fails", async () => {
    const create = vi.fn();
    const service = new FilterService(
      {
        scrapeLive: async () => {
          throw new Error("offline fixture fetch fail");
        },
      } as never,
      { create } as never,
    );

    await expect(
      service.run(
        { filter: FILTER_MORE_THAN_5_WORDS_COMMENTS },
        "demo-user-1",
      ),
    ).rejects.toBeInstanceOf(HnScrapeFailedException);

    expect(create).not.toHaveBeenCalled();
  });
});

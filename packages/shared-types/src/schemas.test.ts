import { describe, expect, it } from "vitest";
import {
  EntrySchema,
  FILTER_LESS_OR_EQUAL_5_WORDS_POINTS,
  FILTER_MORE_THAN_5_WORDS_COMMENTS,
  FILTER_WORD_THRESHOLD,
  FilterQuerySchema,
  LoginBodySchema,
  SavedFilterResultCreateSchema,
  SavedFilterResultSchema,
  UsageLogSchema,
} from "./schemas.js";

describe("FILTER_WORD_THRESHOLD", () => {
  it("is 5", () => {
    expect(FILTER_WORD_THRESHOLD).toBe(5);
  });
});

describe("EntrySchema", () => {
  it("accepts a valid entry", () => {
    const parsed = EntrySchema.parse({
      rank: 1,
      title: "Show HN: Zod schemas",
      points: 10,
      comments: 3,
    });
    expect(parsed.title).toBe("Show HN: Zod schemas");
  });

  it("rejects missing title", () => {
    expect(() =>
      EntrySchema.parse({
        rank: 1,
        points: 0,
        comments: 0,
      }),
    ).toThrow();
  });
});

describe("FilterQuerySchema", () => {
  it("accepts MORE_THAN_5_WORDS_COMMENTS", () => {
    expect(
      FilterQuerySchema.parse({
        filter: FILTER_MORE_THAN_5_WORDS_COMMENTS,
      }),
    ).toEqual({ filter: "MORE_THAN_5_WORDS_COMMENTS" });
  });

  it("accepts LESS_OR_EQUAL_5_WORDS_POINTS", () => {
    expect(
      FilterQuerySchema.parse({
        filter: FILTER_LESS_OR_EQUAL_5_WORDS_POINTS,
      }),
    ).toEqual({ filter: "LESS_OR_EQUAL_5_WORDS_POINTS" });
  });

  it("rejects OTHER", () => {
    expect(() => FilterQuerySchema.parse({ filter: "OTHER" })).toThrow();
  });
});

describe("LoginBodySchema", () => {
  it("accepts email and password", () => {
    expect(
      LoginBodySchema.parse({
        email: "demo@example.com",
        password: "secret",
      }),
    ).toEqual({ email: "demo@example.com", password: "secret" });
  });

  it("rejects missing password", () => {
    expect(() =>
      LoginBodySchema.parse({ email: "demo@example.com" }),
    ).toThrow();
  });
});

const VALID_USAGE_LOG = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  timestamp: "2026-10-02T19:00:00.000Z",
  filter_applied: FILTER_MORE_THAN_5_WORDS_COMMENTS,
  processed_items: 30,
  execution_time_ms: 12,
  userId: "user-1",
  requestId: "req-corr-1",
  scrape_duration_ms: 320,
} as const;

describe("UsageLogSchema", () => {
  it("accepts a valid usage log with requestId and scrape_duration_ms", () => {
    const parsed = UsageLogSchema.parse(VALID_USAGE_LOG);
    expect(parsed.userId).toBe("user-1");
    expect(parsed.requestId).toBe("req-corr-1");
    expect(parsed.scrape_duration_ms).toBe(320);
  });

  it("accepts numeric id", () => {
    const parsed = UsageLogSchema.parse({
      id: 42,
      timestamp: "2026-10-02T19:00:00.000Z",
      filter_applied: FILTER_LESS_OR_EQUAL_5_WORDS_POINTS,
      processed_items: 1,
      execution_time_ms: 5,
      userId: "user-2",
      requestId: "req-2",
      scrape_duration_ms: 0,
    });
    expect(parsed.id).toBe(42);
  });

  it("rejects missing userId", () => {
    expect(() =>
      UsageLogSchema.parse({
        id: 1,
        timestamp: "2026-10-02T19:00:00.000Z",
        filter_applied: FILTER_MORE_THAN_5_WORDS_COMMENTS,
        processed_items: 1,
        execution_time_ms: 1,
        requestId: "req-3",
        scrape_duration_ms: 1,
      }),
    ).toThrow();
  });

  it("rejects missing requestId", () => {
    const { requestId: _omit, ...withoutRequestId } = VALID_USAGE_LOG;
    expect(() => UsageLogSchema.parse(withoutRequestId)).toThrow();
  });

  it("rejects missing scrape_duration_ms", () => {
    const { scrape_duration_ms: _omit, ...withoutScrape } = VALID_USAGE_LOG;
    expect(() => UsageLogSchema.parse(withoutScrape)).toThrow();
  });

  it("rejects negative scrape_duration_ms", () => {
    expect(() =>
      UsageLogSchema.parse({ ...VALID_USAGE_LOG, scrape_duration_ms: -1 }),
    ).toThrow();
  });
});

const VALID_ENTRY = {
  rank: 1,
  title: "Show HN: Zod schemas",
  points: 10,
  comments: 3,
};

describe("SavedFilterResultSchema", () => {
  it("accepts a valid saved filter result", () => {
    const parsed = SavedFilterResultSchema.parse({
      id: "save-1",
      savedAt: "2026-10-03T12:00:00.000Z",
      userId: "user-1",
      filter_applied: FILTER_MORE_THAN_5_WORDS_COMMENTS,
      entries: [VALID_ENTRY],
      entryCount: 1,
      label: "morning",
    });
    expect(parsed.entryCount).toBe(1);
    expect(parsed.label).toBe("morning");
  });

  it("accepts omit label", () => {
    const parsed = SavedFilterResultSchema.parse({
      id: "save-2",
      savedAt: "2026-10-03T12:00:00.000Z",
      userId: "user-1",
      filter_applied: FILTER_LESS_OR_EQUAL_5_WORDS_POINTS,
      entries: [],
      entryCount: 0,
    });
    expect(parsed.entries).toEqual([]);
  });

  it("rejects invalid nested entry", () => {
    expect(() =>
      SavedFilterResultSchema.parse({
        id: "save-3",
        savedAt: "2026-10-03T12:00:00.000Z",
        userId: "user-1",
        filter_applied: FILTER_MORE_THAN_5_WORDS_COMMENTS,
        entries: [{ rank: 1, points: 0, comments: 0 }],
        entryCount: 1,
      }),
    ).toThrow();
  });

  it("rejects missing entryCount", () => {
    expect(() =>
      SavedFilterResultSchema.parse({
        id: "save-4",
        savedAt: "2026-10-03T12:00:00.000Z",
        userId: "user-1",
        filter_applied: FILTER_MORE_THAN_5_WORDS_COMMENTS,
        entries: [VALID_ENTRY],
      }),
    ).toThrow();
  });
});

describe("SavedFilterResultCreateSchema", () => {
  it("accepts create input without id/savedAt/userId", () => {
    const parsed = SavedFilterResultCreateSchema.parse({
      filter_applied: FILTER_MORE_THAN_5_WORDS_COMMENTS,
      entries: [VALID_ENTRY],
    });
    expect(parsed.entries).toHaveLength(1);
  });

  it("rejects create input with invalid entries", () => {
    expect(() =>
      SavedFilterResultCreateSchema.parse({
        filter_applied: FILTER_MORE_THAN_5_WORDS_COMMENTS,
        entries: [{ title: "missing rank" }],
      }),
    ).toThrow();
  });
});

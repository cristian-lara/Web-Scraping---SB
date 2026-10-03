import { describe, expect, it } from "vitest";
import {
  EntrySchema,
  FILTER_LESS_OR_EQUAL_5_WORDS_POINTS,
  FILTER_MORE_THAN_5_WORDS_COMMENTS,
  FILTER_WORD_THRESHOLD,
  FilterQuerySchema,
  LoginBodySchema,
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

describe("UsageLogSchema", () => {
  it("accepts a valid usage log", () => {
    const parsed = UsageLogSchema.parse({
      id: "550e8400-e29b-41d4-a716-446655440000",
      timestamp: "2026-10-02T19:00:00.000Z",
      filter_applied: FILTER_MORE_THAN_5_WORDS_COMMENTS,
      processed_items: 30,
      execution_time_ms: 12,
      userId: "user-1",
    });
    expect(parsed.userId).toBe("user-1");
  });

  it("accepts numeric id", () => {
    const parsed = UsageLogSchema.parse({
      id: 42,
      timestamp: "2026-10-02T19:00:00.000Z",
      filter_applied: FILTER_LESS_OR_EQUAL_5_WORDS_POINTS,
      processed_items: 1,
      execution_time_ms: 5,
      userId: "user-2",
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
      }),
    ).toThrow();
  });
});

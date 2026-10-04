import {
  FILTER_MORE_THAN_5_WORDS_COMMENTS,
  SavedFilterResultCreateSchema,
} from "@repo/shared-types";
import { describe, expect, it } from "vitest";
import { parseSaveBody } from "@/lib/saved-results";

describe("parseSaveBody", () => {
  it("accepts valid save payload", () => {
    const parsed = parseSaveBody({
      filter_applied: FILTER_MORE_THAN_5_WORDS_COMMENTS,
      entries: [
        { rank: 1, title: "one two three four five six", points: 1, comments: 2 },
      ],
    });
    expect(parsed.entries).toHaveLength(1);
    expect(SavedFilterResultCreateSchema.parse(parsed).filter_applied).toBe(
      FILTER_MORE_THAN_5_WORDS_COMMENTS,
    );
  });

  it("rejects invalid nested entries", () => {
    expect(() =>
      parseSaveBody({
        filter_applied: FILTER_MORE_THAN_5_WORDS_COMMENTS,
        entries: [{ rank: 1, points: 0, comments: 0 }],
      }),
    ).toThrow();
  });
});

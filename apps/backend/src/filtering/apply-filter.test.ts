import { describe, expect, it } from "vitest";
import {
  FILTER_LESS_OR_EQUAL_5_WORDS_POINTS,
  FILTER_MORE_THAN_5_WORDS_COMMENTS,
  type Entry,
} from "@repo/shared-types";
import { applyFilter } from "./apply-filter.js";

/** > FILTER_WORD_THRESHOLD (6 words). */
const LONG_TITLE = "one two three four five six";
/** = FILTER_WORD_THRESHOLD (5 words). */
const EXACT_THRESHOLD_TITLE = "one two three four five";
/** < FILTER_WORD_THRESHOLD (2 words). */
const SHORT_TITLE = "short title";

function entry(
  partial: Pick<Entry, "rank" | "title" | "points" | "comments">,
): Entry {
  return partial;
}

describe("applyFilter", () => {
  const mixed: Entry[] = [
    entry({ rank: 3, title: LONG_TITLE, points: 10, comments: 50 }),
    entry({ rank: 1, title: SHORT_TITLE, points: 100, comments: 2 }),
    entry({ rank: 2, title: EXACT_THRESHOLD_TITLE, points: 80, comments: 90 }),
    entry({ rank: 4, title: LONG_TITLE, points: 5, comments: 50 }),
    entry({
      rank: 5,
      title: "alpha beta gamma delta epsilon zeta eta",
      points: 1,
      comments: 200,
    }),
  ];

  it("HP-FA: keeps titles above threshold, sorts comments DESC then rank ASC", () => {
    const result = applyFilter(mixed, FILTER_MORE_THAN_5_WORDS_COMMENTS);

    expect(result.map((e) => e.rank)).toEqual([5, 3, 4]);
    expect(
      result.every((e) => e.title === LONG_TITLE || e.rank === 5),
    ).toBe(true);
  });

  it("HP-FB: keeps titles at or below threshold, sorts points DESC then rank ASC", () => {
    const result = applyFilter(mixed, FILTER_LESS_OR_EQUAL_5_WORDS_POINTS);

    expect(result.map((e) => e.rank)).toEqual([1, 2]);
    expect(result.map((e) => e.title)).toEqual([
      SHORT_TITLE,
      EXACT_THRESHOLD_TITLE,
    ]);
  });

  it("EC-TIE: equal primary key breaks by rank ASC (Filter A comments)", () => {
    const tied: Entry[] = [
      entry({ rank: 8, title: LONG_TITLE, points: 1, comments: 40 }),
      entry({ rank: 2, title: LONG_TITLE, points: 1, comments: 40 }),
      entry({ rank: 5, title: LONG_TITLE, points: 1, comments: 40 }),
    ];

    const result = applyFilter(tied, FILTER_MORE_THAN_5_WORDS_COMMENTS);
    expect(result.map((e) => e.rank)).toEqual([2, 5, 8]);
  });

  it("EC-TIE: equal primary key breaks by rank ASC (Filter B points)", () => {
    const tied: Entry[] = [
      entry({ rank: 9, title: SHORT_TITLE, points: 30, comments: 0 }),
      entry({ rank: 3, title: SHORT_TITLE, points: 30, comments: 0 }),
    ];

    const result = applyFilter(tied, FILTER_LESS_OR_EQUAL_5_WORDS_POINTS);
    expect(result.map((e) => e.rank)).toEqual([3, 9]);
  });

  it("EC-EMPTY: empty input returns [] without throw", () => {
    expect(applyFilter([], FILTER_MORE_THAN_5_WORDS_COMMENTS)).toEqual([]);
    expect(applyFilter([], FILTER_LESS_OR_EQUAL_5_WORDS_POINTS)).toEqual([]);
  });

  it("EC-EMPTY: all excluded returns [] without throw", () => {
    const onlyShort: Entry[] = [
      entry({ rank: 1, title: SHORT_TITLE, points: 10, comments: 1 }),
    ];
    const onlyLong: Entry[] = [
      entry({ rank: 1, title: LONG_TITLE, points: 10, comments: 1 }),
    ];

    expect(
      applyFilter(onlyShort, FILTER_MORE_THAN_5_WORDS_COMMENTS),
    ).toEqual([]);
    expect(
      applyFilter(onlyLong, FILTER_LESS_OR_EQUAL_5_WORDS_POINTS),
    ).toEqual([]);
  });
});

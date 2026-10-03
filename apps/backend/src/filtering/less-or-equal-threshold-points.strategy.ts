import {
  FILTER_WORD_THRESHOLD,
  countWords,
  type Entry,
} from "@repo/shared-types";
import type { FilterStrategy } from "./filter-strategy.js";

/** Filter B: titles with at most FILTER_WORD_THRESHOLD words, by points DESC. */
export class LessOrEqualThresholdPointsStrategy implements FilterStrategy {
  apply(entries: Entry[]): Entry[] {
    return entries
      .filter((entry) => countWords(entry.title) <= FILTER_WORD_THRESHOLD)
      .sort((a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        }
        return a.rank - b.rank;
      });
  }
}

import {
  FILTER_WORD_THRESHOLD,
  countWords,
  type Entry,
} from "@repo/shared-types";
import type { FilterStrategy } from "./filter-strategy.js";

/** Filter A: titles with more than FILTER_WORD_THRESHOLD words, by comments DESC. */
export class MoreThanThresholdCommentsStrategy implements FilterStrategy {
  apply(entries: Entry[]): Entry[] {
    return entries
      .filter((entry) => countWords(entry.title) > FILTER_WORD_THRESHOLD)
      .sort((a, b) => {
        if (b.comments !== a.comments) {
          return b.comments - a.comments;
        }
        return a.rank - b.rank;
      });
  }
}

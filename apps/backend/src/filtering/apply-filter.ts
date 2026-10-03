import {
  FILTER_LESS_OR_EQUAL_5_WORDS_POINTS,
  FILTER_MORE_THAN_5_WORDS_COMMENTS,
  type Entry,
  type FilterApplied,
} from "@repo/shared-types";
import type { FilterStrategy } from "./filter-strategy.js";
import { LessOrEqualThresholdPointsStrategy } from "./less-or-equal-threshold-points.strategy.js";
import { MoreThanThresholdCommentsStrategy } from "./more-than-threshold-comments.strategy.js";

const STRATEGIES: Record<FilterApplied, FilterStrategy> = {
  [FILTER_MORE_THAN_5_WORDS_COMMENTS]: new MoreThanThresholdCommentsStrategy(),
  [FILTER_LESS_OR_EQUAL_5_WORDS_POINTS]:
    new LessOrEqualThresholdPointsStrategy(),
};

/** Select strategy by FilterApplied enum and apply to entries. */
export function applyFilter(
  entries: Entry[],
  filter: FilterApplied,
): Entry[] {
  return STRATEGIES[filter].apply(entries);
}

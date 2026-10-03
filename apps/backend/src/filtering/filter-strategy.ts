import type { Entry } from "@repo/shared-types";

/** Strategy Pattern contract for Filter A / Filter B. */
export interface FilterStrategy {
  apply(entries: Entry[]): Entry[];
}

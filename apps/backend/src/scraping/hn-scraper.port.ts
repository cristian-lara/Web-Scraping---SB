import type { Entry } from "@repo/shared-types";

/**
 * Port for extracting HN entries from HTML (offline fixture or later live fetch).
 */
export interface HnScraperPort {
  scrapeFromHtml(html: string): Entry[];
}

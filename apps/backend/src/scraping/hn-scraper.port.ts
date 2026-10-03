import type { Entry } from "@repo/shared-types";

/**
 * Port for extracting HN entries from HTML.
 * Live runtime: AxiosHnHtmlFetcher supplies HTML; CheerioScraperAdapter parses.
 * Unit tests inject fixture HTML into scrapeFromHtml (no network).
 */
export interface HnScraperPort {
  scrapeFromHtml(html: string): Entry[];
}

import { Inject, Injectable } from "@nestjs/common";
import type { Entry } from "@repo/shared-types";
import { CheerioScraperAdapter } from "./cheerio-scraper.adapter.js";
import {
  HN_HTML_FETCHER,
  type HnHtmlFetcher,
} from "./hn-html.fetcher.js";

/**
 * Orchestrates live Axios HTML fetch + Cheerio parse.
 * Tests call CheerioScraperAdapter.scrapeFromHtml with fixtures (no network).
 */
@Injectable()
export class ScrapingService {
  constructor(
    @Inject(HN_HTML_FETCHER) private readonly htmlFetcher: HnHtmlFetcher,
    @Inject(CheerioScraperAdapter)
    private readonly cheerioAdapter: CheerioScraperAdapter,
  ) {}

  scrapeFromHtml(html: string): Entry[] {
    return this.cheerioAdapter.scrapeFromHtml(html);
  }

  async scrapeLive(): Promise<Entry[]> {
    const html = await this.htmlFetcher.fetchHtml();
    return this.cheerioAdapter.scrapeFromHtml(html);
  }
}

import { Module } from "@nestjs/common";
import { AxiosHnHtmlFetcher } from "./axios-hn-html.fetcher.js";
import { CheerioScraperAdapter } from "./cheerio-scraper.adapter.js";
import { HN_HTML_FETCHER } from "./hn-html.fetcher.js";
import { ScrapingService } from "./scraping.service.js";

@Module({
  providers: [
    CheerioScraperAdapter,
    AxiosHnHtmlFetcher,
    { provide: HN_HTML_FETCHER, useExisting: AxiosHnHtmlFetcher },
    ScrapingService,
  ],
  exports: [ScrapingService, CheerioScraperAdapter, HN_HTML_FETCHER],
})
export class ScrapingModule {}

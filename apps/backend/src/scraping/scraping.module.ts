import { Module } from "@nestjs/common";
import { isE2eScrapeFixtureEnabled } from "../common/env.constants.js";
import { AxiosHnHtmlFetcher } from "./axios-hn-html.fetcher.js";
import { CheerioScraperAdapter } from "./cheerio-scraper.adapter.js";
import { FixtureHnHtmlFetcher } from "./fixture-hn-html.fetcher.js";
import { HN_HTML_FETCHER } from "./hn-html.fetcher.js";
import { ScrapingService } from "./scraping.service.js";

@Module({
  providers: [
    CheerioScraperAdapter,
    AxiosHnHtmlFetcher,
    FixtureHnHtmlFetcher,
    {
      provide: HN_HTML_FETCHER,
      useFactory: (
        axiosFetcher: AxiosHnHtmlFetcher,
        fixtureFetcher: FixtureHnHtmlFetcher,
      ) =>
        isE2eScrapeFixtureEnabled() ? fixtureFetcher : axiosFetcher,
      inject: [AxiosHnHtmlFetcher, FixtureHnHtmlFetcher],
    },
    ScrapingService,
  ],
  exports: [ScrapingService, CheerioScraperAdapter, HN_HTML_FETCHER],
})
export class ScrapingModule {}

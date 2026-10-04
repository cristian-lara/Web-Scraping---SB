import { Module } from "@nestjs/common";
import { isE2eScrapeFixtureEnabled } from "../common/env.constants.js";
import { AxiosHnHtmlFetcher } from "./axios-hn-html.fetcher.js";
import { CheerioScraperAdapter } from "./cheerio-scraper.adapter.js";
import { FixtureHnHtmlFetcher } from "./fixture-hn-html.fetcher.js";
import { HN_HTML_FETCHER } from "./hn-html.fetcher.js";
import { PoliteHnHtmlFetcher } from "./polite-hn-html.fetcher.js";
import { ScrapingService } from "./scraping.service.js";

@Module({
  providers: [
    CheerioScraperAdapter,
    AxiosHnHtmlFetcher,
    FixtureHnHtmlFetcher,
    {
      provide: PoliteHnHtmlFetcher,
      useFactory: (axiosFetcher: AxiosHnHtmlFetcher) =>
        new PoliteHnHtmlFetcher(axiosFetcher),
      inject: [AxiosHnHtmlFetcher],
    },
    {
      provide: HN_HTML_FETCHER,
      useFactory: (
        fixtureFetcher: FixtureHnHtmlFetcher,
        politeFetcher: PoliteHnHtmlFetcher,
      ) =>
        isE2eScrapeFixtureEnabled() ? fixtureFetcher : politeFetcher,
      inject: [FixtureHnHtmlFetcher, PoliteHnHtmlFetcher],
    },
    ScrapingService,
  ],
  exports: [ScrapingService, CheerioScraperAdapter, HN_HTML_FETCHER],
})
export class ScrapingModule {}

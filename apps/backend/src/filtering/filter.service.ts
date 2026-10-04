import { Inject, Injectable } from "@nestjs/common";
import type { Entry, FilterQuery } from "@repo/shared-types";
import { PrismaUsageRepository } from "../analytics/prisma-usage.repository.js";
import {
  LOG_STAGE_FILTER,
  LOG_STAGE_PERSIST,
  LOG_STAGE_SCRAPE,
} from "../common/http.constants.js";
import {
  SPAN_FILTER_RUN,
  SPAN_SCRAPE_LIVE,
  SPAN_USAGE_LOG_WRITE,
} from "../common/otel.constants.js";
import { withSpan } from "../common/otel-bootstrap.js";
import { getRequestId } from "../common/request-context.js";
import { logStage } from "../common/structured-logger.js";
import { HnScrapeFailedException } from "../scraping/hn-scrape.exception.js";
import { ScrapingService } from "../scraping/scraping.service.js";
import { applyFilter } from "./apply-filter.js";

/** Fallback when ALS has no request id (should not happen on HTTP path). */
const MISSING_REQUEST_ID = "missing-request-id";

@Injectable()
export class FilterService {
  constructor(
    @Inject(ScrapingService)
    private readonly scrapingService: ScrapingService,
    @Inject(PrismaUsageRepository)
    private readonly usageRepository: PrismaUsageRepository,
  ) {}

  /** Scrape (live/injectable fetcher) then apply FilterQuery strategy. */
  async run(query: FilterQuery, userId: string): Promise<Entry[]> {
    return withSpan(SPAN_FILTER_RUN, async () => {
      const startedAt = Date.now();
      let scrapeDurationMs = 0;
      let entries: Entry[];
      try {
        logStage(LOG_STAGE_SCRAPE);
        const scrapeStartedAt = Date.now();
        entries = await withSpan(SPAN_SCRAPE_LIVE, () =>
          this.scrapingService.scrapeLive(),
        );
        scrapeDurationMs = Date.now() - scrapeStartedAt;
        logStage(LOG_STAGE_SCRAPE, { durationMs: scrapeDurationMs });
      } catch {
        throw new HnScrapeFailedException();
      }
      const filtered = applyFilter(entries, query.filter);
      logStage(LOG_STAGE_FILTER);
      await withSpan(SPAN_USAGE_LOG_WRITE, () =>
        this.usageRepository.create({
          timestamp: new Date().toISOString(),
          filter_applied: query.filter,
          processed_items: entries.length,
          execution_time_ms: Date.now() - startedAt,
          userId,
          requestId: getRequestId() ?? MISSING_REQUEST_ID,
          scrape_duration_ms: scrapeDurationMs,
        }),
      );
      logStage(LOG_STAGE_PERSIST);
      return filtered;
    });
  }
}

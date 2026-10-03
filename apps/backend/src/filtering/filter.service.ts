import { Inject, Injectable } from "@nestjs/common";
import type { Entry, FilterQuery } from "@repo/shared-types";
import { PrismaUsageRepository } from "../analytics/prisma-usage.repository.js";
import { HnScrapeFailedException } from "../scraping/hn-scrape.exception.js";
import { ScrapingService } from "../scraping/scraping.service.js";
import {
  LOG_STAGE_FILTER,
  LOG_STAGE_PERSIST,
  LOG_STAGE_SCRAPE,
} from "../common/http.constants.js";
import { logStage } from "../common/structured-logger.js";
import { applyFilter } from "./apply-filter.js";

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
    const startedAt = Date.now();
    let entries: Entry[];
    try {
      logStage(LOG_STAGE_SCRAPE);
      entries = await this.scrapingService.scrapeLive();
      logStage(LOG_STAGE_SCRAPE, { durationMs: Date.now() - startedAt });
    } catch {
      throw new HnScrapeFailedException();
    }
    const filtered = applyFilter(entries, query.filter);
    logStage(LOG_STAGE_FILTER);
    await this.usageRepository.create({
      timestamp: new Date().toISOString(),
      filter_applied: query.filter,
      processed_items: entries.length,
      execution_time_ms: Date.now() - startedAt,
      userId,
    });
    logStage(LOG_STAGE_PERSIST);
    return filtered;
  }
}

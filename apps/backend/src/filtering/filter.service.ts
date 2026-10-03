import { Inject, Injectable } from "@nestjs/common";
import type { Entry, FilterQuery } from "@repo/shared-types";
import { PrismaUsageRepository } from "../analytics/prisma-usage.repository.js";
import { HnScrapeFailedException } from "../scraping/hn-scrape.exception.js";
import { ScrapingService } from "../scraping/scraping.service.js";
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
      entries = await this.scrapingService.scrapeLive();
    } catch {
      throw new HnScrapeFailedException();
    }
    const filtered = applyFilter(entries, query.filter);
    await this.usageRepository.create({
      timestamp: new Date().toISOString(),
      filter_applied: query.filter,
      processed_items: entries.length,
      execution_time_ms: Date.now() - startedAt,
      userId,
    });
    return filtered;
  }
}

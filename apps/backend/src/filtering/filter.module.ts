import { Module } from "@nestjs/common";
import { AnalyticsModule } from "../analytics/analytics.module.js";
import { ScrapingModule } from "../scraping/scraping.module.js";
import { FilterController } from "./filter.controller.js";
import { FilterService } from "./filter.service.js";

@Module({
  imports: [ScrapingModule, AnalyticsModule],
  controllers: [FilterController],
  providers: [FilterService],
  exports: [FilterService],
})
export class FilterModule {}

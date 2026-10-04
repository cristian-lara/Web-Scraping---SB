import { Module } from "@nestjs/common";
import { PrismaSavedFilterResultRepository } from "./prisma-saved-filter-result.repository.js";
import { PrismaUsageRepository } from "./prisma-usage.repository.js";
import { PrismaService } from "./prisma.service.js";
import { SavedFilterResultController } from "./saved-filter-result.controller.js";
import { SavedFilterResultService } from "./saved-filter-result.service.js";

@Module({
  controllers: [SavedFilterResultController],
  providers: [
    PrismaService,
    PrismaUsageRepository,
    PrismaSavedFilterResultRepository,
    SavedFilterResultService,
  ],
  exports: [PrismaUsageRepository, PrismaSavedFilterResultRepository],
})
export class AnalyticsModule {}

import { Module } from "@nestjs/common";
import { PrismaUsageRepository } from "./prisma-usage.repository.js";
import { PrismaService } from "./prisma.service.js";

@Module({
  providers: [PrismaService, PrismaUsageRepository],
  exports: [PrismaUsageRepository],
})
export class AnalyticsModule {}

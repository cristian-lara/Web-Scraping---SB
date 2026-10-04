import { Inject, Injectable } from "@nestjs/common";
import {
  UsageLogSchema,
  type UsageLog,
} from "@repo/shared-types";
import { randomUUID } from "node:crypto";
import { PrismaService } from "./prisma.service.js";

export type CreateUsageLogInput = Omit<UsageLog, "id">;

@Injectable()
export class PrismaUsageRepository {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async create(input: CreateUsageLogInput): Promise<UsageLog> {
    const parsed = UsageLogSchema.parse({
      ...input,
      id: randomUUID(),
    });

    const row = await this.prisma.usageLog.create({
      data: {
        id: String(parsed.id),
        timestamp: new Date(parsed.timestamp),
        filter_applied: parsed.filter_applied,
        processed_items: parsed.processed_items,
        execution_time_ms: parsed.execution_time_ms,
        userId: parsed.userId,
        requestId: parsed.requestId,
        scrape_duration_ms: parsed.scrape_duration_ms,
      },
    });

    return this.toUsageLog(row);
  }

  async findById(id: string): Promise<UsageLog | null> {
    const row = await this.prisma.usageLog.findUnique({ where: { id } });
    if (row === null) {
      return null;
    }
    return this.toUsageLog(row);
  }

  async findLatestByUserId(userId: string): Promise<UsageLog | null> {
    const row = await this.prisma.usageLog.findFirst({
      where: { userId },
      orderBy: { timestamp: "desc" },
    });
    if (row === null) {
      return null;
    }
    return this.toUsageLog(row);
  }

  private toUsageLog(row: {
    id: string;
    timestamp: Date;
    filter_applied: string;
    processed_items: number;
    execution_time_ms: number;
    userId: string;
    requestId: string;
    scrape_duration_ms: number;
  }): UsageLog {
    return UsageLogSchema.parse({
      id: row.id,
      timestamp: row.timestamp.toISOString(),
      filter_applied: row.filter_applied,
      processed_items: row.processed_items,
      execution_time_ms: row.execution_time_ms,
      userId: row.userId,
      requestId: row.requestId,
      scrape_duration_ms: row.scrape_duration_ms,
    });
  }
}

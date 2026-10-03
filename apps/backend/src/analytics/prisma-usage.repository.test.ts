import {
  FILTER_MORE_THAN_5_WORDS_COMMENTS,
  UsageLogSchema,
} from "@repo/shared-types";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaUsageRepository } from "./prisma-usage.repository.js";
import { PrismaService } from "./prisma.service.js";

describe("PrismaUsageRepository (offline SQLite)", () => {
  const prisma = new PrismaService();
  const repo = new PrismaUsageRepository(prisma);

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates and reads a UsageLog row without live HN", async () => {
    const created = await repo.create({
      timestamp: "2026-10-03T05:00:00.000Z",
      filter_applied: FILTER_MORE_THAN_5_WORDS_COMMENTS,
      processed_items: 3,
      execution_time_ms: 12,
      userId: "jwt-user-offline",
    });

    expect(UsageLogSchema.parse(created).userId).toBe("jwt-user-offline");
    expect(created.filter_applied).toBe(FILTER_MORE_THAN_5_WORDS_COMMENTS);
    expect(created.timestamp).toBe("2026-10-03T05:00:00.000Z");

    const read = await repo.findById(String(created.id));
    expect(read).toEqual(created);
  });

  it("rejects invalid UsageLogSchema before write", async () => {
    const before = await prisma.usageLog.count();

    await expect(
      repo.create({
        timestamp: "not-iso",
        filter_applied: FILTER_MORE_THAN_5_WORDS_COMMENTS,
        processed_items: 1,
        execution_time_ms: 1,
        userId: "jwt-user-offline",
      }),
    ).rejects.toThrow();

    expect(await prisma.usageLog.count()).toBe(before);
  });
});

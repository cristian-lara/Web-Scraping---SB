import {
  FILTER_MORE_THAN_5_WORDS_COMMENTS,
  SavedFilterResultSchema,
  type Entry,
} from "@repo/shared-types";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaSavedFilterResultRepository } from "./prisma-saved-filter-result.repository.js";
import { PrismaService } from "./prisma.service.js";

const ENTRY: Entry = {
  rank: 1,
  title: "one two three four five six",
  points: 10,
  comments: 3,
};

describe("PrismaSavedFilterResultRepository (offline SQLite)", () => {
  const prisma = new PrismaService();
  const repo = new PrismaSavedFilterResultRepository(prisma);

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates and lists saved results newest first without live HN", async () => {
    const userId = `save-user-${Date.now()}`;
    const first = await repo.create({
      userId,
      filter_applied: FILTER_MORE_THAN_5_WORDS_COMMENTS,
      entries: [ENTRY],
      label: "first",
    });
    expect(SavedFilterResultSchema.parse(first).entryCount).toBe(1);

    await new Promise((r) => setTimeout(r, 5));

    const second = await repo.create({
      userId,
      filter_applied: FILTER_MORE_THAN_5_WORDS_COMMENTS,
      entries: [ENTRY, { ...ENTRY, rank: 2 }],
    });
    expect(second.entryCount).toBe(2);

    const listed = await repo.listByUserId(userId);
    expect(listed.length).toBeGreaterThanOrEqual(2);
    expect(listed[0].id).toBe(second.id);
    expect(listed.every((row) => row.userId === userId)).toBe(true);
  });

  it("rejects invalid nested entries before write", async () => {
    const before = await prisma.savedFilterResult.count();
    await expect(
      repo.create({
        userId: "bad-user",
        filter_applied: FILTER_MORE_THAN_5_WORDS_COMMENTS,
        entries: [{ rank: 1, points: 0, comments: 0 } as Entry],
      }),
    ).rejects.toThrow();
    expect(await prisma.savedFilterResult.count()).toBe(before);
  });
});

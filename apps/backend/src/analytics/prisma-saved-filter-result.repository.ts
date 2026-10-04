import { Inject, Injectable } from "@nestjs/common";
import {
  EntrySchema,
  SavedFilterResultSchema,
  type Entry,
  type FilterApplied,
  type SavedFilterResult,
  type SavedFilterResultCreate,
} from "@repo/shared-types";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { PrismaService } from "./prisma.service.js";

const EntriesJsonSchema = z.array(EntrySchema);

export type CreateSavedFilterResultInput = SavedFilterResultCreate & {
  userId: string;
};

@Injectable()
export class PrismaSavedFilterResultRepository {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async create(input: CreateSavedFilterResultInput): Promise<SavedFilterResult> {
    const entries = EntriesJsonSchema.parse(input.entries);
    const parsed = SavedFilterResultSchema.parse({
      id: randomUUID(),
      savedAt: new Date().toISOString(),
      userId: input.userId,
      filter_applied: input.filter_applied,
      entries,
      entryCount: entries.length,
      label: input.label,
    });

    const row = await this.prisma.savedFilterResult.create({
      data: {
        id: parsed.id,
        savedAt: new Date(parsed.savedAt),
        userId: parsed.userId,
        filter_applied: parsed.filter_applied,
        entries: JSON.stringify(parsed.entries),
        entryCount: parsed.entryCount,
        label: parsed.label ?? null,
      },
    });

    return this.toSaved(row);
  }

  async listByUserId(userId: string): Promise<SavedFilterResult[]> {
    const rows = await this.prisma.savedFilterResult.findMany({
      where: { userId },
      orderBy: { savedAt: "desc" },
    });
    return rows.map((row) => this.toSaved(row));
  }

  private toSaved(row: {
    id: string;
    savedAt: Date;
    userId: string;
    filter_applied: string;
    entries: string;
    entryCount: number;
    label: string | null;
  }): SavedFilterResult {
    const entries = EntriesJsonSchema.parse(
      JSON.parse(row.entries) as Entry[],
    );
    return SavedFilterResultSchema.parse({
      id: row.id,
      savedAt: row.savedAt.toISOString(),
      userId: row.userId,
      filter_applied: row.filter_applied as FilterApplied,
      entries,
      entryCount: row.entryCount,
      label: row.label ?? undefined,
    });
  }
}

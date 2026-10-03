import { z } from "zod";

export const FILTER_MORE_THAN_5_WORDS_COMMENTS =
  "MORE_THAN_5_WORDS_COMMENTS" as const;
export const FILTER_LESS_OR_EQUAL_5_WORDS_POINTS =
  "LESS_OR_EQUAL_5_WORDS_POINTS" as const;

export const FilterAppliedSchema = z.enum([
  FILTER_MORE_THAN_5_WORDS_COMMENTS,
  FILTER_LESS_OR_EQUAL_5_WORDS_POINTS,
]);

export const FilterQuerySchema = z.object({
  filter: FilterAppliedSchema,
});

export const EntrySchema = z.object({
  rank: z.number(),
  title: z.string(),
  points: z.number(),
  comments: z.number(),
});

export const UsageLogSchema = z.object({
  id: z.union([z.string(), z.number()]),
  timestamp: z.iso.datetime(),
  filter_applied: FilterAppliedSchema,
  processed_items: z.number().int(),
  execution_time_ms: z.number().int(),
  userId: z.string(),
});

export type Entry = z.infer<typeof EntrySchema>;
export type FilterApplied = z.infer<typeof FilterAppliedSchema>;
export type FilterQuery = z.infer<typeof FilterQuerySchema>;
export type UsageLog = z.infer<typeof UsageLogSchema>;

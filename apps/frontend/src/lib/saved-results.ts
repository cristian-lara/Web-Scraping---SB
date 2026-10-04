import {
  SavedFilterResultCreateSchema,
  SavedFilterResultSchema,
  type SavedFilterResult,
  type SavedFilterResultCreate,
} from "@repo/shared-types";
import { api } from "@/lib/api";

export function parseSaveBody(body: unknown): SavedFilterResultCreate {
  return SavedFilterResultCreateSchema.parse(body);
}

export async function saveFilteredResults(
  body: SavedFilterResultCreate,
): Promise<SavedFilterResult> {
  const payload = parseSaveBody(body);
  const { data } = await api.post<unknown>("/results/saved", payload);
  return SavedFilterResultSchema.parse(data);
}

export async function listSavedResults(): Promise<SavedFilterResult[]> {
  const { data } = await api.get<unknown>("/results/saved");
  if (!Array.isArray(data)) {
    throw new Error("Saved results response must be an array");
  }
  return data.map((row) => SavedFilterResultSchema.parse(row));
}

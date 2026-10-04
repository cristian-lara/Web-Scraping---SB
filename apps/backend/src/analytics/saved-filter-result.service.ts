import { Inject, Injectable } from "@nestjs/common";
import type {
  SavedFilterResult,
  SavedFilterResultCreate,
} from "@repo/shared-types";
import { PrismaSavedFilterResultRepository } from "./prisma-saved-filter-result.repository.js";

@Injectable()
export class SavedFilterResultService {
  constructor(
    @Inject(PrismaSavedFilterResultRepository)
    private readonly repository: PrismaSavedFilterResultRepository,
  ) {}

  save(
    userId: string,
    body: SavedFilterResultCreate,
  ): Promise<SavedFilterResult> {
    return this.repository.create({ ...body, userId });
  }

  listForUser(userId: string): Promise<SavedFilterResult[]> {
    return this.repository.listByUserId(userId);
  }
}

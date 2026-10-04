import { Body, Controller, Get, Inject, Post, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import {
  FILTER_LESS_OR_EQUAL_5_WORDS_POINTS,
  FILTER_MORE_THAN_5_WORDS_COMMENTS,
  SavedFilterResultCreateSchema,
  type SavedFilterResult,
  type SavedFilterResultCreate,
} from "@repo/shared-types";
import { CurrentUser } from "../auth/current-user.decorator.js";
import type { AuthenticatedUser } from "../auth/jwt.strategy.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { SAVED_RESULTS_ROUTE_PREFIX } from "../common/http.constants.js";
import { ZodValidationPipe } from "../common/zod-validation.pipe.js";
import { SavedFilterResultService } from "./saved-filter-result.service.js";

@ApiTags(SAVED_RESULTS_ROUTE_PREFIX)
@Controller(SAVED_RESULTS_ROUTE_PREFIX)
export class SavedFilterResultController {
  constructor(
    @Inject(SavedFilterResultService)
    private readonly savedFilterResultService: SavedFilterResultService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Save filtered HN entries for the current user" })
  @ApiCreatedResponse({ description: "Saved filter result created" })
  @ApiBadRequestResponse({ description: "Zod validation failed" })
  @ApiUnauthorizedResponse({ description: "Missing or invalid JWT" })
  save(
    @Body(new ZodValidationPipe(SavedFilterResultCreateSchema))
    body: SavedFilterResultCreate,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<SavedFilterResult> {
    return this.savedFilterResultService.save(user.userId, body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "List saved filter results for the current user" })
  @ApiOkResponse({
    description: "Newest-first saved filter results",
    schema: {
      type: "array",
      items: {
        type: "object",
        required: [
          "id",
          "savedAt",
          "userId",
          "filter_applied",
          "entries",
          "entryCount",
        ],
        properties: {
          id: { type: "string" },
          savedAt: { type: "string", format: "date-time" },
          userId: { type: "string" },
          filter_applied: {
            type: "string",
            enum: [
              FILTER_MORE_THAN_5_WORDS_COMMENTS,
              FILTER_LESS_OR_EQUAL_5_WORDS_POINTS,
            ],
          },
          entryCount: { type: "integer" },
          label: { type: "string" },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Missing or invalid JWT" })
  list(@CurrentUser() user: AuthenticatedUser): Promise<SavedFilterResult[]> {
    return this.savedFilterResultService.listForUser(user.userId);
  }
}

import { Controller, Get, Inject, Query, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import {
  FILTER_LESS_OR_EQUAL_5_WORDS_POINTS,
  FILTER_MORE_THAN_5_WORDS_COMMENTS,
  FilterQuerySchema,
  type Entry,
  type FilterQuery,
} from "@repo/shared-types";
import { CurrentUser } from "../auth/current-user.decorator.js";
import type { AuthenticatedUser } from "../auth/jwt.strategy.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { FILTERS_ROUTE_PREFIX } from "../common/http.constants.js";
import { ZodValidationPipe } from "../common/zod-validation.pipe.js";
import { FilterService } from "./filter.service.js";

@ApiTags(FILTERS_ROUTE_PREFIX)
@Controller(FILTERS_ROUTE_PREFIX)
export class FilterController {
  constructor(
    @Inject(FilterService) private readonly filterService: FilterService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Scrape HN entries and apply Filter A or B",
  })
  @ApiQuery({
    name: "filter",
    required: true,
    enum: [
      FILTER_MORE_THAN_5_WORDS_COMMENTS,
      FILTER_LESS_OR_EQUAL_5_WORDS_POINTS,
    ],
  })
  @ApiOkResponse({
    description: "Filtered and sorted Entry list",
    schema: {
      type: "array",
      items: {
        type: "object",
        required: ["rank", "title", "points", "comments"],
        properties: {
          rank: { type: "number" },
          title: { type: "string" },
          points: { type: "number" },
          comments: { type: "number" },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: "Zod validation failed" })
  @ApiUnauthorizedResponse({ description: "Missing or invalid JWT" })
  filter(
    @Query(new ZodValidationPipe(FilterQuerySchema)) query: FilterQuery,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Entry[]> {
    return this.filterService.run(query, user.userId);
  }
}

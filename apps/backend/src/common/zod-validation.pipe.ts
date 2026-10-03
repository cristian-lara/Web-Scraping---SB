import {
  BadRequestException,
  type PipeTransform,
} from "@nestjs/common";
import type { ZodType } from "zod";
import { HTTP_STATUS_BAD_REQUEST } from "./http.constants.js";

/** Zod DTO pipe → 400 Bad Request (never 500) on schema violation. */
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}

  transform(value: unknown): unknown {
    const parsed = this.schema.safeParse(value);
    if (!parsed.success) {
      throw new BadRequestException({
        statusCode: HTTP_STATUS_BAD_REQUEST,
        message: "Validation failed",
        errors: parsed.error.issues,
      });
    }
    return parsed.data;
  }
}

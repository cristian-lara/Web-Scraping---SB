import {
  Catch,
  HttpException,
  type ArgumentsHost,
  type ExceptionFilter,
} from "@nestjs/common";
import type { Response } from "express";
import { DomainException } from "./domain.exception.js";
import { HTTP_STATUS_INTERNAL_SERVER_ERROR } from "./http.constants.js";
import { getRequestId } from "./request-context.js";
import {
  captureSentryException,
  type SentryCapture,
} from "./sentry-client.js";

type JsonBody = Record<string, unknown>;

function stripStackFields(body: JsonBody): JsonBody {
  const { stack: _stack, stackTrace: _stackTrace, ...rest } = body;
  return rest;
}

function asJsonBody(value: string | object): JsonBody {
  if (typeof value === "string") {
    return { message: value };
  }
  return { ...(value as JsonBody) };
}

/**
 * Maps typed/domain + Nest HttpException failures to HTTP JSON.
 * EC-NOSTACK: never includes stack / stackTrace in the response body.
 */
@Catch()
export class HttpExceptionMappingFilter implements ExceptionFilter {
  constructor(
    private readonly capture: SentryCapture = captureSentryException,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    this.reportToSentry(exception);
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof DomainException) {
      response.status(exception.httpStatus).json({
        statusCode: exception.httpStatus,
        message: exception.message,
        code: exception.code,
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = stripStackFields(asJsonBody(exception.getResponse()));
      response.status(status).json({
        ...body,
        statusCode: status,
      });
      return;
    }

    response.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      statusCode: HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: "Internal server error",
    });
  }

  private reportToSentry(exception: unknown): void {
    try {
      this.capture(exception, { requestId: getRequestId() });
    } catch {
      // Capture must not replace typed HTTP mapping.
    }
  }
}

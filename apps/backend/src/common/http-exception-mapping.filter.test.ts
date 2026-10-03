import { BadRequestException, HttpException, type ArgumentsHost } from "@nestjs/common";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DomainException } from "./domain.exception.js";
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR } from "./http.constants.js";
import { HttpExceptionMappingFilter } from "./http-exception-mapping.filter.js";
import { requestContext } from "./request-context.js";
import type { SentryCapture } from "./sentry-client.js";
import {
  buildSentryNodeOptions,
  initSentryIfConfigured,
  isSentryDsnConfigured,
  scrubSentryEvent,
} from "./sentry-client.js";

const TEST_REQUEST_ID = "corr-id-sentry-001";
const TEST_PASSWORD = "super-secret-password";
const TEST_JWT = "eyJhbGciOiJIUzI1NiJ9.payload.sig";
const TEST_BEARER = `Bearer ${TEST_JWT}`;

function mockHost(): {
  host: ArgumentsHost;
  statusCode: number;
  body: Record<string, unknown> | undefined;
} {
  const state: {
    statusCode: number;
    body: Record<string, unknown> | undefined;
  } = { statusCode: 0, body: undefined };

  const response = {
    status(code: number) {
      state.statusCode = code;
      return this;
    },
    json(payload: Record<string, unknown>) {
      state.body = payload;
      return this;
    },
  };

  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
    }),
  } as ArgumentsHost;

  return {
    host,
    get statusCode() {
      return state.statusCode;
    },
    get body() {
      return state.body;
    },
  };
}

describe("HttpExceptionMappingFilter + Sentry capture", () => {
  const capture: SentryCapture = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("EC-SENTRY-MOCK: thrown error invokes capture", () => {
    const filter = new HttpExceptionMappingFilter(capture);
    const { host } = mockHost();
    const error = new Error("boom");

    filter.catch(error, host);

    expect(capture).toHaveBeenCalledTimes(1);
    expect(capture).toHaveBeenCalledWith(error, expect.anything());
  });

  it("HP-SENTRY-CORR: capture extra/tag context includes requestId", () => {
    const filter = new HttpExceptionMappingFilter(capture);
    const { host } = mockHost();
    const error = new Error("correlated boom");

    requestContext.run({ requestId: TEST_REQUEST_ID }, () => {
      filter.catch(error, host);
    });

    expect(capture).toHaveBeenCalledWith(error, {
      requestId: TEST_REQUEST_ID,
    });
  });

  it("EC-SENTRY-DOMAIN: DomainException keeps mapped status/body and still captures", () => {
    const filter = new HttpExceptionMappingFilter(capture);
    const ctx = mockHost();
    const exception = new DomainException(
      "scrape failed",
      "HN_SCRAPE_FAILED",
      HTTP_STATUS_BAD_REQUEST,
    );

    filter.catch(exception, ctx.host);

    expect(capture).toHaveBeenCalledWith(exception, expect.anything());
    expect(ctx.statusCode).toBe(HTTP_STATUS_BAD_REQUEST);
    expect(ctx.body).toEqual({
      statusCode: HTTP_STATUS_BAD_REQUEST,
      message: "scrape failed",
      code: "HN_SCRAPE_FAILED",
    });
    expect(ctx.body).not.toHaveProperty("stack");
    expect(ctx.body).not.toHaveProperty("stackTrace");
  });

  it("keeps HttpException mapping and omits stack from JSON", () => {
    const filter = new HttpExceptionMappingFilter(capture);
    const ctx = mockHost();
    const exception = new BadRequestException({
      message: "bad input",
      stack: "SECRET_STACK",
      stackTrace: "SECRET_TRACE",
    });

    filter.catch(exception, ctx.host);

    expect(ctx.statusCode).toBe(HTTP_STATUS_BAD_REQUEST);
    expect(ctx.body).toMatchObject({
      message: "bad input",
      statusCode: HTTP_STATUS_BAD_REQUEST,
    });
    expect(ctx.body).not.toHaveProperty("stack");
    expect(ctx.body).not.toHaveProperty("stackTrace");
    expect(JSON.stringify(ctx.body)).not.toContain("SECRET_STACK");
  });

  it("maps unknown errors to 500 without stack", () => {
    const filter = new HttpExceptionMappingFilter(capture);
    const ctx = mockHost();

    filter.catch(new Error("hidden"), ctx.host);

    expect(ctx.statusCode).toBe(HTTP_STATUS_INTERNAL_SERVER_ERROR);
    expect(ctx.body).toEqual({
      statusCode: HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: "Internal server error",
    });
    expect(JSON.stringify(ctx.body)).not.toContain("hidden");
    expect(ctx.body).not.toHaveProperty("stack");
  });

  it("HttpException instances still go through capture", () => {
    const filter = new HttpExceptionMappingFilter(capture);
    const { host } = mockHost();
    const exception = new HttpException("nope", HTTP_STATUS_BAD_REQUEST);

    filter.catch(exception, host);

    expect(capture).toHaveBeenCalledWith(exception, expect.anything());
  });
});

describe("Sentry init + scrub (EC-SENTRY-SCRUB, HP-SENTRY-OFF)", () => {
  it("does not treat empty DSN as configured", () => {
    expect(isSentryDsnConfigured(undefined)).toBe(false);
    expect(isSentryDsnConfigured("")).toBe(false);
    expect(isSentryDsnConfigured("   ")).toBe(false);
    expect(isSentryDsnConfigured("https://example.ingest.sentry.io/1")).toBe(
      true,
    );
  });

  it("initSentryIfConfigured skips SDK init when DSN is empty", () => {
    const initFn = vi.fn();
    expect(initSentryIfConfigured("", initFn)).toBe(false);
    expect(initSentryIfConfigured("   ", initFn)).toBe(false);
    expect(initSentryIfConfigured(undefined, initFn)).toBe(false);
    expect(initFn).not.toHaveBeenCalled();
  });

  it("init options disable default PII and attach beforeSend scrubber", () => {
    const options = buildSentryNodeOptions("https://example.ingest.sentry.io/1");
    expect(options.sendDefaultPii).toBe(false);
    expect(typeof options.beforeSend).toBe("function");
  });

  it("scrubbed events omit password, raw JWT, and Authorization", () => {
    const event = {
      request: {
        headers: {
          Authorization: TEST_BEARER,
          authorization: TEST_BEARER,
        },
        data: {
          password: TEST_PASSWORD,
          jwt: TEST_JWT,
        },
      },
      extra: {
        password: TEST_PASSWORD,
        authorization: TEST_BEARER,
      },
    };

    const scrubbed = scrubSentryEvent(event);
    const serialized = JSON.stringify(scrubbed);

    expect(serialized).not.toContain(TEST_PASSWORD);
    expect(serialized).not.toContain(TEST_JWT);
    expect(serialized).not.toContain(TEST_BEARER);
    expect(serialized.toLowerCase()).not.toContain("bearer ");
  });
});

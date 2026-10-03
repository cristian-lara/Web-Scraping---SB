import * as Sentry from "@sentry/node";
import {
  SENSITIVE_HEADER_AUTHORIZATION,
  SENSITIVE_KEY_JWT,
  SENSITIVE_KEY_PASSWORD,
  SENTRY_DSN_ENV,
  SENTRY_REDACTED,
  SENTRY_REQUEST_ID_TAG,
  SENTRY_SEND_DEFAULT_PII,
} from "./sentry.constants.js";

export type SentryCaptureContext = {
  requestId?: string;
};

export type SentryCapture = (
  exception: unknown,
  context?: SentryCaptureContext,
) => void;

export type SentryEventLike = {
  request?: {
    headers?: Record<string, unknown>;
    data?: unknown;
  };
  extra?: Record<string, unknown>;
  user?: Record<string, unknown>;
  contexts?: Record<string, unknown>;
  [key: string]: unknown;
};

const SENSITIVE_KEYS = new Set([
  SENSITIVE_HEADER_AUTHORIZATION,
  SENSITIVE_KEY_PASSWORD,
  SENSITIVE_KEY_JWT,
  "token",
  "accesstoken",
]);

const BEARER_PATTERN = /Bearer\s+\S+/i;
const JWT_PATTERN = /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

let sentryEnabled = false;

export function isSentryDsnConfigured(dsn: string | undefined): boolean {
  return (dsn?.trim() ?? "") !== "";
}

export function scrubSentryEvent<T extends SentryEventLike>(event: T): T {
  return redactUnknown(event) as T;
}

export function buildSentryNodeOptions(dsn: string): {
  dsn: string;
  sendDefaultPii: false;
  beforeSend: (event: SentryEventLike) => SentryEventLike;
} {
  return {
    dsn,
    sendDefaultPii: SENTRY_SEND_DEFAULT_PII,
    beforeSend(event) {
      return scrubSentryEvent(event);
    },
  };
}

export function initSentryIfConfigured(
  dsn = process.env[SENTRY_DSN_ENV],
  initFn: (options: ReturnType<typeof buildSentryNodeOptions>) => void = (
    options,
  ) => {
    Sentry.init(options as unknown as Parameters<typeof Sentry.init>[0]);
  },
): boolean {
  if (!isSentryDsnConfigured(dsn)) {
    sentryEnabled = false;
    return false;
  }
  initFn(buildSentryNodeOptions(dsn!.trim()));
  sentryEnabled = true;
  return true;
}

export function captureSentryException(
  exception: unknown,
  context?: SentryCaptureContext,
): void {
  if (!sentryEnabled) {
    return;
  }
  Sentry.withScope((scope) => {
    if (context?.requestId) {
      scope.setTag(SENTRY_REQUEST_ID_TAG, context.requestId);
      scope.setExtra(SENTRY_REQUEST_ID_TAG, context.requestId);
    }
    Sentry.captureException(exception);
  });
}

function redactUnknown(value: unknown): unknown {
  if (typeof value === "string") {
    if (BEARER_PATTERN.test(value) || JWT_PATTERN.test(value)) {
      return SENTRY_REDACTED;
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(redactUnknown);
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(
      value as Record<string, unknown>,
    )) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        out[key] = SENTRY_REDACTED;
      } else {
        out[key] = redactUnknown(nested);
      }
    }
    return out;
  }
  return value;
}

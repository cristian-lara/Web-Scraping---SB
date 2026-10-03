import * as Sentry from "@sentry/react";

export const VITE_SENTRY_DSN_ENV = "VITE_SENTRY_DSN";

export function isFrontendSentryConfigured(
  dsn: string | undefined = import.meta.env.VITE_SENTRY_DSN,
): boolean {
  return (dsn?.trim() ?? "") !== "";
}

export function initFrontendSentry(
  dsn: string | undefined = import.meta.env.VITE_SENTRY_DSN,
): void {
  const trimmed = dsn?.trim() ?? "";
  if (trimmed === "") {
    return;
  }
  Sentry.init({
    dsn: trimmed,
  });
}

export function reportFrontendError(error: unknown): void {
  if (!isFrontendSentryConfigured()) {
    return;
  }
  Sentry.captureException(error);
}

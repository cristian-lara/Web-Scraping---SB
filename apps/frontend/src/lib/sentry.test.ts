import { describe, expect, it } from "vitest";
import { isFrontendSentryConfigured } from "./sentry";

describe("frontend Sentry DSN gate", () => {
  it("does not init when VITE_SENTRY_DSN is empty", () => {
    expect(isFrontendSentryConfigured(undefined)).toBe(false);
    expect(isFrontendSentryConfigured("")).toBe(false);
    expect(isFrontendSentryConfigured("   ")).toBe(false);
  });
});

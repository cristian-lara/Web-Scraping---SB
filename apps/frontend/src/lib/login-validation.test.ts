import { LoginBodySchema } from "@repo/shared-types";
import { describe, expect, it } from "vitest";

describe("LoginBodySchema", () => {
  it("rejects invalid email", () => {
    const result = LoginBodySchema.safeParse({
      email: "not-an-email",
      password: "secret",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = LoginBodySchema.safeParse({
      email: "demo@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid credentials shape", () => {
    const result = LoginBodySchema.safeParse({
      email: "demo@example.com",
      password: "demo-password-change-me",
    });
    expect(result.success).toBe(true);
  });
});

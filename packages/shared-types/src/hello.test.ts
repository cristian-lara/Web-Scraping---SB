import { describe, expect, it } from "vitest";
import { hello } from "../src/hello.js";

describe("hello", () => {
  it("returns a greeting", () => {
    expect(hello("HN")).toBe("Hello, HN!");
  });
});

import { describe, expect, it } from "vitest";
import { SYMBOL_ONLY_TOKEN, countWords } from "./count-words.js";

describe("countWords", () => {
  it("returns 5 for the canonical example", () => {
    expect(countWords("This is - a self-explained example")).toBe(5);
  });

  it("returns 0 for empty or whitespace-only input", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   ")).toBe(0);
    expect(countWords("\t\n")).toBe(0);
  });

  it("trims and collapses consecutive whitespace", () => {
    expect(countWords("  hello   world  ")).toBe(2);
    expect(countWords("one\t\ttwo\nthree")).toBe(3);
  });

  it("excludes isolated symbol-only tokens", () => {
    expect(countWords("a - b & c / d | e")).toBe(5);
    expect(countWords("-")).toBe(0);
    expect(countWords("& / |")).toBe(0);
    expect(countWords("foo ... bar !!!")).toBe(2);
  });

  it("counts compound tokens without spaces as one word", () => {
    expect(countWords("self-explained")).toBe(1);
    expect(countWords("Node.js")).toBe(1);
    expect(countWords("Learn Node.js today")).toBe(3);
    expect(countWords("hello-world")).toBe(1);
    expect(countWords("hello - world")).toBe(2);
  });

  it("counts numeric tokens as words", () => {
    expect(countWords("123")).toBe(1);
    expect(countWords("top 10 tips")).toBe(3);
  });
});

describe("SYMBOL_ONLY_TOKEN", () => {
  it("matches pure symbol tokens", () => {
    expect(SYMBOL_ONLY_TOKEN.test("-")).toBe(true);
    expect(SYMBOL_ONLY_TOKEN.test("&")).toBe(true);
    expect(SYMBOL_ONLY_TOKEN.test("/")).toBe(true);
    expect(SYMBOL_ONLY_TOKEN.test("|")).toBe(true);
    expect(SYMBOL_ONLY_TOKEN.test("...")).toBe(true);
    expect(SYMBOL_ONLY_TOKEN.test("!!!")).toBe(true);
  });

  it("does not match tokens with alphanumeric characters", () => {
    expect(SYMBOL_ONLY_TOKEN.test("self-explained")).toBe(false);
    expect(SYMBOL_ONLY_TOKEN.test("Node.js")).toBe(false);
    expect(SYMBOL_ONLY_TOKEN.test("a")).toBe(false);
    expect(SYMBOL_ONLY_TOKEN.test("123")).toBe(false);
  });
});

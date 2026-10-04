import { defineConfig } from "vitest/config";

/** CORE floors — set after baseline; fail under these. */
const CORE_COVERAGE_FLOORS = {
  lines: 90,
  functions: 90,
  branches: 80,
  statements: 90,
} as const;

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "html", "lcov"],
      include: ["src/count-words.ts", "src/schemas.ts"],
      thresholds: {
        ...CORE_COVERAGE_FLOORS,
      },
    },
  },
});

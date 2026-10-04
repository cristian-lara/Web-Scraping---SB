import path from "node:path";
import { fileURLToPath } from "node:url";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    // Nest DI needs decorator metadata; esbuild alone does not emit it.
    swc.vite({
      module: { type: "es6" },
      jsc: {
        target: "es2022",
        parser: { syntax: "typescript", decorators: true },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@repo/shared-types": path.resolve(
        rootDir,
        "../../packages/shared-types/src/index.ts",
      ),
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
    setupFiles: ["src/test/setup-env.ts"],
    // Nest HTTP tests share one app; avoid cross-file throttle races.
    fileParallelism: false,
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "html", "lcov"],
      include: ["src/scraping/**/*.ts", "src/filtering/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/**/*.http.test.ts"],
      // CORE floors from baseline (~98% stmts); fail under these (not whole-repo).
      thresholds: {
        lines: 90,
        functions: 85,
        branches: 85,
        statements: 90,
      },
    },
  },
});

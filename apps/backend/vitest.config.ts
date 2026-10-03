import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
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
  },
});

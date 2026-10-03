import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_DEMO_USER_EMAIL,
  DEFAULT_JWT_SECRET,
} from "../common/env.constants.js";

process.env.JWT_SECRET ??= DEFAULT_JWT_SECRET;
process.env.DEMO_USER_EMAIL ??= DEFAULT_DEMO_USER_EMAIL;
// DEMO_USER_PASSWORD: no source default — set in test beforeAll / .env

const backendRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
execSync("pnpm exec prisma migrate deploy", {
  cwd: backendRoot,
  stdio: "inherit",
});

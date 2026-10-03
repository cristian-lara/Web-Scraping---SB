import bcrypt from "bcrypt";
import {
  BCRYPT_SALT_ROUNDS,
  DEFAULT_DEMO_USER_EMAIL,
  DEFAULT_DEMO_USER_ID,
} from "../common/env.constants.js";

export type DemoUserRecord = {
  id: string;
  email: string;
  passwordHash: string;
};

/**
 * In-memory demo user (YAGNI: no User table). JWT `sub` binds UsageLog.userId.
 * Idempotent: hashing runs once per process.
 */
let cached: DemoUserRecord | null = null;

export async function bootstrapDemoUser(): Promise<DemoUserRecord> {
  if (cached !== null) {
    return cached;
  }

  const email = process.env.DEMO_USER_EMAIL ?? DEFAULT_DEMO_USER_EMAIL;
  const password = process.env.DEMO_USER_PASSWORD;
  if (!password) {
    throw new Error(
      "DEMO_USER_PASSWORD is required (see apps/backend/.env.example)",
    );
  }
  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  cached = {
    id: DEFAULT_DEMO_USER_ID,
    email,
    passwordHash,
  };
  return cached;
}

/** Test helper: drop cache so the next bootstrap re-reads env. */
export function resetDemoUserStore(): void {
  cached = null;
}

export function getDemoUserOrThrow(): DemoUserRecord {
  if (cached === null) {
    throw new Error("Demo user not bootstrapped");
  }
  return cached;
}

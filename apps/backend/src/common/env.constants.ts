/** Defaults for local demos; override via env / .env.example. */
export const DEFAULT_PORT = 3000;
export const DEFAULT_JWT_SECRET = "dev-only-change-me";
export const DEFAULT_DEMO_USER_EMAIL = "demo@example.com";
export const DEFAULT_DEMO_USER_ID = "demo-user-1";
export const DEFAULT_THROTTLE_TTL_MS = 60_000;
export const DEFAULT_THROTTLE_LIMIT = 100;
export const DEFAULT_HN_LIST_URL = "https://news.ycombinator.com/";
export const BCRYPT_SALT_ROUNDS = 10;

/** Read at call time so Nest factories see post-dotenv values. */
export function resolveJwtSecret(): string {
  return process.env.JWT_SECRET ?? DEFAULT_JWT_SECRET;
}

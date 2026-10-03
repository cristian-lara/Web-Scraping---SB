import "reflect-metadata";
import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FILTER_MORE_THAN_5_WORDS_COMMENTS } from "@repo/shared-types";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import {
  DEFAULT_DEMO_USER_EMAIL,
} from "../common/env.constants.js";
import {
  FILTERS_ROUTE_PREFIX,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_OK,
  HTTP_STATUS_UNAUTHORIZED,
} from "../common/http.constants.js";
import { createApp } from "../bootstrap.js";
import { resetDemoUserStore } from "./demo-user.store.js";

/** Matches apps/backend/.env.example — set in beforeAll, not as a source default. */
const TEST_DEMO_USER_PASSWORD = "demo-password-change-me";
const TEST_CORS_ORIGIN = "http://localhost:5173";
const PROTECTED_FILTER_PATH = `/${FILTERS_ROUTE_PREFIX}`;

async function bootApp(): Promise<INestApplication> {
  resetDemoUserStore();
  const app = await createApp();
  await app.init();
  return app;
}

describe("Auth + hardening HTTP (Nest)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.DEMO_USER_PASSWORD = TEST_DEMO_USER_PASSWORD;
    process.env.THROTTLE_TTL_MS = "60000";
    process.env.THROTTLE_LIMIT = "100";
    app = await bootApp();
  });

  afterAll(async () => {
    await app.close();
    resetDemoUserStore();
  });

  it("HP-AUTH: valid demo credentials return JWT without password hash", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: DEFAULT_DEMO_USER_EMAIL,
        password: TEST_DEMO_USER_PASSWORD,
      })
      .expect(HTTP_STATUS_OK);

    expect(res.body.access_token).toEqual(expect.any(String));
    expect(res.body.access_token.length).toBeGreaterThan(10);
    expect(JSON.stringify(res.body)).not.toMatch(/\$2[aby]\$/);
    expect(res.body).not.toHaveProperty("password");
    expect(res.body).not.toHaveProperty("passwordHash");
    expect(res.body).not.toHaveProperty("stack");
  });

  it("EC-401: protected route without token returns 401", async () => {
    await request(app.getHttpServer())
      .get(PROTECTED_FILTER_PATH)
      .query({ filter: FILTER_MORE_THAN_5_WORDS_COMMENTS })
      .expect(HTTP_STATUS_UNAUTHORIZED);
  });

  it("EC-401: protected route with invalid token returns 401", async () => {
    await request(app.getHttpServer())
      .get(PROTECTED_FILTER_PATH)
      .query({ filter: FILTER_MORE_THAN_5_WORDS_COMMENTS })
      .set("Authorization", "Bearer not-a-valid-jwt")
      .expect(HTTP_STATUS_UNAUTHORIZED);
  });

  it("EC-401: protected route with expired token returns 401", async () => {
    const jwt = app.get(JwtService);
    const expired = await jwt.signAsync(
      { sub: "demo-user-1", email: DEFAULT_DEMO_USER_EMAIL },
      { expiresIn: -1 },
    );

    await request(app.getHttpServer())
      .get(PROTECTED_FILTER_PATH)
      .query({ filter: FILTER_MORE_THAN_5_WORDS_COMMENTS })
      .set("Authorization", `Bearer ${expired}`)
      .expect(HTTP_STATUS_UNAUTHORIZED);
  });

  it("hardening: Helmet x-frame-options and CORS allow-origin", async () => {
    const res = await request(app.getHttpServer())
      .get(PROTECTED_FILTER_PATH)
      .query({ filter: FILTER_MORE_THAN_5_WORDS_COMMENTS })
      .set("Origin", TEST_CORS_ORIGIN)
      .expect(HTTP_STATUS_UNAUTHORIZED);

    expect(res.headers["x-frame-options"]).toMatch(/SAMEORIGIN/i);
    // Nest enableCors() default allows all origins as "*".
    expect(res.headers["access-control-allow-origin"]).toBeTruthy();
  });

  it("EC-400: invalid login body returns 400 not 500", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "not-an-email" })
      .expect(HTTP_STATUS_BAD_REQUEST);

    expect(res.status).not.toBe(500);
    expect(res.body).not.toHaveProperty("stack");
  });
});

describe("Throttle EC-429 (low limit app)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.DEMO_USER_PASSWORD = TEST_DEMO_USER_PASSWORD;
    process.env.THROTTLE_TTL_MS = "60000";
    process.env.THROTTLE_LIMIT = "3";
    app = await bootApp();
  });

  afterAll(async () => {
    await app.close();
    resetDemoUserStore();
    process.env.THROTTLE_LIMIT = "100";
  });

  it("returns 429 when client exceeds throttle", async () => {
    let saw429 = false;
    for (let i = 0; i < 8; i += 1) {
      const res = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email: DEFAULT_DEMO_USER_EMAIL,
          password: TEST_DEMO_USER_PASSWORD,
        });
      if (res.status === 429) {
        saw429 = true;
        break;
      }
    }
    expect(saw429).toBe(true);
  });
});

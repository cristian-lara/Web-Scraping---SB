import "reflect-metadata";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import {
  FILTER_MORE_THAN_5_WORDS_COMMENTS,
  type Entry,
} from "@repo/shared-types";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { AppModule } from "../app.module.js";
import { bootstrapDemoUser, resetDemoUserStore } from "../auth/demo-user.store.js";
import { configureApp } from "../bootstrap.js";
import {
  DEFAULT_DEMO_USER_EMAIL,
} from "../common/env.constants.js";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_OK,
  HTTP_STATUS_UNAUTHORIZED,
  SAVED_RESULTS_ROUTE_PREFIX,
} from "../common/http.constants.js";
import { ScrapingService } from "../scraping/scraping.service.js";

const TEST_DEMO_USER_PASSWORD = "demo-password-change-me";
const SAVED_PATH = `/${SAVED_RESULTS_ROUTE_PREFIX}`;

const ENTRY: Entry = {
  rank: 1,
  title: "one two three four five six",
  points: 10,
  comments: 3,
};

async function bootApp(): Promise<INestApplication> {
  resetDemoUserStore();
  await bootstrapDemoUser();

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(ScrapingService)
    .useValue({
      scrapeLive: async () => [ENTRY],
      scrapeFromHtml: () => [ENTRY],
    })
    .compile();

  const app = moduleRef.createNestApplication();
  configureApp(app);
  await app.init();
  return app;
}

async function loginToken(app: INestApplication): Promise<string> {
  const res = await request(app.getHttpServer())
    .post("/auth/login")
    .send({
      email: DEFAULT_DEMO_USER_EMAIL,
      password: TEST_DEMO_USER_PASSWORD,
    })
    .expect(HTTP_STATUS_OK);
  return res.body.access_token as string;
}

describe("Saved filter results HTTP (offline)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await bootApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("returns 401 without JWT on save", async () => {
    await request(app.getHttpServer())
      .post(SAVED_PATH)
      .send({
        filter_applied: FILTER_MORE_THAN_5_WORDS_COMMENTS,
        entries: [ENTRY],
      })
      .expect(HTTP_STATUS_UNAUTHORIZED);
  });

  it("returns 400 for invalid save body", async () => {
    const token = await loginToken(app);
    await request(app.getHttpServer())
      .post(SAVED_PATH)
      .set("Authorization", `Bearer ${token}`)
      .send({
        filter_applied: FILTER_MORE_THAN_5_WORDS_COMMENTS,
        entries: [{ rank: 1, points: 0, comments: 0 }],
      })
      .expect(HTTP_STATUS_BAD_REQUEST);
  });

  it("saves and lists for authenticated user", async () => {
    const token = await loginToken(app);
    const created = await request(app.getHttpServer())
      .post(SAVED_PATH)
      .set("Authorization", `Bearer ${token}`)
      .send({
        filter_applied: FILTER_MORE_THAN_5_WORDS_COMMENTS,
        entries: [ENTRY],
        label: "http-test",
      })
      .expect((res) => {
        expect([200, 201]).toContain(res.status);
      });

    expect(created.body.id).toBeTruthy();
    expect(created.body.entryCount).toBe(1);
    expect(created.body.label).toBe("http-test");

    const listed = await request(app.getHttpServer())
      .get(SAVED_PATH)
      .set("Authorization", `Bearer ${token}`)
      .expect(HTTP_STATUS_OK);

    expect(Array.isArray(listed.body)).toBe(true);
    expect(
      listed.body.some((row: { id: string }) => row.id === created.body.id),
    ).toBe(true);
  });
});

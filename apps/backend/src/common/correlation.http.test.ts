import "reflect-metadata";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { FILTER_MORE_THAN_5_WORDS_COMMENTS, type Entry } from "@repo/shared-types";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { PrismaUsageRepository } from "../analytics/prisma-usage.repository.js";
import { AppModule } from "../app.module.js";
import { bootstrapDemoUser, resetDemoUserStore } from "../auth/demo-user.store.js";
import { configureApp } from "../bootstrap.js";
import {
  DEFAULT_DEMO_USER_EMAIL,
  DEFAULT_DEMO_USER_ID,
} from "./env.constants.js";
import {
  FILTERS_ROUTE_PREFIX,
  HTTP_STATUS_OK,
  LOG_STAGE_AUTH,
  LOG_STAGE_FILTER,
  LOG_STAGE_PERSIST,
  LOG_STAGE_SCRAPE,
  REQUEST_ID_HEADER,
} from "./http.constants.js";
import {
  resetStructuredLogWriter,
  setStructuredLogWriter,
  type StructuredLogRecord,
} from "./structured-logger.js";
import { ScrapingService } from "../scraping/scraping.service.js";

const TEST_DEMO_USER_PASSWORD = "demo-password-change-me";
const FILTERS_PATH = `/${FILTERS_ROUTE_PREFIX}`;
const INBOUND_REQUEST_ID = "client-correlation-id-001";

const MOCK_SCRAPE_ENTRIES: Entry[] = [
  {
    rank: 1,
    title: "one two three four five six",
    points: 10,
    comments: 20,
  },
];

async function bootWithMockScraper(): Promise<INestApplication> {
  resetDemoUserStore();
  await bootstrapDemoUser();

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(ScrapingService)
    .useValue({
      scrapeLive: async () => MOCK_SCRAPE_ENTRIES,
      scrapeFromHtml: () => MOCK_SCRAPE_ENTRIES,
    })
    .compile();

  const app = moduleRef.createNestApplication();
  configureApp(app);
  await app.init();
  return app;
}

describe("Correlation + structured logs (offline)", () => {
  let app: INestApplication;
  let records: StructuredLogRecord[];

  beforeAll(async () => {
    process.env.DEMO_USER_PASSWORD = TEST_DEMO_USER_PASSWORD;
    process.env.THROTTLE_TTL_MS = "60000";
    process.env.THROTTLE_LIMIT = "100";
    app = await bootWithMockScraper();
  });

  beforeEach(() => {
    records = [];
    setStructuredLogWriter((record) => {
      records.push(record);
    });
  });

  afterEach(() => {
    resetStructuredLogWriter();
  });

  afterAll(async () => {
    resetStructuredLogWriter();
    await app.close();
    resetDemoUserStore();
  });

  async function loginToken(): Promise<string> {
    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: DEFAULT_DEMO_USER_EMAIL,
        password: TEST_DEMO_USER_PASSWORD,
      })
      .expect(HTTP_STATUS_OK);
    return res.body.access_token as string;
  }

  it("HP-CORR: generates x-request-id and shares it across pipeline stages", async () => {
    const token = await loginToken();
    records = [];

    const res = await request(app.getHttpServer())
      .get(FILTERS_PATH)
      .query({ filter: FILTER_MORE_THAN_5_WORDS_COMMENTS })
      .set("Authorization", `Bearer ${token}`)
      .expect(HTTP_STATUS_OK);

    const requestId = res.headers[REQUEST_ID_HEADER] as string;
    expect(requestId).toBeTruthy();
    expect(typeof requestId).toBe("string");

    const stages = records.map((r) => r.stage);
    expect(stages).toContain(LOG_STAGE_AUTH);
    expect(stages).toContain(LOG_STAGE_SCRAPE);
    expect(stages).toContain(LOG_STAGE_FILTER);
    expect(stages).toContain(LOG_STAGE_PERSIST);
    for (const record of records) {
      expect(record.requestId).toBe(requestId);
      expect(record.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      const blob = JSON.stringify(record);
      expect(blob.toLowerCase()).not.toContain("password");
      expect(blob).not.toContain(token);
      expect(blob.toLowerCase()).not.toContain("dsn");
    }

    const usage = await app.get(PrismaUsageRepository).findLatestByUserId(
      DEFAULT_DEMO_USER_ID,
    );
    expect(usage?.id).toBeTruthy();
    expect(usage?.id).not.toBe(requestId);
    expect(usage?.requestId).toBe(requestId);
    expect(typeof usage?.scrape_duration_ms).toBe("number");
  });

  it("HP-CORR-IN: echoes inbound x-request-id", async () => {
    const token = await loginToken();
    records = [];

    const res = await request(app.getHttpServer())
      .get(FILTERS_PATH)
      .query({ filter: FILTER_MORE_THAN_5_WORDS_COMMENTS })
      .set("Authorization", `Bearer ${token}`)
      .set(REQUEST_ID_HEADER, INBOUND_REQUEST_ID)
      .expect(HTTP_STATUS_OK);

    expect(res.headers[REQUEST_ID_HEADER]).toBe(INBOUND_REQUEST_ID);
    expect(records.length).toBeGreaterThan(0);
    for (const record of records) {
      expect(record.requestId).toBe(INBOUND_REQUEST_ID);
    }
  });
});

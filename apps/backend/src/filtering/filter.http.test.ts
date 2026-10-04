import "reflect-metadata";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import {
  FILTER_LESS_OR_EQUAL_5_WORDS_POINTS,
  FILTER_MORE_THAN_5_WORDS_COMMENTS,
  FILTER_WORD_THRESHOLD,
  countWords,
  type Entry,
} from "@repo/shared-types";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { PrismaUsageRepository } from "../analytics/prisma-usage.repository.js";
import { AppModule } from "../app.module.js";
import { bootstrapDemoUser, resetDemoUserStore } from "../auth/demo-user.store.js";
import { configureApp } from "../bootstrap.js";
import {
  DEFAULT_DEMO_USER_EMAIL,
  DEFAULT_DEMO_USER_ID,
} from "../common/env.constants.js";
import {
  FILTERS_ROUTE_PREFIX,
  HTTP_STATUS_BAD_GATEWAY,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_OK,
  HTTP_STATUS_UNAUTHORIZED,
  SWAGGER_PATH,
} from "../common/http.constants.js";
import { HN_HTML_FETCHER } from "../scraping/hn-html.fetcher.js";
import { HN_SCRAPE_FAILED_CODE } from "../scraping/hn-scrape.exception.js";
import { ScrapingService } from "../scraping/scraping.service.js";

const TEST_DEMO_USER_PASSWORD = "demo-password-change-me";
const FILTERS_PATH = `/${FILTERS_ROUTE_PREFIX}`;
const OPENAPI_JSON_PATH = `/${SWAGGER_PATH}-json`;

/**
 * Mixed titles so Filter A keeps > FILTER_WORD_THRESHOLD and Filter B keeps
 * <= threshold (offline, no HN). Ranks 2 and 4 share points for Filter B tie-break.
 */
const MOCK_SCRAPE_ENTRIES: Entry[] = [
  {
    rank: 1,
    title: "one two three four five six",
    points: 10,
    comments: 20,
  },
  {
    rank: 2,
    title: "short title",
    points: 100,
    comments: 5,
  },
  {
    rank: 3,
    title: "alpha beta gamma delta epsilon zeta",
    points: 50,
    comments: 40,
  },
  {
    rank: 4,
    title: "brief",
    points: 100,
    comments: 1,
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

async function bootWithFailingFetcher(): Promise<INestApplication> {
  resetDemoUserStore();
  await bootstrapDemoUser();

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(HN_HTML_FETCHER)
    .useValue({
      fetchHtml: async () => {
        throw new Error("simulated network failure");
      },
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

describe("Filter HTTP (fixture scraper, offline)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.DEMO_USER_PASSWORD = TEST_DEMO_USER_PASSWORD;
    process.env.THROTTLE_TTL_MS = "60000";
    process.env.THROTTLE_LIMIT = "100";
    app = await bootWithMockScraper();
  });

  afterAll(async () => {
    await app.close();
    resetDemoUserStore();
  });

  it("happy path: JWT + Filter A returns filtered mock-scraper entries", async () => {
    const token = await loginToken(app);

    const res = await request(app.getHttpServer())
      .get(FILTERS_PATH)
      .query({ filter: FILTER_MORE_THAN_5_WORDS_COMMENTS })
      .set("Authorization", `Bearer ${token}`)
      .expect(HTTP_STATUS_OK);

    const entries = res.body as Entry[];
    expect(Array.isArray(entries)).toBe(true);
    expect(entries).toHaveLength(2);
    expect(entries.map((e) => e.rank)).toEqual([3, 1]);
    for (const entry of entries) {
      expect(countWords(entry.title)).toBeGreaterThan(FILTER_WORD_THRESHOLD);
    }

    const usage = await app.get(PrismaUsageRepository).findLatestByUserId(
      DEFAULT_DEMO_USER_ID,
    );
    expect(usage).toBeTruthy();
    expect(usage?.filter_applied).toBe(FILTER_MORE_THAN_5_WORDS_COMMENTS);
    expect(usage?.userId).toBe(DEFAULT_DEMO_USER_ID);
    expect(usage?.processed_items).toBe(MOCK_SCRAPE_ENTRIES.length);
    expect(usage?.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("happy path: JWT + Filter B returns filtered mock-scraper entries", async () => {
    const token = await loginToken(app);

    const res = await request(app.getHttpServer())
      .get(FILTERS_PATH)
      .query({ filter: FILTER_LESS_OR_EQUAL_5_WORDS_POINTS })
      .set("Authorization", `Bearer ${token}`)
      .expect(HTTP_STATUS_OK);

    const entries = res.body as Entry[];
    expect(Array.isArray(entries)).toBe(true);
    expect(entries.length).toBeGreaterThan(0);
    expect(entries.map((e) => e.rank)).toEqual([2, 4]);
    for (const entry of entries) {
      expect(countWords(entry.title)).toBeLessThanOrEqual(FILTER_WORD_THRESHOLD);
    }
    expect(entries[0].points).toBe(entries[1].points);
    expect(entries[0].rank).toBeLessThan(entries[1].rank);

    const usage = await app.get(PrismaUsageRepository).findLatestByUserId(
      DEFAULT_DEMO_USER_ID,
    );
    expect(usage).toBeTruthy();
    expect(usage?.filter_applied).toBe(FILTER_LESS_OR_EQUAL_5_WORDS_POINTS);
    expect(usage?.userId).toBe(DEFAULT_DEMO_USER_ID);
    expect(usage?.processed_items).toBe(MOCK_SCRAPE_ENTRIES.length);
    expect(usage?.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("EC-400: invalid filter query rejected before service", async () => {
    const token = await loginToken(app);

    const res = await request(app.getHttpServer())
      .get(FILTERS_PATH)
      .query({ filter: "NOT_A_FILTER" })
      .set("Authorization", `Bearer ${token}`)
      .expect(HTTP_STATUS_BAD_REQUEST);

    expect(res.status).not.toBe(500);
    expect(JSON.stringify(res.body)).not.toMatch(/at\s+\S+\s+\(/);
    expect(res.body).not.toHaveProperty("stack");
  });

  it("HP-SWAG: OpenAPI documents auth + filter shapes", async () => {
    const res = await request(app.getHttpServer())
      .get(OPENAPI_JSON_PATH)
      .expect(HTTP_STATUS_OK);

    const paths = res.body.paths as Record<string, unknown>;
    expect(paths["/auth/login"]).toBeTruthy();
    expect(paths[FILTERS_PATH]).toBeTruthy();

    const filterGet = (
      paths[FILTERS_PATH] as { get: { parameters?: unknown[]; responses: object } }
    ).get;
    expect(filterGet.parameters?.length).toBeGreaterThan(0);
    expect(filterGet.responses).toHaveProperty("200");

    const loginPost = (
      paths["/auth/login"] as { post: { requestBody?: unknown; responses: object } }
    ).post;
    expect(loginPost.requestBody).toBeTruthy();
    expect(loginPost.responses).toHaveProperty("200");
  });

  it("EC-THIN: controllers only DTO → service → status (source)", () => {
    const root = dirname(fileURLToPath(import.meta.url));
    const authSrc = readFileSync(join(root, "../auth/auth.controller.ts"), "utf8");
    const filterSrc = readFileSync(join(root, "./filter.controller.ts"), "utf8");
    const forbidden =
      /bcrypt|cheerio|prisma|applyFilter|scrapeFromHtml|scrapeLive|countWords|passwordHash/i;

    expect(authSrc).not.toMatch(forbidden);
    expect(filterSrc).not.toMatch(forbidden);
    expect(authSrc).toContain("authService");
    expect(filterSrc).toContain("filterService");
  });
});

describe("Filter HTTP scrape failure (EC-NOSTACK)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.DEMO_USER_PASSWORD = TEST_DEMO_USER_PASSWORD;
    process.env.THROTTLE_TTL_MS = "60000";
    process.env.THROTTLE_LIMIT = "100";
    app = await bootWithFailingFetcher();
  });

  afterAll(async () => {
    await app.close();
    resetDemoUserStore();
  });

  it("maps typed scrape failure without stack in JSON body", async () => {
    const token = await loginToken(app);

    const res = await request(app.getHttpServer())
      .get(FILTERS_PATH)
      .query({ filter: FILTER_MORE_THAN_5_WORDS_COMMENTS })
      .set("Authorization", `Bearer ${token}`)
      .expect(HTTP_STATUS_BAD_GATEWAY);

    expect(res.body.statusCode).toBe(HTTP_STATUS_BAD_GATEWAY);
    expect(res.body.code).toBe(HN_SCRAPE_FAILED_CODE);
    expect(res.body).not.toHaveProperty("stack");
    expect(res.body).not.toHaveProperty("stackTrace");
    expect(JSON.stringify(res.body)).not.toMatch(/simulated network failure/);
    expect(JSON.stringify(res.body)).not.toMatch(/at\s+\S+\s+\(/);
  });

  it("EC-401 still applies before scrape", async () => {
    await request(app.getHttpServer())
      .get(FILTERS_PATH)
      .query({ filter: FILTER_MORE_THAN_5_WORDS_COMMENTS })
      .expect(HTTP_STATUS_UNAUTHORIZED);
  });
});

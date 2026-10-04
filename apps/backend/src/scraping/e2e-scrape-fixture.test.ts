import "reflect-metadata";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import { Test } from "@nestjs/testing";
import { E2E_SCRAPE_FIXTURE_ENV } from "../common/env.constants.js";
import { HN_TOP_ENTRY_LIMIT } from "./cheerio-scraper.adapter.js";
import { HN_HTML_FETCHER } from "./hn-html.fetcher.js";
import { PoliteHnHtmlFetcher } from "./polite-hn-html.fetcher.js";
import { ScrapingModule } from "./scraping.module.js";
import { ScrapingService } from "./scraping.service.js";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("E2E_SCRAPE_FIXTURE scrape path", () => {
  beforeEach(() => {
    vi.mocked(axios.get).mockReset();
    delete process.env[E2E_SCRAPE_FIXTURE_ENV];
  });

  afterEach(() => {
    delete process.env[E2E_SCRAPE_FIXTURE_ENV];
  });

  it("with E2E_SCRAPE_FIXTURE=1 scrapeLive uses fixture and does not call Axios", async () => {
    process.env[E2E_SCRAPE_FIXTURE_ENV] = "1";
    vi.mocked(axios.get).mockResolvedValue({ data: "<html>should-not-use</html>" });

    const moduleRef = await Test.createTestingModule({
      imports: [ScrapingModule],
    }).compile();

    const scraping = moduleRef.get(ScrapingService);
    const entries = await scraping.scrapeLive();

    expect(entries).toHaveLength(HN_TOP_ENTRY_LIMIT);
    expect(entries[0]?.title).toBe("Sample story 1");
    expect(axios.get).not.toHaveBeenCalled();

    await moduleRef.close();
  });

  it("without E2E_SCRAPE_FIXTURE scrapeLive still uses Axios fetcher", async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: `
        <table>
          <tr class="athing"><td class="title"><span class="rank">1.</span></td>
            <td class="title"><span class="titleline"><a href="#">Only live</a></span></td></tr>
          <tr><td class="subtext"><span class="score">1 point</span>
            <a href="item">1&nbsp;comment</a></td></tr>
        </table>`,
    });

    const moduleRef = await Test.createTestingModule({
      imports: [ScrapingModule],
    }).compile();

    const scraping = moduleRef.get(ScrapingService);
    const fetcher = moduleRef.get(HN_HTML_FETCHER);
    const entries = await scraping.scrapeLive();

    expect(fetcher).toBeInstanceOf(PoliteHnHtmlFetcher);
    expect(axios.get).toHaveBeenCalledOnce();
    expect(entries).toHaveLength(1);
    expect(entries[0]?.title).toBe("Only live");

    await moduleRef.close();
  });
});

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { EntrySchema } from "@repo/shared-types";
import {
  CheerioScraperAdapter,
  HN_TOP_ENTRY_LIMIT,
} from "./cheerio-scraper.adapter.js";

const FIXTURE_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../test/fixtures/hn_sample.html",
);

describe("CheerioScraperAdapter", () => {
  it("loads the fixture from disk without network", () => {
    const html = readFileSync(FIXTURE_PATH, "utf8");
    expect(html.length).toBeGreaterThan(0);
    expect(html).toContain("athing");
  });

  it("returns exactly HN_TOP_ENTRY_LIMIT EntrySchema-validated entries", () => {
    const html = readFileSync(FIXTURE_PATH, "utf8");
    const adapter = new CheerioScraperAdapter();
    const entries = adapter.scrapeFromHtml(html);

    expect(entries).toHaveLength(HN_TOP_ENTRY_LIMIT);
    for (const entry of entries) {
      expect(() => EntrySchema.parse(entry)).not.toThrow();
      expect(entry.rank).toEqual(expect.any(Number));
      expect(entry.title).toEqual(expect.any(String));
      expect(entry.points).toEqual(expect.any(Number));
      expect(entry.comments).toEqual(expect.any(Number));
    }
  });

  it("defaults missing points and comments to 0", () => {
    const html = readFileSync(FIXTURE_PATH, "utf8");
    const adapter = new CheerioScraperAdapter();
    const entries = adapter.scrapeFromHtml(html);

    const askStyle = entries.find((e) => e.rank === 5);
    expect(askStyle).toBeDefined();
    expect(askStyle?.points).toBe(0);
    expect(askStyle?.comments).toBe(0);

    const jobStyle = entries.find((e) => e.rank === 10);
    expect(jobStyle?.points).toBe(0);
    expect(jobStyle?.comments).toBe(0);
  });

  it("maps title and rank from the first rows", () => {
    const html = readFileSync(FIXTURE_PATH, "utf8");
    const adapter = new CheerioScraperAdapter();
    const [first] = adapter.scrapeFromHtml(html);

    expect(first.rank).toBe(1);
    expect(first.title).toBe("Sample story 1");
    expect(first.points).toBe(3);
    expect(first.comments).toBe(2);
  });

  it("skips rows with invalid rank or empty title", () => {
    const html = `
      <table>
        <tr class="athing"><td class="title"><span class="rank">x.</span></td>
          <td class="title"><span class="titleline"><a href="#">Bad</a></span></td></tr>
        <tr><td class="subtext"><span class="score">1 point</span></td></tr>
        <tr class="athing"><td class="title"><span class="rank">1.</span></td>
          <td class="title"><span class="titleline"><a href="#"></a></span></td></tr>
        <tr><td class="subtext"><span class="score">2 points</span></td></tr>
        <tr class="athing"><td class="title"><span class="rank">2.</span></td>
          <td class="title"><span class="titleline"><a href="#">Ok</a></span></td></tr>
        <tr><td class="subtext"><span class="score">3 points</span>
          <a href="item">1&nbsp;comment</a></td></tr>
      </table>`;
    const entries = new CheerioScraperAdapter().scrapeFromHtml(html);
    expect(entries).toHaveLength(1);
    expect(entries[0].title).toBe("Ok");
    expect(entries[0].comments).toBe(1);
  });
});

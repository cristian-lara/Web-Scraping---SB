import * as cheerio from "cheerio";
import { EntrySchema, type Entry } from "@repo/shared-types";
import type { HnScraperPort } from "./hn-scraper.port.js";

/** Intake §2.1 — extract exactly the first 30 HN entries. */
export const HN_TOP_ENTRY_LIMIT = 30;

/** Defensive default when points/comments are missing (Ask HN / jobs). */
export const HN_MISSING_METRIC_DEFAULT = 0;

const POINTS_PATTERN = /(\d+)\s*points?/i;
const COMMENTS_PATTERN = /(\d+)\s*comments?/i;

/**
 * Offline Cheerio adapter: pairs each `tr.athing` with the following subtext row.
 *
 * ponytail:debt hn-live-row-pairing — When live HN HTML / UI-facing fetch lands,
 * prefer pairing by story id / `#score_<id>` (spacers and DOM drift). Fixture
 * tests stay on adjacent-row pairing.
 */
export class CheerioScraperAdapter implements HnScraperPort {
  scrapeFromHtml(html: string): Entry[] {
    const $ = cheerio.load(html);
    const rows = $("tr.athing").toArray();
    const entries: Entry[] = [];

    for (const element of rows) {
      if (entries.length >= HN_TOP_ENTRY_LIMIT) {
        break;
      }

      const entry = this.mapRow($, element);
      if (entry !== null) {
        entries.push(entry);
      }
    }

    return entries;
  }

  private mapRow(
    $: cheerio.CheerioAPI,
    element: cheerio.Element,
  ): Entry | null {
    const $row = $(element);
    const rankText = $row.find("span.rank").first().text().trim();
    const rank = Number.parseInt(rankText.replace(/\D/g, ""), 10);
    const title = $row.find("span.titleline a").first().text().trim();

    if (!Number.isFinite(rank) || title.length === 0) {
      return null;
    }

    const $subtext = $row.nextAll("tr").has("td.subtext").first().find("td.subtext");
    const scoreText = $subtext.find("span.score").first().text().trim();
    const pointsMatch = scoreText.match(POINTS_PATTERN);
    const points = pointsMatch
      ? Number.parseInt(pointsMatch[1], 10)
      : HN_MISSING_METRIC_DEFAULT;

    const commentsLinkText = $subtext
      .find("a")
      .filter((_, el) => COMMENTS_PATTERN.test($(el).text()))
      .first()
      .text()
      .replace(/\u00a0/g, " ")
      .trim();
    const commentsMatch = commentsLinkText.match(COMMENTS_PATTERN);
    const comments = commentsMatch
      ? Number.parseInt(commentsMatch[1], 10)
      : HN_MISSING_METRIC_DEFAULT;

    return EntrySchema.parse({
      rank,
      title,
      points,
      comments,
    });
  }
}

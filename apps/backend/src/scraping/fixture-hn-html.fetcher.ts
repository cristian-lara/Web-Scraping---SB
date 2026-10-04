import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Injectable } from "@nestjs/common";
import type { HnHtmlFetcher } from "./hn-html.fetcher.js";

/** Offline HN list HTML for CI/Bruno non-vacuous Filter A/B evidence. */
export const HN_SAMPLE_FIXTURE_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../test/fixtures/hn_sample.html",
);

@Injectable()
export class FixtureHnHtmlFetcher implements HnHtmlFetcher {
  async fetchHtml(): Promise<string> {
    return readFileSync(HN_SAMPLE_FIXTURE_PATH, "utf8");
  }
}

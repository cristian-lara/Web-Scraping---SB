import { DomainException } from "../common/domain.exception.js";
import { HTTP_STATUS_BAD_GATEWAY } from "../common/http.constants.js";

export const HN_SCRAPE_FAILED_CODE = "HN_SCRAPE_FAILED";
export const HN_SCRAPE_FAILED_MESSAGE =
  "Failed to fetch or parse Hacker News";

/** Thrown when live/fixture HTML fetch or parse fails before filtering. */
export class HnScrapeFailedException extends DomainException {
  constructor(message = HN_SCRAPE_FAILED_MESSAGE) {
    super(message, HN_SCRAPE_FAILED_CODE, HTTP_STATUS_BAD_GATEWAY);
    this.name = "HnScrapeFailedException";
  }
}

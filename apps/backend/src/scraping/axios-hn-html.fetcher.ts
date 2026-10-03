import { Injectable } from "@nestjs/common";
import axios from "axios";
import { DEFAULT_HN_LIST_URL } from "../common/env.constants.js";
import type { HnHtmlFetcher } from "./hn-html.fetcher.js";

/** Runtime live HN HTML via Axios; unit tests must not use this path. */
@Injectable()
export class AxiosHnHtmlFetcher implements HnHtmlFetcher {
  async fetchHtml(): Promise<string> {
    const url = process.env.HN_LIST_URL ?? DEFAULT_HN_LIST_URL;
    const response = await axios.get<string>(url, {
      responseType: "text",
      timeout: 15_000,
      headers: {
        "User-Agent": "web-scraping-sb-mvp/0.0.1",
        Accept: "text/html",
      },
    });
    return response.data;
  }
}

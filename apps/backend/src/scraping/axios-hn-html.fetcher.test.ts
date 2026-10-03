import { afterEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import { AxiosHnHtmlFetcher } from "./axios-hn-html.fetcher.js";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("AxiosHnHtmlFetcher", () => {
  afterEach(() => {
    vi.mocked(axios.get).mockReset();
    delete process.env.HN_LIST_URL;
  });

  it("fetches HTML via axios.get (mocked; no network)", async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: "<html>hn</html>" });
    const fetcher = new AxiosHnHtmlFetcher();
    const html = await fetcher.fetchHtml();

    expect(html).toBe("<html>hn</html>");
    expect(axios.get).toHaveBeenCalledOnce();
    const [url] = vi.mocked(axios.get).mock.calls[0];
    expect(url).toContain("news.ycombinator.com");
  });
});

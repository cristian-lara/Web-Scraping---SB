/** Port: supply HN list HTML (live Axios or injected string for tests). */
export const HN_HTML_FETCHER = Symbol("HN_HTML_FETCHER");

export interface HnHtmlFetcher {
  fetchHtml(): Promise<string>;
}

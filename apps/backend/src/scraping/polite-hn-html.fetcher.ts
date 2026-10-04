import { trace } from "@opentelemetry/api";
import axios from "axios";
import {
  DEFAULT_HN_LIST_URL,
  HN_FETCH_MAX_LIVE_RETRIES,
  resolveHnFetchCacheTtlMs,
  resolveHnFetchMinIntervalMs,
} from "../common/env.constants.js";
import {
  ATTR_HN_FETCH_OUTCOME,
  ATTR_HN_FETCH_WAIT_MS,
  HN_FETCH_OUTCOME_CACHE,
  HN_FETCH_OUTCOME_LIVE,
  HN_FETCH_OUTCOME_RETRY,
} from "../common/otel.constants.js";
import { logStage } from "../common/structured-logger.js";
import {
  HN_FETCH_STAGE_CACHE_HIT,
  HN_FETCH_STAGE_LIVE,
  HN_FETCH_STAGE_RETRY,
} from "./hn-fetch.constants.js";
import type { HnHtmlFetcher } from "./hn-html.fetcher.js";

export type PoliteHnFetchDeps = {
  cacheTtlMs?: number;
  minIntervalMs?: number;
  maxRetries?: number;
  now?: () => number;
  sleep?: (ms: number) => Promise<void>;
  listUrl?: () => string;
};

type CachedHtml = {
  html: string;
  storedAt: number;
};

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isRetryableHnFetchError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }
  const status = error.response?.status;
  if (status !== undefined) {
    return status >= 500;
  }
  return true;
}

function setActiveSpanOutcome(outcome: string): void {
  trace.getActiveSpan()?.setAttribute(ATTR_HN_FETCH_OUTCOME, outcome);
}

function setActiveSpanWaitMs(waitMs: number): void {
  trace.getActiveSpan()?.setAttribute(ATTR_HN_FETCH_WAIT_MS, waitMs);
}

export class PoliteHnHtmlFetcher implements HnHtmlFetcher {
  private readonly cache = new Map<string, CachedHtml>();
  private lastLiveAtMs = Number.NEGATIVE_INFINITY;
  private readonly cacheTtlMs: number;
  private readonly minIntervalMs: number;
  private readonly maxRetries: number;
  private readonly now: () => number;
  private readonly sleep: (ms: number) => Promise<void>;
  private readonly listUrl: () => string;

  constructor(
    private readonly inner: HnHtmlFetcher,
    deps: PoliteHnFetchDeps = {},
  ) {
    this.cacheTtlMs = deps.cacheTtlMs ?? resolveHnFetchCacheTtlMs();
    this.minIntervalMs = deps.minIntervalMs ?? resolveHnFetchMinIntervalMs();
    this.maxRetries = deps.maxRetries ?? HN_FETCH_MAX_LIVE_RETRIES;
    this.now = deps.now ?? Date.now;
    this.sleep = deps.sleep ?? defaultSleep;
    this.listUrl =
      deps.listUrl ??
      (() => process.env.HN_LIST_URL ?? DEFAULT_HN_LIST_URL);
  }

  async fetchHtml(): Promise<string> {
    const url = this.listUrl();
    const now = this.now();
    const cached = this.cache.get(url);
    if (
      this.cacheTtlMs > 0 &&
      cached !== undefined &&
      now - cached.storedAt < this.cacheTtlMs
    ) {
      logStage(HN_FETCH_STAGE_CACHE_HIT);
      setActiveSpanOutcome(HN_FETCH_OUTCOME_CACHE);
      return cached.html;
    }

    if (
      this.minIntervalMs > 0 &&
      Number.isFinite(this.lastLiveAtMs) &&
      now - this.lastLiveAtMs < this.minIntervalMs
    ) {
      const waitMs = this.minIntervalMs - (now - this.lastLiveAtMs);
      setActiveSpanWaitMs(waitMs);
      await this.sleep(waitMs);
    }

    let lastError: unknown;
    for (let attempt = 0; attempt <= this.maxRetries; attempt += 1) {
      if (attempt > 0) {
        logStage(HN_FETCH_STAGE_RETRY);
      }
      logStage(HN_FETCH_STAGE_LIVE);
      try {
        const html = await this.inner.fetchHtml();
        const storedAt = this.now();
        this.lastLiveAtMs = storedAt;
        if (this.cacheTtlMs > 0) {
          this.cache.set(url, { html, storedAt });
        }
        setActiveSpanOutcome(
          attempt > 0 ? HN_FETCH_OUTCOME_RETRY : HN_FETCH_OUTCOME_LIVE,
        );
        return html;
      } catch (error) {
        this.lastLiveAtMs = this.now();
        lastError = error;
        if (attempt >= this.maxRetries || !isRetryableHnFetchError(error)) {
          if (attempt > 0) {
            setActiveSpanOutcome(HN_FETCH_OUTCOME_RETRY);
          }
          throw error;
        }
      }
    }
    throw lastError;
  }
}

import { createRoot } from "react-dom/client";
import { act } from "react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import {
  APP_ERROR_FALLBACK_HINT,
  APP_ERROR_FALLBACK_TITLE,
  AppErrorBoundary,
} from "./AppErrorBoundary";

function Bomb(): never {
  throw new Error("render fail");
}

describe("AppErrorBoundary", () => {
  let host: HTMLDivElement;

  beforeAll(() => {
    (
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    host?.remove();
  });

  it("shows fallback UI when a child throws during render", async () => {
    host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);

    await act(async () => {
      root.render(
        <AppErrorBoundary>
          <Bomb />
        </AppErrorBoundary>,
      );
    });

    expect(host.textContent).toContain(APP_ERROR_FALLBACK_TITLE);
    expect(host.textContent).toContain(APP_ERROR_FALLBACK_HINT);
  });
});

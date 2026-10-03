import { describe, expect, it } from "vitest";
import { resultsPanelState } from "@/lib/results-panel-state";

describe("resultsPanelState", () => {
  it("shows loading while the request is in flight", () => {
    expect(resultsPanelState("pending", undefined)).toBe("loading");
  });

  it("shows empty when the API returns []", () => {
    expect(resultsPanelState("success", [])).toBe("empty");
  });

  it("shows table when the list is non-empty", () => {
    expect(resultsPanelState("success", [{ rank: 1 }])).toBe("table");
  });

  it("shows error on request failure", () => {
    expect(resultsPanelState("error", undefined)).toBe("error");
  });
});

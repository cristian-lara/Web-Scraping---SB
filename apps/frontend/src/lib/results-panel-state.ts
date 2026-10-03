export type ResultsStatus = "idle" | "pending" | "error" | "success";

export type ResultsPanelState =
  | "idle"
  | "loading"
  | "error"
  | "empty"
  | "table";

export function resultsPanelState(
  status: ResultsStatus,
  entries: readonly unknown[] | undefined,
): ResultsPanelState {
  if (status === "pending") {
    return "loading";
  }
  if (status === "error") {
    return "error";
  }
  if (status === "idle") {
    return "idle";
  }
  if (!entries?.length) {
    return "empty";
  }
  return "table";
}

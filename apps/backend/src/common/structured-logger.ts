import { getRequestId } from "./request-context.js";

export type StructuredLogRecord = {
  timestamp: string;
  level: string;
  stage: string;
  requestId: string;
  durationMs?: number;
};

export type StructuredLogWriter = (record: StructuredLogRecord) => void;

const SECRET_SUBSTRINGS = [
  "password",
  "access_token",
  "authorization",
  "bearer ",
  "sentry",
] as const;

function defaultWriter(record: StructuredLogRecord): void {
  process.stdout.write(`${JSON.stringify(record)}\n`);
}

let writer: StructuredLogWriter = defaultWriter;

export function setStructuredLogWriter(next: StructuredLogWriter): void {
  writer = next;
}

export function resetStructuredLogWriter(): void {
  writer = defaultWriter;
}

function payloadLooksSecret(serialized: string): boolean {
  const lower = serialized.toLowerCase();
  return SECRET_SUBSTRINGS.some((part) => lower.includes(part));
}

export function logStage(
  stage: string,
  extra?: { durationMs?: number; level?: string },
): void {
  const requestId = getRequestId();
  if (requestId === undefined) {
    return;
  }
  const record: StructuredLogRecord = {
    timestamp: new Date().toISOString(),
    level: extra?.level ?? "info",
    stage,
    requestId,
  };
  if (extra?.durationMs !== undefined) {
    record.durationMs = extra.durationMs;
  }
  const serialized = JSON.stringify(record);
  if (payloadLooksSecret(serialized)) {
    return;
  }
  writer(record);
}

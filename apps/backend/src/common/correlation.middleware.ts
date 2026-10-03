import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { REQUEST_ID_HEADER } from "./http.constants.js";
import { requestContext } from "./request-context.js";

export function correlationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const inbound = req.header(REQUEST_ID_HEADER);
  const trimmed = inbound?.trim() ?? "";
  const requestId = trimmed === "" ? randomUUID() : trimmed;
  res.setHeader(REQUEST_ID_HEADER, requestId);
  requestContext.run({ requestId }, () => {
    next();
  });
}

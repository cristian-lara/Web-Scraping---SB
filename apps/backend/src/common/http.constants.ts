import { HttpStatus } from "@nestjs/common";

/** HTTP contract constants (prefer over magic literals at the boundary). */
export const HTTP_STATUS_OK = HttpStatus.OK;
export const HTTP_STATUS_BAD_REQUEST = HttpStatus.BAD_REQUEST;
export const HTTP_STATUS_UNAUTHORIZED = HttpStatus.UNAUTHORIZED;
export const HTTP_STATUS_BAD_GATEWAY = HttpStatus.BAD_GATEWAY;
export const HTTP_STATUS_INTERNAL_SERVER_ERROR =
  HttpStatus.INTERNAL_SERVER_ERROR;

export const AUTH_ROUTE_PREFIX = "auth";
export const AUTH_LOGIN_ROUTE = "login";
export const FILTERS_ROUTE_PREFIX = "filters";

/** Swagger UI path; OpenAPI JSON at `/{SWAGGER_PATH}-json`. */
export const SWAGGER_PATH = "api";
export const SWAGGER_TITLE = "HN Scraper BFF";
export const SWAGGER_VERSION = "0.0.1";

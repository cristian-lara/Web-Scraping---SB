## Purpose

Defines Swagger/OpenAPI documentation for auth and filter HTTP endpoints and the thin-controller boundary: Zod DTO bind/validate, service delegation, and HTTP status mapping without scrape, filter-sort, Prisma, or password-hash work in controllers, and without stack traces in JSON bodies.

## ADDED Requirements

### Requirement: OpenAPI documents auth and filter shapes (HP-SWAG)
When the NestJS BFF is running, Swagger UI and/or the published OpenAPI document MUST describe the auth and filter HTTP endpoints, including request and response shapes sufficient for a client or evaluator to discover how to call them.

#### Scenario: Auth and filter endpoints visible in OpenAPI
- **WHEN** the NestJS application is running
- **THEN** Swagger UI or the OpenAPI JSON/YAML MUST document the auth endpoint(s) with request and response shapes
- **AND** MUST document the filter endpoint(s) with request and response shapes

### Requirement: Controllers stay thin (EC-THIN)
HTTP controllers MUST only bind and validate DTOs, call services, and map outcomes or typed exceptions to HTTP status codes. Controllers MUST NOT scrape Hacker News, apply filter/sort strategy logic, call Prisma (or any persistence client) directly, or hash/verify passwords (e.g. Bcrypt).

#### Scenario: Controller path is DTO then service then status
- **WHEN** a controller method handles an auth or filter request
- **THEN** it MUST bind/validate the DTO, delegate to a service, and map the result or typed exception to an HTTP status
- **AND** the controller MUST NOT perform scraping, filter-sort business logic, Prisma/persistence calls, or password hashing/verification

### Requirement: Zod-backed DTOs reject invalid input before services
Invalid request bodies or query parameters for documented auth and filter endpoints MUST be rejected by Zod-backed DTO validation before the corresponding service method runs. Validation failures MUST surface as client errors (e.g. `400 Bad Request`), not as unhandled server failures caused solely by bad input.

#### Scenario: Invalid DTO never reaches service
- **WHEN** a client submits a body or query that violates the Zod-backed DTO for an auth or filter endpoint
- **THEN** validation MUST reject the request before the service layer executes
- **AND** the API MUST respond with a client error (e.g. `400 Bad Request`)

### Requirement: Typed exceptions map to HTTP without stack leakage (EC-NOSTACK)
When a service fails with a domain or other typed exception, the HTTP layer MUST map it to an appropriate HTTP status. JSON success and error response bodies MUST NOT include stack traces or equivalent internal stack dump fields.

#### Scenario: Typed service failure maps status without stack in body
- **WHEN** a service fails with a typed/domain exception on an auth or filter request path
- **THEN** the HTTP layer MUST map that failure to an appropriate HTTP status
- **AND** the JSON success or error body MUST NOT contain a stack trace or stack-dump field

### Requirement: Named constants at the HTTP boundary
At the HTTP boundary (controllers, route/status literals, and DTO-adjacent constants used by controllers), named constants MUST be preferred over unexplained magic strings or numbers (e.g. status codes or filter identifiers duplicated as raw literals).

#### Scenario: Review prefers named constants over magic literals
- **WHEN** auth or filter controller code at the HTTP boundary is reviewed against engineering standards
- **THEN** named constants MUST be preferred over unexplained magic strings or numbers for values that define HTTP contract behavior

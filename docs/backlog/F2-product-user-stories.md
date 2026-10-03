# Phase F2 — Product vertical (user stories)

Milestone 2 from intake §5: filter strategies, JWT auth, SQLite `UsageLog`, React UI, Bruno collection.  
Parent index: `docs/BACKLOG.md`. SSOT: `cursor-intake-spec-v7.md`.

Each story SHOULD become its own OpenSpec change (`/opsx-propose` → audit → apply → archive).

---

## F2-1 — Filter strategies A/B with rank tie-break

| Field | Value |
| --- | --- |
| **ID** | F2-1 |
| **Title** | Apply Filter A and Filter B with secondary rank tie-break |
| **Proposed OpenSpec change** | `add-filter-strategies` |

**As a** API consumer (and later the React UI),  
**I want** two filter strategies that select and sort HN entries by word-count rules,  
**So that** I can get deterministic ranked lists matching the challenge business rules.

### Acceptance criteria

1. **WHEN** Filter A (`MORE_THAN_5_WORDS_COMMENTS`) is applied to a set of entries  
   **THEN** only titles with `countWords(title) > 5` are returned, sorted by `comments` DESC, and ties break by `rank` ASC.
2. **WHEN** Filter B (`LESS_OR_EQUAL_5_WORDS_POINTS`) is applied to a set of entries  
   **THEN** only titles with `countWords(title) <= 5` are returned, sorted by `points` DESC, and ties break by `rank` ASC.
3. **WHEN** two entries share the primary sort key  
   **THEN** the lower `rank` appears first (secondary tie-break).
4. **WHEN** unit tests run for the strategy module  
   **THEN** they pass without network I/O and cover both strategies plus tie-break cases.
5. **WHEN** the filter endpoint (or service) receives a valid filter enum  
   **THEN** the Strategy Pattern selects the matching strategy without branching logic leaked into controllers.

### Out of scope

- JWT auth, guards, and HTTP status mapping (F2-2).
- Persisting `UsageLog` (F2-3).
- Scraping / Cheerio adapter (F1).
- React UI and Bruno collections (F2-4, F2-5).
- Pagination of filtered results.

### Intake references

- §2.2 Word-count algorithm (`countWords`)
- §2.3 Filtering strategies (Strategy Pattern) — Filter A/B + rank ASC tie-break
- §5 Milestone 2 — “Strategy pattern for both filter/sort rules”
- §1.8 Zod / `FilterQuerySchema` (consumer of shared filter enum)
- §4 Architecture — Filter Module (Strategy Pattern)

---

## F2-2 — JWT auth, 401, Bcrypt, and HTTP hardening

| Field | Value |
| --- | --- |
| **ID** | F2-2 |
| **Title** | Authenticate with JWT; reject unauthorized; harden with Helmet, CORS, rate limit |
| **Proposed OpenSpec change** | `add-jwt-auth` |

**As a** authenticated user of the BFF,  
**I want** login that issues a JWT (password hashed with Bcrypt) and protected filter endpoints,  
**So that** only authorized callers can scrape/filter and usage can be bound to my `userId`.

### Acceptance criteria

1. **WHEN** a client submits valid credentials to the auth endpoint  
   **THEN** the API returns a JWT suitable for `Authorization: Bearer <token>` and the password is verified via Bcrypt (stored hashes never returned).
2. **WHEN** a protected endpoint is called without a token or with an invalid/expired token  
   **THEN** the API responds `401 Unauthorized` (`JwtAuthGuard`).
3. **WHEN** a protected endpoint is called with a valid JWT  
   **THEN** the request proceeds and the authenticated `userId` is available to downstream services.
4. **WHEN** auth/query request bodies violate Zod DTOs  
   **THEN** validation fails before business logic (`ZodValidationPipe` / nestjs-zod) with a client error (not a 500).
5. **WHEN** the NestJS app boots  
   **THEN** Helmet and CORS are enabled for the BFF surface.
6. **WHEN** a client exceeds the configured throttle (`@nestjs/throttler`)  
   **THEN** the API responds `429 Too Many Requests`.

### Out of scope

- Filter A/B sort algorithms (F2-1).
- `UsageLog` persistence (F2-3) — may accept `userId` from auth but not own Prisma schema.
- React login form and TanStack Query wiring (F2-4).
- Bruno collection files (F2-5).
- Swagger decorator completeness beyond what is needed to expose auth routes (full thin-controller/Swagger pattern in F2-6).
- OAuth, refresh-token rotation, multi-tenant RBAC, password-reset flows.

### Intake references

- §1.6 Authentication and security — JWT (Passport.js), Bcrypt, Helmet, CORS, `@nestjs/throttler`
- §1.8 Zod DTO validation for auth/query
- §2.4 Usage metrics — `userId` from authenticated user
- §5 Milestone 2 — “JWT auth protecting the API with DTOs via `ZodValidationPipe`”
- §4 Architecture — JwtAuthGuard, Helmet & Rate Limiter
- §1.9 Edge Case 1 (401) and Edge Case 3 (429) as contract for later Bruno

---

## F2-3 — UsageLog SQLite persistence (Prisma + Repository)

| Field | Value |
| --- | --- |
| **ID** | F2-3 |
| **Title** | Persist UsageLog rows in SQLite via Prisma Repository |
| **Proposed OpenSpec change** | `add-usage-persistence` |

**As a** the system,  
**I want** each successful filter execution written to SQLite as a `UsageLog` bound to `userId`,  
**So that** evaluators can inspect usage metrics without an external database.

### Acceptance criteria

1. **WHEN** a filter execution completes successfully for an authenticated user  
   **THEN** a `UsageLog` row is persisted with: `id`, `timestamp` (ISO 8601), `filter_applied` (A or B enum), `processed_items`, `execution_time_ms`, and `userId`.
2. **WHEN** the row is written  
   **THEN** attributes validate against `UsageLogSchema` (from `@repo/shared-types`) before or at the persistence boundary.
3. **WHEN** persistence is implemented  
   **THEN** it uses Prisma ORM against SQLite (`app.db`) behind a Repository (`PrismaUsageRepository`), not direct Prisma calls from controllers.
4. **WHEN** the project is run on a clean machine  
   **THEN** SQLite requires no external DB service or container.
5. **WHEN** unit/integration tests for the repository/service run  
   **THEN** they prove create/read of a log row without depending on live HN network calls.

### Out of scope

- Filter strategy algorithms (F2-1) beyond calling persistence after apply.
- Auth implementation (F2-2) — depends on `userId` being available.
- Analytics dashboards, admin UI for logs, retention/purge jobs.
- Sentry / structured logging / correlation IDs (F3).
- React UI for viewing usage history.

### Intake references

- §1.5 Persistence — SQLite + Prisma + Repository Pattern (`PrismaUsageRepository`)
- §2.4 Usage metrics persistence (`UsageLog` / `UsageLogSchema` fields)
- §5 Milestone 2 — “Prisma + SQLite for automatic `UsageLog` persistence”
- §3 Decision matrix — Persistence row
- §4 Architecture — Analytics Module

---

## F2-4 — React UI: auth, filter, table (loading / error / empty)

| Field | Value |
| --- | --- |
| **ID** | F2-4 |
| **Title** | React UI for login, filter selection, and results table states |
| **Proposed OpenSpec change** | `add-frontend-filters-ui` |

**As a** end user,  
**I want** a React client to log in, choose Filter A or B, and see results in a table,  
**So that** I can exercise the full product vertical without calling the API manually.

### Acceptance criteria

1. **WHEN** the user submits valid credentials in the UI  
   **THEN** the client obtains a JWT and attaches it as Bearer on subsequent API calls (e.g. Axios interceptor).
2. **WHEN** the user selects Filter A or Filter B and requests results  
   **THEN** the UI shows a loading state while the request is in flight (TanStack Query).
3. **WHEN** the API returns a non-empty filtered list  
   **THEN** the table renders entry fields needed for MVP review (at least rank, title, points, comments) using Shadcn/ui + Tailwind.
4. **WHEN** the API returns an empty filtered list  
   **THEN** the UI shows an explicit empty state (not a blank/broken table).
5. **WHEN** the API call fails (network/4xx/5xx)  
   **THEN** the UI shows an error state the user can understand (no uncaught white screen).
6. **WHEN** forms/inputs are validated on the client  
   **THEN** Zod resolvers (`@hookform/resolvers/zod`) share rules with `@repo/shared-types` where applicable.
7. **WHEN** reviewing the MVP UI  
   **THEN** there is **no pagination** of results.

### Out of scope

- Server-side filter/auth/persistence implementation details (F2-1…F2-3) beyond consuming their HTTP contracts.
- Bruno E2E (F2-5).
- Sentry ErrorBoundary and correlation UI (F3).
- Pagination, infinite scroll, saved filters, dark-mode theming, usage-log history screens.

### Intake references

- §1.4 Frontend — React + Vite + Tailwind + Shadcn/ui + TanStack Query + Bearer JWT
- §5 Milestone 2 — “React UI with Shadcn/ui via TanStack Query… (including empty-state; **no pagination** in MVP)”
- §1.8 React validation with `@hookform/resolvers/zod`
- §4 Architecture — Frontend box (table, filter, Hook Form, Axios JWT)

---

## F2-5 — Bruno E2E: happy paths and edge cases (401 / 400 / 429)

| Field | Value |
| --- | --- |
| **ID** | F2-5 |
| **Title** | Bruno collection for auth, Filter A/B, and 401/400/429 edges |
| **Proposed OpenSpec change** | `add-bruno-e2e` |

**As a** QA / evaluator,  
**I want** a Bruno `.bru` collection covering happy and edge API paths,  
**So that** I can manually (and later in CI) prove the BFF contract without Postman.

### Acceptance criteria

1. **WHEN** the Bruno collection is run against a live local server (`apps/backend/bruno/`, env `local`)  
   **THEN** Happy Path 1 succeeds: auth and JWT extraction.
2. **WHEN** Filter A is requested with a valid JWT  
   **THEN** Happy Path 2 succeeds: extract/sort by comments for titles with >5 words.
3. **WHEN** Filter B is requested with a valid JWT  
   **THEN** Happy Path 3 succeeds: extract/sort by points for titles with ≤5 words.
4. **WHEN** a protected route is called with no auth  
   **THEN** Edge Case 1 expects `401 Unauthorized`.
5. **WHEN** an invalid filter value is sent  
   **THEN** Edge Case 2 expects `400 Bad Request` from Zod schemas.
6. **WHEN** the client exceeds rate limits  
   **THEN** Edge Case 3 expects `429 Too Many Requests`.
7. **WHEN** the collection is stored in git  
   **THEN** files are plain-text `.bru` under `apps/backend/bruno/` (Bruno CLI–runnable later; CI automation itself is F3).

### Out of scope

- Wiring `@usebruno/cli` into GitHub Actions / Makefile targets (F3).
- Implementing auth, filters, or throttler if missing — this story consumes F2-1…F2-3 (and F2-2 hardening).
- React UI testing (component/E2E browser tests).
- Live HN flake handling beyond what the BFF already supports (fixtures vs live is backend concern).

### Intake references

- §1.9 API E2E testing strategy — Bruno + happy/edge cases listed
- §5 Milestone 2 — “Bruno `.bru` collection covering Auth, Filter A/B, 401, 400, 429”
- §6 Cursor Agent Directives — Maintain Bruno under `apps/backend/bruno/`

---

## F2-6 — Swagger on controllers + thin controller / DTO pattern

| Field | Value |
| --- | --- |
| **ID** | F2-6 |
| **Title** | Thin Swagger-documented controllers with validated DTOs |
| **Proposed OpenSpec change** | `add-swagger-thin-controllers` |

**As a** developer / evaluator,  
**I want** every HTTP controller documented in Swagger and limited to DTO binding + status mapping,  
**So that** the API is discoverable and business logic stays in services with typed exceptions.

### Acceptance criteria

1. **WHEN** the NestJS app is running  
   **THEN** Swagger UI (or OpenAPI JSON) documents auth and filter endpoints with request/response shapes.
2. **WHEN** a controller method handles a request  
   **THEN** it only binds/validates DTOs, delegates to a service, and maps the result/exception to an HTTP status — no scraping, filtering, Prisma, or password hashing inside the controller.
3. **WHEN** invalid input reaches an endpoint  
   **THEN** Zod-backed DTO validation rejects it before the service layer.
4. **WHEN** a service fails with a domain/typed exception  
   **THEN** the HTTP layer maps it to the appropriate status without leaking stack traces in the success path.
5. **WHEN** reviewing controllers against engineering standards  
   **THEN** named constants are preferred over magic strings/numbers at the HTTP boundary.

### Out of scope

- New product features beyond documenting/refactoring existing F2 endpoints.
- Sentry global filters and correlation IDs (F3).
- Frontend changes.
- Expanding OpenAPI for non-MVP routes.

### Intake references

- §1.10 Engineering standards — thin Swagger-documented controllers, DTO validation, typed service exceptions, named constants
- §1.2 NestJS BFF — modular controllers/services
- §1.8 NestJS validation via `ZodValidationPipe` / nestjs-zod
- §5 Milestone 2 delivery criterion — type-validated E2E flow through BFF
- §6 Agent directives — shared types, runtime validation

---

## Dependency sketch (apply order)

```text
F2-1 filter strategies
F2-2 JWT + Bcrypt + Helmet/CORS/throttler ──┐
         │                                  │
         ▼                                  ▼
F2-3 UsageLog Prisma ──────────────► F2-5 Bruno E2E
F2-6 Swagger/thin controllers (can trail or pair with F2-2)
F2-4 React UI (needs F2-2 + filter HTTP contract; ideally after F2-1…F2-3)
```

Helmet, CORS, and rate limiting are **in F2-2** (not a separate story) so Bruno’s 429 edge case has a clear producer.

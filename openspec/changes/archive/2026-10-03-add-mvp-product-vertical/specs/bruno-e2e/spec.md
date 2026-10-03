## Purpose

Defines a git-friendly Bruno API E2E collection under `apps/backend/bruno/` so evaluators can manually (and later via CLI) prove auth JWT extraction, Filter A/B contracts, and 401/400/429 edges against a live local server without Postman or React UI tests. CI automation of Bruno is out of scope for this capability (F3).

## ADDED Requirements

### Requirement: Plain-text Bruno collection with local environment
The repository MUST include a Bruno collection of plain-text `.bru` files under `apps/backend/bruno/` with a `local` environment suitable for runs against a live local BFF. Collection files MUST be committed as text (not a proprietary binary export). The collection MUST be manually runnable against that local server and MUST remain structurally runnable later via `@usebruno/cli` (e.g. `npx @usebruno/cli run apps/backend/bruno --env local`). Wiring Bruno into GitHub Actions, Makefile E2E targets, or other CI automation MUST NOT be required by this capability (deferred to F3).

#### Scenario: Collection layout and local env
- **WHEN** the Bruno collection is present in the repository
- **THEN** requests MUST live as plain-text `.bru` files under `apps/backend/bruno/`
- **AND** a `local` environment MUST be available for targeting a live local server
- **AND** the collection MUST be manually runnable without CI automation

#### Scenario: CI Bruno automation deferred
- **WHEN** Milestone 2 delivery of this capability is evaluated
- **THEN** absence of GitHub Actions / Makefile Bruno CI wiring MUST NOT fail this capability
- **AND** the collection MUST still be suitable for later CLI runs under F3

### Requirement: Happy Path 1 authenticates and extracts JWT (HP-BR1)
The collection MUST include a Happy Path 1 request that authenticates with the shared local demo credentials against the live local server and extracts a JWT usable as `Authorization: Bearer <token>` for subsequent authenticated requests in the collection.

#### Scenario: HP1 auth JWT extract
- **WHEN** Happy Path 1 is run against the live local server using the `local` environment and valid demo credentials
- **THEN** authentication MUST succeed
- **AND** a JWT MUST be extractable from the response for Bearer use on later requests

### Requirement: Happy Path 2 Filter A with JWT (HP-BR2)
The collection MUST include a Happy Path 2 request that calls the authenticated filter endpoint with a valid JWT and requests Filter A (`MORE_THAN_5_WORDS_COMMENTS`). The asserted contract MUST match Filter A: retain titles with word count greater than the named threshold (`FILTER_WORD_THRESHOLD` / >5 words) and sort by `comments` descending (ties by `rank` ascending per filter-strategies).

#### Scenario: HP2 Filter A with JWT
- **WHEN** Happy Path 2 is run with a valid JWT requesting Filter A
- **THEN** the API MUST accept the authenticated request
- **AND** the response MUST conform to the Filter A contract: entries with `countWords(title) > FILTER_WORD_THRESHOLD`, sorted by `comments` DESC (ties `rank` ASC)

### Requirement: Happy Path 3 Filter B with JWT (HP-BR3)
The collection MUST include a Happy Path 3 request that calls the authenticated filter endpoint with a valid JWT and requests Filter B (`LESS_OR_EQUAL_5_WORDS_POINTS`). The asserted contract MUST match Filter B: retain titles with word count less than or equal to the named threshold (`FILTER_WORD_THRESHOLD` / ≤5 words) and sort by `points` descending (ties by `rank` ascending per filter-strategies).

#### Scenario: HP3 Filter B with JWT
- **WHEN** Happy Path 3 is run with a valid JWT requesting Filter B
- **THEN** the API MUST accept the authenticated request
- **AND** the response MUST conform to the Filter B contract: entries with `countWords(title) <= FILTER_WORD_THRESHOLD`, sorted by `points` DESC (ties `rank` ASC)

### Requirement: Edge Case 1 expects 401 without auth (EC-BR1)
The collection MUST include an Edge Case 1 request that calls a protected route without a valid Authorization Bearer token and asserts `401 Unauthorized`.

#### Scenario: E1 no auth returns 401
- **WHEN** Edge Case 1 calls a protected endpoint with no auth (missing Bearer token)
- **THEN** the assertion MUST expect HTTP `401 Unauthorized`

### Requirement: Edge Case 2 expects 400 for invalid filter (EC-BR2)
The collection MUST include an Edge Case 2 request that sends an invalid filter value (violating the Zod/shared filter DTO) and asserts `400 Bad Request` from schema validation.

#### Scenario: E2 invalid filter returns 400
- **WHEN** Edge Case 2 sends an invalid filter value against the filter API
- **THEN** the assertion MUST expect HTTP `400 Bad Request` from Zod/schema validation
- **AND** the outcome MUST NOT be treated as a successful filter result

### Requirement: Edge Case 3 expects 429 over throttle (EC-BR3)
The collection MUST include an Edge Case 3 sequence that exceeds the configured request throttle against the live local server and asserts `429 Too Many Requests`. Local throttle settings relevant to reproducing this case SHOULD be documented for the `local` Bruno environment so the edge is reliably runnable.

#### Scenario: E3 over throttle returns 429
- **WHEN** Edge Case 3 issues enough requests against the live local server to exceed the configured throttle
- **THEN** the assertion MUST expect HTTP `429 Too Many Requests`

### Requirement: Scope excludes React UI tests and Nest implementation
This capability MUST only define and require the Bruno collection contract coverage above. It MUST NOT require React UI component or browser E2E tests. It MUST NOT require implementing NestJS auth, filters, throttler, or other BFF producers; those are consumed from sibling capabilities (F2-1…F2-3 / F2-2 hardening). Live HN flake handling beyond what the BFF already supports is out of scope for the collection.

#### Scenario: No React or Nest deliverables in this capability
- **WHEN** this capability is implemented or reviewed
- **THEN** success MUST be judged by the Bruno `.bru` collection and its happy/edge assertions
- **AND** React UI tests MUST NOT be required
- **AND** NestJS feature implementation MUST NOT be required as part of this capability alone

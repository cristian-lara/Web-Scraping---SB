## ADDED Requirements

### Requirement: Happy Path save filter results with JWT (HP-BR-SAVE)
The Bruno collection MUST include an authenticated request that saves a filter-result snapshot (valid filter_applied and Entry-shaped entries) using a Bearer JWT obtained from Happy Path 1 (or equivalent prior auth step). The assertion MUST expect a successful HTTP status and a response body that includes an `id` and `entryCount` for the created save.

#### Scenario: HP save with JWT
- **WHEN** the save happy-path request runs with a valid JWT and a valid save body
- **THEN** the API MUST accept the authenticated save
- **AND** the response MUST include an id and entryCount for the created saved filter result

### Requirement: Happy Path list saved filter results with JWT (HP-BR-LIST)
The Bruno collection MUST include an authenticated request that lists saved filter results for the JWT user. After a successful save in the same collection run (or equivalent fixture seed), the list assertion MUST expect HTTP success and at least one item containing `id`, `savedAt`, `filter_applied`, and `entryCount`.

#### Scenario: HP list with JWT
- **WHEN** the list happy-path request runs with a valid JWT after at least one save exists for that user
- **THEN** the API MUST accept the authenticated list request
- **AND** the response MUST include at least one item with id, savedAt, filter_applied, and entryCount

### Requirement: Edge Case save without auth expects 401 (EC-BR-SAVE-401)
The Bruno collection MUST include a request that calls the save endpoint without a valid Authorization Bearer token and asserts `401 Unauthorized`.

#### Scenario: Save without auth returns 401
- **WHEN** the save edge request runs with no auth (missing Bearer token)
- **THEN** the assertion MUST expect HTTP `401 Unauthorized`
)
## Purpose

Lets an authenticated user explicitly save the filtered Hacker News entry list from a successful Filter A/B run and later list those snapshots for comparison across time, without conflating snapshots with automatic UsageLog metrics.

## Requirements

### Requirement: Persist saved filter result on authenticated save
The system MUST expose an authenticated HTTP endpoint that accepts a save of filtered results for the current user. A successful save MUST persist: opaque `id`, ISO 8601 `savedAt`, `userId`, `filter_applied` (Filter A/B enum), `entries` (array of Entry-shaped objects), and `entryCount` equal to `entries.length`. An optional short `label` MAY be accepted. The endpoint MUST reject unauthenticated requests with `401`.

#### Scenario: Authenticated save stores snapshot
- **WHEN** an authenticated client POSTs a valid save payload with filter_applied and entries
- **THEN** the system MUST persist a saved filter result owned by that user
- **AND** the persisted row MUST include id, savedAt, userId, filter_applied, entries, and entryCount

#### Scenario: Unauthenticated save rejected
- **WHEN** a client calls the save endpoint without a valid Bearer token
- **THEN** the response MUST be HTTP `401 Unauthorized`
- **AND** no saved filter result MUST be created for that call

### Requirement: Validate save payload with shared schema
Save payloads and persisted shapes MUST validate against a shared Zod schema from `@repo/shared-types` (e.g. `SavedFilterResultSchema` / create-input variant). Invalid bodies MUST return `400`. Entry objects inside `entries` MUST satisfy `EntrySchema` rules (rank, title, points, comments).

#### Scenario: Invalid save body returns 400
- **WHEN** an authenticated client posts a save body missing required fields or with invalid entries
- **THEN** the API MUST respond `400 Bad Request`
- **AND** no saved filter result MUST be accepted as valid

### Requirement: List saved filter results for the authenticated user
The system MUST expose an authenticated HTTP endpoint that returns the current user's saved filter results, newest first (or equivalently documented stable order). Each list item MUST include at least `id`, `savedAt`, `filter_applied`, and `entryCount`. List responses MUST NOT include other users' saves.

#### Scenario: List returns only caller saves
- **WHEN** an authenticated user requests their saved filter results list
- **THEN** the response MUST include only that user's saves
- **AND** each item MUST include id, savedAt, filter_applied, and entryCount

### Requirement: Repository owns Prisma access for saved results
Persistence of saved filter results MUST use the Repository pattern (Prisma against SQLite `app.db`). Controllers MUST NOT call Prisma directly for saves or lists.

#### Scenario: Service persists via repository
- **WHEN** a save or list operation runs
- **THEN** Prisma access MUST be confined to a repository layer
- **AND** the HTTP controller MUST NOT call Prisma directly

### Requirement: Offline tests prove save and list without live HN
Automated unit/integration tests MUST prove create and list of a saved filter result without live Hacker News network calls.

#### Scenario: Save/list tests offline of HN
- **WHEN** saved-filter-result repository or service tests run
- **THEN** they MUST demonstrate create and list of a snapshot row
- **AND** they MUST NOT require live HN network access

### Requirement: Scope excludes cron and diff UI
This capability MUST NOT require scheduled/cron scraping or a UI that diffs two saves side-by-side. Manual save after Filter A/B is sufficient.

#### Scenario: No cron or diff required
- **WHEN** this capability is reviewed
- **THEN** absence of cron jobs and absence of a snapshot-diff UI MUST NOT fail the capability

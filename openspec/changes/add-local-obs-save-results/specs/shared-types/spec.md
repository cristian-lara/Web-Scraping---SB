## ADDED Requirements

### Requirement: Saved filter result schema
The shared package MUST export a Zod schema (and inferred type) for a saved filter result that includes `id`, ISO 8601 `savedAt`, `userId`, `filter_applied` (allowed filter enum), `entries` (array of Entry-shaped objects), `entryCount` (int), and optional `label` (string). A create-input schema MAY omit server-assigned `id` / `savedAt` when those are generated server-side, but persisted/read shapes MUST validate the full saved-result contract.

#### Scenario: Valid saved filter result
- **WHEN** an object with valid id, savedAt, userId, filter_applied, entries, and entryCount is parsed
- **THEN** the saved-filter-result schema parse MUST succeed

#### Scenario: Invalid saved filter result
- **WHEN** required fields are missing, mistyped, or entries violate EntrySchema
- **THEN** parse MUST throw a Zod error

### Requirement: Saved filter result on single import surface
Consumers MUST be able to import the saved-filter-result schema and type from `@repo/shared-types` without redefining an equivalent schema in apps.

#### Scenario: Package export includes saved filter result
- **WHEN** a consumer imports from `@repo/shared-types`
- **THEN** the saved-filter-result schema and inferred type MUST be available

## MODIFIED Requirements

### Requirement: UsageLog schema
The shared package MUST export `UsageLogSchema` with `id`, ISO 8601 `timestamp`, `filter_applied` (allowed filter enum), `processed_items`, `execution_time_ms`, `userId`, and `requestId` (non-empty string correlation/request ID for the filter request). The schema MUST also include `scrape_duration_ms` as a non-negative integer measuring the scrape stage duration for that request.

#### Scenario: Valid UsageLog
- **WHEN** all required fields including `requestId` and `scrape_duration_ms` are present and typed correctly
- **THEN** `UsageLogSchema.parse` MUST succeed

#### Scenario: Invalid UsageLog
- **WHEN** fields are missing or mistyped (including missing `requestId` or `scrape_duration_ms`)
- **THEN** `UsageLogSchema.parse` MUST throw a Zod error
)
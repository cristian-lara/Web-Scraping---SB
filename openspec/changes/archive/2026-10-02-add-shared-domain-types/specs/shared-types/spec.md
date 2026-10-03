## Purpose

Provides shared Zod schemas and inferred types so backend and frontend validate Entry, filter queries, and UsageLog against one contract.

## ADDED Requirements

### Requirement: Entry schema
The shared package MUST export `EntrySchema` validating `rank` (number), `title` (string), `points` (number), and `comments` (number), plus a matching inferred TypeScript type.

#### Scenario: Valid entry
- **WHEN** an object with valid rank, title, points, and comments is parsed
- **THEN** `EntrySchema.parse` MUST succeed

#### Scenario: Invalid entry
- **WHEN** an entry is missing a required field or uses a wrong type
- **THEN** `EntrySchema.parse` MUST throw a Zod error

### Requirement: Filter query schema
The shared package MUST export `FilterQuerySchema` that accepts only `MORE_THAN_5_WORDS_COMMENTS` and `LESS_OR_EQUAL_5_WORDS_POINTS` for the filter field.

#### Scenario: Valid filter
- **WHEN** either allowed filter value is parsed
- **THEN** parse MUST succeed

#### Scenario: Invalid filter
- **WHEN** any other filter value is parsed
- **THEN** parse MUST fail

### Requirement: UsageLog schema
The shared package MUST export `UsageLogSchema` with `id`, ISO 8601 `timestamp`, `filter_applied` (allowed filter enum), `processed_items`, `execution_time_ms`, and `userId`.

#### Scenario: Valid UsageLog
- **WHEN** all required fields are present and typed correctly
- **THEN** `UsageLogSchema.parse` MUST succeed

#### Scenario: Invalid UsageLog
- **WHEN** fields are missing or mistyped
- **THEN** `UsageLogSchema.parse` MUST throw a Zod error

### Requirement: Single import surface
Consumers MUST be able to import the schemas and inferred types from `@repo/shared-types` without redefining equivalent schemas in apps.

#### Scenario: Package export
- **WHEN** a consumer imports from `@repo/shared-types`
- **THEN** Entry, FilterQuery, and UsageLog schemas/types MUST be available

### Requirement: Offline unit tests
Schema unit tests MUST run in Vitest without network access.

#### Scenario: Vitest green
- **WHEN** the `@repo/shared-types` schema test suite runs
- **THEN** tests MUST pass with no network dependency

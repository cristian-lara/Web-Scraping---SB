## Purpose

Provides shared Zod schemas, inferred types, and domain helpers (including `countWords`) so backend and frontend share one validation and word-count contract.

## Requirements

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

### Requirement: countWords utility
The shared package MUST export a `countWords(title: string): number` function that counts space-separated words after trimming and collapsing consecutive whitespace, excluding tokens that are only symbols, and treating compound tokens without spaces as a single word.

#### Scenario: Canonical example
- **WHEN** `countWords` is called with `"This is - a self-explained example"`
- **THEN** the result MUST be `5`

#### Scenario: Trim and collapse whitespace
- **WHEN** the input has leading/trailing spaces or consecutive whitespace between tokens
- **THEN** those spaces MUST NOT create extra words

#### Scenario: Symbol-only tokens excluded
- **WHEN** a token consists only of symbols (for example `-`, `&`, `/`, `|`)
- **THEN** that token MUST NOT increment the count

#### Scenario: Compound tokens count as one
- **WHEN** a token has no spaces (for example `"self-explained"` or `"Node.js"`)
- **THEN** it MUST count as exactly one word

### Requirement: Named symbol-token rule
The shared package MUST export a named constant (or equivalently named helper bound to that constant) used by `countWords` to decide whether a token is symbol-only, so call sites do not embed ad-hoc magic regex/string checks.

#### Scenario: Shared named rule
- **WHEN** a consumer needs the symbol-only token rule used by word counting
- **THEN** it MUST be available as a named export from `@repo/shared-types`

### Requirement: Offline unit tests for countWords
`countWords` unit tests MUST run in Vitest without network access and MUST include the canonical case plus empty/whitespace-only, multiple spaces, and isolated-symbol edges.

#### Scenario: Vitest green offline
- **WHEN** the `@repo/shared-types` `countWords` test suite runs
- **THEN** tests MUST pass with no network dependency

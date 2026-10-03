## Purpose

Defines automatic `UsageLog` persistence after successful authenticated filter execution: SQLite `app.db` via Prisma and `PrismaUsageRepository`, rows shaped and validated with `UsageLogSchema` from `@repo/shared-types`, with no external database service and with create/read proven offline of live HN.

## Requirements

### Requirement: Persist UsageLog after successful authenticated filter (HP-LOG)
After a filter execution completes successfully for an authenticated user, the system MUST persist a `UsageLog` row. The row MUST include `id`, `timestamp` (ISO 8601 datetime), `filter_applied` (enum values from `FilterAppliedSchema`: `MORE_THAN_5_WORDS_COMMENTS` or `LESS_OR_EQUAL_5_WORDS_POINTS`), `processed_items`, `execution_time_ms`, and `userId` (the authenticated user). Persistence MUST be triggered by the filter/analytics service path after success, not by inventing a log on failed filter execution.

#### Scenario: Successful authenticated filter writes UsageLog
- **WHEN** an authenticated filter execution completes successfully
- **THEN** the system MUST persist a `UsageLog` with `id`, `timestamp` (ISO 8601), `filter_applied`, `processed_items`, `execution_time_ms`, and `userId`
- **AND** `filter_applied` MUST be one of the `FilterAppliedSchema` enum values
- **AND** `userId` MUST be the authenticated user's identity for that request

### Requirement: Validate against UsageLogSchema at persistence boundary
Attributes of each persisted `UsageLog` MUST validate against `UsageLogSchema` from `@repo/shared-types` before or at the persistence boundary. Invalid shapes MUST NOT be written as accepted usage metrics.

#### Scenario: Row validated with UsageLogSchema before or at write
- **WHEN** a `UsageLog` is about to be persisted
- **THEN** its attributes MUST validate against `UsageLogSchema`
- **AND** a row that fails `UsageLogSchema` validation MUST NOT be accepted as a valid persisted usage metric

### Requirement: SQLite app.db without external DB service
UsageLog storage MUST use Prisma against a local SQLite database file `app.db`. Running the project on a clean machine MUST NOT require an external database service or container for UsageLog persistence.

#### Scenario: Local SQLite file is the UsageLog store
- **WHEN** UsageLog persistence is configured and used
- **THEN** the store MUST be SQLite file `app.db` accessed via Prisma
- **AND** UsageLog persistence MUST NOT depend on an external database service or container

### Requirement: PrismaUsageRepository owns Prisma access (controllers excluded)
Persistence MUST follow the Repository pattern with a `PrismaUsageRepository` (or equivalent named repository implementing the same role). Filter/analytics services MUST call the repository to create/read usage logs. Controllers MUST NOT call Prisma directly and MUST NOT perform UsageLog writes themselves.

#### Scenario: Service persists via PrismaUsageRepository
- **WHEN** a successful filter path needs to record usage
- **THEN** the filter/analytics service MUST persist through `PrismaUsageRepository` (Repository pattern)
- **AND** Prisma client access for UsageLog MUST be confined to the repository layer

#### Scenario: Controllers do not call Prisma
- **WHEN** an HTTP controller handles an authenticated filter request
- **THEN** the controller MUST NOT call Prisma directly
- **AND** the controller MUST NOT write `UsageLog` rows itself

### Requirement: Create and read proven without live HN network (EC-LOG-NET)
Automated unit/integration tests for the UsageLog repository and/or the service that uses it MUST prove create and read of a log row without depending on live Hacker News network calls.

#### Scenario: Repository or service tests create and read offline of HN
- **WHEN** unit or integration tests for UsageLog create/read run
- **THEN** those tests MUST demonstrate creating and reading a `UsageLog` row
- **AND** those tests MUST NOT require live HN network access

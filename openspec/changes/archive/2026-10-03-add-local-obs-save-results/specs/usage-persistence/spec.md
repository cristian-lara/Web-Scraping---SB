## MODIFIED Requirements

### Requirement: Persist UsageLog after successful authenticated filter (HP-LOG)
After a filter execution completes successfully for an authenticated user, the system MUST persist a `UsageLog` row. The row MUST include `id`, `timestamp` (ISO 8601 datetime), `filter_applied` (enum values from `FilterAppliedSchema`: `MORE_THAN_5_WORDS_COMMENTS` or `LESS_OR_EQUAL_5_WORDS_POINTS`), `processed_items`, `execution_time_ms`, `userId` (the authenticated user), `requestId` (the request correlation/request ID for that HTTP call), and `scrape_duration_ms` (non-negative integer for the scrape stage). Persistence MUST be triggered by the filter/analytics service path after success, not by inventing a log on failed filter execution. UsageLog rows MUST NOT store the filtered or unfiltered entry payload arrays (those belong to saved-filter-results when the user explicitly saves).

#### Scenario: Successful authenticated filter writes UsageLog
- **WHEN** an authenticated filter execution completes successfully
- **THEN** the system MUST persist a `UsageLog` with `id`, `timestamp` (ISO 8601), `filter_applied`, `processed_items`, `execution_time_ms`, `userId`, `requestId`, and `scrape_duration_ms`
- **AND** `filter_applied` MUST be one of the `FilterAppliedSchema` enum values
- **AND** `userId` MUST be the authenticated user's identity for that request
- **AND** `requestId` MUST match the correlation/request ID used for that HTTP request
- **AND** the UsageLog row MUST NOT contain entry payload arrays

## ADDED Requirements

### Requirement: UsageLog correlation fields join observability
Persisted `requestId` on UsageLog MUST be the same correlation/request ID exposed on the HTTP `x-request-id` response header for that filter request, so operators can join SQLite usage rows with structured logs and traces.

#### Scenario: requestId matches response header
- **WHEN** an authenticated filter succeeds and a UsageLog row is written
- **THEN** the row's `requestId` MUST equal the `x-request-id` value returned on that response
)
## ADDED Requirements

### Requirement: Offline Vitest asserts ranks one through thirty and surplus exclusion
When the offline fixture contains more than thirty HN list rows, scraper Vitest coverage MUST assert that returned entries have ranks exactly `1` through `30` in order (one entry per rank) and MUST assert that titles (or equivalent identity) belonging only to surplus rows beyond the top-30 slice are absent from the result. Length `30` alone is not sufficient evidence for this requirement.

#### Scenario: Ranks one through thirty
- **WHEN** scraper unit tests run against a fixture with at least thirty list rows
- **THEN** the result MUST contain exactly thirty entries whose ranks are `1..30` in ascending order with no gaps or duplicates

#### Scenario: Surplus rows excluded
- **WHEN** the fixture contains additional list rows beyond the first thirty
- **THEN** the scraper result MUST NOT include entries that exist only in those surplus rows

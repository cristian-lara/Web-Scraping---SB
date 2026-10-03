## Purpose

Defines Filter A/B selection and sort rules via Strategy Pattern so entry lists are filtered by word count against a named threshold and ordered with deterministic rank tie-break, covered by offline unit tests.

## Requirements

### Requirement: Named word-count threshold constant
The system MUST apply Filter A and Filter B word-count comparisons against a named constant conceptually `FILTER_WORD_THRESHOLD` with value `5`, exported from `@repo/shared-types` alongside the filter enum / `FilterQuery` surface. Strategy and orchestration call sites MUST NOT embed a magic numeric `5` for the word threshold.

#### Scenario: Threshold used for both filters
- **WHEN** Filter A or Filter B evaluates an entry title
- **THEN** the word-count comparison MUST use `FILTER_WORD_THRESHOLD` (or the same named export) rather than an inline literal `5`

### Requirement: Filter A more-than-threshold by comments
When the applied filter is `MORE_THAN_5_WORDS_COMMENTS`, the system MUST retain only entries whose `countWords(title)` is greater than `FILTER_WORD_THRESHOLD`, and MUST sort the retained list by `comments` descending, breaking ties by `rank` ascending.

#### Scenario: HP-FA mixed titles
- **WHEN** Filter A (`MORE_THAN_5_WORDS_COMMENTS`) is applied to a mixed set of entries
- **THEN** only entries with `countWords(title) > FILTER_WORD_THRESHOLD` MUST be returned, sorted by `comments` DESC, with equal `comments` ordered by `rank` ASC

### Requirement: Filter B less-or-equal-threshold by points
When the applied filter is `LESS_OR_EQUAL_5_WORDS_POINTS`, the system MUST retain only entries whose `countWords(title)` is less than or equal to `FILTER_WORD_THRESHOLD`, and MUST sort the retained list by `points` descending, breaking ties by `rank` ascending.

#### Scenario: HP-FB mixed titles
- **WHEN** Filter B (`LESS_OR_EQUAL_5_WORDS_POINTS`) is applied to a mixed set of entries
- **THEN** only entries with `countWords(title) <= FILTER_WORD_THRESHOLD` MUST be returned, sorted by `points` DESC, with equal `points` ordered by `rank` ASC

### Requirement: Secondary rank ascending tie-break
When two or more retained entries share the primary sort key for the active filter (`comments` for Filter A, `points` for Filter B), the system MUST order those entries by `rank` ascending so the lower rank appears first.

#### Scenario: EC-TIE shared primary key
- **WHEN** two retained entries share the same primary sort key under the active filter
- **THEN** the entry with the lower `rank` MUST appear before the other

### Requirement: Empty filtered result is not an error
When the input entry list is empty, or every entry is excluded by the active filter rule, the system MUST return an empty list and MUST NOT treat that outcome as a failure.

#### Scenario: EC-EMPTY empty input
- **WHEN** the strategy receives an empty entry list
- **THEN** it MUST return an empty list without raising an error

#### Scenario: EC-EMPTY all excluded
- **WHEN** every entry fails the active word-count inclusion rule
- **THEN** the result MUST be an empty list and MUST NOT be reported as an error

### Requirement: Strategy selection by filter enum
The system MUST select the Filter A or Filter B strategy from the filter enum value (`MORE_THAN_5_WORDS_COMMENTS` or `LESS_OR_EQUAL_5_WORDS_POINTS`) using Strategy Pattern behavior so filter/sort branching does not leak into HTTP controllers. Controllers MAY pass the validated filter enum into a service; they MUST NOT implement per-filter include/exclude or sort logic themselves.

#### Scenario: Enum selects matching strategy
- **WHEN** a valid filter enum value is supplied to the filter application path
- **THEN** the system MUST apply the matching Filter A or Filter B rules without HTTP-controller-level filter or sort branching

### Requirement: Offline unit tests for filter strategies
Filter strategy behavior MUST be covered by unit tests that exercise both strategies, the rank tie-break, and empty-result edges without any network I/O.

#### Scenario: Offline Vitest coverage
- **WHEN** the filter strategy unit test suite runs
- **THEN** tests MUST pass with no network dependency and MUST cover Filter A, Filter B, tie-break ordering, and empty-result cases

## ADDED Requirements

### Requirement: Non-vacuous Filter A/B happy-path evidence
Bruno Happy Path 2 and Happy Path 3 MUST NOT treat an empty JSON array alone as sufficient proof that Filter A or Filter B executed correctly. Each of those happy paths MUST fail its assertions when the response body is an empty array. Product behavior that returns `[]` for no matches (filter-strategies EC-EMPTY) remains valid at the API; it is simply not accepted as Bruno happy-path evidence. The suite MUST remain CLI-runnable for local and CI use, and CI MUST have a reliable path to satisfy non-empty Filter A and Filter B evidence (for example fixture-backed scrape in the live server under test, or an equivalent documented offline companion proven in the same change).

#### Scenario: Empty array fails HP2 assertions
- **WHEN** Happy Path 2 receives HTTP success with body `[]`
- **THEN** the Bruno happy-path assertions for Filter A MUST fail

#### Scenario: Empty array fails HP3 assertions
- **WHEN** Happy Path 3 receives HTTP success with body `[]`
- **THEN** the Bruno happy-path assertions for Filter B MUST fail

#### Scenario: CI has a reliable non-empty path
- **WHEN** CI runs the Bruno collection (or the documented companion evidence path for this change)
- **THEN** Filter A and Filter B happy-path evidence MUST be achievable without depending on lucky live HN title distributions alone

## MODIFIED Requirements

### Requirement: Happy Path 2 Filter A with JWT (HP-BR2)
The collection MUST include a Happy Path 2 request that calls the authenticated filter endpoint with a valid JWT and requests Filter A (`MORE_THAN_5_WORDS_COMMENTS`). The asserted contract MUST match Filter A: retain titles with word count greater than the named threshold (`FILTER_WORD_THRESHOLD` / >5 words) and sort by `comments` descending (ties by `rank` ascending per filter-strategies). The Happy Path assertions MUST require a non-empty result array and MUST fail when the body is `[]`.

#### Scenario: HP2 Filter A with JWT
- **WHEN** Happy Path 2 is run with a valid JWT requesting Filter A
- **THEN** the API MUST accept the authenticated request
- **AND** the response MUST be a non-empty array
- **AND** the response MUST conform to the Filter A contract: entries with `countWords(title) > FILTER_WORD_THRESHOLD`, sorted by `comments` DESC (ties `rank` ASC)

### Requirement: Happy Path 3 Filter B with JWT (HP-BR3)
The collection MUST include a Happy Path 3 request that calls the authenticated filter endpoint with a valid JWT and requests Filter B (`LESS_OR_EQUAL_5_WORDS_POINTS`). The asserted contract MUST match Filter B: retain titles with word count less than or equal to the named threshold (`FILTER_WORD_THRESHOLD` / <=5 words) and sort by `points` descending (ties by `rank` ascending per filter-strategies). The Happy Path assertions MUST require a non-empty result array and MUST fail when the body is `[]`.

#### Scenario: HP3 Filter B with JWT
- **WHEN** Happy Path 3 is run with a valid JWT requesting Filter B
- **THEN** the API MUST accept the authenticated request
- **AND** the response MUST be a non-empty array
- **AND** the response MUST conform to the Filter B contract: entries with `countWords(title) <= FILTER_WORD_THRESHOLD`, sorted by `points` DESC (ties `rank` ASC)

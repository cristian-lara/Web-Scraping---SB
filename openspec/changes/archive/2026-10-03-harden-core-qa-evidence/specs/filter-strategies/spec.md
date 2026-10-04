## ADDED Requirements

### Requirement: Nest HTTP Filter B happy path offline
In addition to offline Strategy unit tests, the backend MUST include an authenticated Nest HTTP test that requests Filter B (`LESS_OR_EQUAL_5_WORDS_POINTS`) with a valid JWT against an injected or mocked scrape producing a known entry set, and MUST assert a non-empty filtered result that matches Filter B inclusion (`countWords(title) <= FILTER_WORD_THRESHOLD`) and points-descending / rank-ascending tie-break ordering for that fixture. The test MUST NOT require live Hacker News network access.

#### Scenario: HTTP Filter B with mock scrape
- **WHEN** the Nest HTTP Filter B happy-path test runs with JWT and a mock/injected scrape
- **THEN** the response MUST be HTTP success with a non-empty Entry array
- **AND** every returned entry MUST satisfy `countWords(title) <= FILTER_WORD_THRESHOLD`
- **AND** ordering MUST match Filter B sort rules for the fixture
- **AND** the test MUST pass without calling news.ycombinator.com

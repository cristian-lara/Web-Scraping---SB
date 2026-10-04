## Purpose

Provides a committed, evaluator-facing matrix that maps CORE challenge happy paths and edge cases to concrete Vitest and Bruno tests so reviewers can see what is covered and what still needs cases.

## ADDED Requirements

### Requirement: Committed CORE scenario matrix document
The repository MUST include an English Markdown document under `docs/qa/core-scenario-matrix.md` that lists CORE scenarios for HN top-30 scrape, `countWords` / `FILTER_WORD_THRESHOLD`, Filter A/B (including boundary and ties), and Bruno API E2E happy/edge paths. Each row MUST name the scenario identifier (or OpenSpec/intake reference), the expected behavior in one short phrase, the concrete test file (and test name when practical), and a status of `PASS`, `WEAK`, or `GAP`.

#### Scenario: Matrix file present and readable
- **WHEN** an evaluator opens `docs/qa/core-scenario-matrix.md`
- **THEN** the document MUST exist in the repository as plain Markdown
- **AND** it MUST include rows for scrape top-30, word-threshold boundary, Filter A, Filter B, tie-break, empty filter result, and Bruno HP1–HP3 plus documented edges

#### Scenario: Status values are explicit
- **WHEN** a matrix row describes a scenario
- **THEN** its status MUST be exactly one of `PASS`, `WEAK`, or `GAP`
- **AND** any `GAP` or `WEAK` row MUST include a one-line note of what evidence is missing or thin

### Requirement: Matrix stays aligned with shipped tests
When CORE Vitest or Bruno tests for the scenarios in the matrix are added, removed, or materially renamed, the matrix MUST be updated in the same change so evaluators are not shown stale mappings.

#### Scenario: Test rename updates matrix
- **WHEN** a listed CORE test file or primary test name changes
- **THEN** the corresponding matrix row MUST be updated before the change is considered complete

### Requirement: README points evaluators at the matrix
The root English `README.md` MUST link to `docs/qa/core-scenario-matrix.md` from the testing or evaluation section so evaluators can find the matrix without searching the OpenSpec tree.

#### Scenario: README discovers the matrix
- **WHEN** an evaluator follows the testing/evaluation section of the root README
- **THEN** they MUST find a link or path to `docs/qa/core-scenario-matrix.md`

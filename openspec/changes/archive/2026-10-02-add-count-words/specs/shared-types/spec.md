## ADDED Requirements

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

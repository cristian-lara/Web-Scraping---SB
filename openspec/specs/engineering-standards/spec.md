## Purpose

Enforces foundation coding and delivery conventions so the monorepo stays English-first, lintable, and consistent before feature work begins.

## Requirements

### Requirement: English-only repository text
All source identifiers, comments, commit messages, and technical docs in this repository MUST be written in English.

#### Scenario: New contribution
- **WHEN** code or docs are added under the foundation scaffold
- **THEN** they MUST be in English

### Requirement: Conventional Commits
Git commits MUST follow Conventional Commits (`feat`, `fix`, `docs`, `chore`, `test`, `refactor`, …) with English summaries.

#### Scenario: Chore commit for scaffold
- **WHEN** foundation tooling is committed
- **THEN** the message MUST use a Conventional Commits type such as `chore:` or `feat:`

### Requirement: Lint and format scripts
The monorepo MUST provide ESLint and Prettier (or equivalent) scripts runnable from the root or packages.

#### Scenario: Lint script exists
- **WHEN** a developer runs the documented lint command
- **THEN** the command MUST start from a valid config (warnings allowed; fatal config errors MUST NOT occur)

### Requirement: Consistent naming conventions
Source files MUST use kebab-case names; classes PascalCase; functions/methods camelCase.

#### Scenario: New TypeScript file
- **WHEN** a foundation source file is added
- **THEN** its filename MUST be kebab-case

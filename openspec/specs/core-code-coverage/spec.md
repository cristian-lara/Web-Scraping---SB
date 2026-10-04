## Purpose

Gives evaluators and CI a Vitest-generated code-coverage report focused on CORE challenge modules (word count, scrape, filter) with explicit thresholds and documented how-to, without requiring whole-repo 100% coverage.

## Requirements

### Requirement: CORE coverage tooling and reports
The monorepo MUST provide a documented command (PNPM script and Makefile target) that runs Vitest with coverage for CORE modules covering at least: `countWords` / shared filter threshold surface in `@repo/shared-types`, backend scraping adapters/services used for top-30 extraction, and backend filtering apply/strategies (and Nest filter HTTP tests when they live beside those modules). The run MUST emit HTML and LCOV reports under a gitignored `coverage/` output path (or per-package coverage dirs that are gitignored).

#### Scenario: Local coverage report generation
- **WHEN** a contributor runs the documented coverage command
- **THEN** the command MUST exit zero on a healthy tree that meets CORE thresholds
- **AND** an HTML report MUST be produced under the documented coverage output path
- **AND** an LCOV report MUST be produced for CI artifact use

#### Scenario: Coverage output not committed
- **WHEN** coverage reports are generated
- **THEN** report output directories MUST be gitignored
- **AND** committing HTML/LCOV blobs MUST NOT be required for a green tree

### Requirement: CORE coverage thresholds fail the run
Coverage configuration MUST define numeric floors for CORE include paths (lines and/or branches as configured). When measured CORE coverage falls below those floors, the coverage command MUST exit non-zero. The repository MUST NOT require a global 100% line-coverage gate across frontend chrome, Nest bootstrap, or unrelated packages.

#### Scenario: Under-threshold CORE fails
- **WHEN** CORE coverage for an included path falls below the configured floor
- **THEN** the coverage command MUST fail

#### Scenario: No whole-repo 100% gate
- **WHEN** coverage configuration is reviewed
- **THEN** it MUST NOT mandate 100% coverage for the entire monorepo

### Requirement: CI runs CORE coverage and uploads artifacts
GitHub Actions CI MUST run the CORE coverage command (or an equivalent documented CI step) on pull requests and default-branch pushes. On success or failure of the coverage step after report generation, CI MUST upload HTML and/or LCOV as a workflow artifact when the runner produced report files. A CORE threshold breach MUST fail the workflow.

#### Scenario: CI coverage step exists
- **WHEN** CI runs the quality workflow
- **THEN** it MUST invoke CORE coverage generation
- **AND** a CORE threshold breach MUST fail the workflow

#### Scenario: Evaluator can download coverage artifact
- **WHEN** a CI run has produced coverage report files
- **THEN** those files MUST be available as a GitHub Actions artifact named in README or workflow comments

### Requirement: README documents coverage for evaluators
The root English `README.md` MUST document how to generate CORE coverage locally and how to open the HTML report, and MUST state that thresholds apply to CORE modules only.

#### Scenario: README coverage how-to
- **WHEN** an evaluator reads the testing section of the root README
- **THEN** they MUST find commands to generate and open CORE coverage HTML
- **AND** they MUST be told thresholds apply to CORE modules, not the whole monorepo

## Purpose

Lets an evaluator clone, install, run, test, and identify the Milestone-3 MVP snapshot without tribal knowledge, using English docs, Make targets, and git tag v1.0.0-mvp.

## ADDED Requirements

### Requirement: English README covers architecture and how to run
Root `README.md` MUST be English and MUST cover: architecture overview, key decisions (BFF, Zod shared types, filters, JWT, SQLite, observability), install steps, how to run dev, how to run Vitest, and how to run Bruno E2E (`@usebruno/cli`). It MUST mention tag `v1.0.0-mvp` as the MVP snapshot name.

#### Scenario: Evaluator can follow README
- **WHEN** an evaluator reads the root README
- **THEN** they MUST find install, dev, Vitest, and Bruno E2E instructions in English
- **AND** they MUST find architecture/decision context sufficient to run the local MVP

### Requirement: Makefile maps install, dev, test, e2e, lint
A root `Makefile` MUST provide at least `make install`, `make dev`, `make test`, `make test-e2e`, and `make lint`, each mapping to real monorepo commands documented in the README. Following README plus `make install` MUST yield a runnable local MVP with env examples documented and no committed secrets.

#### Scenario: Make targets exist and are documented
- **WHEN** a developer runs the documented Make targets
- **THEN** `install`, `dev`, `test`, `test-e2e`, and `lint` MUST invoke the corresponding workspace commands

### Requirement: Warning-free MVP build and git tag
The repo MUST build without warnings treated as release blockers for MVP. After F3-1…F3-3 acceptance evidence is green, maintainers MUST create git tag `v1.0.0-mvp` pointing at the release commit. Publishing npm packages or a full GitHub Release asset set MUST NOT be required.

#### Scenario: Warning-free build is a release blocker
- **WHEN** an evaluator runs the documented workspace build (`pnpm build` or equivalent Make target)
- **THEN** the command MUST exit 0
- **AND** warnings treated as MVP release blockers MUST NOT remain

#### Scenario: Tag name matches intake
- **WHEN** the MVP snapshot is marked
- **THEN** the git tag MUST be named exactly `v1.0.0-mvp`
- **AND** the README MUST mention that tag name

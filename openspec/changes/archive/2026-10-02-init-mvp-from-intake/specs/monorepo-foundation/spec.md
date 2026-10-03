## Purpose

Provides the monorepo skeleton and hello-world smoke path so later feature changes have linked workspaces and runnable root scripts.

## ADDED Requirements

### Requirement: Monorepo structure with workspaces
The system SHALL organize code in a monorepo with workspaces that include at least `apps/backend`, `apps/frontend`, and `packages/shared-types`.

#### Scenario: Workspaces recognized
- **WHEN** a developer runs dependency install at the monorepo root
- **THEN** backend, frontend, and shared-types workspaces MUST be linked for local development

### Requirement: Root orchestration scripts
The system SHALL expose root scripts for test (and preferably lint/dev) via the monorepo orchestrator.

#### Scenario: Unified test command
- **WHEN** a developer runs the root test command
- **THEN** configured workspace test scripts MUST execute

### Requirement: Hello-world smoke
The monorepo MUST include a trivial shared-package export covered by a passing unit test that proves the workspace toolchain works.

#### Scenario: Hello test green
- **WHEN** the shared-types package tests run
- **THEN** a hello/smoke unit test MUST pass without network access

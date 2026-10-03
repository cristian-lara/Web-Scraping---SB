## Why

The repo needs a runnable monorepo skeleton before feature work. Without workspaces, shared tooling, and a hello-world smoke path, later OpenSpec changes cannot land incrementally. Product MVP scope stays in the intake SSOT and `docs/BACKLOG.md`—**not** in this change’s implementation tasks.

## What Changes

- Establish PNPM Workspaces + Turborepo with `apps/backend`, `apps/frontend`, and `packages/shared-types`.
- Wire TypeScript baseline, Vitest, ESLint, and Prettier at the root.
- Deliver a **hello-world** smoke: `pnpm install` links workspaces and `pnpm test` runs at least one passing unit test from a workspace package.
- Record English-only + Conventional Commits + Cursor rules as foundation engineering standards.
- Publish a phased product backlog (`docs/BACKLOG.md` + `docs/backlog/F*-*.md`) with **detailed user stories** derived from `cursor-intake-spec-v7.md`, produced via **parallel subagents** (F1/F2/F3), each story with role/goal/benefit, acceptance criteria, and a kebab-case OpenSpec change name.
- Explicitly **defer** domain scraping, filters, auth, persistence, UI, Bruno, Sentry, and full CI to those backlog-driven changes.

## Capabilities

### New Capabilities
- `monorepo-foundation`: PNPM + Turborepo workspaces (`apps/backend`, `apps/frontend`, `packages/shared-types`) with root scripts and a hello-world smoke test path.
- `engineering-standards`: Foundation conventions—English-only repository text, Conventional Commits, ESLint/Prettier scripts, consistent naming; Cursor agent rules under `.cursor/rules/` (not OpenSpec capabilities).

### Modified Capabilities
<!-- None -->

## Impact

- This change delivers **environment + skeleton only**, not the HN scraper MVP.
- Product roadmap / user stories → future changes: see `docs/BACKLOG.md`.
- Business vision remains `cursor-intake-spec-v7.md`.
- Apply is a single small slice (no multi-phase MVP apply).

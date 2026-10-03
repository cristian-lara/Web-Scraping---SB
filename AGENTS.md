# AGENTS.md

This repository uses OpenSpec + Cursor agent rules.

## Source of truth
- Intake SSOT: `cursor-intake-spec-v7.md`
- Active change: `openspec/changes/init-mvp-from-intake/`
- Main specs (after archive): `openspec/specs/`
- Config: `openspec/config.yaml` (Language: English)

## Cursor rules (always on)
- `.cursor/rules/ponytail-yagni.mdc` — YAGNI / minimal implementation
- `.cursor/rules/caveman-communication.mdc` — terse chat; preserve user language
- `.cursor/rules/english-and-commits.mdc` — English repo text + Conventional Commits

## Conventions
- Import DTOs/schemas from `@repo/shared-types`
- Thin controllers + Swagger; services throw typed exceptions
- TDD fail-first for domain logic; slice gates N.5/N.6 in OpenSpec tasks

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->

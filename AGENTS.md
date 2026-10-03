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

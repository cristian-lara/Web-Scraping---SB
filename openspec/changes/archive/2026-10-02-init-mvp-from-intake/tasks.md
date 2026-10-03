# Apply: single foundation slice (hello world). Product features → docs/BACKLOG.md.

## 1. Foundation workspace + hello world

- [x] 1.1 Ensure PNPM workspaces + Turborepo root (`pnpm-workspace.yaml`, `turbo.json`, root `package.json`) with `apps/backend`, `apps/frontend`, `packages/shared-types` — verify: `pnpm install` links all three
- [x] 1.2 Keep `@repo/shared-types` as a minimal package with a trivial `hello()` export (no domain schemas yet) — verify: package builds/exports
- [x] 1.3 Write failing Vitest for `hello()`, then implement until green — verify: `pnpm --filter @repo/shared-types test` exit 0
- [x] 1.4 Ensure backend/frontend workspace packages exist as placeholders (package.json + README) without Nest/Vite feature code — verify: listed in `pnpm-workspace.yaml` and install succeeds
- [x] 1.5 **Slice review:** `pnpm install` + root `pnpm test` (or filter shared-types) exit 0 — verify: hello test green
- [x] 1.6 **Slice audit:** table 1.1–1.5 → PASS — verify: note in `openspec/changes/init-mvp-from-intake/SLICE-AUDIT.md`

## 2. Tooling, docs, backlog (user stories from intake via subagents)

- [x] 2.1 ESLint + Prettier root configs and scripts (`lint` / `format`) — verify: scripts exist and run without fatal config errors
- [x] 2.2 `AGENTS.md` + `docs/CHECKS.md` point to OpenSpec, intake, and `.cursor/rules` (ponytail, caveman, english-and-commits) — verify: three rule paths referenced
- [x] 2.3 Launch **three parallel subagents** (F1 domain / F2 product / F3 ops) that read `cursor-intake-spec-v7.md` and draft detailed user stories (As a… I want… So that… + acceptance criteria + proposed OpenSpec change id) — verify: each subagent output captured under `docs/backlog/` or merged notes
- [x] 2.4 Merge subagent drafts into `docs/BACKLOG.md` (phases F0–F3, stories → kebab change names, ready to drive `/opsx-propose`) — verify: file covers intake milestones 1–3 without implementing them here
- [x] 2.5 Confirm `openspec/config.yaml` Language English and intake SSOT is English — verify: spot-check
- [x] 2.6 **Slice review:** docs + backlog + lint script smoke — verify: checklist OK
- [x] 2.7 **Slice audit:** table 2.1–2.6 → PASS; foundation change ready to archive after validate — verify: note in SLICE-AUDIT.md

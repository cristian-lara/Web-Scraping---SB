## Context

Greenfield repo with English intake SSOT and OpenSpec. This design covers **foundation only**: monorepo skeleton + hello world. Full MVP is planned in `docs/BACKLOG.md` and built via later OpenSpec changes.

## Goals / Non-Goals

**Goals:**
- Runnable PNPM + Turborepo monorepo with three workspaces.
- Shared TypeScript baseline; lint/format/test scripts at root.
- Hello-world proof: install + at least one passing Vitest in `@repo/shared-types`.
- Agent/docs pointers (`AGENTS.md`, `docs/CHECKS.md`, `.cursor/rules`).
- Phased backlog with user stories → future change names.

**Non-Goals (deferred to backlog changes):**
- HN scraping, `countWords`, filter strategies.
- NestJS feature modules, JWT, Prisma, React UI, Bruno, Sentry, full CI/CD release.
- OpenAPI/Swagger on controllers (comes with first API change).

## TDD-DESIGN

| Slice | First failing test | Turns green |
|-------|--------------------|-------------|
| ##1 hello | `@repo/shared-types` hello/smoke test fails until package exports a trivial function | `hello()` (or equivalent) + Vitest |

## Certainty

**Grill:** N/A for foundation bootstrap; product certainty deferred to feature changes (cite intake + backlog).

| Claim | Level | RUNTIME | Notes |
|-------|-------|---------|-------|
| PNPM workspaces + Turbo fit this repo | B | B | Pin majors at install |
| Hello-world Vitest proves linkage | S | S | Required by tasks |
| MVP features out of this change | S | S | Backlog owns them |
| Critical U | — | — | None for foundation |

## Decisions

### Decision 1: Foundation change vs product backlog
- **Choice:** This change = skeleton + hello world + **intake-derived backlog** (detailed user stories via parallel subagents → `docs/backlog/` + index `docs/BACKLOG.md`). Product implementation is later OpenSpec changes spawned from those stories.
- **Rationale:** Separates planning backlog from mega-apply; each story maps to one small change.

### Decision 2: Minimal shared-types package
- **Choice:** `@repo/shared-types` ships a trivial export + Vitest smoke (not full Zod domain schemas yet).
- **Rationale:** Proves workspace linking; domain schemas arrive in `add-shared-domain-types`.

### Decision 3: Placeholder apps
- **Choice:** `apps/backend` and `apps/frontend` exist as workspace packages with package.json + README placeholders until feature changes.
- **Rationale:** Monorepo shape matches intake without implementing Nest/Vite features now.

### Decision 4: Engineering standards (foundation subset)
- **Choice:** English-only, Conventional Commits, ESLint/Prettier, naming; Cursor rules always-on.
- **Rationale:** Enforceable from day one; API/Swagger/exception patterns land with first BFF change.

## Risks / Trade-offs

- **[Risk] Premature domain code in tree** → Mitigation: strip scraper/countWords/schemas from foundation; restore via backlog changes.
- **[Trade-off] Empty-ish apps** → Acceptable; Hello World lives in `shared-types` smoke test.

## Migration Plan

1. Align artifacts to foundation scope; remove out-of-scope delta specs from this change.
2. Apply tasks → `pnpm install` + `pnpm test` green.
3. Archive this change → promote `monorepo-foundation` + `engineering-standards` to main specs.
4. Open next change from backlog (e.g. `add-shared-domain-types`).

# Checks

Local quality gates for this repo (filled as packages land):

| Check | Command | Notes |
|-------|---------|-------|
| Install | `pnpm install` | Root workspaces |
| Unit tests | `pnpm test` | Vitest via Turborepo |
| Lint | `pnpm lint` | ESLint |
| Format | `pnpm format` | Prettier |
| OpenSpec | `openspec validate <active-change> --strict` | Next: F2-1 `add-filter-strategies` |

See `AGENTS.md` and `.cursor/rules/` for agent policy.

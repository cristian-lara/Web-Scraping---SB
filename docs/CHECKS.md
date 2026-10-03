# Checks

Local quality gates for this repo (filled as packages land):

| Check | Command | Notes |
|-------|---------|-------|
| Install | `pnpm install` | Root workspaces |
| Unit tests | `pnpm test` | Vitest via Turborepo |
| Lint | `pnpm lint` | ESLint |
| Format | `pnpm format` | Prettier |
| OpenSpec | `openspec validate <active-change> --strict` | When a change is open |

See `AGENTS.md` and `.cursor/rules/` for agent policy.

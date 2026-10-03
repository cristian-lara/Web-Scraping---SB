# Checks

Local quality gates for this repo (filled as packages land):

| Check | Command | Notes |
|-------|---------|-------|
| Install | `pnpm install` | Root workspaces |
| Unit tests | `pnpm test` | Vitest via Turborepo |
| Lint | `pnpm lint` | ESLint |
| Format | `pnpm format` | Prettier |
| OpenSpec | `openspec validate add-hn-scraper-fixture --strict` | Active change |

See `AGENTS.md` and `.cursor/rules/` for agent policy.

# Web-Scraping---SB

Hacker News scraper MVP (challenge).

## Branching

| Branch | Role |
|--------|------|
| `main` | Stable / release only |
| `develop` | Integration line for completed stories |
| `feature/<story-id>-<slug>` | One OpenSpec change / user story |

Flow: `feature/*` → PR → `develop` → (release) PR → `main` + tag `vX.Y.Z`.

Local gestor notes live under `projects/**/_local/` and are gitignored.

# INSPECTION

- at: 2026-10-02T23:28:46Z
- cite_prior: propose-audit/20261002-181410/INSPECTION.md
- deltas: empty-state + pagination Non-Goal now in design/frontend-ui; English SSOT

## A — Happy paths
| ID | Path | Plan cite |
|----|------|-----------|
| A1 | Auth → JWT | auth-security · tasks ##4 |
| A2 | Filter A | filtering · ##3 |
| A3 | Filter B | filtering · ##3 |
| A4 | Scrape 30 offline | hn-scraping · ##2 |
| A5 | UsageLog persist | usage-persistence · ##5 |
| A6 | UI table + empty | frontend-ui · ##6 |
| A7 | Correlation trail | observability · ##8 |
| A8 | Bruno happy | api-e2e-bruno · ##7 |

## B — Edges
| ID | Edge | Plan cite |
|----|------|-----------|
| B1 | 401 | auth-security · Bruno |
| B2 | 400 invalid filter | shared-types · Bruno |
| B3 | 429 | auth-security · ##5 |
| B4 | default points/comments 0 | hn-scraping |
| B5 | countWords edges | filtering · ##2 |
| B6 | <30 entries | hn-scraping |
| B7 | typed exceptions | engineering-standards · ##5 |
| B8 | ErrorBoundary | observability · ##9 |
| B9 | no secrets in logs | observability · ##8 |
| B10 | empty UI | frontend-ui · ##6.3 |

## C — UI surfaces
Login, filter A/B, table columns, loading/error/empty — specified. Pagination explicitly Non-Goal.

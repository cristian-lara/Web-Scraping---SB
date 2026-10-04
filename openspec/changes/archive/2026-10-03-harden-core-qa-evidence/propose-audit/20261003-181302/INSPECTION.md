# INSPECTION (propose-audit written — no ticket-audit cite)

- at: 2026-10-03T23:13:02Z
- change: harden-core-qa-evidence
- packs: challenge-core scrape/filter + API E2E (no ui-surfaces)

## A — Happy paths (plan must cover)

| ID | Path | Plan cite |
|----|------|-----------|
| HP-SCRAPE-30 | Offline fixture → exactly 30 entries | hn-scraper delta + tasks 1.x |
| HP-RANK-SLICE | Ranks 1..30 + surplus excluded | hn-scraper ADDED + tasks 1.1–1.2 |
| HP-FA / HP-FB | Filter A/B unit (existing) + HTTP B new | filter-strategies ADDED + tasks 2.x |
| HP-BR1 | Auth JWT | existing Bruno (matrix row) |
| HP-BR2 / HP-BR3 | Non-empty Filter A/B Bruno | bruno-e2e MODIFIED + tasks 3.x |
| HP-COV | CORE coverage HTML/LCOV + threshold | core-code-coverage + tasks 4.x |
| HP-MATRIX | Evaluator matrix PASS/WEAK/GAP | qa-scenario-matrix + tasks 5.x |

## B — Edges / deltas

| ID | Edge | Plan cite |
|----|------|-----------|
| EC-EMPTY | API `[]` still valid product | design D3; bruno-e2e Purpose text |
| EC-VACUOUS | `[]` must fail Bruno HP | bruno-e2e ADDED + 3.1–3.2 |
| EC-HN-FLAKE | Live HN no matches | D3 fixture env CI |
| EC-FIX-ENV | Default remains live scrape | design Risks |
| EC-THRESH | Coverage under floor fails | core-code-coverage + 4.3–4.4 |
| EC-401/400/429 | Bruno edges remain | matrix; not re-specified as MODIFIED |

## C — Gaps for HAPPY/EDGE lenses

- No prior ticket `INSPECTION.md` — this file is the cite.
- Fixture env wiring not yet in code (`scraping.service.ts` live-only) — expected; tasks 3.3 must land with tests.

# Lente SCOPE

- at: 2026-10-03T23:13:02Z
- prompt_focus: Every proposal capability/claim → task + spec cite
- files_reviewed:
  - openspec/changes/harden-core-qa-evidence/proposal.md
  - openspec/changes/harden-core-qa-evidence/tasks.md
  - openspec/changes/harden-core-qa-evidence/specs/**/*.md

## Claim register

| Claim / AC | Spec | Task | PASS\|GAP |
|------------|------|------|-----------|
| Scenario matrix docs/qa + PASS/WEAK/GAP | qa-scenario-matrix | 5.1–5.3 | PASS |
| CORE coverage HTML/LCOV + scripts/Makefile | core-code-coverage | 4.1–4.2, 4.5 | PASS |
| CORE thresholds fail under floor | core-code-coverage | 4.3 | PASS |
| CI coverage step + artifact upload | core-code-coverage | 4.4 | PASS |
| Bruno HP2/HP3 non-empty (not vacuous []) | bruno-e2e | 3.1–3.2 | PASS |
| CI reliable non-empty path (fixture) | bruno-e2e ADDED | 3.3–3.5 | PASS |
| Scraper ranks 1..30 + surplus exclude | hn-scraper | 1.1–1.3 | PASS |
| Nest HTTP Filter B offline | filter-strategies | 2.1–2.3 | PASS |
| No Playwright / no global 100% | proposal out + design NG | — (negative scope) | PASS |
| Preserve EC-EMPTY product semantics | bruno-e2e + design D3 | 3.x docs | PASS |

- findings:
  - All positive What Changes bullets map to specs + tasks.
  - Negative scope (Playwright) not tasked — OK as non-goal.
- veredicto_lente: PASS

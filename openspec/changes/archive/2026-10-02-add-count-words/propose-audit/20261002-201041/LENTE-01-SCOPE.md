# Lente SCOPE

- at: 2026-10-02T20:11:00-05:00
- prompt_focus: F1-2 AC ↔ tasks/specs
- files_reviewed:
  - docs/backlog/F1-domain-user-stories.md (§ F1-2)
  - proposal.md, tasks.md, specs/shared-types/spec.md
  - cursor-intake-spec-v7.md §2.2

| Claim | Evidence | PASS\|GAP |
|-------|----------|-----------|
| Canonical → 5 fail-first | tasks 1.1–1.2; spec Canonical; intake §2.2 | PASS |
| trim + collapse `\s+` | design TDD-DESIGN; spec Trim scenario; intake algo 1 | PASS |
| symbol-only excluded | spec Symbol-only; tasks 1.1–1.2; intake algo 2 | PASS |
| compounds = 1 | spec Compound; intake algo 3 | PASS |
| named constant / export | spec Named symbol-token; tasks 1.2–1.3; §1.10 | PASS |
| Vitest offline + edges | tasks 1.5; spec Offline unit tests | PASS |
| OOS filters/threshold/Cheerio | proposal What Changes; design Non-Goals; F1-2 OOS | PASS |

- veredicto_lente: PASS

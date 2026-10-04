# Lente EDGE

- at: 2026-10-04T03:28:28Z
- prompt_focus: Edges for retry class, fixture, correlation silence
- files_reviewed:
  - openspec/changes/add-polite-hn-fetch/propose-audit/20261003-222828/INSPECTION.md
  - openspec/changes/add-polite-hn-fetch/design.md
  - openspec/changes/add-polite-hn-fetch/specs/hn-scraper/spec.md

- claims:
  | Afirmación | Evidencia | PASS\|GAP |
  |------------|-----------|-----------|
  | EC-403-429 no retry | specs + tasks 1.5 + design D4 | PASS |
  | EC-RETRY-FAIL → existing 502 | design D4 | PASS |
  | EC-NO-CORR log silence | design Risks | PASS |
  | EC-OFFLINE-TEST | specs Policy unit tests | PASS |
  | EC-STALE-TTL | tasks 1.2 | PASS |

- findings:
  - Edges covered; no FE ui-surfaces needed.
- veredicto_lente: PASS

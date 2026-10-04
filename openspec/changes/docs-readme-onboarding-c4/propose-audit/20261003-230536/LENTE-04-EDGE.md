<!--
SPDX-FileCopyrightText: 2026 Vicente Adrian Eguez Sarzosa (cédula 1718137159, Ecuador) — Manticore Labs
SPDX-License-Identifier: LicenseRef-Manticore-Proprietary
-->
# Lente EDGE

- at: 2026-10-04T04:05:36Z
- prompt_focus: Host/Docker/Grafana drift edges in plan
- files_reviewed:
  - openspec/changes/docs-readme-onboarding-c4/propose-audit/20261003-230536/INSPECTION.md
  - openspec/changes/docs-readme-onboarding-c4/design.md
  - openspec/changes/docs-readme-onboarding-c4/tasks.md

- claims:
  | Edge | Plan cite | PASS\|GAP |
  |------|-----------|-----------|
  | B1 host without Docker | design Goals; task 3.1 dual path | PASS |
  | B2 CI without Grafana | task 3.3 preserve CI note (present in current README) | PASS |
  | B3 dashboard title drift | design Risks + task 3.2 verify live titles | PASS |
  | B4 PNG clipped | task 2.2 | PASS |
  | B5 secrets via env | task 3.3 | PASS |
  | B6 E2E fixture | task 3.3 | PASS |
  | B7 no C4 code level | design Non-Goals | PASS |

- findings: Edges from INSPECTION B covered; no ui-surfaces FE product change.
- veredicto_lente: PASS

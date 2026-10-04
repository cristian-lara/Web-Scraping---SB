<!--
SPDX-FileCopyrightText: 2026 Vicente Adrian Eguez Sarzosa (cédula 1718137159, Ecuador) — Manticore Labs
SPDX-License-Identifier: LicenseRef-Manticore-Proprietary
-->
# Lente SCOPE

- at: 2026-10-04T04:09:00Z
- prompt_focus: Every proposal claim has a task cite (not proposal-only)
- files_reviewed:
  - openspec/changes/docs-readme-onboarding-c4/proposal.md
  - openspec/changes/docs-readme-onboarding-c4/tasks.md
  - openspec/changes/docs-readme-onboarding-c4/design.md

## Claim register

| Claim (from proposal What Changes) | Task / design cite | PASS\|GAP |
|------------------------------------|--------------------|-----------|
| Reorganize README evaluator-first | tasks.md 3.1 | PASS |
| Keep/tighten ops content (Save, requestId, OTLP, coverage, matrix, E2E fixture) | tasks.md 3.3 | PASS |
| Document Grafana home + request list + Explore + spans/attrs | tasks.md 3.2 | PASS |
| C4 C1–C3 Mermaid + PNG + regenerate note | tasks.md 1.1–1.4, 2.1–2.2 | PASS |
| Link PNGs from README Architecture | tasks.md 3.4 | PASS |
| No runtime/API/CI behavior change | proposal Impact + design Non-Goals; tasks have no code paths | PASS |
| Ground truth Make/Compose/otel/Grafana | tasks.md 3.2, 3.4, 4.2 | PASS |
| Slice gates before next group | design.md Decision 7; tasks 1.5/1.6, 2.5/2.6, 3.5/3.6, 4.5/4.6 | PASS |

- findings:
  - No ticket AC list; SCOPE uses proposal bullets as AC surrogate — OK for docs-only.
  - Recheck: prior FAIL was gates-only; claim→task map still intact after N.5/N.6 insert.
- veredicto_lente: PASS

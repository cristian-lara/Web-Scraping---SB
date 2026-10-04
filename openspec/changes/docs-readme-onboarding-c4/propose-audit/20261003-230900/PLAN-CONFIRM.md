<!--
SPDX-FileCopyrightText: 2026 Vicente Adrian Eguez Sarzosa (cédula 1718137159, Ecuador) — Manticore Labs
SPDX-License-Identifier: LicenseRef-Manticore-Proprietary
-->
# PLAN-CONFIRM — docs-readme-onboarding-c4

- run_id: 20261003-230900
- audit: PASS (recheck of 20261003-230536)
- role authorizing apply: DEV (human)

## Objective

Evaluator-first root README + C1–C3 architecture diagrams (Mermaid + PNG), with Grafana/OTel wording synced to live provisioned dashboards and span attrs. Docs-only (`skip_specs: true`).

## In scope

- `README.md` reorganize (objective → stack → prereqs → host → Docker/Grafana → commands → verify → layout/CI)
- `docs/architecture/` C1–C3 `.mmd` + PNG + short regenerate README
- Sync Home **BFF at a glance**, Local obs **BFF request list**, Explore Tempo by `request.id`; spans + `hn.fetch.*`
- Preserve Save/requestId/coverage/matrix/fixture/secrets-via-env content
- Slice gates ##1→##4 with N.5/N.6 hard stops

## Out of scope

- Nest/React/Compose/Grafana JSON code changes
- C4 Code level
- Permanent mermaid-cli workspace dependency
- Spanish README

## Task groups

1. C4 Mermaid sources + architecture README  
2. PNG render + legibility  
3. README onboarding rewrite + image links  
4. `openspec validate --strict` + manual command/path pass  

## Key decisions (design)

1. Rebase on live develop (not old “no OTel” draft)  
2. C2 includes full local obs containers  
3. C3 = BFF modules + FE Login/Filters/Save  
4. Short Grafana verify block  
5. `npx mmdc` for PNGs  
6. `skip_specs: true`  
7. N.5/N.6 per group before next  

## Top certainty / residual

- Live spotcheck already matches claimed Grafana titles + otel attrs (E-ish for docs facts).
- Residual: re-read titles/attrs at apply if working tree still moves.

## Outsider questions (1–3)

1. ¿El README debe mencionar `hn.fetch.wait_ms` en el bloque corto de verify, o solo `hn.fetch.outcome`?
2. ¿PNGs se commitean en el mismo PR que el README (plan dice sí — confirmar)?
3. ¿Algún diagrama C3 debe nombrar módulos Nest exactos del árbol actual, o labels de producto bastan?

## Human confirm

**Chosen: A** (2026-10-04) — user pre-authorized apply on audit PASS; apply subagent started.

`A.` proceder a apply  
`B.` editar plan (invalida PASS → re-audit)  
`C.` aclarar  
`D.` hotfix explícito (raro; anotar META)

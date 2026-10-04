# Lente VERIFY

- at: 2026-10-03T23:13:02Z
- prompt_focus: Falsifiable done per delivery task; N.5/N.6 per group
- files_reviewed:
  - openspec/changes/harden-core-qa-evidence/tasks.md
  - openspec/changes/archive/2026-10-03-add-mvp-product-vertical/tasks.md (repo pattern)

## Done table (sample + gates)

| task_id | done = (comando / paths) | stub? | PASS\|FAIL |
|---------|--------------------------|-------|------------|
| 1.1 | Vitest asserts ranks 1..30 | no | PASS |
| 1.2 | Vitest surplus title absent | no | PASS |
| 1.3 | `pnpm --filter @repo/backend test` | no | PASS |
| 2.1–2.3 | HTTP Filter B green offline | no | PASS |
| 3.1–3.5 | Bruno length>=1; fixture env; e2e:ci | no | PASS |
| 4.1–4.5 | coverage config; Makefile; CI upload | no | PASS |
| 5.1–5.3 | matrix file + README link | no | PASS |
| 6.1–6.3 | test+coverage+e2e; openspec validate; audit note | no | PASS |
| **1.5 / 1.6** | missing | — | **FAIL** |
| **2.5 / 2.6** | missing | — | **FAIL** |
| **3.5 / 3.6** | 3.5 is Bruno run, not slice review; no 3.6 | — | **FAIL** |
| **4.5 / 4.6** | 4.5 is README docs, not slice review; no 4.6 | — | **FAIL** |
| **5.5 / 5.6** | missing | — | **FAIL** |
| **6.5 / 6.6** | missing (6.3 is close audit only) | — | **FAIL** |

- findings:
  - Individual verify: clauses are generally falsifiable (good).
  - Repo canon (archived F2 tasks) uses **N.5 slice review** + **N.6 slice audit** per group — **absent** here.
  - Group ##3 task 3.5 collides with gate numbering (Bruno run vs slice review).
- veredicto_lente: FAIL

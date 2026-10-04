<!--
SPDX-FileCopyrightText: 2026 Vicente Adrian Eguez Sarzosa (cédula 1718137159, Ecuador) — Manticore Labs
SPDX-License-Identifier: LicenseRef-Manticore-Proprietary
-->
# Inspection (docs-only — written for propose-audit)

No ticket `INSPECTION.md` found for this change. Pack: onboarding docs + local ops diagrams.

## A — Happy paths (plan)

| ID | Path | Acceptance (observable) |
|----|------|-------------------------|
| A1 | Host quick start | Follow README: install → env → migrate → `make dev` → login UI → Filter A/B |
| A2 | Docker ecosystem | `make up` → API :3000 + UI :5173 + Grafana :3001 |
| A3 | Grafana read | After Filter traffic: Home **BFF at a glance** → Local obs **BFF request list** → Explore Tempo by `request.id` |
| A4 | Quality commands | `pnpm build`, `make test`, `make test-coverage`, `make test-e2e` (BFF up), `make lint` documented |
| A5 | C4 visuals | README Architecture links C1–C3 PNGs under `docs/architecture/` with Mermaid sources |

## B — Edges / limits

| ID | Edge | Plan handling |
|----|------|---------------|
| B1 | Host without Docker | Compose/Grafana optional; `make dev` path standalone |
| B2 | CI without Grafana | README keeps “CI does not start Compose/Grafana” |
| B3 | Dashboard title drift | Task 3.2 verify against live `deploy/grafana/**` + `otel.constants.ts` at apply |
| B4 | PNG unreadable / clipped | Task 2.2 re-render scale |
| B5 | Secrets in images | Preserve Compose secrets-via-env wording (3.3) |
| B6 | E2E vacuous scrape | Keep `E2E_SCRAPE_FIXTURE` note (3.3) |
| B7 | C4 Code level | Explicit non-goal |

## C — Out of scope

App code, Compose service changes, Grafana JSON edits, Bruno collection changes, C4 level 4, Spanish README.

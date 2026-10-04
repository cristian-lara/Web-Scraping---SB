## Why

Evaluators still need a crisp onboarding story: what the MVP does, prerequisites, host vs Docker paths, build/test/coverage, and how to read local Grafana after `make up`. The root README already documents Compose + provisioned dashboards, but it remains command-heavy without a clear objective-first layout, and there are no C4 diagrams. Meanwhile the live stack grew past “Explore Tempo only” (home dashboard, stage tables, polite-fetch span attributes), so any onboarding rewrite must mirror **current** Grafana/OTel facts—not the earlier explore draft.

## What Changes

- Reorganize root `README.md` **evaluator-first**: objective → stack → prerequisites → host quick start → Docker ecosystem → command cheat sheet (install/dev/build/test/coverage/e2e/lint/up/down) → verify/smoke (UI + Grafana) → short layout/CI notes.
- Keep and tighten existing accurate ops content already on `develop` (SavedFilterResult, `requestId` on UsageLog, OTLP, Grafana ports, `make test-coverage`, scenario matrix link, `E2E_SCRAPE_FIXTURE` note). Remove leftover noise (e.g. premature milestone-tag wording) where it fights onboarding.
- Document Grafana as it exists today after `make up`:
  - Home dashboard **BFF at a glance** (`bff-overview.json`, default via `GF_DASHBOARDS_DEFAULT_HOME_DASHBOARD_PATH`)
  - **Dashboards → Local obs → BFF request list** (`bff-request-timings.json`) for per-stage tables
  - **Explore → Tempo** for a single-request waterfall via `request.id` / `x-request-id`
  - Span names: `scrape.live`, `filter.run`, `usageLog.write`; polite-fetch attrs `hn.fetch.outcome` (`cache`|`live`|`retry`) and optional `hn.fetch.wait_ms`
- Add C4 diagrams through **level 3** under `docs/architecture/`: Mermaid sources + PNGs (C1 Context, C2 Containers including OTel/Loki/Tempo/Grafana, C3 Components for BFF modules + FE Login/Filters/Save), with regenerate notes; link PNGs from README Architecture.

No runtime API/schema/CI behavior changes in this change. **Not BREAKING.**

## Capabilities

### New Capabilities

None. Documentation and diagrams only (`skip_specs: true` in `.openspec.yaml`).

### Modified Capabilities

None.

## Impact

- Docs: root `README.md`; new `docs/architecture/*` (`.mmd`, `.png`, short `README.md`)
- Ground truth for ops facts: `Makefile`, `docker-compose.yml`, `deploy/grafana/provisioning/**`, `apps/backend/src/common/otel.constants.ts`, Bruno/`E2E_SCRAPE_FIXTURE` notes
- Optional tool: `@mermaid-js/mermaid-cli` via `npx` to render PNGs (not a new workspace dependency unless apply proves necessary)
- Related completed/nearby work (do not re-implement): `add-local-obs-save-results`, polite HN fetch + `hn.fetch.*` OTel attrs, CORE coverage / scenario matrix already linked from README

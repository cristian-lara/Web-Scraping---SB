## Context

See `proposal.md` for motivation. On `develop` (2026-10-04 verification):

- `add-local-obs-save-results` is **complete**. Compose + OTel bootstrap + Save results are live.
- Root README already covers Docker ports, Grafana home + request-list dashboards, Explore Tempo, coverage (`make test-coverage`), and `docs/qa/core-scenario-matrix.md`.
- Grafana provisioning: folder **Local obs**, datasources Tempo (default) + Loki, JSON dashboards `bff-overview.json` (**BFF at a glance**, Compose home) and `bff-request-timings.json` (**BFF request list**).
- OTel service `hn-scraper-bff`; spans `filter.run` / `scrape.live` / `usageLog.write`; attrs `request.id`, `hn.fetch.outcome`, `hn.fetch.wait_ms`.
- Makefile: `install`, `dev`, `test`, `test-e2e`, `test-coverage`, `lint`, `up`, `down`, `logs`. Build remains `pnpm build`.
- Earlier draft of this change assumed large README “no OTel / no correlation” drift; that drift is **already fixed**. Remaining gap = structure/objective + C4 visuals + keep Grafana/OTel wording synced with dashboards/attrs.

## Goals / Non-Goals

**Goals:**

- Evaluator-first README layout with accurate host vs Docker paths.
- C1–C3 Mermaid + PNG under `docs/architecture/`, linked from README.
- Grafana/OTel section matches provisioned dashboards and current span/attribute names.
- Preserve working links to scenario matrix and coverage commands.

**Non-Goals:**

- Changing Nest/React/Compose/Grafana JSON (docs-only).
- C4 Code level.
- Permanent Mermaid CLI dependency in the monorepo.
- Replacing dashboard markdown tutorials already inside Grafana JSON (README points; does not duplicate TraceQL essays).

## Decisions

1. **Rebase scope on live `develop`, not the old explore assumptions**  
   Primary work is reorganize + diagrams + sync Grafana facts; not “introduce OTel to README.”

2. **C2 includes the full local obs containers**  
   React, Nest BFF, SQLite, OTel Collector, Loki, Tempo, Grafana. Edges: JWT/HTTP, HN scrape, OTLP, Tempo/Loki queries from Grafana.

3. **C3 focuses on BFF modules + FE surfaces**  
   Auth / Filter / Scraping (incl. polite fetch adapter) / Analytics (UsageLog + SavedFilterResult) + Login + Filters/Save. Optional callout for OTel bootstrap + span names (not a fake Nest module box soup).

4. **README Grafana verify block stays short**  
   Three bullets: Home overview → Local obs request list → Explore by `request.id`. Point to dashboard “How to read” for TraceQL/`hn.fetch.outcome` detail.

5. **Mermaid `.mmd` + PNG via `npx mmdc`**  
   Same as prior design; regenerate documented in `docs/architecture/README.md`.

6. **`skip_specs: true`**  
   Docs-only; acceptance via task verify checklists.

7. **Slice gates (N.5 / N.6)**  
   Each executable `tasks.md` group (`##1`–`##4`) ends with **N.5 Slice review** (happy + edge for that group’s deliverables; falsifiable path/command checks) and **N.6 Slice audit** (table of N.1–N.5 → PASS before starting the next group). No stub diagrams or “link later” README images. Docs-only: no TDD unit gates; slice gates still apply.

## Risks / Trade-offs

- [Uncommitted polite-fetch / dashboard JSON edits on working tree] → At apply time, re-read `otel.constants.ts` + Grafana JSON titles before final README wording.
- [PNG drift] → Regenerate whenever `.mmd` changes; document command.
- [README length] → Prefer structure over duplicating full TraceQL from dashboard markdown.
- [Change missing from git history] → Recreated on `develop`; commit with apply or separately so it is not lost again.

## Migration Plan

Docs-only. Land README + `docs/architecture/` in one commit/PR so image links never 404.

## Open Questions

None material after verification. If polite-fetch attrs land after README apply, a one-line README tweak is enough (no new change).

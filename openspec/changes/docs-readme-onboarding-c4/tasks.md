## 1. C4 diagram sources

- [x] 1.1 Create `docs/architecture/` and write `c1-context.mmd` (evaluator, HN Scraper MVP, Hacker News, optional Sentry, local Grafana stack) — verify: English labels; C1-only
- [x] 1.2 Write `c2-containers.mmd` (React SPA, Nest BFF, SQLite, OTel Collector, Loki, Tempo, Grafana + edges) — verify: matches `docker-compose.yml` service set
- [x] 1.3 Write `c3-components.mmd` (Auth/Filter/Scraping/Analytics + Login/Filters Save; note OTel spans/bootstrap) — verify: names align with backend modules / FE pages
- [x] 1.4 Add `docs/architecture/README.md` with `npx @mermaid-js/mermaid-cli` regenerate commands — verify: English short instructions present
- [x] 1.5 **Slice review:** happy + edge for 1.1–1.4 (C1–C3 sources + regenerate note present; English; no C4 Code level) — verify: four `.mmd`/README paths exist; spot-read labels
- [x] 1.6 **Slice audit:** table 1.1–1.5 → PASS/FAIL; veredicto **PASS** before group 2 — verify: no `[x]` on 1.x without paths present

### Slice audit 1.6

| Task | Verdict | Evidence |
|------|---------|----------|
| 1.1 | PASS | `docs/architecture/c1-context.mmd` — C1 Context only; English |
| 1.2 | PASS | `c2-containers.mmd` — fe/backend/sqlite + otel/loki/tempo/grafana |
| 1.3 | PASS | `c3-components.mmd` — Auth/Filter/Scraping/Analytics + Login/Filters; OTel span note |
| 1.4 | PASS | `docs/architecture/README.md` — npx mermaid-cli regenerate |
| 1.5 | PASS | four paths present; no C4 Code level |
| **Group 1** | **PASS** | proceed to group 2 |

## 2. PNG generation

- [x] 2.1 Render `c1-context.png`, `c2-containers.png`, `c3-components.png` from `.mmd` via `mmdc` — verify: three valid PNGs beside sources
- [x] 2.2 Spot-check label legibility; re-render with scale/width if clipped — verify: readable at README width
- [x] 2.5 **Slice review:** happy + edge for 2.1–2.2 (three PNGs open; labels legible; re-render if clipped) — verify: PNG paths exist and are non-empty
- [x] 2.6 **Slice audit:** table 2.1–2.5 → PASS; veredicto **PASS** before group 3 — verify: no group 3 until 2.6 PASS

### Slice audit 2.6

| Task | Verdict | Evidence |
|------|---------|----------|
| 2.1 | PASS | three PNGs via mmdc `--size 1600` |
| 2.2 | PASS | labels legible; sizes ~110–149 KB |
| 2.5 | PASS | non-empty PNG paths beside sources |
| **Group 2** | **PASS** | proceed to group 3 |

## 3. README onboarding rewrite

- [x] 3.1 Reorganize root `README.md` evaluator-first (What/Why, Stack, Prerequisites, host Quick start, Docker + Grafana, Commands including `pnpm build` / `make test-coverage`, Verify, Layout, short CI) — verify: objective-first; English only
- [x] 3.2 Sync Grafana/OTel verify section to live facts: Home **BFF at a glance**, Local obs **BFF request list**, Explore Tempo by `request.id`; spans `scrape.live` / `filter.run` / `usageLog.write`; mention `hn.fetch.outcome` without copying full TraceQL — verify: titles/paths match `deploy/grafana/provisioning/**` and `otel.constants.ts`
- [x] 3.3 Preserve accurate existing content: SavedFilterResult, UsageLog `requestId`, coverage + scenario matrix link, Bruno/`E2E_SCRAPE_FIXTURE`, Compose secrets-via-env — verify: those topics still present after rewrite
- [x] 3.4 Embed/link C1–C3 PNGs under Architecture; trim onboarding noise (e.g. premature tag wording) — verify: relative image paths resolve; no dead Make/script names vs `Makefile`/`package.json`
- [x] 3.5 **Slice review:** happy + edge for 3.1–3.4 (evaluator-first sections; Grafana titles match live JSON; preserved topics; PNG links resolve) — verify: grep/list checks exit 0 / paths found
- [x] 3.6 **Slice audit:** table 3.1–3.5 → PASS; veredicto **PASS** before group 4 — verify: no group 4 until 3.6 PASS

### Slice audit 3.6

| Task | Verdict | Evidence |
|------|---------|----------|
| 3.1 | PASS | evaluator-first sections; English |
| 3.2 | PASS | titles match JSON; spans/attrs match `otel.constants.ts` |
| 3.3 | PASS | SavedFilterResult, requestId, matrix, fixture, secrets-via-env |
| 3.4 | PASS | PNG links; `v1.0.0-mvp` removed; Make targets live |
| 3.5 | PASS | grep/list all PASS |
| **Group 3** | **PASS** | proceed to group 4 |

## 4. Close-out

- [x] 4.1 Run `openspec validate docs-readme-onboarding-c4 --strict` — verify: exit 0
- [x] 4.2 Manual pass: README host/Docker/Grafana/coverage commands match live Make/Compose/package scripts — verify: no dead paths
- [x] 4.5 **Slice review:** happy + edge for whole change (README + `docs/architecture/*` + validate) — verify: 4.1 exit 0 and architecture assets linked
- [x] 4.6 **Slice audit:** table 4.1–4.5 → PASS; change ready for post-apply HITL — verify: all prior group audits PASS; no stubs

### Slice audit 4.6

| Task | Verdict | Evidence |
|------|---------|----------|
| 4.1 | PASS | `openspec validate … --strict` exit 0 |
| 4.2 | PASS | Make targets + Compose ports + Grafana titles verified |
| 4.5 | PASS | README + `docs/architecture/*` + validate |
| **Group 4** | **PASS** | ready for post-apply HITL / archive |

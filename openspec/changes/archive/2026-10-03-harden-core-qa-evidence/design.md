## Context

See proposal.md — Why. Observed today: Vitest covers `countWords`, Filter A/B strategies (boundary/ties/empty), and Cheerio length-30 offline; Bruno HP2/HP3 assert filter contracts but treat `[]` as pass; no Filter B Nest HTTP happy path; no ranks/`1..30` or surplus-slice asserts despite a 32-row fixture; no scenario matrix; no Vitest coverage reports or CORE thresholds. Milestone-3 CI already runs Vitest + Bruno + lint.

## Goals / Non-Goals

**Goals:**
- Evaluator-readable HP/EC matrix + CORE coverage HTML/LCOV.
- Non-vacuous Bruno Filter A/B happy paths with a CI-stable way to get non-empty results.
- Close major unit/HTTP gaps (ranks/slice, Filter B HTTP).

**Non-Goals:**
- Playwright/Cypress or React browser E2E.
- Whole-repo 100% coverage gates.
- Changing product EC-EMPTY (`[]` remains a valid API outcome).
- Replacing Bruno or adding Redis/Postgres/docker-compose.

## Decisions

### D1 — Two evidence surfaces (matrix + coverage)
- **Choice:** Committed Markdown matrix at `docs/qa/core-scenario-matrix.md` plus Vitest `@vitest/coverage-v8` reports for CORE includes.
- **Why:** Matrix answers "what scenarios?"; coverage answers "how much CORE code is exercised?". Different audiences, both evaluator-useful.
- **Alternatives:** Generated-only matrix (stale risk / tooling heavy); coverage-only (hides HP/EC gaps like vacuous Bruno).

### D2 — CORE include paths and thresholds
- **Choice:** Coverage includes `packages/shared-types` count-words/schemas surface and `apps/backend` `scraping/**` + `filtering/**` (tests co-located). Thresholds set as floors after a baseline run during apply (record exact numbers in vitest config + matrix note); fail under floor. No global monorepo gate.
- **Why:** Ponytail — measure what the challenge cares about.
- **Alternatives:** Frontend-wide coverage (noise); no CI fail (weak evaluator signal).

### D3 — Non-vacuous Bruno without fighting EC-EMPTY
- **Choice:** HP2/HP3 assertions require `items.length >= 1`. Product may still return `[]`. For CI stability, prefer injecting fixture HTML (or mock scrape) into the process under test when `E2E_SCRAPE_FIXTURE=1` (or equivalent env) so Filter A and B both yield non-empty results from `hn_sample.html`; document local live-HN runs may flake if HN has no matching titles. Wire fixture behind `HnHtmlFetcher` / scrape port (not FilterController branching).
- **Why:** Spec forbids empty as happy-path proof; live HN distribution is not a reliable oracle.
- **Alternatives:** Suite-level "A or B non-empty" only (still vacuous for the empty side); Playwright UI smoke (out of scope).

### D4 — Offline Nest Filter B mirrors Filter A
- **Choice:** Extend `filter.http.test.ts` with JWT + Filter B against existing mock scrape entries shaped so B returns non-empty (adjust mock titles/points if needed).
- **Why:** Shortest path; Filter A pattern already exists.
- **Alternatives:** Only Bruno live (flake); only unit `apply-filter` (already covered, misses HTTP wiring).

### D5 — Scraper ranks and surplus
- **Choice:** In `cheerio-scraper.adapter.test.ts`, assert `entries.map(e => e.rank)` equals `[1..30]` and assert a known surplus title from the fixture (story 31/32) is absent.
- **Why:** Fixture already has 32 rows; closes WEAK slice evidence cheaply.

### D6 — CI wiring
- **Choice:** Add coverage step to `.github/workflows/ci.yml`; upload `coverage/` (or merged LCOV/HTML) as artifact; fail on threshold. Keep Bruno step; enable fixture scrape env for CI Bruno so hardened asserts stay green.
- **Why:** Matches `core-code-coverage` + hardened `bruno-e2e` without a second workflow.

## TDD

Fail-first per code slice (apply order):

| Slice | Failing test first | Impl that turns green |
|-------|--------------------|------------------------|
| Scraper ranks/surplus | Vitest expects `ranks === [1..30]` and surplus title absent — fails on current suite | Extend asserts only (adapter already slices); if fail for wrong reason, fix adapter |
| HTTP Filter B | Nest HTTP test JWT + Filter B non-empty/order — fails until mock shape + test exist | Adjust mock entries + add test mirroring Filter A |
| Fixture scrape env | Vitest: with `E2E_SCRAPE_FIXTURE=1`, `scrapeLive` (or fetcher) returns fixture-parsed entries and MUST NOT call live Axios — fails until env path exists | Env-gated fetcher/port swap reading `hn_sample.html` |
| Bruno non-vacuous | Bruno/docs: empty `[]` fails HP2/HP3 — fails on current collection | Assert `length >= 1` in `.bru` |
| Coverage tooling | `pnpm`/Make coverage command produces HTML+LCOV and fails under floor — fails until `@vitest/coverage-v8` + config | Add dep, includes, thresholds, CI upload |

Docs-only slices (matrix Markdown, README links): no unit TDD; done = path + readable criteria.

## Slice gates

Apply is **phased**. Each `tasks.md` group `## N.` with executable work ends with:

- **N.5 Slice review** — happy + edge for that group green; commands + exit 0; fix gaps in-group.
- **N.6 Slice audit** — table N.1–N.5 → PASS in `SLICE-AUDIT.md`; **forbidden** to start next phase without N.6 PASS.

Human-confirmed phases (propose-audit 20261003-181302 + confirm A):

| Phase | Groups | Post-apply |
|-------|--------|------------|
| 1 | ##1 scraper, ##2 Filter B HTTP | R1–R3 before Phase 2 |
| 2 | ##3 Bruno + fixture | R1–R3 before Phase 3 |
| 3 | ##4 coverage, ##5 matrix | R1–R3 before Phase 4 |
| 4 | ##6 close | R1–R3 |

## Certainty

| Claim | Level | Notes |
|-------|-------|-------|
| Fixture env behind `HnHtmlFetcher` / scrape port (not controller) | S | design D3 + arch-review |
| CI Bruno non-empty under fixture env | S | D3 + D6 |
| Live HN local without fixture may return empty / flake | E | known; documented |
| CORE coverage floors | A → S | A until baseline run in apply sets numbers; then S in config |
| `@vitest/coverage-v8` works with current Vitest | A | pin on install; RUNTIME becomes E after first green CI |
| Matrix stays aligned via tasks | S | qa-scenario-matrix refresh rule |
| Product EC-EMPTY unchanged | E | existing filter-strategies spec |

**Grill:** N/A — explore + propose-audit locked D1–D6 and slice phases; no separate `GRILL.md` workshop artifact. Re-grill only if fixture port approach is rejected during apply.

## Risks / Trade-offs

- [Live HN empty titles] → Mitigation: CI uses fixture scrape env; README documents local live risk.
- [Threshold too high before tests land] → Mitigation: set floors after first green coverage run in apply; do not invent 100%.
- [Matrix drifts] → Mitigation: tasks require matrix update with test edits; status WEAK/GAP explicit.
- [Fixture env changes prod behavior] → Mitigation: env-gated; default remains live Axios scrape.

## Migration Plan

1. Phase 1–2 land test hardenings + fixture env on a feature branch.
2. Phase 3: coverage + matrix; flip CI Bruno to fixture env; confirm HP2/HP3 non-empty green.
3. Phase 4 close; upload coverage artifacts; document README/Makefile.
4. No data migration; rollback = revert branch / disable fixture env.

## Open Questions

None deferrable — CI uses fixture-backed scrape for Bruno non-empty evidence (D3); exact threshold numbers chosen during apply from baseline.

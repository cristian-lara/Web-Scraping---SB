# SLICE-AUDIT — harden-core-qa-evidence

## Phase 1 — ##1 scraper + ##2 Filter B HTTP

| Task | Result | Evidence |
|------|--------|----------|
| 1.1 ranks `1..30` | PASS | `cheerio-scraper.adapter.test.ts` — `returns ranks exactly 1..HN_TOP_ENTRY_LIMIT in order` |
| 1.2 surplus excluded | PASS | same file — `excludes surplus fixture rows beyond the top-30 slice` (titles 31/32 absent) |
| 1.3 adapter adjust | PASS | none needed — existing slice already correct; asserts green |
| 1.4 scraper Vitest | PASS | `pnpm --filter @repo/backend exec vitest run src/scraping/cheerio-scraper.adapter.test.ts` → 7 tests exit 0 |
| 1.5 slice review | PASS | openspec validate `--strict` exit 0; HP-SCRAPE-30 ranks + surplus covered |
| 1.6 slice audit | PASS | this table |
| 2.1 mock Filter B set | PASS | mock ranks 2 + 4 short titles (`short title`, `brief`) |
| 2.2–2.3 HTTP Filter B | PASS | `filter.http.test.ts` — `happy path: JWT + Filter B...` ranks `[2, 4]` |
| 2.4 filter HTTP suite | PASS | vitest `filter.http.test.ts` → 7 tests exit 0 (with scraper file: 14/14) |
| 2.5 slice review | PASS | HP-FA + HP-FB HTTP offline; `openspec validate harden-core-qa-evidence --strict` exit 0 |
| 2.6 slice audit | PASS | this table |

**Commands**

```text
pnpm --filter @repo/backend exec vitest run src/scraping/cheerio-scraper.adapter.test.ts src/filtering/filter.http.test.ts
# Test Files  2 passed (2)
# Tests  14 passed (14)
# exit 0

openspec validate harden-core-qa-evidence --strict
# Change 'harden-core-qa-evidence' is valid
# exit 0
```

**Phase 1 veredicto:** PASS  
**Next:** post-apply R1–R3 HITL, then Phase 2 (`##3` Bruno + fixture).

## Phase 2 — ##3 Bruno + fixture scrape

| Task | Result | Evidence |
|------|--------|----------|
| 3.1 fail-first fixture Vitest | PASS | `e2e-scrape-fixture.test.ts` — env=1 → 30 entries, axios not called |
| 3.2 FixtureHnHtmlFetcher + module factory | PASS | `fixture-hn-html.fetcher.ts`, `scraping.module.ts` useFactory; env off → Axios |
| 3.3 Bruno length >= 1 | PASS | HP2/HP3 `.bru` `expect(items.length).to.be.greaterThan(0)` |
| 3.4 docs + CI + e2e:ci | PASS | `.env.example`, `bruno/README.md`, `ci.yml` `E2E_SCRAPE_FIXTURE=1`; `pnpm test:e2e:ci` 10/10 |
| 3.5 slice review | PASS | openspec validate `--strict` exit 0; E1–E2 in `test:e2e:ci`; E3 still Vitest/local |
| 3.6 slice audit | PASS | this table |

**Commands**

```text
pnpm --filter @repo/backend exec vitest run src/scraping/e2e-scrape-fixture.test.ts src/scraping/cheerio-scraper.adapter.test.ts
# Tests  9 passed — exit 0

# Nest with E2E_SCRAPE_FIXTURE=1, then:
pnpm run test:e2e:ci
# Requests 5 Passed · Tests 10/10 · exit 0

openspec validate harden-core-qa-evidence --strict
# valid — exit 0
```

**Fixture note:** `hn_sample.html` even ranks 2..28 use long titles (>5 words) so Filter A is non-empty under fixture; odds + 30 stay short for Filter B.

**Phase 2 veredicto:** PASS  
**Next:** post-apply R1–R3 HITL, then Phase 3 (`##4` coverage + `##5` matrix).

## Phase 3 — ##4 CORE coverage + ##5 scenario matrix

| Task | Result | Evidence |
|------|--------|----------|
| 4.1–4.2 coverage tooling | PASS | `@vitest/coverage-v8@3.2.4`; `pnpm test:coverage` / `make test-coverage`; HTML+LCOV under package `coverage/` (gitignored) |
| 4.3 thresholds | PASS | shared-types 90/90/80/90; backend 90/85/85/90; `pnpm test:coverage` exit 0 (~98% backend stmts) |
| 4.4 CI | PASS | `ci.yml` coverage step + `upload-artifact` `core-coverage` |
| 4.5–4.6 | PASS | this table |
| 5.1–5.4 matrix | PASS | `docs/qa/core-scenario-matrix.md` — HP/EC rows PASS incl. ranks, HTTP B, Bruno non-vacuous, E1–E3 |
| 5.3 README | PASS | section “Evaluator evidence” links matrix + coverage how-to |
| 5.5–5.6 | PASS | `openspec validate harden-core-qa-evidence --strict` exit 0 |

**Commands**

```text
pnpm test:coverage
# shared-types 100% · backend ~98% stmts · HTML+LCOV present · exit 0

openspec validate harden-core-qa-evidence --strict
# valid — exit 0
```

**Open locally:** `packages/shared-types/coverage/index.html`, `apps/backend/coverage/index.html`

**Phase 3 veredicto:** PASS  
**Next:** post-apply R1–R3 HITL, then Phase 4 (`##6` close).

## Phase 4 — ##6 close

| Task | Result | Evidence |
|------|--------|----------|
| 6.1 full suite | PASS | `pnpm test` exit 0 (turbo 4/4); `pnpm test:coverage` exit 0; `pnpm test:e2e:ci` 10/10 with `E2E_SCRAPE_FIXTURE=1` |
| 6.2 openspec | PASS | `openspec validate harden-core-qa-evidence --strict` exit 0 |
| 6.3 finalize audit | PASS | Phases 1–4 tables above |
| 6.4 READY FOR PR | PASS | see note below |
| 6.5–6.6 | PASS | matrix has no GAP for this change’s closed CORE items |

**Commands (Phase 4)**

```text
pnpm test
# Tasks: 4 successful · exit 0

pnpm test:coverage
# shared-types 100% · backend ~98% stmts · exit 0

# Nest: E2E_SCRAPE_FIXTURE=1
pnpm test:e2e:ci
# Tests 10/10 · exit 0

openspec validate harden-core-qa-evidence --strict
# valid · exit 0
```

### READY FOR PR

- Change: `harden-core-qa-evidence`
- Target: `feature/harden-core-qa-evidence` → PR → `develop` (then release path to `main` per README)
- **Note:** work currently sits on branch `feature/add-local-obs-save-results` mixed with another change. Prefer a dedicated branch / split PR before merge so this change’s diff is reviewable alone.
- Evaluator surfaces: `docs/qa/core-scenario-matrix.md`, `pnpm test:coverage` HTML, CI artifact `core-coverage`, Bruno with fixture env.

**Phase 4 veredicto:** PASS  

## Change veredicto

**PASS** — all tasks `[x]`. Ready for post-apply HITL / archive after PR merge on a clean branch.

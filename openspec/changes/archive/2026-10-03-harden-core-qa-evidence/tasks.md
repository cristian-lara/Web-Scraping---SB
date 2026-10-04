# Tasks — harden-core-qa-evidence

Slice phases (human OK 2026-10-03): **Phase 1** = ##1–##2 · **Phase 2** = ##3 · **Phase 3** = ##4–##5 · **Phase 4** = ##6.  
Each group: **N.5** slice review + **N.6** slice audit PASS in `SLICE-AUDIT.md` before next phase. TDD: fail-first where noted (see design.md § TDD).

## 1. Scraper offline hardening (hn-scraper) — Phase 1

Slice gates: **1.5** (ranks 1..30 + surplus excluded; scraper Vitest offline green) and **1.6** (audit PASS) before ##2 close of Phase 1.

- [x] 1.1 Write/extend failing Vitest asserts for ranks exactly `1..30` in order on `hn_sample.html` — verify: test fails on current suite for missing rank sequence (or documents already-green with intentional fail if sequence wrong)
- [x] 1.2 Write/extend failing Vitest assert that surplus fixture titles (story 31/32 or equivalent) are absent — verify: fails if surplus appears; no network
- [x] 1.3 Implement/adjust Cheerio adapter only if 1.1–1.2 fail for wrong reason; keep slice semantics — verify: 1.1–1.2 green offline
- [x] 1.4 Run backend scraper Vitest offline — verify: `pnpm --filter @repo/backend test` scraper-related exit 0; no news.ycombinator.com
- [x] 1.5 **Slice review:** HP-SCRAPE-30 ranks + surplus; `openspec validate harden-core-qa-evidence --strict` exit 0 — verify: commands + exit 0
- [x] 1.6 **Slice audit:** table 1.1–1.5 → PASS before ##2 — verify: `SLICE-AUDIT.md` with commands + exit codes

## 2. Filter HTTP Filter B (filter-strategies) — Phase 1

Slice gates: **2.5** (HTTP Filter A+B green offline) and **2.6** (audit PASS) before Phase 2.

- [x] 2.1 Ensure mock scrape entries yield non-empty Filter B (`countWords <= FILTER_WORD_THRESHOLD`) — verify: at least one mock entry qualifies for B
- [x] 2.2 Write failing Nest HTTP happy path: JWT + Filter B non-empty, word rule, points/rank order — verify: test fails until wired; no live HN
- [x] 2.3 Implement until 2.2 green (mirror Filter A style) — verify: Filter A and Filter B HTTP happy paths exit 0 offline
- [x] 2.4 Run filter HTTP suite — verify: `pnpm --filter @repo/backend test` includes A+B HTTP exit 0
- [x] 2.5 **Slice review:** HP-FB HTTP + existing HP-FA; offline; `openspec validate harden-core-qa-evidence --strict` exit 0 — verify: commands + exit 0
- [x] 2.6 **Slice audit:** table 2.1–2.5 → PASS before Phase 2 — verify: `SLICE-AUDIT.md` note; **Phase 1 post-apply R1–R3** before ##3

## 3. Bruno non-vacuous E2E + fixture scrape (bruno-e2e) — Phase 2

Slice gates: **3.5** (Bruno HP2/HP3 non-empty under fixture; empty fails asserts) and **3.6** (audit PASS) before Phase 3.

- [x] 3.1 Write failing Vitest for fixture scrape path: with `E2E_SCRAPE_FIXTURE=1` (or equiv), scrape/fetcher returns fixture-parsed entries and MUST NOT call live Axios — verify: fails until env path exists; no network when env on
- [x] 3.2 Implement env-gated fixture behind `HnHtmlFetcher` / scrape port (not FilterController) until 3.1 green — verify: env on → fixture; env off → live path unchanged in unit terms
- [x] 3.3 Change HP2 and HP3 Bruno asserts to require `items.length >= 1` and keep Filter A/B contracts — verify: body `[]` fails both HP2 and HP3
- [x] 3.4 Document fixture env in `apps/backend/bruno/README.md` and `.env.example` (placeholders only); wire CI Bruno with fixture env; run `pnpm test:e2e:ci` (or documented equiv) exit 0 with non-empty HP2/HP3 — verify: README states CI uses fixture; `ci.yml` sets env; e2e:ci green; no secrets in examples
- [x] 3.5 **Slice review:** EC-VACUOUS + HP-BR2/3 non-empty under fixture; E1–E3 still in collection/CI scope as documented — verify: commands + exit 0; `openspec validate harden-core-qa-evidence --strict` exit 0
- [x] 3.6 **Slice audit:** table 3.1–3.5 → PASS before Phase 3 — verify: `SLICE-AUDIT.md`; **Phase 2 post-apply R1–R3** before ##4

## 4. CORE code coverage (core-code-coverage) — Phase 3

Slice gates: **4.5** (coverage HTML+LCOV + threshold fail behavior) and **4.6** (audit PASS) before ##5 close of Phase 3.

- [x] 4.1 Add `@vitest/coverage-v8` and coverage config/includes for CORE paths; gitignore `coverage/` — verify: config present; coverage dirs ignored
- [x] 4.2 Add root/package scripts and Makefile `test-coverage` (or equiv) producing HTML + LCOV — verify: command generates both
- [x] 4.3 Run baseline coverage; set CORE thresholds as floors that pass current green suite — verify: coverage exit 0; deliberate under-floor fails
- [x] 4.4 Wire CI coverage step, fail on threshold, upload HTML/LCOV artifact — verify: `ci.yml` has coverage + `upload-artifact`
- [x] 4.5 **Slice review:** CORE coverage command + CI wiring; README draft commands OK — verify: local coverage exit 0; workflow contains steps
- [x] 4.6 **Slice audit:** table 4.1–4.5 → PASS before ##5 — verify: `SLICE-AUDIT.md`

## 5. Scenario matrix (qa-scenario-matrix) — Phase 3

Slice gates: **5.5** (matrix complete + README link) and **5.6** (audit PASS) before Phase 4.

- [x] 5.1 Create `docs/qa/core-scenario-matrix.md` with CORE HP/EC rows mapped to tests (PASS/WEAK/GAP) — verify: file exists; every row has status
- [x] 5.2 Reflect Phase 1–2 hardenings (ranks/slice, Filter B HTTP, non-vacuous Bruno) as PASS — verify: no stale WEAK for closed gaps
- [x] 5.3 Link matrix from root README testing/evaluation section; document coverage how-to + CORE-only thresholds — verify: matrix path + coverage commands discoverable
- [x] 5.4 Confirm E1–E3 / HP1 rows present in matrix — verify: auth + 401/400/429 listed
- [x] 5.5 **Slice review:** matrix + README; `openspec validate harden-core-qa-evidence --strict` exit 0 — verify: evaluator can find both evidence surfaces
- [x] 5.6 **Slice audit:** table 5.1–5.5 → PASS before Phase 4 — verify: `SLICE-AUDIT.md`; **Phase 3 post-apply R1–R3** before ##6

## 6. Close — Phase 4

Slice gates: **6.5** (full green suite) and **6.6** (final audit PASS).

- [x] 6.1 Run `pnpm test`, coverage command, and Bruno E2E with fixture env — verify: all exit 0
- [x] 6.2 Run `openspec validate harden-core-qa-evidence --strict` — verify: exit 0
- [x] 6.3 Finalize `SLICE-AUDIT.md` for all phases (matrix + coverage artifact + non-vacuous Bruno) — verify: checklist complete with commands + exit codes
- [x] 6.4 READY FOR PR note (branch → develop/main as repo convention) — verify: note in `SLICE-AUDIT.md`
- [x] 6.5 **Slice review:** 6.1–6.4 evidence complete — verify: no open GAP in matrix for this change's closed items
- [x] 6.6 **Slice audit:** table 6.1–6.5 → PASS; change ready for archive after post-apply HITL — verify: final `SLICE-AUDIT.md` veredicto PASS

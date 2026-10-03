## 1. Filter strategies + threshold (F2-1)

Slice gates: **1.5** (review: filter Vitest green offline, `FILTER_WORD_THRESHOLD` exported, no network) and **1.6** (audit PASS in `SLICE-AUDIT.md`) before wave 2.

- [ ] 1.1 Export named `FILTER_WORD_THRESHOLD = 5` from `@repo/shared-types` next to filter enum / `FilterQuery` surface — verify: import resolves; value is `5`; no strategy/call site uses magic literal `5` for word threshold
- [ ] 1.2 Write failing Vitest cases (TDD fail-first) for Filter A (HP-FA), Filter B (HP-FB), rank tie-break (EC-TIE), empty input and all-excluded (EC-EMPTY) using in-memory `Entry[]` — verify: tests fail for the right reason (missing strategies/impl); suite has no network
- [ ] 1.3 Implement Strategy Pattern under `apps/backend` filter module (Filter A: `countWords(title) > FILTER_WORD_THRESHOLD`, sort `comments` DESC then `rank` ASC; Filter B: `<=`, sort `points` DESC then `rank` ASC; enum selects strategy; empty → `[]` not error) — verify: tests from 1.2 green; no magic `5`; strategies not in HTTP controllers
- [ ] 1.4 Confirm offline filter unit suite covers both strategies, tie-break, and empty edges with no Axios/live HN — verify: `pnpm --filter @repo/backend test` (filter suite) exit 0; no network
- [ ] 1.5 **Slice review:** filter strategy + threshold tests green offline; `openspec validate add-mvp-product-vertical --strict` exit 0 — verify: HP-FA, HP-FB, EC-TIE, EC-EMPTY mapped; `FILTER_WORD_THRESHOLD` exported
- [ ] 1.6 **Slice audit:** table 1.1–1.5 → PASS before wave 2 — verify: note in change `SLICE-AUDIT.md` with falsifiable evidence (commands + exit codes)

## 2. Nest bootstrap + JWT auth harden (F2-2) + Axios live behind port (hn-scraper delta)

Slice gates: **2.5** (review: Nest boots; JWT/401/400/429/Helmet/CORS/seed; Axios runtime adapter; scraper unit tests still offline) and **2.6** (audit PASS) before wave 3.

- [ ] 2.1 Bootstrap NestJS shell in `apps/backend` with modular auth, filter, scraping, and analytics placeholders; replace Cheerio-only placeholder entry; keep Cheerio parse injectable — verify: Nest app boots locally; existing fixture HTML path still usable
- [ ] 2.2 Document demo credentials in `.env.example` (`DEMO_USER_EMAIL`, `DEMO_USER_PASSWORD`); idempotent Prisma seed / auth bootstrap creates one Bcrypt-hashed demo user; implement JWT login (Passport) + Bcrypt verify → Bearer-usable JWT (HP-AUTH); expose authenticated `userId` downstream — verify: valid demo credentials return JWT; hash stored and never in response body; plaintext only in `.env.example` docs
- [ ] 2.3 Harden HTTP surface: `JwtAuthGuard` → `401` missing/invalid/expired (EC-401); Zod DTO validation → `400` not `500` before business logic (EC-400); Helmet + CORS on boot; `@nestjs/throttler` → `429` when exceeded (EC-429) — verify: automated or scripted checks show 401/400/429 and Helmet/CORS enabled
- [ ] 2.4 Add Axios-backed adapter/collaborator behind `HnScraperPort` for runtime live HN HTML; preserve HTML-string / `hn_sample.html` injection for automated tests (no network in unit tests) — verify: runtime path uses Axios; scraper Vitest suite exit 0 without calling news.ycombinator.com
- [ ] 2.5 **Slice review:** Nest boot + auth/hardening + Axios wiring; auth and scraper offline suites green where applicable; `openspec validate add-mvp-product-vertical --strict` exit 0 — verify: HP-AUTH, EC-401, EC-400, EC-429, Decision 4/6 covered
- [ ] 2.6 **Slice audit:** table 2.1–2.5 → PASS before wave 3 — verify: note in change `SLICE-AUDIT.md` with commands + exit codes

## 3. Thin HTTP + Swagger (F2-6) filter + auth controllers

Slice gates: **3.5** (review: OpenAPI documents auth+filter; controllers thin; no stack leakage) and **3.6** (audit PASS) before wave 4.

- [ ] 3.1 Add thin auth HTTP controller: Zod DTO bind → auth service → status only; document auth request/response in Swagger/OpenAPI (HP-SWAG auth) — verify: OpenAPI shows auth shapes; controller has no Bcrypt/Prisma/scrape/filter-sort logic
- [ ] 3.2 Add thin filter HTTP controller: Zod DTO bind → filter service → status only; document filter request/response in Swagger/OpenAPI (HP-SWAG filter); prefer named constants at HTTP boundary — verify: OpenAPI shows filter shapes; controller has no scrape/filter-sort/Prisma/Bcrypt; invalid DTO rejected before service (`400`)
- [ ] 3.3 Map typed/domain service exceptions to HTTP status; ensure success/error JSON bodies never leak stack traces (EC-NOSTACK) — verify: failure-path response has appropriate status and no stack-dump fields
- [ ] 3.4 Confirm thin-controller boundary (EC-THIN) across auth + filter controllers via review or focused tests — verify: every controller method is DTO → service → status only; named constants preferred over magic HTTP literals
- [ ] 3.5 **Slice review:** Swagger UI or OpenAPI JSON documents auth + filter; thin-controller + no-stack checklist pass; `openspec validate add-mvp-product-vertical --strict` exit 0 — verify: HP-SWAG, EC-THIN, EC-NOSTACK covered
- [ ] 3.6 **Slice audit:** table 3.1–3.5 → PASS before wave 4 — verify: note in change `SLICE-AUDIT.md` with falsifiable evidence

## 4. UsageLog Prisma (F2-3)

Slice gates: **4.5** (review: migrate + repository + wire-after-success + offline create/read) and **4.6** (audit PASS) before wave 5.

- [ ] 4.1 Add Prisma schema targeting SQLite `app.db` with `UsageLog` fields (`id`, `timestamp`, `filter_applied`, `processed_items`, `execution_time_ms`, `userId`); prefer versioned migrations for clean-machine path — verify: migrate (or documented equivalent) creates local SQLite without external DB/container
- [ ] 4.2 Implement `PrismaUsageRepository` (Repository pattern); validate rows with `UsageLogSchema` at persistence boundary; reject invalid shapes; keep Prisma out of controllers — verify: repository create/read works; invalid `UsageLogSchema` not accepted; controllers do not import Prisma
- [ ] 4.3 Wire filter/analytics service to persist via repository **after** successful authenticated filter execution only (HP-LOG); bind `userId` from JWT — verify: successful filter writes one row with required fields + `FilterAppliedSchema` enum; failed filter does not invent a success log
- [ ] 4.4 Write offline unit/integration tests for UsageLog create/read without live HN (EC-LOG-NET) — verify: tests green with no network to news.ycombinator.com
- [ ] 4.5 **Slice review:** UsageLog path green offline; `openspec validate add-mvp-product-vertical --strict` exit 0 — verify: HP-LOG, EC-LOG-NET, Decision 5 covered
- [ ] 4.6 **Slice audit:** table 4.1–4.5 → PASS before wave 5 — verify: note in change `SLICE-AUDIT.md` with commands + exit codes

## 5. React UI (F2-4)

Slice gates: **5.5** (review: Vite app login/filter/table states; hookform+zod; no pagination) and **5.6** (audit PASS) before wave 6.

- [ ] 5.1 Scaffold real Vite React app in `apps/frontend` with Tailwind + Shadcn/ui + TanStack Query (+ Axios client as needed); implement login obtaining JWT and attaching `Authorization: Bearer` on subsequent authenticated calls (HP-UI-OK login) — verify: package scripts run; post-login filter calls include Bearer
- [ ] 5.2 Implement Filter A/B selection + results table (rank, title, points, comments) for non-empty lists (HP-UI-OK table); TanStack Query drives request lifecycle — verify: non-empty API list renders required columns
- [ ] 5.3 Add explicit loading (EC-UI-LOAD), empty `[]` (EC-UI-EMPTY), and network/4xx/5xx error (EC-UI-ERR) states — verify: each state is visible; not a blank/broken table or white screen
- [ ] 5.4 Validate login/filter forms with `@hookform/resolvers/zod` sharing `@repo/shared-types` rules where applicable (EC-UI-ZOD); confirm no pagination controls or paged filter API usage (EC-UI-NOPAGE) — verify: invalid client input rejected without relying on server `500`; UI review finds no page nav / infinite-scroll paging
- [ ] 5.5 **Slice review:** frontend build/lint or smoke checks green; UI acceptance HP-UI-OK + EC-UI-* covered; `openspec validate add-mvp-product-vertical --strict` exit 0 — verify: Bearer path works; no pagination
- [ ] 5.6 **Slice audit:** table 5.1–5.5 → PASS before wave 6 — verify: note in change `SLICE-AUDIT.md` with falsifiable evidence

## 6. Bruno E2E (F2-5)

Slice gates: **6.5** (review: `.bru` HP1–3 + E1–3 under `apps/backend/bruno/` with `local` env) and **6.6** (audit PASS) before mono close.

- [ ] 6.1 Add Bruno collection as plain-text `.bru` files under `apps/backend/bruno/` with a `local` environment targeting the live local BFF; align demo credentials with seed/`.env.example`; do not add CI Bruno Actions (F3 out of scope) — verify: collection is manually runnable; no Postman binary; absence of GitHub Actions Bruno wiring does not fail this wave
- [ ] 6.2 Add Happy Path 1: authenticate with demo credentials and extract JWT for Bearer use (HP-BR1) — verify: HP1 against local server succeeds and JWT is extractable
- [ ] 6.3 Add Happy Path 2 (Filter A with JWT: `MORE_THAN_5_WORDS_COMMENTS`, > `FILTER_WORD_THRESHOLD`, `comments` DESC / `rank` ASC) (HP-BR2) and Happy Path 3 (Filter B with JWT: `LESS_OR_EQUAL_5_WORDS_POINTS`, ≤ threshold, `points` DESC / `rank` ASC) (HP-BR3) — verify: HP2/HP3 assertions match Filter A/B contracts
- [ ] 6.4 Add Edge Case 1: protected route without auth expects `401` (EC-BR1); Edge Case 2: invalid filter expects `400` from Zod (EC-BR2); Edge Case 3: exceed throttle expects `429` with local throttle notes (EC-BR3) — verify: E1–E3 assertions document expected status codes
- [ ] 6.5 **Slice review:** collection layout + HP1–3 + E1–3 present; `openspec validate add-mvp-product-vertical --strict` exit 0 — verify: Bruno-only deliverable (no React/Nest re-implementation); F3 CI wiring absent by design
- [ ] 6.6 **Slice audit:** table 6.1–6.5 → PASS before wave 7 — verify: note in change `SLICE-AUDIT.md` with falsifiable evidence

## 7. Mono close

- [ ] 7.1 Run full workspace test suite green (shared-types, backend, frontend as applicable) — verify: all package test scripts exit 0; scraper/filter/usage suites remain offline (no live HN in unit tests)
- [ ] 7.2 Run `openspec validate add-mvp-product-vertical --strict` — verify: exit 0
- [ ] 7.3 Code review checklist vs design Happy Paths / Edge Cases table (all rows: HP-FA, HP-FB, EC-TIE, EC-EMPTY, HP-AUTH, EC-401, EC-400, EC-429, HP-LOG, EC-LOG-NET, HP-UI-OK, EC-UI-LOAD, EC-UI-EMPTY, EC-UI-ERR, EC-UI-ZOD, EC-UI-NOPAGE, HP-BR1–3, EC-BR1–3, HP-SWAG, EC-THIN, EC-NOSTACK) plus Decision 4 Axios/fixture split — verify: each row marked covered with task/evidence pointer; no F3 (Sentry, CI Bruno Actions, release tag) included
- [ ] 7.4 Add READY FOR PR note (branch `feature/F2-mvp-product-vertical` → `develop`) summarizing F2-1…F2-6 acceptance met — verify: note present in change docs (e.g. `SLICE-AUDIT.md` or PR prep section) stating vertical is review-ready

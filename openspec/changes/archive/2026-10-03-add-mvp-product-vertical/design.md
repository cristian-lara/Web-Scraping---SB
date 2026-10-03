## Context

Milestone 1 (F1) delivered `@repo/shared-types` (`Entry`, `FilterQuery`, `UsageLog`, `countWords`) and an offline Cheerio scraper behind `HnScraperPort` with `hn_sample.html`. Milestone 2 must deliver the full product vertical so evaluators can exercise auth → scrape/filter → persist → UI end-to-end.

**Current gaps (locked):**
- `apps/backend` is Cheerio-only + placeholder index — NestJS is not bootstrapped.
- `apps/frontend` is an empty `package.json` scaffold.
- Axios live fetch is not wired yet (port exists; runtime still offline-only).
- Filter word threshold `5` is not exported as a named constant (F1-2 deferred into this change).

**SSOT:** `cursor-intake-spec-v7.md` §1.2–1.6, §1.8–1.10, §2.2–2.4, §5 M2.  
**Backlog:** `docs/backlog/F2-product-user-stories.md` (F2-1…F2-6 as one mono change).  
**Branch:** `feature/F2-mvp-product-vertical`.  
**Proposal:** `openspec/changes/add-mvp-product-vertical/proposal.md` — this design explains HOW that scope is built.

## Goals / Non-Goals

**Goals:**
- Bootstrap NestJS BFF in `apps/backend` with modular auth, filter, scraping, and analytics (usage) modules.
- Filter A/B Strategy Pattern with named word-count threshold, secondary `rank` ASC tie-break, offline unit tests (F2-1).
- JWT auth (Passport), Bcrypt, `JwtAuthGuard` → `401`, Zod DTO validation → client errors, Helmet, CORS, throttler → `429` (F2-2).
- Persist `UsageLog` to SQLite via Prisma + `PrismaUsageRepository` after successful filter runs (F2-3).
- Thin Swagger-documented HTTP controllers for auth and filter (F2-6).
- Axios live HN fetch behind `HnScraperPort` at runtime; automated scraper/filter tests stay on the offline fixture (modified `hn-scraper`).
- React UI (Vite + Tailwind + Shadcn/ui + TanStack Query + React Hook Form): login, Filter A/B, results table with loading / empty / error; client validation via `@hookform/resolvers/zod` sharing `@repo/shared-types` rules where applicable; no pagination (F2-4).
- Bruno `.bru` collection under `apps/backend/bruno/` for Happy Paths 1–3 and Edge Cases 401 / 400 / 429 (F2-5).

**Non-Goals (F3 / later):**
- Sentry, structured correlation logging, request correlation IDs.
- CI wiring for Bruno / GitHub Actions automation of the collection.
- Makefile release targets and `v1.0.0-mvp` git tag.
- OAuth, refresh-token rotation, multi-tenant RBAC, password-reset flows.
- Pagination, usage-history UI, Unicode `countWords` debt.

## Decisions

### Decision 1: NestJS bootstrap in this change
- **Choice:** Replace the Cheerio-only placeholder entry with a real NestJS application shell in `apps/backend` as part of this mono change (not a separate OpenSpec change).
- **Rationale:** JWT, Swagger, throttler, Zod pipes, and DI modules require Nest; F1 intentionally deferred Nest. Without bootstrap, F2-2…F2-6 have no host.
- **Alternatives considered:** Keep plain TS modules forever — rejected (intake §1.2 NestJS BFF). Separate “bootstrap-only” change — rejected (mono Milestone-2 delivery / single feature branch).

### Decision 2: Strategy Pattern lives in backend, not shared-types
- **Choice:** Filter strategy interfaces and Filter A/B implementations live under `apps/backend` (filter module). `@repo/shared-types` continues to own enums, Zod schemas, and `countWords`; it does **not** host strategy classes.
- **Rationale:** Strategies orchestrate domain rules against `Entry[]` and are consumed only by the BFF service layer. Shared-types stays schemas/algorithms without Nest or IO.
- **Alternatives considered:** Strategies in `@repo/shared-types` — rejected (no second runtime consumer; pulls sort policy into a types package).

### Decision 3: Named word-count threshold constant
- **Choice:** Export a named constant (e.g. `FILTER_WORD_THRESHOLD = 5`) from `@repo/shared-types` next to the filter enum / `FilterQuery` surface. Filter A uses `countWords(title) > FILTER_WORD_THRESHOLD`; Filter B uses `countWords(title) <= FILTER_WORD_THRESHOLD`. No magic `5` in strategy or controller code.
- **Rationale:** F1-2 deferred this export into F2; intake §2.3 hard-codes five words; engineering standards prefer named constants. Shared export keeps UI copy / docs / tests aligned with backend rules.
- **Alternatives considered:** Constant only in backend — workable but duplicates the magic number if UI or Bruno docs need it. Inline `5` — rejected (standards / F1-2 intent).

### Decision 4: Axios live fetch + fixture-backed tests
- **Choice:** Add an Axios-backed adapter (or fetch collaborator) behind existing `HnScraperPort` for **runtime** HN HTML retrieval. Unit/integration tests for scrape and filter continue to inject fixture HTML (`hn_sample.html`) — **no network in automated unit tests**.
- **Rationale:** Intake §1.3 requires Axios + Cheerio; F1 proved parsing offline. Live path is a port swap/wiring concern; tests must stay deterministic.
- **Alternatives considered:** Always hit live HN in tests — rejected (flake). Mock Axios in every filter test — unnecessary if port accepts HTML / injectable scraper.

### Decision 5: SQLite + Prisma path for UsageLog
- **Choice:** Prisma schema targeting SQLite file `app.db`; `PrismaUsageRepository` implements persistence; filter/analytics service calls the repository after a successful filter execution. Controllers never call Prisma directly. Rows validate against `UsageLogSchema` at the persistence boundary.
- **Rationale:** Intake §1.5 / §2.4; portable MVP without external DB/container.
- **Alternatives considered:** In-memory only — rejected (evaluators need inspectable metrics). Direct Prisma in controllers — rejected (Repository + thin-controller standards).

### Decision 6: Seed / demo user for JWT
- **Choice:** On first boot (Prisma seed script and/or idempotent auth bootstrap), create **one** demo user with a Bcrypt-hashed password. Credentials come from environment variables documented in `.env.example` (e.g. `DEMO_USER_EMAIL`, `DEMO_USER_PASSWORD`) with safe local defaults for evaluator demos. Bruno `local` env and the React login form use the same values. Hashes never returned in API responses; plaintext passwords never committed outside `.env.example` documentation.
- **Rationale:** Intake requires JWT + Bcrypt but does not specify IAM/user admin UI. A single seeded user unblocks login, UsageLog `userId` binding, Bruno HP1, and the React UI without OAuth or registration flows (out of scope).
- **Alternatives considered:** Hard-coded user in source — rejected (secret hygiene). Full registration API — rejected (YAGNI / out of scope). Manual SQL insert only — rejected (poor clean-machine DX).

### Decision 7: Apply wave order (implementation sequence)
- **Choice:** Implement in this order inside the mono change/tasks:
  1. **F2-1** — filter strategies + named threshold + offline unit tests (can land as pure modules before or as Nest lands).
  2. **Nest bootstrap + F2-2 auth/hardening** — app shell, JWT, Bcrypt, guards, Helmet, CORS, throttler, Zod pipes.
  3. **HTTP + F2-6 Swagger/thin controllers** — auth + filter routes, OpenAPI, DTO → service → status only.
  4. **F2-3 UsageLog** — Prisma SQLite + repository wired after successful filter.
  5. **F2-4 React UI** — login, filters, table states against the HTTP contract.
  6. **F2-5 Bruno** — HP1–3 and E1–3 against local server (manual-runnable; CI automation is F3).
- **Rationale:** Matches dependency sketch in `F2-product-user-stories.md` while locking Swagger with the first HTTP surface (task-locked wave). Bruno last so producers of 401/400/429 exist. UI after stable filter + auth contract.
- **Alternatives considered:** Bruno before persistence — possible for auth/filter only, but UsageLog is part of the vertical success path; keep Bruno last for full contract. UI before Swagger — rejected (evaluators and agents benefit from OpenAPI while building the client).

### Decision 8: Thin controllers (cross-cutting)
- **Choice:** Controllers bind/validate DTOs (Zod / nestjs-zod), call services, map typed exceptions to HTTP status. No scraping, filtering, Prisma, or password hashing in controllers.
- **Rationale:** Intake §1.10; F2-6 acceptance; keeps Bruno and Swagger aligned with a stable service boundary.

## Happy paths and edge cases

Coverage map for F2-1…F2-6 (no story skipped). Rows are the contract implementers and Bruno/UI must honor.

| ID | Story | Path | Trigger | Expected outcome |
| --- | --- | --- | --- | --- |
| HP-FA | F2-1 | Happy | Filter A on mixed titles | Only `countWords(title) > FILTER_WORD_THRESHOLD`; sort `comments` DESC; ties → `rank` ASC |
| HP-FB | F2-1 | Happy | Filter B on mixed titles | Only `countWords(title) <= FILTER_WORD_THRESHOLD`; sort `points` DESC; ties → `rank` ASC |
| EC-TIE | F2-1 | Edge | Two entries share primary sort key | Lower `rank` appears first |
| EC-EMPTY | F2-1 | Edge | Input set empty **or** all entries excluded by rule | Empty array (not error); no crash |
| HP-AUTH | F2-2 / F2-5 HP1 | Happy | Valid demo credentials → login | JWT returned; suitable for `Authorization: Bearer`; password verified via Bcrypt; hash never in body |
| EC-401 | F2-2 / F2-5 E1 | Edge | Protected route, missing/invalid/expired token | `401 Unauthorized` (`JwtAuthGuard`) |
| EC-400 | F2-2 / F2-5 E2 | Edge | Body/query violates Zod DTO (e.g. invalid filter enum) | Client error `400 Bad Request`; not `500`; validation before business logic |
| EC-429 | F2-2 / F2-5 E3 | Edge | Client exceeds `@nestjs/throttler` limit | `429 Too Many Requests` |
| HP-LOG | F2-3 | Happy | Successful authenticated filter execution | `UsageLog` row: `id`, `timestamp` (ISO 8601), `filter_applied`, `processed_items`, `execution_time_ms`, `userId`; validates `UsageLogSchema`; via `PrismaUsageRepository` → SQLite `app.db` |
| EC-LOG-NET | F2-3 | Edge | Repository/service tests | Create/read proven **without** live HN network |
| HP-UI-OK | F2-4 | Happy | Login + Filter A/B + non-empty API list | Bearer on subsequent calls; table shows at least rank, title, points, comments |
| EC-UI-LOAD | F2-4 | Edge | Request in flight | Explicit loading state (TanStack Query) |
| EC-UI-EMPTY | F2-4 | Edge | API returns `[]` | Explicit empty state (not blank/broken table) |
| EC-UI-ERR | F2-4 | Edge | Network / 4xx / 5xx | Understandable error state; no white screen |
| EC-UI-ZOD | F2-4 | Edge | Invalid login/filter form input | Client rejects via `@hookform/resolvers/zod` using shared schemas/rules from `@repo/shared-types` where applicable (before/without relying on a 500) |
| EC-UI-NOPAGE | F2-4 | Edge | MVP review | **No pagination** controls or paged API usage |
| HP-BR1 | F2-5 | Happy | Bruno HP1 against local server | Auth succeeds; JWT extractable |
| HP-BR2 | F2-5 | Happy | Bruno HP2 with JWT | Filter A extract/sort by comments for >5-word titles |
| HP-BR3 | F2-5 | Happy | Bruno HP3 with JWT | Filter B extract/sort by points for ≤5-word titles |
| EC-BR1 | F2-5 | Edge | Bruno E1 no auth | Expect `401` |
| EC-BR2 | F2-5 | Edge | Bruno E2 invalid filter | Expect `400` from Zod |
| EC-BR3 | F2-5 | Edge | Bruno E3 over throttle | Expect `429` |
| HP-SWAG | F2-6 | Happy | Nest running | Swagger UI / OpenAPI documents auth + filter request/response shapes |
| EC-THIN | F2-6 | Edge | Controller code review / tests | Controller = DTO bind → service → status only; no scrape/filter/Prisma/Bcrypt in controller; named constants at HTTP boundary |
| EC-NOSTACK | F2-6 | Edge | Typed service exception on failure path | HTTP layer maps to status; success/error JSON MUST NOT leak stack traces |

**Capability checklist (all addressed):**
- `filter-strategies` — HP-FA, HP-FB, EC-TIE, EC-EMPTY + Decision 2–3.
- `jwt-auth` — HP-AUTH, EC-401, EC-400, EC-429 + Decision 6.
- `usage-persistence` — HP-LOG, EC-LOG-NET + Decision 5.
- `swagger-thin-controllers` — HP-SWAG, EC-THIN, EC-NOSTACK + Decision 8.
- `frontend-filters-ui` — HP-UI-OK, EC-UI-LOAD, EC-UI-EMPTY, EC-UI-ERR, EC-UI-ZOD, EC-UI-NOPAGE.
- `bruno-e2e` — HP-BR1…3, EC-BR1…3.
- Modified `hn-scraper` — Decision 4 (Axios live behind port; fixture tests offline).
- `jwt-auth` also covers Decision 6 (env-seeded demo user).

## Risks / Trade-offs

- **[Risk] Large mono PR (F2-1…F2-6)** → Mitigation: strict apply wave order; keep modules separable; TDD fail-first per wave; single feature branch with reviewable commits by story ID if helpful. Accept one PR to `develop` per Milestone-2 plan.
- **[Risk] NestJS greenfield on Cheerio-only tree** → Mitigation: bootstrap early (Decision 1); keep existing port/adapter as injectable providers; do not rewrite Cheerio parsing while adding Nest.
- **[Risk] Live HN markup drift vs fixture** → Mitigation: production path uses Axios + same Cheerio adapter; unit tests stay on fixture; refresh fixture only when selectors break.
- **[Risk] Throttler flakes in Bruno E3** → Mitigation: document throttle settings for `local` Bruno env; run E3 with enough requests; avoid coupling unit tests to wall-clock throttle.
- **[Trade-off] Seeded demo user vs real IAM** → Acceptable for MVP; no registration/OAuth (Non-Goals).
- **[Trade-off] Threshold constant in shared-types while strategies stay in backend** → Slight split of “policy number” vs “policy algorithm”; preferred over magic numbers or putting Nest-facing strategies in shared-types.

## Migration / Rollout

1. Develop entirely on `feature/F2-mvp-product-vertical`.
2. Apply OpenSpec tasks in Decision 7 wave order; keep `pnpm` workspace scripts green after each wave where practical.
3. Local rollout only: `prisma migrate` / `db push` + seed → Nest listen → Vite UI → Bruno `local` collection (manual).
4. Open PR into `develop` when F2-1…F2-6 acceptance is met.
5. **No production migration**, no release tag, no CI Bruno gate in this change (F3).
6. SQLite `app.db` is local/dev artifact — document path; do not treat as hosted production data store.

## Open defaults (resolved here — do not block apply)

1. **Demo credentials source:** env-driven seed with documented `.env.example` defaults (Decision 6). Exact default strings are an apply-time detail as long as Bruno, UI, and seed share one source.
2. **Prisma migrate vs `db push` for local SQLite:** prefer versioned Prisma migrations in-repo for evaluator reproducibility; `db push` alone is acceptable only if tasks document an equivalent clean-machine path — default to migrations.

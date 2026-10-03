# Epics — Hacker News Scraper MVP

**Vision SSOT:** `cursor-intake-spec-v7.md`  
**Backlog index:** [`docs/BACKLOG.md`](../BACKLOG.md)  
**Detailed stories:** [`F1-domain-user-stories.md`](F1-domain-user-stories.md) · [`F2-product-user-stories.md`](F2-product-user-stories.md) · [`F3-ops-user-stories.md`](F3-ops-user-stories.md)

Each epic groups related child stories. Each child story → one OpenSpec change (`/opsx-propose` → audit → apply → archive).

**Suggested epic order:** E1 → E2 → E3 → E4 → E5 → E6 / E7 (Bruno after E4–E5; UI after filter HTTP exists) → E8 → E9.

---

## E1 — Foundation

| Field | Value |
| --- | --- |
| **ID** | E1 |
| **Title** | Monorepo foundation and toolchain proof |
| **MVP milestone** | §5 Milestone 1 (scaffolding / OpenSpec / agent backlog start) |

### Epic story

As a **developer**,  
I want **a PNPM + Turborepo monorepo with backend, frontend, shared-types, and a hello-world test**,  
So that **later domain and product changes have a working install/build/test baseline**.

### Child stories

| Child ID | Proposed OpenSpec change | Status (index) |
| --- | --- | --- |
| F0-1 | `init-mvp-from-intake` | archived 2026-10-02 |
| F0-2 | `init-mvp-from-intake` | archived 2026-10-02 |
| F0-3 | `init-mvp-from-intake` | archived 2026-10-02 |

### Definition of Done (epic)

- Monorepo installs with PNPM; `apps/backend`, `apps/frontend`, and `packages/shared-types` exist.
- A hello-world Vitest proves the toolchain.
- Phased backlog exists so subsequent epics can spawn OpenSpec changes.
- Foundation change archived (no open foundation work blocking E2).

### Dependencies

- None (first epic).

---

## E2 — Domain / Scraping

| Field | Value |
| --- | --- |
| **ID** | E2 |
| **Title** | Shared Zod contracts, word count, and offline HN scrape |
| **MVP milestone** | §5 Milestone 1 (domain foundations, Zod, scraping core) |

### Epic story

As the **system / developer**,  
I want **shared Zod domain schemas, a TDD’d `countWords` rule, and a Cheerio adapter that extracts the first 30 HN entries from a local fixture**,  
So that **filters and the BFF can trust offline-validated Entry data with no live network in Milestone 1 tests**.

### Child stories

| Child ID | Proposed OpenSpec change |
| --- | --- |
| F1-1 | `add-shared-domain-types` |
| F1-2 | `add-count-words` |
| F1-3 | `add-hn-scraper-fixture` |

**Child order:** F1-1 → F1-2 (parallel with F1-3 after F1-1) → F1-3. Details: `F1-domain-user-stories.md`.

### Definition of Done (epic)

- `EntrySchema`, `FilterQuerySchema`, and `UsageLogSchema` (+ `z.infer` types) export from `@repo/shared-types` with green Vitest schema tests.
- `countWords` passes the canonical case (`"This is - a self-explained example"` → 5) and edge cases with a named symbol-token constant; no network.
- `CheerioScraperAdapter` behind `HnScraperPort` parses `hn_sample.html` to exactly 30 Zod-validated entries with points/comments defaulting to `0` when missing; fixture tests use no live network.
- Milestone 1 delivery criterion met for domain unit tests (schemas + word count + scraper).

### Dependencies

- **E1** complete (archived foundation).

---

## E3 — Filtering

| Field | Value |
| --- | --- |
| **ID** | E3 |
| **Title** | Filter strategies A/B with rank tie-break |
| **MVP milestone** | §5 Milestone 2 (filter strategies) |

### Epic story

As an **API consumer (and later the React UI)**,  
I want **Strategy-pattern Filter A and Filter B with deterministic sort and rank ASC tie-break**,  
So that **filtered HN lists match the challenge business rules**.

### Child stories

| Child ID | Proposed OpenSpec change |
| --- | --- |
| F2-1 | `add-filter-strategies` |

Details: `F2-product-user-stories.md` (F2-1).

### Definition of Done (epic)

- Filter A (`MORE_THAN_5_WORDS_COMMENTS`): `countWords(title) > 5`, sort `comments` DESC, tie-break `rank` ASC.
- Filter B (`LESS_OR_EQUAL_5_WORDS_POINTS`): `countWords(title) <= 5`, sort `points` DESC, tie-break `rank` ASC.
- Strategy selection is not leaked into controllers; Vitest covers both strategies + tie-break without network I/O.

### Dependencies

- **E2** (F1-1 filter enums / Entry shape; F1-2 `countWords`; scraper entries from F1-3 for integration later).

---

## E4 — Auth & Security

| Field | Value |
| --- | --- |
| **ID** | E4 |
| **Title** | JWT auth, HTTP hardening, and thin Swagger controllers |
| **MVP milestone** | §5 Milestone 2 (JWT + ZodValidationPipe; engineering standards for API surface) |

### Epic story

As an **authenticated user of the BFF**,  
I want **JWT login (Bcrypt), protected filter endpoints, Helmet/CORS/rate limiting, and thin Swagger-documented controllers**,  
So that **only authorized callers can use scrape/filter APIs, abuse is throttled, and the HTTP surface stays discoverable and thin**.

### Child stories

| Child ID | Proposed OpenSpec change |
| --- | --- |
| F2-2 | `add-jwt-auth` |
| F2-6 | `add-swagger-thin-controllers` |

**Child order:** F2-2 first; F2-6 may trail or pair with F2-2. Details: `F2-product-user-stories.md`.

### Definition of Done (epic)

- Valid credentials issue a Bearer JWT; passwords verified with Bcrypt (hashes never returned).
- Missing/invalid JWT → `401`; throttle exceed → `429`; Zod DTO failures → client error (not 500).
- Helmet and CORS enabled on NestJS boot.
- Authenticated `userId` available to downstream services (for UsageLog binding).
- Swagger/OpenAPI documents auth and filter endpoints; controllers only bind DTOs, delegate to services, and map typed exceptions to HTTP status.

### Dependencies

- **E1** (NestJS app shell).
- **E2** (shared Zod DTOs / schemas).
- Soft: **E3** for a meaningful protected filter endpoint to document and guard (auth can land first; Swagger completes once filter routes exist).

---

## E5 — Persistence

| Field | Value |
| --- | --- |
| **ID** | E5 |
| **Title** | UsageLog persistence in SQLite via Prisma Repository |
| **MVP milestone** | §5 Milestone 2 (Prisma + SQLite UsageLog) |

### Epic story

As the **system**,  
I want **each successful filter execution persisted as a `UsageLog` row in SQLite behind `PrismaUsageRepository`**,  
So that **evaluators can inspect usage metrics bound to `userId` without an external database**.

### Child stories

| Child ID | Proposed OpenSpec change |
| --- | --- |
| F2-3 | `add-usage-persistence` |

Details: `F2-product-user-stories.md` (F2-3).

### Definition of Done (epic)

- Successful authenticated filter runs write `UsageLog` with `id`, `timestamp` (ISO 8601), `filter_applied`, `processed_items`, `execution_time_ms`, `userId`.
- Rows validate against `UsageLogSchema`; Prisma + SQLite (`app.db`) behind Repository pattern.
- Clean-machine run needs no external DB/container; repository/service tests prove create/read without live HN network.

### Dependencies

- **E2** (F1-1 `UsageLogSchema`).
- **E3** (filter execution to persist after).
- **E4** (authenticated `userId`).

---

## E6 — Frontend

| Field | Value |
| --- | --- |
| **ID** | E6 |
| **Title** | React UI for auth, filters, and results table |
| **MVP milestone** | §5 Milestone 2 (React UI; empty state; no pagination) |

### Epic story

As an **end user**,  
I want **a React client to log in, choose Filter A or B, and see loading / results / empty / error states**,  
So that **I can exercise the full product vertical without calling the API manually**.

### Child stories

| Child ID | Proposed OpenSpec change |
| --- | --- |
| F2-4 | `add-frontend-filters-ui` |

Details: `F2-product-user-stories.md` (F2-4).

### Definition of Done (epic)

- Login obtains JWT; Bearer attached on subsequent calls (e.g. Axios interceptor).
- Filter A/B request shows loading (TanStack Query); non-empty list renders rank/title/points/comments (Shadcn/ui + Tailwind).
- Empty list shows explicit empty state; failures show understandable error (no white screen).
- Client forms use Zod resolvers aligned with `@repo/shared-types` where applicable.
- **No pagination** in MVP UI.
- Milestone 2 delivery slice for UI: end-to-end flow from React through BFF (with E4–E5) is exercisable.

### Dependencies

- **E3** + **E4** (filter HTTP contract + JWT); ideally **E5** so UI-driven filter runs also persist UsageLog.

---

## E7 — E2E Bruno

| Field | Value |
| --- | --- |
| **ID** | E7 |
| **Title** | Bruno API E2E collection (happy paths and edges) |
| **MVP milestone** | §5 Milestone 2 (Bruno `.bru` collection; manual-run ready) |

### Epic story

As a **QA / evaluator**,  
I want **a git-friendly Bruno collection covering auth, Filter A/B, and 401/400/429**,  
So that **I can prove the BFF contract manually and later automate it in CI**.

### Child stories

| Child ID | Proposed OpenSpec change |
| --- | --- |
| F2-5 | `add-bruno-e2e` |

Details: `F2-product-user-stories.md` (F2-5).

### Definition of Done (epic)

- Collection under `apps/backend/bruno/` (plain-text `.bru`), runnable against live local server (env `local`).
- Happy Path 1: auth + JWT extraction.
- Happy Path 2: Filter A (comments sort, >5 words).
- Happy Path 3: Filter B (points sort, ≤5 words).
- Edge Case 1: no auth → `401`.
- Edge Case 2: invalid filter → `400`.
- Edge Case 3: rate limit → `429`.
- CI wiring of `@usebruno/cli` is **out of this epic** (see E9 / F3-3).

### Dependencies

- **E3**, **E4**, **E5** (filters, auth/hardening including 429 producer, persistence path as exercised by filter calls).
- **E6** not required (API E2E is independent of React).

---

## E8 — Observability / Logging

| Field | Value |
| --- | --- |
| **ID** | E8 |
| **Title** | Structured logs, correlation IDs, and Sentry |
| **MVP milestone** | §5 Milestone 3 (Sentry + structured logging + correlation IDs) |

### Epic story

As an **operator**,  
I want **structured logs with per-request correlation IDs across auth → scrape → filter → persist, plus Sentry (Global Exception Filter and React ErrorBoundary)**,  
So that **I can trace requests and group failures without flooding consoles or confusing correlation IDs with business `UsageLog` rows**.

### Child stories

| Child ID | Proposed OpenSpec change |
| --- | --- |
| F3-1 | `add-structured-logging` |
| F3-2 | `add-sentry-observability` |

**Child order:** F3-1 → F3-2 (Sentry consumes correlation IDs). Details: `F3-ops-user-stories.md`.

### Definition of Done (epic)

- Every inbound request has a correlation/request ID (generate or accept inbound header); ID returned on response.
- Structured logs for a successful filter flow share one ID across auth/guard, scrape, filter, and UsageLog persistence stages; ID distinct from UsageLog business keys.
- No passwords/raw JWTs/DSNs in log examples or test payloads.
- Sentry initializes when DSN present (app boots without DSN); Nest Global Exception Filter + React ErrorBoundary report when configured; correlation ID attached to Sentry events when available.
- Env vars documented in README or `.env.example` (no secrets committed); automated test proves filter/capture path with mocked Sentry.

### Dependencies

- **E4–E7** product vertical present (pipeline stages to observe; Bruno optional for header asserts).
- Prerequisite stated in F3: Phase F2 complete before F3 stories.

---

## E9 — CI / Release

| Field | Value |
| --- | --- |
| **ID** | E9 |
| **Title** | CI quality gates, docs, Makefile, and MVP tag |
| **MVP milestone** | §5 Milestone 3 (Bruno CLI in CI; README; Makefile; tag `v1.0.0-mvp`) |

### Epic story

As a **maintainer / evaluator**,  
I want **GitHub Actions running Vitest, Bruno CLI, and lint, plus English README, Makefile targets, and git tag `v1.0.0-mvp`**,  
So that **merges stay green and anyone can install, run, test, and identify the MVP snapshot**.

### Child stories

| Child ID | Proposed OpenSpec change |
| --- | --- |
| F3-3 | `add-ci-quality-gates` |
| F3-4 | `add-docs-makefile-release` |

**Child order:** F3-3 → F3-4 (tag last). Details: `F3-ops-user-stories.md`.

### Definition of Done (epic)

- `.github/workflows/ci.yml` runs on PRs/pushes: PNPM install, Vitest, live-API `@usebruno/cli` on `apps/backend/bruno`, ESLint/Prettier lint — fail on non-zero.
- Sentry optional in CI (disabled/mocked); no secret DSN required for green.
- Root English `README.md`: architecture, decisions, install, dev, Vitest, Bruno E2E.
- `Makefile`: `make install`, `make dev`, `make test`, `make test-e2e`, `make lint` documented and aligned with CI where practical.
- Warning-free MVP build; annotated or team-standard git tag **`v1.0.0-mvp`** on the release commit.
- Milestone 3 delivery criterion: clean repo, Vitest + Bruno green, tag present.

### Dependencies

- **E7** (Bruno collection exists before CI automates it).
- **E8** (observability in place to document/release; CI must not require Sentry secrets).
- Full product vertical **E2–E6** green so release tag is meaningful.

---

## Epic map (summary)

| Epic | Title | Milestone | Child IDs | OpenSpec changes (kebab) |
| --- | --- | --- | --- | --- |
| E1 | Foundation | M1 | F0-1, F0-2, F0-3 | `init-mvp-from-intake` |
| E2 | Domain / Scraping | M1 | F1-1, F1-2, F1-3 | `add-shared-domain-types`, `add-count-words`, `add-hn-scraper-fixture` |
| E3 | Filtering | M2 | F2-1 | `add-filter-strategies` |
| E4 | Auth & Security | M2 | F2-2, F2-6 | `add-jwt-auth`, `add-swagger-thin-controllers` |
| E5 | Persistence | M2 | F2-3 | `add-usage-persistence` |
| E6 | Frontend | M2 | F2-4 | `add-frontend-filters-ui` |
| E7 | E2E Bruno | M2 | F2-5 | `add-bruno-e2e` |
| E8 | Observability / Logging | M3 | F3-1, F3-2 | `add-structured-logging`, `add-sentry-observability` |
| E9 | CI / Release | M3 | F3-3, F3-4 | `add-ci-quality-gates`, `add-docs-makefile-release` |

### Dependency graph (epics)

```text
E1 Foundation
 └── E2 Domain / Scraping
      ├── E3 Filtering
      │    └── E4 Auth & Security
      │         ├── E5 Persistence
      │         │    ├── E6 Frontend
      │         │    └── E7 E2E Bruno
      │         └── (E6 also needs E3 filter HTTP; E7 needs E3–E5)
      └── E8 Observability (after F2 / E3–E7)
           └── E9 CI / Release
```

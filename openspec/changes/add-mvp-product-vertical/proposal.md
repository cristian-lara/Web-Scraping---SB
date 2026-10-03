## Why

Milestone 2 (intake §5) must deliver the full product vertical: filter strategies, NestJS BFF with JWT hardening, UsageLog persistence, React UI, Bruno contract tests, and Swagger-documented thin controllers. F1 already provides shared Zod types, `countWords`, and an offline Cheerio scraper; without a single Milestone-2 delivery the evaluators cannot exercise auth → scrape/filter → persist → UI end-to-end. This change ships that vertical as one OpenSpec change and one feature branch (backlog F2-1…F2-6).

## What Changes

- Bootstrap NestJS BFF in `apps/backend` (GAP from F1 placeholder) and wire modular auth, filter, scraping, and analytics modules.
- Add Filter A/B Strategy Pattern with named word-count threshold `5`, secondary `rank` ASC tie-break, offline unit tests.
- Add JWT auth (Passport), Bcrypt password verification, `JwtAuthGuard` → `401`, Zod DTO validation → client errors, Helmet, CORS, and `@nestjs/throttler` → `429`.
- Seed one env-driven demo user (Bcrypt hash) via Prisma seed / idempotent bootstrap so login, Bruno, and UI share credentials (documented in `.env.example`).
- Persist `UsageLog` rows to SQLite via Prisma + `PrismaUsageRepository` after successful filter execution (`UsageLogSchema`).
- Expose thin Swagger-documented HTTP controllers for auth and filter (DTO bind → service → status only).
- Wire Axios live HN fetch behind `HnScraperPort` for runtime; keep automated scraper/filter tests on the offline fixture (no network in unit tests).
- Build React UI (Vite + Tailwind + Shadcn/ui + TanStack Query): login, Filter A/B, results table with loading / empty / error states; **no pagination**.
- Add Bruno `.bru` collection under `apps/backend/bruno/` covering Happy Paths 1–3 and Edge Cases 401 / 400 / 429.
- Do **not** include F3 work: Sentry, structured correlation logging, CI Bruno/Actions wiring, Makefile release, or `v1.0.0-mvp` tag.

## Capabilities

### New Capabilities
- `filter-strategies`: Strategy Pattern for Filter A (`MORE_THAN_5_WORDS_COMMENTS`) and Filter B (`LESS_OR_EQUAL_5_WORDS_POINTS`), named threshold, rank tie-break, offline tests.
- `jwt-auth`: NestJS JWT login, Bcrypt, JwtAuthGuard `401`, Zod validation, Helmet, CORS, throttler `429`, authenticated `userId`, and env-seeded demo user for local/Bruno/UI.
- `usage-persistence`: Prisma SQLite `app.db`, `PrismaUsageRepository`, `UsageLog` fields validated with `UsageLogSchema`.
- `swagger-thin-controllers`: OpenAPI/Swagger for auth + filter; controllers limited to DTO → service → HTTP mapping.
- `frontend-filters-ui`: React client login, filter selection, table + loading/empty/error; Bearer JWT; client forms validated with `@hookform/resolvers/zod` sharing rules from `@repo/shared-types` where applicable; no pagination.
- `bruno-e2e`: Bruno collection for auth, Filter A/B, and edges 401 / 400 / 429 under `apps/backend/bruno/`.

### Modified Capabilities
- `hn-scraper`: Extend runtime path to allow Axios live fetch behind `HnScraperPort` while preserving the offline fixture contract for automated tests (no network in unit tests).

## Impact

- Apps: `apps/backend` (Nest bootstrap, modules, Prisma, Bruno), `apps/frontend` (Vite UI scaffold → real app)
- Packages: `@repo/shared-types` (consume enums / `countWords` / schemas; may export named filter threshold constant)
- Dependencies (new): NestJS stack, Passport JWT, Bcrypt, Helmet, throttler, Prisma, Axios (live scrape), React/Vite/Tailwind/Shadcn/TanStack Query / Axios client as required by intake
- Stories: `docs/backlog/F2-product-user-stories.md` F2-1…F2-6 (single change)
- Branch: `feature/F2-mvp-product-vertical`
- Out of scope: F3 observability/CI/release; OAuth/refresh/RBAC; pagination; usage-history UI; Unicode `countWords` debt

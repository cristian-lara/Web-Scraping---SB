# Web-Scraping---SB

Hacker News scraper MVP: NestJS BFF + React client + SQLite `UsageLog`. Milestone 3 snapshot name: git tag `v1.0.0-mvp` (created on `main` after F3 is merged; this README names the tag before it exists).

## Architecture

```
React (Vite, :5173)  --proxy /auth /filters-->  Nest BFF (:3000)
                                              |-- JWT login (in-memory demo user)
                                              |-- scrape HN HTML (Cheerio)
                                              |-- Filter A / Filter B
                                              |-- Prisma SQLite UsageLog
```

- **BFF:** `@repo/backend` owns scraping, filters, auth, persistence, and HTTP contracts. The SPA does not scrape HN.
- **Shared contracts:** Zod schemas in `@repo/shared-types` (login + filter query/response).
- **Filters:** Filter A = titles with `countWords(title) > 5`, sort comments DESC (rank ASC ties). Filter B = `countWords(title) <= 5`, sort points DESC (rank ASC ties).
- **JWT:** `POST /auth/login` returns a Bearer token. Protected `GET /filters`. Demo user from env (`DEMO_USER_EMAIL` / `DEMO_USER_PASSWORD`); JWT `sub` is `UsageLog.userId`.
- **SQLite:** local file `apps/backend/prisma/app.db` (no hosted DB).
- **Observability:** header `x-request-id` (inbound or generated UUID, echoed). JSON-line logs with `requestId` and stage. Optional Sentry (`SENTRY_DSN` / `VITE_SENTRY_DSN`); empty DSN = disabled, app still boots. React `ErrorBoundary` around the root.

## Decisions

| Topic | Choice |
|--------|--------|
| BFF | Nest owns HN fetch + filters; browser is a client |
| Zod | Shared schemas in `@repo/shared-types` |
| Filters | Word-count A/B as above; Unicode `countWords` debt out of scope |
| JWT | HS256 with `JWT_SECRET`; demo user in-memory |
| SQLite | Prisma `UsageLog` only; correlation ID is not stored |
| Observability | `x-request-id` + JSON logs; Sentry optional; no OTel/Jaeger |

## Branching

| Branch | Role |
|--------|------|
| `main` | Stable / release only |
| `develop` | Integration line for completed stories |
| `feature/<story-id>-<slug>` | One OpenSpec change / user story |

Flow: `feature/*` → PR → `develop` → (release) PR → `main` + tag `v1.0.0-mvp`.

Local gestor notes live under `projects/**/_local/` and are gitignored.

## Prerequisites

- Node 22+
- pnpm (see `packageManager` in root `package.json`)

## Install

```bash
make install
# equivalent: pnpm install --frozen-lockfile
```

Copy env examples (placeholders only; never commit real `.env`):

```bash
cp apps/backend/.env.example apps/backend/.env
# optional frontend: cp apps/frontend/.env.example apps/frontend/.env
pnpm --filter @repo/backend prisma:migrate
```

`.env.example` files document `SENTRY_DSN` and `VITE_SENTRY_DSN` as **empty placeholders**. Leave them empty unless you have a Sentry project.

## Dev

```bash
make dev
# equivalent: pnpm dev
```

Turbo starts backend (`tsx`, default `http://localhost:3000`) and frontend (`http://localhost:5173`). Swagger: `http://localhost:3000/api`.

Rebuild shared types if schemas change: `pnpm --filter @repo/shared-types build`.

## Vitest

```bash
make test
# equivalent: pnpm test
```

Workspace unit/integration tests (Turbo). Backend suites stay offline (fixture HTML / mocked scrape). No live `news.ycombinator.com` in Vitest.

## Bruno E2E

Backend must already be listening on `http://localhost:3000`.

```bash
make test-e2e
# equivalent: pnpm test:e2e  (runs bru from apps/backend/bruno)
```

Collection: `apps/backend/bruno/` (plain-text `.bru`, env `local`). HP1 login, HP2/HP3 filters (assert non-empty `x-request-id`), E1–E3 (401/400/429). See `apps/backend/bruno/README.md`.

## Lint

```bash
make lint
# equivalent: pnpm lint
```

## CI

GitHub Actions: `.github/workflows/ci.yml` on `pull_request` and `push` to `develop` and `main`.

Order: `pnpm install --frozen-lockfile` → `pnpm test` → `pnpm lint` → live backend (`pnpm --filter @repo/backend start`) → `pnpm test:e2e` (Bruno from `apps/backend/bruno`).

**A failing Vitest or Bruno run fails CI** (non-zero exit fails the job). Lint non-zero also fails the job. `SENTRY_DSN` is empty in CI (Sentry not required). `JWT_SECRET` and `DEMO_USER_PASSWORD` are step `env` values and must not be echoed in workflow logs.

## Build

```bash
pnpm build
```

Turbo `build` across packages. MVP release blocker: this command must exit 0.

## Env examples

| File | Notes |
|------|--------|
| `apps/backend/.env.example` | `PORT`, `JWT_SECRET`, demo user, optional `SENTRY_DSN=` |
| `apps/frontend/.env.example` | `VITE_API_BASE_URL`, optional `VITE_SENTRY_DSN=` |
| `.env.example` | Root convenience mirror of the same placeholders |

Do not put production secrets in git. Empty Sentry DSN = observability SDKs stay off.

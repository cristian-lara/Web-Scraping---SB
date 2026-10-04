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
- **Docker Desktop** (or equivalent) only if you use the Compose local stack (`make up`)

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

## Dev (host, no Docker)

```bash
make dev
# equivalent: pnpm dev
```

Turbo starts backend (`tsx`, default `http://localhost:3000`) and frontend (`http://localhost:5173`). Swagger: `http://localhost:3000/api`.

Rebuild shared types if schemas change: `pnpm --filter @repo/shared-types build`.

## Local Docker stack (`make up`)

One-command local ecosystem (app + OpenTelemetry → Loki/Tempo/Grafana). Does **not** run Vitest/Bruno as part of `up`.

```bash
make up      # docker compose up -d --build
make logs    # follow backend container logs
make down    # stop stack
```

| Service | Host port |
|---------|-----------|
| BFF API | http://localhost:3000 |
| Frontend | http://localhost:5173 |
| Grafana | http://localhost:3001 (anonymous Admin for local Explore) |
| OTLP | 4317 (gRPC) / 4318 (HTTP) |

Secrets (`JWT_SECRET`, `DEMO_USER_PASSWORD`, optional `GRAFANA_ADMIN_PASSWORD`) come from the host environment or a Compose `.env` file — **never baked into image layers**. Copy `apps/backend/.env.example` values into Compose env as needed.

After `make up`: login in the UI → Filter A/B → **Save results** → open Grafana Explore (Tempo) and filter by attribute `request.id` / correlation header `x-request-id`.

**CI does not start Compose or Grafana.** GitHub Actions stays host/PNPM (`pnpm test`, `pnpm lint`, Bruno subset). Host `make dev` / `make test` remain the day-to-day path without Docker.

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

Collection: `apps/backend/bruno/` (plain-text `.bru`, env `local`). HP1 login, HP2/HP3 filters (assert non-empty `x-request-id`), HP4/HP5 save+list (fixture entries), E1–E4 (401/400/save-401), E3 throttle last. See `apps/backend/bruno/README.md`.

## Lint

```bash
make lint
# equivalent: pnpm lint
```

## CI

GitHub Actions: `.github/workflows/ci.yml` on `pull_request` and `push` to `develop` and `main`.

Order: `pnpm install --frozen-lockfile` → `pnpm test` → `pnpm lint` → live backend (`pnpm --filter @repo/backend start`) → `pnpm test:e2e:ci` (Bruno HP1–5 + E1–E2 + E4; live scrape on HP2/HP3 only). E3 throttle is local/`pnpm test:e2e`; EC-429 also covered by Vitest. No Docker Compose / Grafana in CI.

**A failing Vitest or Bruno run fails CI** (non-zero exit fails the job). Lint non-zero also fails the job. `SENTRY_DSN` is empty in CI (Sentry not required). `JWT_SECRET` and `DEMO_USER_PASSWORD` are step `env` values and must not be echoed in workflow logs.

## Build

```bash
pnpm build
```

Turbo `build` across packages. MVP release blocker: this command must exit 0.

## Env examples

| File | Notes |
|------|--------|
| `apps/backend/.env.example` | `PORT`, `JWT_SECRET`, demo user, optional `SENTRY_DSN=`, optional `OTEL_EXPORTER_OTLP_ENDPOINT=` |
| `apps/frontend/.env.example` | `VITE_API_BASE_URL`, optional `VITE_SENTRY_DSN=` |
| `.env.example` | Root convenience mirror of the same placeholders |

Do not put production secrets in git. Empty Sentry DSN = observability SDKs stay off.

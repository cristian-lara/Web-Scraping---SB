# Backend (`@repo/backend`)

NestJS BFF for the HN scraper MVP.

## Boot

```bash
# from repo root
cp apps/backend/.env.example apps/backend/.env   # optional
pnpm --filter @repo/backend dev
```

Listens on `PORT` (default `3000`). Demo login: `DEMO_USER_EMAIL` / `DEMO_USER_PASSWORD` from `.env.example`. JWT `sub` is `userId` on `UsageLog` rows.

Swagger UI: `http://localhost:3000/api` (OpenAPI JSON: `/api-json`).

Bruno: collection under `apps/backend/bruno/` with env `local`. See `apps/backend/bruno/README.md`. CLI: `npx @usebruno/cli run apps/backend/bruno --env local` with this process listening (`make test-e2e`). CI runs the same command after `pnpm --filter @repo/backend start`.

## SQLite (UsageLog)

Local file `apps/backend/prisma/app.db` (no external DB). First machine:

```bash
pnpm --filter @repo/backend prisma:migrate
```

`prisma generate` runs as part of `dev` / `build` / `test`. Demo auth stays in-memory; UsageLog `userId` is the JWT subject string (`demo-user-1`).

## Tests

```bash
pnpm --filter @repo/backend test
```

Scraper/filter/usage suites stay offline (fixture HTML / mock scraper). Auth/hardening uses `@nestjs/testing` + supertest. Live Axios HN fetch is not exercised in unit tests.

## ESM note

Package is `"type": "module"` (NodeNext). Nest runs via `tsx` (no decorator metadata emit), so constructors use explicit `@Inject(...)`. Vitest uses `unplugin-swc` for Nest HTTP tests. Rebuild shared-types before boot if schemas change: `pnpm --filter @repo/shared-types build`.

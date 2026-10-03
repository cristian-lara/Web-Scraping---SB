# Frontend (`@repo/frontend`)

Vite + React + TypeScript client for HN Scraper: login (JWT), Filter A/B results table, loading/empty/error, and a 404 route.

## Run

1. Copy `apps/backend/.env.example` → `apps/backend/.env` (demo email/password).
2. Backend: `pnpm --filter @repo/backend dev` (http://localhost:3000).
3. Frontend: `pnpm --filter @repo/frontend dev` (http://localhost:5173; Vite proxies `/auth` and `/filters`).

Shared types must be built once: `pnpm --filter @repo/shared-types build`.

## Scripts

- `pnpm --filter @repo/frontend build`
- `pnpm --filter @repo/frontend test`

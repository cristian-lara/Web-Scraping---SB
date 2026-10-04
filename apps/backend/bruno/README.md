# Bruno collection (local BFF)

Plain-text `.bru` requests for the live Nest BFF. CLI-runnable for local and CI (`make test-e2e` / GitHub Actions).

## Nest first

From repo root:

```bash
cp apps/backend/.env.example apps/backend/.env   # first machine
pnpm --filter @repo/backend prisma:migrate      # first machine
pnpm --filter @repo/backend dev
```

BFF: `http://localhost:3000`. Demo user: `DEMO_USER_EMAIL` / `DEMO_USER_PASSWORD` from `.env.example` (same values as Bruno env `local`).

## Fixture scrape (CI / non-vacuous HP2–HP3)

HP2 and HP3 **require a non-empty** filtered array (empty `[]` fails those happy paths). CI sets `E2E_SCRAPE_FIXTURE=1` on the Nest process so scrape uses offline `hn_sample.html` (mixed long/short titles) instead of live Hacker News.

Local equivalent:

```bash
# In apps/backend/.env (or export):
E2E_SCRAPE_FIXTURE=1
pnpm --filter @repo/backend dev
# then: pnpm test:e2e:ci
```

Unset / omit the flag for live HN (local demo). Live HN may return empty Filter A or B depending on titles — that is valid API EC-EMPTY but not Bruno happy-path evidence.

## Run Bruno

GUI: open `apps/backend/bruno/` in Bruno, select environment `local`, run HP1 before HP2–HP5/E2. Run E3 last.

CLI:

```bash
# From repo root (cwd must be collection root with bruno.json):
pnpm test:e2e          # full collection including E3 throttle
pnpm test:e2e:ci       # CI subset: HP1–5 + E1–E2 + E4 (skip E3; 429 is Vitest)
# Or: make test-e2e
```

HP4/HP5 save+list use fixture entries in the request body (no live HN required). E4 asserts 401 on save without Bearer.

## Environment `local`

`environments/local.bru` is CLI-compatible (`vars` only — no `meta`/`docs` blocks; Bruno CLI 4.x parser rejects those). Demo credentials match `apps/backend/.env.example`. HP1 overwrites `accessToken`.

## Throttle (E3)

`AppThrottlerGuard` is the global `APP_GUARD`. Defaults: 100 requests per 60000 ms (`THROTTLE_LIMIT` / `THROTTLE_TTL_MS`). Bruno `throttleLimit` must match Nest. For a short E3: set both to `5`, restart Nest, run E3. Default 100 works but E3 sends ~101 login POSTs in the window.

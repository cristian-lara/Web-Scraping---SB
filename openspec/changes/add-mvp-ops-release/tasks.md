## 1. Structured logging + correlation ID (F3-1)

Slice gates: **1.5** (review) and **1.6** (audit PASS in `SLICE-AUDIT.md`) before wave 2.

- [x] 1.1 Add named constant for header `x-request-id`; middleware/interceptor accepts non-empty inbound or generates UUID; echo on response — verify: `pnpm --filter @repo/backend test` covers generate + echo (HP-CORR, HP-CORR-IN); files under `apps/backend/src/`
- [x] 1.2 Add request-scoped store + JSON-line logger (timestamp, level, stage, `requestId`, optional `durationMs`); emit at auth/guard, scrape entry/exit or duration, filter apply, UsageLog persist; do not persist correlation ID on `UsageLog` — verify: filter success logs one ID across stages; UsageLog PK ≠ request ID (HP-CORR, EC-CORR-USAGE)
- [x] 1.3 TDD-SEQ: write failing Vitest then implement until green — protected filter request with injected scrape shares one correlation ID; log fixtures omit password, raw JWT, DSN; no live HN — verify: `pnpm --filter @repo/backend test` exit 0; suite does not call news.ycombinator.com (EC-CORR-NE, EC-CORR-SECRET)
- [x] 1.4 Confirm structured logs (not only `console.log` listen) include `requestId` and stage on a filter request — verify: test or captured stdout JSON lines contain those fields
- [x] 1.5 **Slice review:** HP-CORR, HP-CORR-IN, EC-CORR-SECRET, EC-CORR-NE, EC-CORR-USAGE; `openspec validate add-mvp-ops-release --strict` exit 0
- [x] 1.6 **Slice audit:** table 1.1–1.5 → PASS before wave 2 — verify: `SLICE-AUDIT.md` with commands + exit codes

## 2. Sentry + Global Exception Filter + ErrorBoundary (F3-2)

Slice gates: **2.5** (review) and **2.6** (audit PASS) before wave 3.

- [x] 2.1 Document `SENTRY_DSN` / `VITE_SENTRY_DSN` in `.env.example` + README placeholders; init Sentry only when non-empty; boot without DSN; frontend still mounts App — verify: backend `createApp` with unset DSN; no real DSN in git; `apps/frontend/src/main.tsx` still renders (HP-SENTRY-OFF)
- [x] 2.2 TDD-SEQ: failing then green Vitest with mocked Sentry client — extend `HttpExceptionMappingFilter` to capture when configured; keep DomainException mapping and no stack JSON; `sendDefaultPii: false` or scrub so events omit password, raw JWT, Authorization — verify: `pnpm --filter @repo/backend test` (HP-SENTRY-ON, EC-SENTRY-DOMAIN, EC-SENTRY-SCRUB, EC-SENTRY-MOCK)
- [x] 2.3 Attach correlation/request ID to Sentry events when present; emit scrape/filter duration on structured logs and/or Sentry breadcrumb/span — verify: event tag/extra has request ID; duration field present (HP-SENTRY-CORR, HP-TIME)
- [x] 2.4 Wrap React root in ErrorBoundary with controlled fallback; report to Sentry when frontend DSN present — verify: test or documented component path `apps/frontend/src/`; thrown child shows fallback (HP-EB)
- [x] 2.5 **Slice review:** EC-SENTRY-MOCK + EC-SENTRY-SCRUB; `openspec validate add-mvp-ops-release --strict` exit 0
- [x] 2.6 **Slice audit:** table 2.1–2.5 → PASS before wave 3 — verify: `SLICE-AUDIT.md` evidence

## 3. Bruno correlation assertions (modified bruno-e2e)

Slice gates: **3.5** (review) and **3.6** (audit PASS) before wave 4.

- [x] 3.1 Add Bruno assertions that HP2 and/or HP3 responses include non-empty `x-request-id`; keep HP1–3 and E1–3 — verify: `.bru` files under `apps/backend/bruno/` contain `x-request-id` assert (HP-BR-CORR)
- [x] 3.2 Confirm collection remains text `.bru` with `local` env — verify: path `apps/backend/bruno/`; no Postman binary
- [x] 3.3 Collection stays CLI-runnable: `npx @usebruno/cli run apps/backend/bruno --env local` remains the documented command — verify: README or bruno README still documents that command
- [x] 3.4 No extra Nest/React work in this wave — verify: diff limited to Bruno (+ docs notes)
- [x] 3.5 **Slice review:** HP-BR-CORR + HP-BR1–3 / EC-BR1–3 still present; `openspec validate add-mvp-ops-release --strict` exit 0
- [x] 3.6 **Slice audit:** table 3.1–3.5 → PASS before wave 4 — verify: `SLICE-AUDIT.md` evidence

## 4. CI quality gates (F3-3)

Slice gates: **4.5** (review) and **4.6** (audit PASS) before wave 5.

- [x] 4.1 Add `.github/workflows/ci.yml` on `pull_request` and `push` to `develop` and `main`; PNPM install; `pnpm test`; fail on non-zero — verify: file `.github/workflows/ci.yml` exists and contains those triggers/steps (HP-CI, EC-CI-FAIL documented in README notes)
- [x] 4.2 CI starts live backend then `npx @usebruno/cli run apps/backend/bruno` with `local` or committed `ci` env; Sentry unset; do not echo `JWT_SECRET` / `DEMO_USER_PASSWORD` in logs — verify: workflow has Bruno step, no DSN required, secrets not printed (EC-CI-NOSENTRY, EC-CI-LOGS)
- [x] 4.3 CI runs `pnpm lint`; fail on violations — verify: `ci.yml` contains lint step
- [x] 4.4 Makefile/README commands named in CI steps (no hidden one-off) — verify: same script names as `package.json` / Makefile
- [x] 4.5 **Slice review:** HP-CI, EC-CI-NOSENTRY, EC-CI-LOGS, EC-CI-FAIL; `openspec validate add-mvp-ops-release --strict` exit 0
- [x] 4.6 **Slice audit:** table 4.1–4.5 → PASS before wave 5 — verify: `SLICE-AUDIT.md` evidence

## 5. README, Makefile, and tag (F3-4)

Slice gates: **5.5** (review) and **5.6** (audit PASS) before mono close. Tag is **5.7** after merge to `main`.

- [x] 5.1 Expand root English `README.md`: architecture, decisions, install, dev, Vitest, Bruno CLI, env examples, tag name `v1.0.0-mvp` — verify: file `README.md` contains those sections (HP-DOCS)
- [x] 5.2 Add root `Makefile` with `install`, `dev`, `test`, `test-e2e`, `lint` mapping to PNPM/Turbo/Bruno — verify: `Makefile` exists with those targets (HP-MAKE)
- [x] 5.3 Warning-free MVP build: run `pnpm build` (or documented Make equivalent) exit 0; `.env.example` placeholders only — verify: `pnpm build` exit 0 (HP-BUILD)
- [x] 5.4 Confirm no committed secrets in env examples — verify: grep of `.env.example` files shows placeholders only
- [x] 5.5 **Slice review:** HP-DOCS, HP-MAKE, HP-BUILD; `openspec validate add-mvp-ops-release --strict` exit 0
- [x] 5.6 **Slice audit:** table 5.1–5.5 → PASS before close — verify: `SLICE-AUDIT.md` evidence
- [ ] 5.7 After F3-1…F3-3 green and change is on `main`, create annotated git tag `v1.0.0-mvp` — verify: `git tag -l v1.0.0-mvp` (HP-TAG). Until `main` merge, README names the tag only

## 6. Mono close

- [x] 6.1 Run `pnpm test` and `pnpm lint` — verify: both exit 0; correlation/Sentry unit tests without live HN
- [x] 6.2 Run `openspec validate add-mvp-ops-release --strict` — verify: exit 0
- [x] 6.3 Code review vs design HP/EC table (all rows including HP-BUILD, EC-SENTRY-SCRUB, EC-CI-LOGS, EC-CI-FAIL) — verify: checklist in `SLICE-AUDIT.md`
- [x] 6.4 READY FOR PR note: `feature/F3-mvp-ops-release` → `develop` — verify: note in `SLICE-AUDIT.md`

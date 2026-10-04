## Why

Evaluators must see that the challenge core (HN top-30 scrape, `countWords` threshold 5, Filter A/B) is proven by tests—and which happy paths or edge cases remain thin. Today Vitest covers domain rules well, but Bruno HP2/HP3 can pass on an empty `[]`, scraper tests do not lock ranks `1..30` / surplus-slice, HTTP integration covers Filter A only, and the repo produces neither an HP/EC scenario matrix nor a CORE code-coverage report. Hardening E2E evidence plus evaluator-facing reports closes that gap without Playwright or product-scope expansion.

## What Changes

- Add a committed English **scenario matrix** mapping CORE OpenSpec / intake happy paths and edge cases to concrete Vitest and Bruno tests, with PASS / WEAK / GAP status so evaluators see coverage and missing cases.
- Add **Vitest code-coverage** tooling for CORE packages (`count-words` / shared-types filter surface, scraping, filtering): HTML + LCOV reports, documented `pnpm` / Makefile entrypoints, CORE thresholds that fail when under floor; `coverage/` gitignored.
- Harden **Bruno API E2E** so Filter A/B runs are non-vacuous (empty `[]` alone MUST NOT prove HP2/HP3) while preserving product EC-EMPTY (empty remains a valid API outcome, not a 5xx).
- Strengthen **scraper offline Vitest**: assert ranks `1..30` and that surplus fixture rows beyond top-30 are excluded.
- Add **Nest HTTP Filter B** happy-path coverage mirroring Filter A (offline mock scraper).
- Wire CI to generate CORE coverage artifacts and keep Bruno E2E green under the hardened collection; document how evaluators open the matrix and coverage HTML.
- Do **not** add Playwright/Cypress, global 100% line coverage gates, pagination, or live-HN flake workarounds beyond documented offline fixture/integration paths.

## Capabilities

### New Capabilities
- `qa-scenario-matrix`: Committed evaluator-facing matrix of CORE HP/EC scenarios vs Vitest/Bruno tests with explicit PASS/WEAK/GAP status and refresh rules when tests change.
- `core-code-coverage`: Vitest coverage (v8) for CORE modules, HTML/LCOV reports, named scripts/Makefile targets, CORE thresholds, and CI step that generates/uploads reports and fails on CORE threshold breach; no global monorepo 100% gate. (CI quality workflow already exists from Milestone 3; this capability extends it for coverage evidence.)

### Modified Capabilities
- `bruno-e2e`: Non-vacuous Filter A/B happy-path evidence (must not treat empty `[]` as sufficient proof of filter execution); keep auth/edges and CLI/CI runnability.
- `hn-scraper`: Offline Vitest MUST assert ordered ranks `1..30` and exclusion of surplus rows beyond the top-30 slice when the fixture has more than thirty list rows.
- `filter-strategies`: Authenticated Nest HTTP path MUST cover Filter B happy path offline (mock/injected scrape) in addition to existing unit Strategy coverage.

## Impact

- Apps/packages: `packages/shared-types`, `apps/backend` (scraping/filtering Vitest, Bruno `.bru`), Vitest configs + `@vitest/coverage-v8`
- Docs: `docs/qa/core-scenario-matrix.md` (or equivalent path), root `README.md` / Makefile targets for coverage
- CI: `.github/workflows/ci.yml` coverage step + artifact upload
- Out of scope: Playwright/Cypress, UI browser E2E, OpenTelemetry, Docker production, Unicode `countWords` debt, demo-user Prisma seed debt, replacing Bruno with another API client
- Assumption: CI fails on CORE coverage threshold (not whole-repo %); scenario matrix is committed Markdown, not a generated binary; offline fixture/integration preferred over requiring live HN non-empty for CI green

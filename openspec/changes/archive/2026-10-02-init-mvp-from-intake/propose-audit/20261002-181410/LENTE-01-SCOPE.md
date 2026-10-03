# Lente SCOPE

- at: 2026-10-02T23:14:10Z
- prompt_focus: Every intake/capability claim must cite task or spec, not only proposal keywords
- files_reviewed:
  - openspec/changes/init-mvp-from-intake/proposal.md
  - openspec/changes/init-mvp-from-intake/tasks.md
  - openspec/changes/init-mvp-from-intake/specs/**/spec.md
  - cursor-intake-spec-v7.md

## Claim register

| Claim / AC | Evidence (task/spec) | PASS\|GAP |
|------------|----------------------|-----------|
| Monorepo PNPM+Turbo apps/backend|frontend|shared-types | tasks 1.1 · specs/monorepo-foundation | PASS |
| Zod Entry/Filter/UsageLog shared | tasks 1.2 · specs/shared-types | PASS |
| countWords canonical + threshold named | tasks 1.3 · specs/filtering + engineering-standards | PASS |
| Scrape top 30 + fixture offline | tasks 1.4 · specs/hn-scraping | PASS |
| Filter A/B Strategy + rank tie-break | tasks 2.1 · specs/filtering | PASS |
| JWT + 401 + ZodValidationPipe thin controllers | tasks 2.2 · specs/auth-security + engineering-standards | PASS |
| Swagger on controllers | tasks 2.3 · specs/engineering-standards | PASS |
| UsageLog SQLite Prisma | tasks 2.4 · specs/usage-persistence | PASS |
| Helmet/CORS/429 | tasks 2.5 · specs/auth-security | PASS |
| React UI auth/filter/table | tasks 2.6 · specs/frontend-ui | PASS |
| Bruno happy+edge suite | tasks 2.7 · specs/api-e2e-bruno | PASS |
| Structured logs + correlation ID | tasks 3.1 · specs/observability | PASS |
| Sentry + ExceptionFilter + ErrorBoundary | tasks 3.2 · specs/observability | PASS |
| CI Vitest+Bruno+lint | tasks 3.3 · specs/engineering-standards + api-e2e-bruno | PASS |
| README/Makefile Conventional Commits | tasks 3.4 · engineering-standards | PASS |
| English-only repo + intake rewrite | proposal Impact only — **no task** | GAP |
| openspec/config.yaml Language English | proposal Impact only — **no task** | GAP |
| Translate remaining Spanish specs/design | proposal Impact — **no task** | GAP |
| Cursor rules Ponytail/Caveman | rules exist on disk; task 1.6 still says “later” | GAP (stale task) |
| AGENT_INSTRUCTIONS / .openspec/spec.yaml from intake §6 | intake mentions; tasks 1.6 vague | GAP |
| Empty/pagination UI states | INSPECTION C — not in specs/tasks | GAP |

- findings:
  - Core MVP capabilities map to tasks/specs well.
  - Explicit follow-ups in proposal Impact (English SSOT/config/specs) are **not** actionable tasks → SCOPE FAIL.
  - Task 1.6 wording outdated vs delivered `.cursor/rules`.
- veredicto_lente: FAIL

# Arch review — add-local-obs-save-results

- at: 2026-10-03T23:42:14Z
- source: propose-audit ARCH lens (ml-arch-review skill not installed under ~/.cursor/skills)
- scope: planning artifacts + current Nest/Prisma/FE layout (read-only)

## Pillars

| Pillar | Verdict | Notes |
|--------|---------|-------|
| Security | WARN→plan OK if applied | Save/list MUST stay JWT; never log JWT/password; Compose secrets via env not baked into images; OTel attrs = requestId only |
| DRY / reuse | PASS (plan) | Reuse EntrySchema, FilterApplied, PrismaUsageRepository pattern, existing correlation middleware |
| Idiomatic Nest | PASS (plan) | Thin controller + service + repository; Swagger; typed 401/400 |
| Data model | PASS (plan) | Separate SavedFilterResult vs UsageLog (D5) — correct boundary |
| Logging / obs | PASS (plan) | Keep stdout JSON; OTel additive; gated by env |
| YAGNI | PASS (plan) | No ELK/cron/diff; Grafana OSS local only |
| Compatibility | WARN | UsageLog schema **required** new fields = breaking for old rows; migration + local recreate documented in design Migration |

## Findings

1. **Align proposal optional vs required fields** (see SCOPE) before apply.
2. Prefer named route constants for save/list (match FILTERS_ROUTE_PREFIX style).
3. OTel SDK must not break Vitest when endpoint unset (task 3.1) — critical for CI.

## Verdict (arch)

Plan architecture acceptable with SCOPE/UNIT patches. **No 🔴 security FAIL** at propose stage if JWT+no-secrets requirements stay in specs (they do).
)
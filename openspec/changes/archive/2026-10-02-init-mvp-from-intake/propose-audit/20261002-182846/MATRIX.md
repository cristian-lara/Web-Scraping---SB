# Matriz F1

Rol: DEV · Change: init-mvp-from-intake · recheck after English + gates + CERT + UI patches

| # | Lente | Decisión | Razón |
|---|-------|----------|-------|
| 01 | SCOPE | APLICA | 10 capabilities + intake ACs must map to tasks/specs |
| 02 | VERIFY | APLICA | Delivery tasks + N.5/N.6 gates |
| 03 | HAPPY | APLICA | Auth, filters, UI, UsageLog, Bruno, correlation |
| 04 | EDGE | APLICA | 401/400/429, defaults, empty UI, secrets-in-logs |
| 05 | UNIT | APLICA | Executable domain logic → TDD-DESIGN + TDD-SEQ + slice gates |
| 06 | UI | APLICA | frontend-ui + React tasks |
| 07 | REPO | APLICA | rules + config + baseline |
| 08 | ARCH | APLICA | Feature code plan |
| 09 | SEC | APLICA | JWT/secrets/rate limit |
| 10 | PLAT | N/A | DEV role; CI covered under VERIFY tasks ##9 |
| 11 | FLOW-SEED | N/A | No IAM/Supabase seed workshop |
| 12 | CERT | APLICA | design § Certainty + Grill N/A |
| 13 | DECISIONS | APLICA | large_change + human slices=A recorded |
| 14 | NODEFER | APLICA | Ensure no v2/later deferrals remain |

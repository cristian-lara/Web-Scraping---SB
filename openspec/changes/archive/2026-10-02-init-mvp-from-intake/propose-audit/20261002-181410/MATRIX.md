# Matriz F1

Rol: DEV · Change: init-mvp-from-intake (greenfield MVP bootstrap + FE + CI + auth)

| # | Lente | Decisión | Razón |
|---|-------|----------|-------|
| 01 | SCOPE | APLICA | Intake + 10 capabilities; need claim↔task/spec coverage |
| 02 | VERIFY | APLICA | 20 delivery tasks; need falsifiable done + slice gates N.5/N.6 |
| 03 | HAPPY | APLICA | Auth, Filter A/B, UI table, UsageLog, Bruno happy paths |
| 04 | EDGE | APLICA | 401/400/429, missing metrics defaults, DOM <30, invalid schemas |
| 05 | UNIT | APLICA | Executable domain logic (countWords, scraper, filters, auth) → TDD-DESIGN + TDD-SEQ + slice gates |
| 06 | UI | APLICA | frontend-ui capability + React milestone tasks |
| 07 | REPO | APLICA | change_root rules/CHECKS/baseline |
| 08 | ARCH | APLICA | Feature code plan (BFF/FE/DB/HTTP) |
| 09 | SEC | APLICA | JWT, Bcrypt, secrets, rate limit, CORS |
| 10 | PLAT | N/A | Rol DEV; CI mentioned but DevOps/PLAT lens owned by DevOps role (CI still covered under VERIFY/REPO tasks) |
| 11 | FLOW-SEED | N/A | No IAM/Supabase RPC/seed workshop |
| 12 | CERT | APLICA | New stack/deps/integrations claims without Certainty section |
| 13 | DECISIONS | APLICA | large_change ≫15 tasks / multi-phase → slices HITL required |
| 14 | NODEFER | APLICA | Detect deferred gates (“later”, v2, English follow-up) |

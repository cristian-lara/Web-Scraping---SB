# Matriz F1

| # | Lente | Decisión | Razón |
|---|-------|----------|-------|
| 01 | SCOPE | APLICA | capabilities + AC-like claims need claim register → tasks/specs |
| 02 | VERIFY | APLICA | delivery tasks; falsifiable done + N.5/N.6 |
| 03 | HAPPY | APLICA | make up, filter scrape telemetry, save/list; no ticket INSPECTION → write propose-audit INSPECTION |
| 04 | EDGE | APLICA | 401 save, 400 bad body, OTel unset, CI without Compose, empty saved list |
| 05 | UNIT | APLICA | executable logic (schemas, persist, OTel spans, API) → TDD + slice gates |
| 06 | UI | APLICA | FE Save control + saved list on Filters page |
| 07 | REPO | APLICA | rules + CHECKS + English artifacts |
| 08 | ARCH | APLICA | Nest modules, Prisma models, OTel bootstrap, Compose |
| 09 | SEC | APLICA | JWT on save/list; no secrets in logs/images; .env.example |
| 10 | PLAT | N/A | rol DEV; Compose/Makefile audited via SCOPE/VERIFY/REPO (not full DevOps PLAT) |
| 11 | FLOW-SEED | N/A | no IAM/FE RPC/seed catalog |
| 12 | CERT | APLICA | new OTel deps, Compose/Grafana integration, schema breaks |
| 13 | DECISIONS | APLICA | large multi-wave change → slices + stubs registry required |
| 14 | NODEFER | APLICA | cron/diff UI out of scope must not hide required gates as “v2 substitute” |
)
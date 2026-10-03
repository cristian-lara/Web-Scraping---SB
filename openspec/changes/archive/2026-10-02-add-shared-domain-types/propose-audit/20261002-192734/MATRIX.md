# Matriz F1

| # | Lente | Decisión | Razón |
|---|-------|----------|-------|
| 01 | SCOPE | APLICA | F1-1 AC + intake §1.8/2.1/2.3/2.4 |
| 02 | VERIFY | APLICA | Delivery tasks 1.1–1.6 need falsifiable done |
| 03 | HAPPY | APLICA | Valid parse paths for Entry/Filter/UsageLog |
| 04 | EDGE | APLICA | Invalid types / enum OTHER / missing fields |
| 05 | UNIT | APLICA | Executable Zod schemas — TDD-DESIGN + TDD-SEQ + slice gates |
| 06 | UI | N/A | No FE surfaces in F1-1 (explicit non-goal) |
| 07 | REPO | APLICA | Rules, CHECKS, English/commits, Ponytail |
| 08 | ARCH | APLICA | Package boundary + shared contract design |
| 09 | SEC | N/A | No authz/secrets; schemas only |
| 10 | PLAT | N/A | DEV role; no CI/GitOps change |
| 11 | FLOW-SEED | N/A | No IAM/FE/seed |
| 12 | CERT | APLICA | New `zod` dep + enum/runtime claims |
| 13 | DECISIONS | APLICA | META § decisions required |
| 14 | NODEFER | APLICA | Must not defer schema tests / gates to v2 |

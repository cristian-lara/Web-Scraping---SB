# Matriz F1

| # | Lente | Decisión | Razón |
|---|-------|----------|-------|
| 01 | SCOPE | APLICA | Claims AC-like in proposal/specs need claim register ↔ tasks |
| 02 | VERIFY | APLICA | Delivery tasks need falsifiable done; slice gates N.5/N.6 |
| 03 | HAPPY | APLICA | Live policy happy paths; write INSPECTION A (no ticket audit) |
| 04 | EDGE | APLICA | 403/429 no-retry, fixture offline, logStage without request id |
| 05 | UNIT | APLICA | Executable policy logic → TDD-DESIGN + TDD-SEQ + SLICE-GATE-PLAN/SEQ |
| 06 | UI | N/A | No FE / mockup / UI surfaces in change |
| 07 | REPO | APLICA | Rules + CHECKS + openspec validate for change_root |
| 08 | ARCH | APLICA | Backend fetch decorator / DI / error propagation |
| 09 | SEC | N/A | No authz/secrets change; outbound UA already identifiable; no proxy/stealth |
| 10 | PLAT | N/A | DEV role; no CI/GitOps/workflow deltas claimed |
| 11 | FLOW-SEED | N/A | No IAM/FE RPC/seed |
| 12 | CERT | APLICA | Technical claims (TTL, interval, retry, DI) need Certainty levels + Grill cite/N/A |
| 13 | DECISIONS | APLICA | META § decisions required (small change; slices n/a) |
| 14 | NODEFER | APLICA | Ensure no “v2” deferral of policy/tests/gates |

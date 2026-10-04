<!--
SPDX-FileCopyrightText: 2026 Vicente Adrian Eguez Sarzosa (cédula 1718137159, Ecuador) — Manticore Labs
SPDX-License-Identifier: LicenseRef-Manticore-Proprietary
-->
# Matriz F1

| # | Lente | Decisión | Razón |
|---|-------|----------|-------|
| 01 | SCOPE | APLICA | Proposal claims need task coverage (no ticket AC; claim register from What Changes) |
| 02 | VERIFY | APLICA | Delivery tasks need falsifiable done; executable groups need N.5/N.6 |
| 03 | HAPPY | APLICA | Evaluator onboarding happy path must be explicit (inspection written) |
| 04 | EDGE | APLICA | Host vs Docker, PNG drift, Grafana title drift, secrets wording |
| 05 | UNIT | N/A | Docs-only / diagrams; no executable app logic (`skip_specs`); TDD N/A; slice gates checked under VERIFY |
| 06 | UI | N/A | No product UI changes; FE surfaces only appear as C3 diagram labels |
| 07 | REPO | APLICA | English README, CHECKS/OpenSpec validate, Make/pnpm baseline |
| 08 | ARCH | N/A | No app code; C4 reflects existing containers/modules (no new architecture) |
| 09 | SEC | N/A | Docs only; plan preserves existing secrets-via-env wording (no new secret handling) |
| 10 | PLAT | N/A | Role DEV; no CI/Compose/Grafana JSON changes in this change |
| 11 | FLOW-SEED | N/A | No IAM/FE mutations/seed |
| 12 | CERT | N/A | Docs-only / static diagrams; same family as UNIT N/A |
| 13 | DECISIONS | APLICA | META § decisions required; ≫15 tasks → slices decision mandatory |
| 14 | NODEFER | APLICA | Ensure no “v2” defer of C4/README gates |

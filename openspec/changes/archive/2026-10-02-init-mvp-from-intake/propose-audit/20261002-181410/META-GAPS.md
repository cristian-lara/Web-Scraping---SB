# Meta-gaps F3

- at: 2026-10-02T23:14:10Z
- matrix_vs_evidence:
  - All APLICA lenses have LENTE-*.md
  - PLAT / FLOW-SEED N/A reasoned in MATRIX — OK
- gaps:
  1. SCOPE/NODEFER: English translation of intake + Spanish specs + config.yaml not tasked.
  2. VERIFY/UNIT: missing TDD-SEQ per logic item and **N.5/N.6** slice gates on groups 1–4.
  3. CERT: no § Certainty / Grill cite|N/A in design.md.
  4. DECISIONS: slices HITL `human_ok_at` pending.
  5. UI: empty-state unspecified; no UI-SURFACES artifact; pagination not Non-Goal.
  6. ARCH/SEC: JWT_SECRET / Sentry DSN / `.env.example` not in design/tasks; versions unpinned.
  7. REPO: `openspec/config.yaml` still Language Spanish vs English-only claim.
  8. Task 1.6 stale (“later Cursor rules”) vs rules already shipped.
  9. design.md language mix (ES/EN) vs engineering-standards English-only for artifacts.
- blocking_count: 8
- veredicto_meta: FAIL

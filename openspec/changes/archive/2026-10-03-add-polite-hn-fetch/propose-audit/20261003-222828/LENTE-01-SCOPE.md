# Lente SCOPE

- at: 2026-10-04T03:28:28Z
- prompt_focus: Every proposal claim maps to spec + task (not proposal-only)
- files_reviewed:
  - openspec/changes/add-polite-hn-fetch/proposal.md
  - openspec/changes/add-polite-hn-fetch/tasks.md
  - openspec/changes/add-polite-hn-fetch/specs/hn-scraper/spec.md

## Claim register

| Claim | Spec / task cite | PASS\|GAP |
|-------|------------------|-----------|
| TTL HTML cache on live path | specs · Polite live HTML fetch policy; tasks 1.2–1.3 | PASS |
| Min interval between live GETs | specs · Minimum interval; tasks 1.4 | PASS |
| One retry timeout/5xx; never 403/429 | specs · Single retry; tasks 1.5 | PASS |
| Structured stages cache/live/retry | specs · Structured stages; tasks 1.3, 1.5 | PASS |
| Fixture path stays offline | specs · Fixture path; tasks 1.6 | PASS |
| Env knobs documented | proposal Impact; tasks 1.1, 2.1 | PASS |
| No proxies/stealth/multi-site | proposal What Changes / Non-goals | PASS (negative scope) |

- findings:
  - Claims are covered by ADDED specs + tasks; no orphan AC keywords.
- veredicto_lente: PASS

# Lente SCOPE

- at: 2026-10-02T19:28:00-05:00
- prompt_focus: Every F1-1 AC maps to task + spec requirement
- files_reviewed:
  - docs/backlog/F1-domain-user-stories.md (§ F1-1 AC)
  - openspec/changes/add-shared-domain-types/proposal.md
  - openspec/changes/add-shared-domain-types/tasks.md
  - openspec/changes/add-shared-domain-types/specs/shared-types/spec.md
  - cursor-intake-spec-v7.md (§1.8, §2.1, §2.3, §2.4)

## Claim register

| Claim (AC / intake) | Evidence | PASS\|GAP |
|---------------------|----------|-----------|
| Import Entry/Filter/UsageLog schemas+types from `@repo/shared-types` | tasks 1.3; spec «Single import surface» | PASS |
| Valid Entry rank/title/points/comments parses | tasks 1.2–1.3; spec «Entry schema» Valid | PASS |
| Invalid Entry throws Zod error | tasks 1.2–1.3; spec Invalid entry | PASS |
| Filter only MORE_THAN_5_WORDS_COMMENTS \| LESS_OR_EQUAL_5_WORDS_POINTS | tasks 1.2–1.3; spec Filter query; intake §2.3 | PASS |
| Invalid filter fails | tasks 1.2–1.3; spec Invalid filter | PASS |
| UsageLog fields id/timestamp/filter_applied/processed_items/execution_time_ms/userId | tasks 1.2–1.3; spec UsageLog; intake §2.4 | PASS |
| Invalid UsageLog throws | tasks 1.2–1.3; spec Invalid UsageLog | PASS |
| Vitest no network | tasks 1.5; spec Offline unit tests | PASS |
| Export filter enum constants (proposal) | tasks 1.3 wording | PASS |
| Out of scope Nest/RHF/countWords/Cheerio/Prisma | proposal Impact; design Non-Goals; F1-1 OOS | PASS |

- findings: none blocking
- veredicto_lente: PASS

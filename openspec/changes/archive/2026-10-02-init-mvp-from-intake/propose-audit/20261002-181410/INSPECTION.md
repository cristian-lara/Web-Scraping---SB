# INSPECTION (written in-audit — no prior ticket-audit)

- at: 2026-10-02T23:14:10Z
- source: proposal.md + design.md + specs/** + cursor-intake-spec-v7.md
- note: No `ticket-audit/**/INSPECTION.md` found; this file is the A/B baseline for HAPPY/EDGE.

## A — Happy paths

| ID | Path | Expected |
|----|------|----------|
| A1 | Auth login success → JWT | Bearer usable on protected routes |
| A2 | Filter A `MORE_THAN_5_WORDS_COMMENTS` | Only titles with >5 words; comments DESC, rank ASC |
| A3 | Filter B `LESS_OR_EQUAL_5_WORDS_POINTS` | Only titles with ≤5 words; points DESC, rank ASC |
| A4 | Scrape top 30 via fixture | Exactly 30 validated `Entry` objects offline |
| A5 | UsageLog persist after filter | Row with filter_applied, userId, execution_time_ms |
| A6 | UI: auth + filter + table | Authenticated user sees filtered rows |
| A7 | Correlation ID trail | Same ID across scrape/filter/persist logs + response header |
| A8 | Bruno happy suite | Auth + A + B pass via CLI |

## B — Edges

| ID | Edge | Expected |
|----|------|----------|
| B1 | No/invalid JWT | 401 |
| B2 | Invalid filter value | 400 via Zod/DTO |
| B3 | Rate limit exceeded | 429 |
| B4 | Missing points/comments on HN row | defaults to 0 |
| B5 | countWords symbols / compound words | canonical 5; symbols ignored |
| B6 | <30 entries in source | return all available, no invented rows |
| B7 | Scraper/schema failure | typed exception → controlled HTTP + Sentry |
| B8 | React render throw | ErrorBoundary contains crash |
| B9 | Secrets in logs | passwords/raw JWT never logged |

## C — UI surfaces (minimal MVP)

| Surface | Decisions captured in plan? |
|---------|------------------------------|
| Login form | Yes (auth + Zod) — page size/columns N/A |
| Filter control (A/B) | Yes — two enum values only |
| Results table rank/title/points/comments | Yes |
| Pagination / empty / loading / error | Loading+error in frontend-ui; empty/pagination **not** specified → gap |

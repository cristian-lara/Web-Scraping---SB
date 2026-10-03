# INSPECTION — add-hn-scraper-fixture (F1-3)

## A — Happy
| ID | Path | Expected |
|----|------|----------|
| A1 | Load `hn_sample.html` from disk | no network |
| A2 | Parse → exactly 30 entries | length 30 |
| A3 | Each entry EntrySchema.parse | rank/title/points/comments |
| A4 | Port accepts HTML string | CheerioScraperAdapter implements HnScraperPort |

## B — Edges
| ID | Edge | Expected |
|----|------|----------|
| B1 | Missing points/comments in fixture rows | default 0 |
| B2 | >30 rows in fixture | still return 30 |
| B3 | No Axios in package.json / test path | PASS |

## C — OOS
Live HN, filters, countWords, Nest full bootstrap, auth, UI, Prisma

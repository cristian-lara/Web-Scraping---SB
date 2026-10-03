## 1. HN scraper fixture (F1-3)

Slice gates: **1.5** (review: scraper Vitest green offline, no Axios, `openspec validate` strict) and **1.6** (audit PASS in `SLICE-AUDIT.md`) before archive / next change.

- [x] 1.1 Write failing Vitest cases (load `hn_sample.html` from disk; expect length 30; defaults 0 for missing metrics; each entry shape via `EntrySchema`; no network) — verify: tests fail for the right reason (missing adapter/impl)
- [x] 1.2 Add Cheerio dependency; implement `HnScraperPort` + `CheerioScraperAdapter` (HTML string in; map `tr.athing` + `.subtext`; `.slice(0, 30)`; defaults; `EntrySchema.parse` per entry) and ensure fixture exists under backend test fixtures path — verify: tests from 1.1 green
- [x] 1.3 Wire `@repo/backend` Vitest script/config so scraper suite runs via package filter — verify: `pnpm --filter @repo/backend test` exit 0
- [x] 1.4 Confirm no Axios (or other HTTP client) added for this slice; port stays HTML-string based — verify: backend `package.json` has no Axios; test path has no live fetch
- [x] 1.5 **Slice review:** `pnpm --filter @repo/backend test` exit 0; `openspec validate add-hn-scraper-fixture --strict` exit 0 — verify: no network in scraper tests
- [x] 1.6 **Slice audit:** table 1.1–1.5 → PASS before archive — verify: note in change `SLICE-AUDIT.md` with falsifiable evidence (commands + exit codes)

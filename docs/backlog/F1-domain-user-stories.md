# Phase F1 — Domain core user stories

Source: `cursor-intake-spec-v7.md` (Milestone 1 / domain foundations).  
Index: `docs/BACKLOG.md` Phase F1.  
Prerequisite: archive foundation change `init-mvp-from-intake`.

Each story = one OpenSpec change. English-only artifacts. No network in F1 tests.

---

## F1-1 — Shared Zod domain schemas

| Field | Value |
| --- | --- |
| **ID** | F1-1 |
| **Title** | Shared Zod schemas for Entry, FilterQuery, and UsageLog |
| **Proposed OpenSpec change** | `add-shared-domain-types` |
| **Intake references** | §1.8, §2.1 (Entry fields), §2.3 (filter enum values), §2.4 (UsageLog attributes), §5 Milestone 1, §6.1–6.2 |

### User story

As a **developer**,  
I want **Zod schemas `EntrySchema`, `FilterQuerySchema`, and `UsageLogSchema` (plus `z.infer` types) exported from `@repo/shared-types`**,  
So that **backend and frontend share one runtime validation contract without duplicating DTOs**.

### Acceptance criteria

- WHEN a consumer imports from `@repo/shared-types`, THEN `EntrySchema`, `FilterQuerySchema`, and `UsageLogSchema` are available as Zod schemas and matching TypeScript types via `z.infer`.
- WHEN a valid Entry object has `rank` (number), `title` (string), `points` (number), and `comments` (number), THEN `EntrySchema.parse` succeeds.
- WHEN an Entry object is missing a required field or uses a wrong type, THEN `EntrySchema.parse` throws a Zod error.
- WHEN `FilterQuerySchema` receives `filter` equal to `MORE_THAN_5_WORDS_COMMENTS` or `LESS_OR_EQUAL_5_WORDS_POINTS`, THEN parse succeeds.
- WHEN `FilterQuerySchema` receives any other `filter` value, THEN parse fails (invalid filter).
- WHEN a valid UsageLog object includes `id`, `timestamp` (ISO 8601 string), `filter_applied` (one of the two filter enums), `processed_items` (int), `execution_time_ms` (int), and `userId` (string), THEN `UsageLogSchema.parse` succeeds.
- WHEN UsageLog fields are missing or mistyped, THEN `UsageLogSchema.parse` throws a Zod error.
- WHEN Vitest runs schema unit tests in `@repo/shared-types`, THEN they pass with no network dependency.

### Out of scope for this story

- NestJS `ZodValidationPipe` wiring, React Hook Form resolvers, HTTP 400 responses.
- `countWords`, filter Strategy implementations, Prisma/`UsageLog` persistence.
- Cheerio scraper / `EntrySchema.parse` at scrape time (see F1-3).

---

## F1-2 — `countWords` utility (TDD)

| Field | Value |
| --- | --- |
| **ID** | F1-2 |
| **Title** | TDD `countWords` with canonical case and symbol-token constant |
| **Proposed OpenSpec change** | `add-count-words` |
| **Intake references** | §1.10 (named constants), §2.2, §5 Milestone 1, §6.5 (TDD / Vitest) |

### User story

As a **developer**,  
I want **a `countWords(title)` utility implemented fail-first in Vitest**,  
So that **filter strategies can apply a single immutable word-count rule with no magic symbol checks**.

### Acceptance criteria

- WHEN TDD starts, THEN a failing Vitest case exists for the canonical input `"This is - a self-explained example"` before the implementation turns it green with result `5`.
- WHEN `countWords` runs, THEN it trims the string and collapses consecutive whitespace (`\s+`) before tokenizing on spaces.
- WHEN a token is made only of symbols (e.g. `-`, `&`, `/`, `|`), THEN that token is excluded from the count.
- WHEN a compound token has no spaces (e.g. `"self-explained"`, `"Node.js"`), THEN it counts as exactly one word.
- WHEN symbol-only tokens are detected, THEN the rule uses a **named constant** (no inline magic regex/string littered in call sites) for the “pure non-alphanumeric / symbol-only token” check.
- WHEN Vitest runs the `countWords` suite (canonical + edge cases: empty/whitespace-only, multiple spaces, several isolated symbols), THEN all tests pass with no network dependency.

### Out of scope for this story

- Filter A/B Strategy modules, sort by comments/points, or the numeric `5` filter threshold wiring (Phase F2).
- Zod schemas (F1-1) and Cheerio scraping (F1-3), except importing `countWords` from a sensible package location if already chosen.
- HTTP API, UI, persistence.

---

## F1-3 — Cheerio scraper adapter + offline fixture

| Field | Value |
| --- | --- |
| **ID** | F1-3 |
| **Title** | Offline HN top-30 scrape via Cheerio adapter and fixture |
| **Proposed OpenSpec change** | `add-hn-scraper-fixture` |
| **Intake references** | §1.3, §2.1, §5 Milestone 1 (delivery: no network), §6.2, §6.4 (Adapter), §6.5 |

### User story

As the **system**,  
I want **a `CheerioScraperAdapter` behind `HnScraperPort` that parses `hn_sample.html` into validated entries**,  
So that **the first 30 HN rows can be extracted offline with defensive defaults and Zod parsing**.

### Acceptance criteria

- WHEN the scraper module is introduced, THEN a local fixture `hn_sample.html` exists and tests load HTML from disk (or equivalent fixture path) with **no live network calls**.
- WHEN parsing the fixture, THEN the adapter maps HN row pairs (`tr.athing` + `.subtext`) into Entry-shaped objects.
- WHEN extraction completes, THEN the result length is exactly **30** (first 30 entries / `.slice(0, 30)`).
- WHEN an entry is missing points or comments (e.g. fresh Ask HN / jobs style rows in the fixture), THEN those metrics default to `0`.
- WHEN each mapped object is produced, THEN it is validated with `EntrySchema.parse()` from `@repo/shared-types` before being returned.
- WHEN every parsed entry is inspected, THEN it has `rank` (number), `title` (string), `points` (number), and `comments` (number).
- WHEN Vitest runs scraper tests against the fixture, THEN they pass with no Axios/network dependency in the test path.

### Out of scope for this story

- Production Axios live fetch to news.ycombinator.com (may exist later behind the same port; F1 tests stay fixture-only).
- Filter strategies, JWT, Prisma `UsageLog` writes, React UI, Bruno E2E.
- Rate-limit / 429 handling and Sentry.

---

## Suggested apply order

1. `add-shared-domain-types` (F1-1) — schemas first so F1-3 can call `EntrySchema.parse`.
2. `add-count-words` (F1-2) — independent of scraper; can run in parallel with F1-3 after F1-1 if desired.
3. `add-hn-scraper-fixture` (F1-3) — depends on F1-1.

**Phase exit:** unit tests for Zod schemas, `countWords`, and scraper fixture are green with no network dependency (§5 Milestone 1 delivery criterion).

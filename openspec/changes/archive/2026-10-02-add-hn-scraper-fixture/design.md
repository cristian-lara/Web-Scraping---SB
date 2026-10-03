## Context

F1-1 archived `EntrySchema` in `@repo/shared-types`. `apps/backend` is still a scaffold (placeholder scripts; `@repo/shared-types` dependency only). See proposal.md — Why. This change adds the scraping Adapter Pattern (intake §1.3 / §6.4) as an offline-only slice (F1-3).

## Goals / Non-Goals

**Goals:**
- TDD fail-first Vitest for Cheerio parsing of `hn_sample.html` → 30 validated entries.
- Port + adapter in `apps/backend`; every entry via `EntrySchema.parse()`.
- Wire backend Vitest + Cheerio dependency as needed for the suite (backend currently has no real `test` script).

**Non-Goals:**
- Axios / live fetch to news.ycombinator.com (later GAP story behind the same port).
- Filter strategies, `countWords` wiring, JWT, Prisma, React UI, Bruno E2E, Sentry/429.
- Shared package for the adapter (rejected — Nest BFF owns scraping).

## TDD-DESIGN

| First failing tests | Implementation |
|---------------------|----------------|
| Fixture loads from disk; no network | `hn_sample.html` + test helper `readFileSync` |
| Parse → length exactly 30 | `CheerioScraperAdapter` + `.slice(0, 30)` |
| Missing points/comments → 0 | Defensive parse of `.subtext` metrics |
| Each item passes `EntrySchema.parse()` | Call parse before return; assert shape |
| Port method accepts HTML string | `HnScraperPort` + adapter implements it |

## Certainty

**Grill:** N/A — scoped to backlog F1-3 / intake §1.3, §2.1, §5 Milestone 1 offline, §6.4; location and no-Axios locked by HITL/scope card.

| Claim | Level | RUNTIME |
|-------|-------|---------|
| Top 30 + defaults 0 match intake §2.1 | E | S |
| EntrySchema.parse on every entry | S | S |
| No Axios / no network in this change | S | S |
| Backend owns port + adapter | S | S |

## Decisions

### Decision 1: Location — `apps/backend`
- **Choice:** `HnScraperPort` + `CheerioScraperAdapter` live under `apps/backend` (e.g. `src/scraping/` or equivalent). Fixture at `apps/backend/test/fixtures/hn_sample.html` (or `src/.../fixtures` if co-located with unit tests).
- **Rationale:** Nest BFF owns scraping; UI/shared-types do not need Cheerio.
- **Alternatives considered:** Shared package — rejected (YAGNI; no second consumer).

### Decision 2: No Axios in this change
- **Choice:** Port/adapter method reads an HTML **string**. Tests load the fixture from disk and pass the string in. No HTTP client dependency added here.
- **Rationale:** Milestone 1 delivery is offline; live fetch is a later story behind the same port.
- **Alternatives considered:** Axios now with mocked HTTP — rejected (scope card / locked decision).

### Decision 3: Validation via shared EntrySchema
- **Choice:** Import `EntrySchema` from `@repo/shared-types`; `parse()` each mapped row before return.
- **Rationale:** Intake §1.8 / §6.2; F1-1 already shipped the schema.

### Decision 4: Cheerio + Vitest on backend
- **Choice:** Add `cheerio` (and Vitest config/scripts if missing) only as needed for adapter + tests in `@repo/backend`.
- **Rationale:** Intake stack; backend `package.json` currently has placeholder test script.

## Risks / Trade-offs

- **[Risk] Fixture DOM drifts from live HN markup** → Keep selectors in one adapter; refresh fixture when live fetch lands.
- **[Risk] Backend still pre-Nest scaffold** → Implement port/adapter as plain TS modules Nest can inject later; do not block on full Nest bootstrap.
- **[Trade-off] HTML-string API vs fetch-inside-adapter** → String input keeps tests offline and defers Axios cleanly.

## Migration Plan

N/A — additive module + fixture + tests; no production deploy surface yet.

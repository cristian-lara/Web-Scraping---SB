# Product backlog â€” Hacker News Scraper MVP

**Vision SSOT:** `cursor-intake-spec-v7.md`  
**Epics (mapa):** [`docs/backlog/EPICS.md`](backlog/EPICS.md) (E1â€“E9)  
**Foundation change:** archived `2026-10-02-init-mvp-from-intake`  
**Detailed stories (subagent drafts from intake):**

| Phase | Detail file | Subagent |
|-------|-------------|----------|
| F1 Domain | [`docs/backlog/F1-domain-user-stories.md`](backlog/F1-domain-user-stories.md) | [Backlog F1](ba812af8-e1b1-4640-85a6-54c87a313f38) |
| F2 Product | [`docs/backlog/F2-product-user-stories.md`](backlog/F2-product-user-stories.md) | [Backlog F2](7102c8eb-b22f-45ae-bbab-2888ab685c94) |
| F3 Ops | [`docs/backlog/F3-ops-user-stories.md`](backlog/F3-ops-user-stories.md) | [Backlog F3](da43828e-e7ab-407f-be35-8df6e4bf4b37) |

Each story â†’ one OpenSpec change: `/opsx-propose <kebab-name>` â†’ audit â†’ apply â†’ archive.

---

## Phase F0 â€” Foundation (this change)

| ID | User story | Change | Status |
|----|------------|--------|--------|
| F0-1 | As a developer, I can install a PNPM monorepo with backend, frontend, and shared-types | `init-mvp-from-intake` | archived 2026-10-02 |
| F0-2 | As a developer, I can run a hello-world unit test proving the toolchain works | `init-mvp-from-intake` | archived 2026-10-02 |
| F0-3 | As a PM/dev, I have a phased backlog of intake-derived user stories to spawn future changes | `init-mvp-from-intake` | archived 2026-10-02 |

---

## Phase F1 â€” Domain core (index)

| ID | Story (short) | Change | Status |
|----|---------------|--------|--------|
| F1-1 | Shared Zod Entry / FilterQuery / UsageLog | `add-shared-domain-types` | archived 2026-10-02 |
| F1-2 | `countWords` TDD + named threshold | `add-count-words` | archived 2026-10-02 |
| F1-3 | Cheerio scraper + fixture top 30 offline | `add-hn-scraper-fixture` | archived 2026-10-02 |

Order: F1-1 â†’ F1-2 (parallel ok) â†’ F1-3. Details in F1 file.

---

## Phase F2 â€” Product vertical (index)

| ID | Story (short) | Change |
|----|---------------|--------|
| F2-1 | Filter strategies A/B + rank tie-break | `add-filter-strategies` |
| F2-2 | JWT + Bcrypt + Helmet/CORS/429 | `add-jwt-auth` |
| F2-3 | UsageLog SQLite Prisma | `add-usage-persistence` |
| F2-4 | React UI auth/filter/table (empty, no pagination) | `add-frontend-filters-ui` |
| F2-5 | Bruno E2E happy + edges | `add-bruno-e2e` |
| F2-6 | Swagger + thin controllers | `add-swagger-thin-controllers` |

Order: F2-1 â†’ F2-2 â†’ F2-3 â†’ F2-4/F2-6 â†’ F2-5. Details in F2 file.

---

## Phase F3 â€” Operability & release (index)

| ID | Story (short) | Change |
|----|---------------|--------|
| F3-1 | Structured logs + correlation IDs | `add-structured-logging` |
| F3-2 | Sentry + exception filter + ErrorBoundary | `add-sentry-observability` |
| F3-3 | CI Vitest + Bruno + lint | `add-ci-quality-gates` |
| F3-4 | README + Makefile + tag `v1.0.0-mvp` | `add-docs-makefile-release` |

Order: F3-1 â†’ F3-2 â†’ F3-3 â†’ F3-4. Details in F3 file.

---

## How to use

1. Finish/archive foundation (`init-mvp-from-intake`).
2. Open the next story detail file; pick one change id.
3. `/opsx-propose <change-name>` using that storyâ€™s acceptance criteria.
4. `/ml-propose-audit-check` â†’ `/opsx-apply` â†’ archive â†’ next story.


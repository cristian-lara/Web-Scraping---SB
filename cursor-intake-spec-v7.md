# Intake & Source of Truth: Hacker News Web Scraper MVP (Cursor Agent SSOT v7)

This document is the **Single Source of Truth (SSOT v7)** for guiding the AI agent (**Cursor Agent**) autonomously, precisely, and incrementally. It keeps only high-value information, technical research, and decision rationale—excluding internal operational schedules—to focus on a **deliverable MVP scope plan**.

---

## 1. Architectural and Technology Decision Rationale

### 1.1. Project orchestration: Monorepo with PNPM Workspaces + Turborepo
* **Decision:** Adopt a monorepo using **PNPM Workspaces** for dependency management and **Turborepo** for script orchestration.
* **Technical rationale:**
  * **PNPM Workspaces:** High-performance package linking via *symlinks*, avoiding dependency duplication between backend and frontend and enabling native linking with `@repo/shared-types`.
  * **Turborepo:** Lightweight pipeline with smart caching for parallel builds/tests (`pnpm dev`, `pnpm test`) with minimal config (`turbo.json`), avoiding heavier tools such as Nx or Lerna.

### 1.2. Backend boundary: NestJS as Backend-for-Frontend (BFF)
* **Decision:** Implement the backend with **NestJS** using the **BFF (Backend for Frontend)** pattern.
* **Technical rationale:**
  * **Decoupling:** Isolates the React client from direct scraping fragility and complex filtering logic, delivering UI-optimized payloads.
  * **Clean Architecture:** NestJS provides native DI, modular controllers/services that are easy to mock and layer.
  * **Resilience:** If the external source changes or fails, the BFF handles errors or fallbacks without collapsing the UI.

### 1.3. Data extraction: Axios + Cheerio with Adapter Pattern
* **Decision:** Use **Axios** for HTTP and **Cheerio** to parse the Hacker News DOM.
* **Technical rationale:**
  * **Performance:** Hacker News is static HTML without client-side rendering (CSR). Cheerio is orders of magnitude faster and lighter than headless browsers (Puppeteer/Playwright).
  * **Adapter Pattern (`CheerioScraperAdapter`):** Encapsulates the library behind the `HnScraperPort` port. If the library or DOM changes, impact is limited to one adapter class.
  * **Rate-limit resilience:** Include a local fixture (`hn_sample.html`) for development and automated tests; reserve live network calls for production.

### 1.4. Frontend: React + Vite + Tailwind CSS + Shadcn/ui
* **Decision:** Build the web client with **React (Vite)**, styled with **Tailwind CSS** and **Shadcn/ui**, with remote state via **TanStack Query**.
* **Technical rationale:**
  * **Low UI complexity:** Vite provides instant compile and start.
  * **Production components:** Shadcn/ui supplies accessible components (tables, badges, controls) without bloating the bundle.
  * **TanStack Query:** Manages loading, retries, and HTTP cache with Bearer JWT tokens.

### 1.5. Persistence: SQLite + Prisma ORM with Repository Pattern
* **Decision:** Use **SQLite** (`app.db`) abstracted with **Prisma ORM** under the **Repository** pattern.
* **Technical rationale:**
  * **Zero external setup:** Embedded DB lets evaluators run the project anywhere without containers or external DB services.
  * **Repository Pattern (`PrismaUsageRepository`):** Decouples business logic from storage infrastructure.

### 1.6. Authentication and security
* **Decision:** Protect the API with **JWT (Passport.js)**, **Bcrypt**, **Helmet**, **CORS**, and **rate limiting (`@nestjs/throttler`)**.
* **Technical rationale:**
  * **Data ownership:** Bind each usage record (`UsageLog`) to the authenticated user's `userId`.
  * **BFF protection:** Prevent unauthorized access (`JwtAuthGuard`), denial-of-service abuse, and common HTTP header weaknesses.

### 1.7. Observability: Sentry + NestJS Exception Filters (+ structured logging)
* **Decision:** Integrate **Sentry** with a NestJS **Global Exception Filter**, a React **ErrorBoundary**, plus **structured logs** and **per-request correlation IDs**.
* **Technical rationale:**
  * **Centralized monitoring:** Captures exceptions in real time and groups errors without flooding the server console.
  * **Latency metrics:** Measures crawler and filter processing times.
  * **Traceability:** Correlation/request IDs link auth → scrape → filter → persistence logs (distinct from business `UsageLog` rows).

### 1.8. Data validation and strict typing: Zod + `@repo/shared-types`
* **Decision:** Use **Zod** in shared library `@repo/shared-types` for validation schemas and type inference via `z.infer`.
* **Technical rationale:**
  * **E2E type safety (compile-time & runtime):** Connects the OpenSpec contract to runtime input/output validation.
  * **NestJS (BFF) validation:** Validate auth/query DTOs via `nestjs-zod` or `ZodValidationPipe`, and defensively parse Cheerio output with `EntrySchema.parse()`.
  * **React validation:** Integrate with `@hookform/resolvers/zod` in Shadcn/ui forms for instant form and API response checks.
  * **Zero duplication:** Frontend and backend share the same validation rules without rewriting types or classifiers.

### 1.9. API E2E testing strategy: Bruno + `@usebruno/cli`
* **Decision:** Include **Bruno** for the REST API E2E suite, automated with `@usebruno/cli` in console and CI/CD.
* **Technical rationale:**
  * **Git-friendly `.bru` files:** Unlike Postman, Bruno stores plain-text collections in the repo (`apps/backend/bruno/`).
  * **CLI automation:** `@usebruno/cli` runs the full suite against a live server (`npx @usebruno/cli run apps/backend/bruno --env local`), integrable in Makefile and GitHub Actions.
  * **Happy paths & edge cases:**
    * *Happy Path 1 (Auth):* Successful auth and JWT extraction.
    * *Happy Path 2 (Filter A):* Extract and sort by comments for titles with >5 words.
    * *Happy Path 3 (Filter B):* Extract and sort by points for titles with ≤5 words.
    * *Edge Case 1 (No auth):* Expect `401 Unauthorized`.
    * *Edge Case 2 (Invalid filter):* Expect `400 Bad Request` from Zod schemas.
    * *Edge Case 3 (Rate limit):* Expect `429 Too Many Requests`.

### 1.10. Engineering standards and agent workflow
* **Decision:** Enforce English-only repository text, Conventional Commits, thin Swagger-documented controllers, DTO validation, typed service exceptions, named constants (no magic numbers), ESLint/Prettier in CI. Cursor agent policy (Ponytail YAGNI, Caveman terse chat) lives under `.cursor/rules/`—not as OpenSpec product capabilities.
* **Technical rationale:** Makes quality reviewable and keeps agent workflow versioned with the repo.

---

## 2. Domain Business Rules and Invariants

### 2.1. Hacker News DOM parsing
* **Strict limit:** Extract exactly the **first 30 entries** (`.slice(0, 30)`).
* **Required fields:** `rank` (number), `title` (string), `points` (number, default `0`), `comments` (number, default `0`).
* **Defensive parsing & Zod:** Map row pairs (`tr.athing` and `.subtext`), default missing metrics to `0` for fresh items (*Ask HN* or jobs), and parse with `EntrySchema.parse()`.

### 2.2. Word-count algorithm (`countWords`)
* **Immutable rule:** Count only space-separated words, **excluding isolated symbols** (pure non-alphanumeric tokens).
* **Canonical test case:**
  $$\text{"This is - a self-explained example"} \longrightarrow \mathbf{5\text{ words}}$$
* **Algorithm:**
  1. `.trim()` and collapse consecutive whitespace (`\s+`).
  2. Filter tokens made only of symbols (e.g. `-`, `&`, `/`, `|`).
  3. Keep compound tokens without spaces as one word (e.g. `"self-explained"` = 1, `"Node.js"` = 1).

### 2.3. Filtering strategies (Strategy Pattern)
* **Filter A (`MORE_THAN_5_WORDS_COMMENTS`):**
  * Condition: `countWords(title) > 5`.
  * Sort: `comments` DESC; secondary tie-break `rank` ASC.
* **Filter B (`LESS_OR_EQUAL_5_WORDS_POINTS`):**
  * Condition: `countWords(title) <= 5`.
  * Sort: `points` DESC; secondary tie-break `rank` ASC.

### 2.4. Usage metrics persistence (`UsageLog`)
Each filter execution persists to SQLite via Prisma with attributes validated by `UsageLogSchema`:
* `id`: Int / UUID
* `timestamp`: ISO 8601 string
* `filter_applied`: `MORE_THAN_5_WORDS_COMMENTS` | `LESS_OR_EQUAL_5_WORDS_POINTS`
* `processed_items`: Int
* `execution_time_ms`: Int
* `userId`: String (authenticated user id)

---

## 3. Consolidated Technology Decision Matrix

| Layer / Area | Chosen option | Brief technical rationale |
| :--- | :--- | :--- |
| **Monorepo engine** | PNPM Workspaces + Turborepo | Fast symlink linking and cached parallel orchestration. |
| **Backend boundary** | NestJS (BFF) | Modularity, native DI, clean UI abstraction. |
| **Validation & typing** | Zod (`@repo/shared-types`) | E2E runtime typing across OpenSpec, NestJS, React. |
| **Auth & security** | JWT + Bcrypt + Helmet + CORS | Light security, endpoint protection, `userId` binding. |
| **Integration / scraping** | Axios + Cheerio (Adapter) | Light static scrape with DOM isolation. |
| **Algorithms & filters** | Strategy Pattern | Encapsulated sort algorithms with dynamic swap. |
| **Persistence** | SQLite + Prisma (Repository) | Full portability (`app.db`) without external DBs. |
| **Frontend framework** | React (Vite) + TypeScript | Reactive, light, fast compile. |
| **UI & styles** | Tailwind CSS + Shadcn/ui | Modern accessible atomic components. |
| **UI remote state** | TanStack Query | Declarative loading, errors, HTTP cache. |
| **Unit/integration tests** | Vitest | Fast unit tests and local fixtures. |
| **API E2E tests** | Bruno (`@usebruno/cli`) | Git `.bru` collection for manual and automated E2E. |
| **Observability** | Sentry + filters + structured logs + correlation IDs | Central errors, latency, request traceability. |
| **Methodology & quality** | OpenSpec + agentic flow + engineering standards | Immutable contract and TDD delivery. |

---

## 4. Architecture, Data Flow, and Testing Pipeline

```text
                               ┌─────────────────────────────────────────┐
                               │  Frontend (React + Vite + Shadcn/ui)    │
                               │  - Table and filter components          │
                               │  - React Hook Form + Zod resolvers      │
                               │  - Axios interceptor with Bearer JWT    │
                               └────────────────────┬────────────────────┘
                                                    │
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │       BFF Boundary (NestJS API)         │
                               │  - JwtAuthGuard, Helmet & Rate Limiter  │
                               │  - ZodValidationPipe (DTO validation)   │
                               │  - Correlation ID + structured logs     │
                               └─────────┬──────────────────┬────────────┘
                                         │                  │
               ┌─────────────────────────┘                  └─────────────────────────┐
               ▼                                                                      ▼
┌───────────────────────────────┐     ┌───────────────────────────────┐     ┌───────────────────────────────┐
│        Scraper Module         │     │         Filter Module         │     │       Analytics Module        │
│   (Adapter Pattern / Cheerio) │     │      (Strategy Pattern)       │     │ - Persistence in SQLite       │
│ - Scraping top 30 HN entries  │     │ - > 5 words (comments)        │     │ - User interaction logs       │
│ - EntrySchema.parse() Zod     │     │ - <= 5 words (points)         │     │ - UsageLogSchema Zod          │
└──────────────┬────────────────┘     └──────────────┬────────────────┘     └──────────────┬────────────────┘
               │                                     │                                     │
               └─────────────────────────────────────┼─────────────────────────────────────┘
                                                     │
                                                     ▼
                               ┌─────────────────────────────────────────┐
                               │   Testing & Observability Pipeline      │
                               │  - Vitest: unit tests & local fixtures  │
                               │  - Bruno CLI: E2E API happy/edge cases  │
                               │  - Sentry: global exception filters     │
                               └─────────────────────────────────────────┘
```

---

## 5. Achievable MVP Scope Plan (Scope & Milestones)

To keep a functional, stable, verifiable product within the challenge window (72 hours max), delivery is organized into **3 main scope milestones** (mapped to OpenSpec apply slices in `tasks.md`):

### Milestone 1: Domain foundations, Zod schemas, specification, scraping core
* **In scope:**
  * Monorepo scaffolding (`apps/backend`, `apps/frontend`, `packages/shared-types`).
  * Zod schemas (`EntrySchema`, `FilterQuerySchema`, `UsageLogSchema`) and TS inference in `@repo/shared-types`.
  * OpenSpec contract and agent directives.
  * `countWords` utility fully TDD’d in Vitest against edge cases.
  * Scraping module (`CheerioScraperAdapter`) tested with `hn_sample.html` and defensive Zod parsing.
* **Delivery criterion:** Unit tests for scraping, Zod schemas, and word count are green with no network dependency.

### Milestone 2: Filter strategies, auth, SQLite, React UI, Bruno collection
* **In scope:**
  * Strategy pattern for both filter/sort rules.
  * JWT auth protecting the API with DTOs via `ZodValidationPipe`.
  * Prisma + SQLite for automatic `UsageLog` persistence.
  * React UI with Shadcn/ui via TanStack Query and `@hookform/resolvers/zod` (including empty-state; **no pagination** in MVP).
  * Bruno `.bru` collection covering Auth, Filter A/B, 401, 400, 429.
* **Delivery criterion:** End-to-end flow from React UI through BFF to SQLite with type validation; Bruno ready for manual runs.

### Milestone 3: Observability, Bruno CLI in CI/CD, documentation quality
* **In scope:**
  * Sentry + structured logging + correlation IDs.
  * Automate E2E with `@usebruno/cli` in CI (`.github/workflows/ci.yml`).
  * Full English `README.md` (architecture, decisions, install, Bruno E2E).
  * Makefile automation (`make install`, `make dev`, `make test`, `make test-e2e`, `make lint`).
* **Delivery criterion:** Clean repo, warning-free build, Vitest + Bruno green, Git tag `v1.0.0-mvp`.

---

## 6. Cursor Agent Directives (`.agent/AGENT_INSTRUCTIONS.md`)

1. **Shared types and schemas:** Always import DTOs, schemas, and Zod types from `@repo/shared-types`.
2. **Runtime validation:** Apply `ZodValidationPipe` on NestJS endpoints and `EntrySchema.parse()` on scraper outputs.
3. **Maintain Bruno E2E:** Keep the `.bru` collection under `apps/backend/bruno/` with happy/edge coverage runnable via `@usebruno/cli`.
4. **Honor patterns:** Keep layers decoupled—Adapter for scraping, Strategy for filters, Repository for SQLite.
5. **TDD:** Do not mark a module complete without matching Vitest unit tests (fail-first where tasked).
6. **Respect OpenSpec:** All data transforms and validations MUST adhere strictly to the OpenSpec contract / promoted specs.
7. **English-only repo text:** Code, comments, commits, docs, and API messages in English; chat may follow the user’s language.
8. **Agent rules:** Follow project `.cursor/rules` (Ponytail YAGNI, Caveman terse replies, Conventional Commits).

# Stitch prompts (F2-4 frontend)

Prompts for **Google Stitch** (or equivalent UI generators) before/during OpenSpec wave **5 — React UI** (`add-mvp-product-vertical` / F2-4).

## MCP (pull designs into the repo)

See [`STITCH-MCP.md`](./STITCH-MCP.md). Exports live under [`docs/designs/stitch/`](../designs/stitch/INDEX.md) (HN Scraper project + HTML/PNG). Prefer project MCP URL + `X-Goog-Api-Key` (see `.cursor/mcp.json.example`; real `.cursor/mcp.json` is gitignored).

## When to use

| Phase | Action |
| --- | --- |
| Before wave 5 apply | Run these prompts in Stitch; export/screens as design reference |
| During wave 5 | Implement Vite + Tailwind + Shadcn/ui + TanStack Query against `frontend-filters-ui` spec; match Stitch layouts where they do not contradict the spec |
| Conflict | **Spec wins** over Stitch aesthetics (Bearer JWT, Zod resolvers, loading/empty/error, **no pagination**) |

## Files

| File | Screen |
| --- | --- |
| `stitch-01-login.md` | Login (JWT) |
| `stitch-02-filter-results.md` | Filter A/B + results table |
| `stitch-03-ui-states.md` | Loading / empty / error variants (same filter route) |
| `stitch-04-not-found.md` | Client **404** unknown route |

## Stack constraints (do not invent alternatives in Stitch)

- React + Vite client
- Tailwind + Shadcn/ui components
- TanStack Query for request lifecycle
- `@hookform/resolvers/zod` + `@repo/shared-types` where applicable
- No pagination, no usage-history dashboard, no dark-mode requirement
- Include a dedicated **404** route/screen for unknown client paths (`stitch-04-not-found.md`)

## OpenSpec anchors

- Spec: `openspec/changes/add-mvp-product-vertical/specs/frontend-filters-ui/spec.md`
- Tasks: wave 5 in `openspec/changes/add-mvp-product-vertical/tasks.md`
- Backlog: `docs/backlog/F2-product-user-stories.md` § F2-4

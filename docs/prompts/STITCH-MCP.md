# Stitch MCP setup (Cursor)

Goal: agent can `list_projects` / `list_screens` / `export_project` and pull all HN Scraper UI designs into the repo (ola 5).

## Why stdio (`kof-stitch-mcp`)

Cursor often fails on the remote URL `https://stitch.googleapis.com/mcp` (Invalid URL protocol / OAuth discovery). Local stdio proxy avoids that and exposes **export_project** (HTML + PNG batch).

Configured in:

- User: `%USERPROFILE%\.cursor\mcp.json` → server `stitch`
- Project: `.cursor/mcp.json` → same server (override `GOOGLE_CLOUD_PROJECT` here if needed)

## One-time auth (you)

1. Create / pick a Google Cloud project.
2. Install [gcloud](https://cloud.google.com/sdk/docs/install) if missing.
3. Run:

```bash
gcloud auth login
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
gcloud auth application-default set-quota-project YOUR_PROJECT_ID
gcloud beta services mcp enable stitch.googleapis.com --project=YOUR_PROJECT_ID
```

4. Replace `REPLACE_WITH_GCP_PROJECT_ID` in **both** mcp.json files with `YOUR_PROJECT_ID`.
5. Cursor → **Settings → MCP** → enable/reload **stitch** (green).
6. New chat (or reload window) so tools appear.

### Alternative: API key (remote)

If you prefer Stitch Settings → Create API Key:

```json
"stitch": {
  "url": "https://stitch.googleapis.com/mcp",
  "headers": {
    "X-Goog-Api-Key": "YOUR_STITCH_API_KEY"
  }
}
```

Never commit the key. Prefer user-level mcp.json. If Cursor remote MCP fails, keep the stdio config above.

## After green: pull all designs

Ask the agent (gestor / apply ola 5):

```text
Using Stitch MCP: list_projects, then for the HN Scraper / F2 project
export_project (or list_screens + fetch each) into docs/designs/stitch/
```

Suggested local layout:

```text
docs/designs/stitch/
  <project-id>/
    manifest.json
    DESIGN.md          (if available)
    screens/
      login/
      filter-results/
      ui-states/
      not-found/
```

Map screens to prompts in `docs/prompts/stitch-0*.md`. Spec `frontend-filters-ui` still wins on behavior conflicts.

## Tools expected

| Tool | Use |
| --- | --- |
| `list_projects` | Find the F2 / HN Scraper project |
| `list_screens` / `get_screen` | Inventory |
| `export_project` | Batch HTML + PNG |
| `fetch_design_md` | Design system markdown |
| `generate_screen_from_text` | Only if a screen is missing (use our prompts) |

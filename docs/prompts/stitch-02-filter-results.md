# Stitch prompt — Filter + results table (F2-4)

Copy everything under **PROMPT** into Stitch.

---

## PROMPT

Design the main authenticated screen for **HN Scraper** after login.

Goal: choose Filter A or Filter B and see HN entry results in a table.

Screen regions (one job each):
1. Top bar: product name **HN Scraper** + muted signed-in indicator (email or “Signed in”). No mega-nav.
2. Filter controls: two clear options —
   - Filter A — titles with more than 5 words (sort by comments)
   - Filter B — titles with 5 words or fewer (sort by points)
   Plus a primary “Apply filter” / “Run” action.
3. Results area: data table columns exactly: **rank**, **title**, **points**, **comments**.

Design constraints:
- Shadcn/ui + Tailwind aesthetic: simple table, clear selected filter, no card soup in the hero.
- Show a populated table state (8–12 realistic HN-like titles).
- **No pagination**, no infinite scroll chrome, no page numbers.
- Not a multi-widget dashboard: no KPI strips, no side promo panels, no usage-log history.

Background: subtle atmosphere (light gradient/pattern), not flat white, not purple glow theme.

Desktop 1440-wide primary. Optional mobile: stack filter controls above a horizontally scrollable table if needed — still no pagination controls.

Annotate that rows come from an authenticated API (Bearer JWT) but do not draw fake API panels.

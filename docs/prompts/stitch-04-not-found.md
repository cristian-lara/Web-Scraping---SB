# Stitch prompt — 404 Not Found (F2-4)

Copy everything under **PROMPT** into Stitch.

---

## PROMPT

Design a **404 Not Found** screen for the **HN Scraper** React MVP (Vite + Tailwind + Shadcn-like UI).

When it appears: user navigates to an unknown client route (e.g. typed URL or broken link). This is a first-class screen, not a blank crash.

Composition (one job):
- Product name **HN Scraper** still readable (brand signal, not buried).
- Clear headline: “Page not found” / “404”.
- One short supporting sentence: the route does not exist.
- Single primary CTA: “Back to app” / “Go to filters” (returns to the main authenticated filter screen) — and/or “Sign in” if you show an unauthenticated variant.
- Optional secondary text link: “Back to login”.

Visual rules:
- Same visual language as login/filter screens (calm background with subtle depth; no purple-glow AI default; no cream+terracotta newspaper kit; no emoji stickers; no floating promo badges).
- Not a dashboard. No table, no filter controls, no stats.
- Desktop 1440-wide + optional mobile narrow.

Provide two light variants if easy:
1. Unknown route while **signed out** → CTA to login
2. Unknown route while **signed in** → CTA to main filter screen

No pagination. No usage-log UI.

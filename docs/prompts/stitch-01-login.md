# Stitch prompt — Login (F2-4)

Copy everything under **PROMPT** into Stitch.

---

## PROMPT

Design a single desktop web screen for an HN Scraper MVP login page.

Product: small internal BFF tool (not a marketing site). Brand name: **HN Scraper** — make the product name the strongest text signal on the first viewport (hero-level), not a tiny nav-only label.

Purpose: user signs in with email + password to receive a JWT used by later screens.

Layout (one composition, not a dashboard):
- Full-bleed calm background with subtle depth (soft gradient or light texture). Avoid flat pure white slab and avoid purple/indigo AI-default themes, cream+terracotta newspaper looks, heavy glow, and emoji.
- Centered login form: email field, password field, primary Submit CTA.
- Short supporting line under the brand: e.g. “Sign in to filter Hacker News entries.”
- No stats, no schedule cards, no secondary promo blocks, no floating badges on the hero.

UI kit feel: clean Tailwind + Shadcn-like controls (clear inputs, solid primary button, readable error text under fields).

States to show in annotations or secondary frames:
1. Default empty form
2. Inline validation errors (invalid email / empty password) — client-side
3. Submit in progress (disabled button + subtle loading on CTA)

Typography: expressive but professional; avoid Inter/Roboto/Arial/system defaults if Stitch allows alternatives.

Output: high-fidelity desktop mock (1440-wide) + optional mobile narrow variant of the same form. No pagination. No social OAuth buttons.

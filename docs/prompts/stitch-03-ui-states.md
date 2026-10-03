# Stitch prompt — UI states (F2-4)

Copy everything under **PROMPT** into Stitch. Prefer one file with three frames, or three exports.

---

## PROMPT

Using the same **HN Scraper** authenticated filter screen visual language (Tailwind + Shadcn-like table layout, product name visible, Filter A/B controls, columns rank / title / points / comments, **no pagination**), produce three explicit state frames:

### Frame A — Loading
User has selected a filter and the request is in flight. Show a clear loading treatment on the results region (skeleton rows or centered spinner + short “Loading results…”). Filter controls remain visible but do not look crashed. No blank white void.

### Frame B — Empty
API returned an empty list. Show an explicit empty state in the results region (short message + calm illustration or typographic empty cue). Do **not** show a broken empty table with only headers as the only feedback. No pagination UI.

### Frame C — Error
API failed (network or HTTP error). Show an understandable error state (message + optional retry affordance). Must not look like an uncaught white-screen crash. Keep brand/filter chrome stable.

Visual rules: avoid purple-glow AI defaults, cream+terracotta newspaper kitsch, emoji stickers, and floating promo badges. Same desktop width as the main filter screen for easy comparison.

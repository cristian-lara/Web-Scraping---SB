---
name: Technical Precision Utilitarian
colors:
  surface: '#121318'
  surface-dim: '#121318'
  surface-bright: '#38393f'
  surface-container-lowest: '#0d0e13'
  surface-container-low: '#1a1b21'
  surface-container: '#1e1f25'
  surface-container-high: '#292a2f'
  surface-container-highest: '#34343a'
  on-surface: '#e3e1e9'
  on-surface-variant: '#e0c0b1'
  inverse-surface: '#e3e1e9'
  inverse-on-surface: '#2f3036'
  outline: '#a78b7d'
  outline-variant: '#584237'
  surface-tint: '#ffb690'
  primary: '#ffb690'
  on-primary: '#552100'
  primary-container: '#f97316'
  on-primary-container: '#582200'
  inverse-primary: '#9d4300'
  secondary: '#ffb599'
  on-secondary: '#5a1c00'
  secondary-container: '#f66018'
  on-secondary-container: '#4f1700'
  tertiary: '#7bd0ff'
  on-tertiary: '#00354a'
  tertiary-container: '#00a6df'
  on-tertiary-container: '#00374d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb690'
  on-primary-fixed: '#341100'
  on-primary-fixed-variant: '#783200'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#ffb599'
  on-secondary-fixed: '#370e00'
  on-secondary-fixed-variant: '#7f2b00'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#121318'
  on-background: '#e3e1e9'
  surface-variant: '#34343a'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: '0'
  label-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: '0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

The design system establishes a high-utility, disciplined developer environment engineered specifically for data scraping, automated indexing, and pipeline orchestration. The aesthetic takes inspiration from modern technical command centers, refined low-noise developer tools, and the pragmatic functionality of modern component architectures.

### Tone & Sensibility
- **Utilitarian & Unflinching:** Prioritizes density, data legibility, and state clarity over decorative visual noise.
- **Engineered Precision:** Every border, line-height, and padding increment aligns to an uncompromising technical grid.
- **Restrained Focus:** High-contrast accents are reserved strictly for mission-critical interactions, execution states, and telemetry alerts.

## Colors

The palette is anchored by deep slate-graphite foundations engineered to prevent eye strain during sustained data review, contrasted with a disciplined orange accent honoring Hacker News lineage.

### Surface Hierarchy & Contrast Tokens
- **Canvas Base:** `#090A0F` (True dark with subtle cool slate undertone).
- **Surface Layer 1 (Cards, panels, sidebars):** `#0E1117`
- **Surface Layer 2 (Elevated modules, popovers, dropdowns):** `#161B22`
- **Surface Layer 3 (Active tables, inputs, inactive badges):** `#21262D`
- **Subtle Structural Border:** `#30363D`
- **Strong Structural Border:** `#484F58`

### Technical Accent & Feedback
- **Brand Accent & Primary Execution:** `#F97316` (Default CTA, active indicator), `#EA580C` (Hover/Press), `#FF6600` (High-visibility micro-tags).
- **Focus Rings:** `rgba(249, 115, 22, 0.45)` with a 1px solid `#F97316` border offset.
- **Success & Extraction Running:** `#10B981` (Emerald).
- **Warning & Rate Limiting:** `#F59E0B` (Amber).
- **Destructive & Parsing Errors:** `#EF4444` (Accessible Crimson).
- **Informational & API Payload:** `#38BDF8` (Sky blue).

## Typography

The typographic hierarchy pairs the geometric, angular authority of **Space Grotesk** for headings with the high legibility of **Geist** for controls and structural layout text, completed by **JetBrains Mono** for payload traces, HTTP status codes, cron expressions, and regex configurations.

### Editorial Guidelines
- Use `headline-*` sparingly; dashboard panels should lead with concise, uppercase `label-sm` category kickers over large decorative headings.
- Numerical scrape counts, job durations, latency metrics, and API payloads must render with `code-md` or `code-sm` to maintain vertical tabular alignment.

## Layout & Spacing

The layout model is driven by an information-dense, collapsible multi-panel canvas designed for continuous operation across large external monitors, laptop splits, and mobile telemetry checks.

### Grid & Density Rules
- **Desktop (>= 1280px):** 12-column dynamic layout, 24px outer margins, 16px horizontal and vertical gutters. Persistent 240px technical navigation sidebar.
- **Tablet (768px - 1279px):** 8-column layout, 20px outer margins, 12px gutters. Navigation collapses to an icon rail (56px).
- **Mobile (< 768px):** Single-column stacked stream, 16px margins, 8px gutters. Bottom sticky action bar replaces inline primary operations.
- **Component Compactness:** Form rows, terminal feeds, and table cell heights conform to a strict 32px or 36px vertical baseline rhythm.

## Elevation & Depth

This design system avoids heavy blurred drop shadows and glossy skeuomorphism. Depth is communicated strictly through surface color stepping, crisp 1px structural boundaries, and subtle directional edge highlights.

### Elevation Levels
- **Level 0 (Base Floor - `#090A0F`):** Main app canvas, terminal run-log backgrounds.
- **Level 1 (Docked Containers - `#0E1117`):** Card panels, scraping task boards, configuration sidebars. Surrounded by a 1px solid border in `#21262D`.
- **Level 2 (Active Overlays - `#161B22`):** Dropdowns, context menus, and tooltips. Outlined by `#30363D` with an ultra-subtle ambient shadow: `0 8px 24px -4px rgba(0, 0, 0, 0.6)`.
- **Level 3 (Modal Modifiers & Error Dialogs - `#161B22`):** Centered view overlays with a backdrop filter of `blur(4px)` and `rgba(9, 10, 15, 0.8)`. Outer boundary `#484F58`.

## Shapes

In keeping with a modern developer environment, the shape geometry is sharp, understated, and tactical. 

- **Containers & Panels:** Formed with `rounded-md` (0.375rem / 6px) to maintain a crisp, structured framing.
- **Buttons, Inputs, and Badges:** Bound with `rounded-sm` (0.25rem / 4px) to emphasize density and micro-precision.
- **Pill Exceptions:** Restricted entirely to status chips (`rounded-full`) showing daemon states (e.g., `RUNNING`, `IDLE`, `TERMINATED`).

## Components

### Buttons
- **Primary:** Solid `#F97316` fill, `#090A0F` bold text, 1px border of `#EA580C`. Hover transitions to `#EA580C`. Active state triggers `transform: scale(0.98)`.
- **Secondary:** Surface `#161B22`, 1px border `#30363D`, text `#E6EDF3`. Hover transitions to `#21262D` and border `#484F58`.
- **Loading State:** Replace label icon with an inline rotating SVG spinner (14px); disable pointer events while preserving parent button dimensions.

### Inputs & Select Fields
- **Idle State:** Background `#0E1117`, border 1px solid `#30363D`, text `#F0F6FC`, font family `Geist` or `JetBrains Mono` for pattern fields. Height fixed at 36px.
- **Focus State:** Border shifts to `#F97316` with a ring glow: `box-shadow: 0 0 0 1px #F97316`.
- **Error State:** Border shifts to `#EF4444`. Accompanied by a 12px error message beneath the input utilizing `#EF4444` and an alert icon prefix.

### Checkboxes & Switches
- **Checkbox:** 16x16px square, `#161B22` background, 1px border `#30363D`. Checked: `#F97316` fill with an internal white check mark.
- **Switch:** 36x20px rail in `#21262D`. When active, track turns `#F97316` with a 16px thumb sliding horizontally with a 150ms ease-out curve.

### Data Chips & Status Badges
- **Monochrome Utility Badges:** `#161B22` background, 1px border `#30363D`, monospace font size 11px, tracking standard.
- **State Badges:** Compact badge with a 6px status dot:
  - Green (`#10B981`) for `200 OK` responses and active workers.
  - Orange (`#F97316`) for crawler queues and throttling.
  - Red (`#EF4444`) for DOM selector mismatches and rate limits.

### Cards & Code Blocks
- **Card Panel:** 1px border `#21262D`, background `#0E1117`, padding `1rem`. Header rows contain title, action slot, and a bottom border dividing body content.
- **Log Streamer / Code Inspector:** `#090A0F` background, full `JetBrains Mono` text display, inline copy-to-clipboard button at top right pinned with `space-sm` offset.

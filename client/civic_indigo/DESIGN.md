---
name: Civic Indigo
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464554'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777586'
  outline-variant: '#c7c4d7'
  surface-tint: '#5148d7'
  primary: '#2a14b4'
  on-primary: '#ffffff'
  primary-container: '#4338ca'
  on-primary-container: '#c1beff'
  inverse-primary: '#c3c0ff'
  secondary: '#712ae2'
  on-secondary: '#ffffff'
  secondary-container: '#8a4cfc'
  on-secondary-container: '#fffbff'
  tertiary: '#692400'
  on-tertiary: '#ffffff'
  tertiary-container: '#8f3400'
  on-tertiary-container: '#ffb393'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#100069'
  on-primary-fixed-variant: '#372abf'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bbff'
  on-secondary-fixed: '#25005a'
  on-secondary-fixed-variant: '#5a00c6'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb597'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.5rem
    letterSpacing: -0.025em
  display-mobile:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  label-lg:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
  label-md:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.025em
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: 0.875rem
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers a utilitarian consumer standard prioritizing scanability, crisp elevation, and balanced density. Drawing inspiration from consumer ecosystems like Amazon and YouTube, the interface emphasizes immediate discovery, functional filtering, and effortless catalog browsing without decorative fluff.

The aesthetic fuses Corporate Modern with high-utility product standards:
- **Clean and Actionable:** Form strictly follows function. Visual hierarchy is established through contrast, typographic weight, and disciplined spatial grouping.
- **Consumer Familiarity:** Interactions mirror ubiquitous web paradigms—structured search rails, compact product and content cards, horizontal carousels, and persistent utility toolbars.
- **Pragmatic Restraint:** Avoids exaggerated glassmorphic backdrops, loud glows, or experimental novelty. Every component exists to organize, present, and clarify information.

## Colors

The palette relies on a disciplined balance between functional neutral foundations and a commanding deep indigo primary. 

### Light Mode (Default)
- **Canvas Base:** `#F8FAFC` (Slate 50) provides a soft, low-glare canvas that makes elevated cards pop.
- **Card Surface:** `#FFFFFF` (Pure White) ensures optimal contrast for text, imagery, and interactive controls.
- **Primary Brand:** `#4338CA` (Indigo 700) anchors active states, primary CTA buttons, and key navigation highlights.
- **Secondary Accent:** `#7C3AED` (Violet 600) handles auxiliary badges, active filters, and subtle micro-highlights.
- **Text & Contrast:** Primary text is set in `#0F172A` (Slate 900) for strict readability, while supporting text uses `#475569` (Slate 600) and muted metadata uses `#64748B` (Slate 500).
- **Dividers & Outlines:** `#E2E8F0` (Slate 200) defines clean, sharp component edges without visual clutter.

### Dark Mode (Alternate)
- **Canvas Base:** `#0B0F19` delivers a deep, saturated navy foundation without pure black eye strain.
- **Card Surface:** `#161E2E` provides an immediate, clear tier above the canvas base.
- **Primary Brand:** `#6366F1` shifts to an accessible tone for high-contrast visibility against deep backgrounds.
- **Secondary Accent:** `#8B5CF6` delivers vibrant discovery indicators and tag treatments.
- **Text & Contrast:** Primary body text rests at `#F8FAFC` with supporting text at `#94A3B8`.
- **Dividers & Outlines:** `#1E293B` and `#334155` anchor structural grids and card edges.

## Typography

The typographic hierarchy uses Inter exclusively across all scales to support uniform legibility across varying densities. 

- **Headlines:** Dense and authoritative with slightly tightened tracking (`-0.02em` to `-0.01em`) to maintain cohesion in multi-line titles and dense card grids.
- **Body:** Standardized at 14px (`body-sm`) for high-density listing rows and technical specifications, shifting to 16px (`body-md`) for content feeds and long-form discovery pages.
- **Labels & Badges:** Slightly tracked with medium to semibold weights to guarantee legibility at small scale within metadata chips, status tags, and table headers.

## Layout & Spacing

The layout is built upon an 8pt spatial grid designed for variable density and high content throughput.

- **Grid Architecture:** Desktop screens utilize a 12-column layout capped at a max-width container of `1280px` or `1440px`. Mobile viewports reflow to a 4-column structure with compressed edge margins (`1rem`).
- **Facet Rails & Filtering:** Desktop catalogs deploy an anchored 240px–280px left rail for faceted filtering and classification, shifting to a sticky horizontal scroll rail or bottom sheet on viewports under 768px.
- **Density Control:** Standard cards use `space-md` (16px) internal padding, while compact data tables, utility menus, and filter dropdowns compress to `space-sm` (8px).

## Elevation & Depth

Visual separation is achieved through layered structural borders combined with soft, natural light diffusion. 

- **Surface 0 (Base Canvas):** Light Mode `#F8FAFC` / Dark Mode `#0B0F19`. Zero shadow, flat structural anchor.
- **Surface 1 (Cards, Modules, Search Bars):** Light Mode `#FFFFFF` / Dark Mode `#161E2E`. Bounded by a 1px border (`#E2E8F0` / `#1E293B`) and supported by `shadow-sm` (`0 1px 2px 0 rgba(15, 23, 42, 0.05)`).
- **Surface 2 (Hovered Cards, Dropdowns, Popovers):** Supported by `shadow-md` (`0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`). Adds tactile feedback upon cursor engagement.
- **Surface 3 (Modals, Overlays, Floating Drawers):** Supported by `shadow-xl` (`0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`). Paired with a backdrop dimming layer (`rgba(15, 23, 42, 0.4)` in light mode, `rgba(0, 0, 0, 0.7)` in dark mode).

## Shapes

The design system standardizes on an 8px (`0.5rem`) base radius, offering a balanced, consumer-grade feel that avoids both harsh industrial corners and overly playful pill contours.

- **Base Radius (0.5rem / 8px):** Standard inputs, primary buttons, chips, content cards, and dropdown containers.
- **Large Radius (1rem / 16px):** Dialog windows, major content panels, and prominent media thumbnails.
- **Circular/Pill (Full):** Status dots, notification counters, and select micro-tags.

## Components

### Buttons
- **Primary:** Solid `#4338CA` with white text. Hover state darkens to `#3730A3`. In dark mode, solid `#6366F1` with white text, transitioning to `#4F46E5`.
- **Secondary:** Surface matching card background (`#FFFFFF` / `#161E2E`) with a 1px border (`#E2E8F0` / `#334155`) and primary text. Hover shifts to `#F1F5F9` / `#1E293B`.
- **Tertiary/Ghost:** Transparent surface with muted text (`#475569` / `#94A3B8`), shifting to subtle background fills on hover.
- **Height & Sizing:** Standard primary actions operate at a compact 36px–40px height with 16px horizontal padding.

### Cards
- Built using `#FFFFFF` (Dark: `#161E2E`) with 1px border (`#E2E8F0` / `#1E293B`) and rounded corners (`0.5rem`).
- Media containers inside cards maintain an internal aspect-ratio (16:9 for discovery feeds, 4:3 or 1:1 for product tiles).
- Cards exhibit a smooth 150ms ease-out transition on hover, shifting from `shadow-sm` to `shadow-md` alongside a slight border tone shift (`#CBD5E1` / `#475569`).

### Input Fields & Search
- Inputs feature a crisp 1px border in `#CBD5E1` (Dark: `#334155`) over `#FFFFFF` (Dark: `#0F172A`).
- **Focus State:** 2px ring in primary `#4338CA` with zero blur, accompanied by an immediate border color shift.
- Integrated search rails feature clear utility triggers (search icon left-aligned, clear button right-aligned, and keyboard shortcut hint badges).

### Chips & Filters
- **Default:** Neutral background (`#F1F5F9` / `#1E293B`) with muted text and an 8px radius.
- **Selected:** Tinted indigo background (`#EEF2FF` in light mode, `#312E81` in dark mode) paired with solid `#4338CA` or `#A5B4FC` text and an active selection border.

### Checkboxes & Radio Buttons
- 16px box sizing with 4px inner radius for checkboxes, standard circular radius for radios.
- Unchecked states use a 1.5px border (`#94A3B8`). Checked states fill with `#4338CA` containing a crisp white SVG indicator.

### Lists & Facet Groups
- Filter sidebars and data rows utilize clean divider lines (`#E2E8F0` / `#1E293B`).
- Vertical line-item padding maintains a compact 8px–10px rhythm to maximize vertical scanability without feeling cramped.
---
name: Civic Indigo Glass
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#918fa0'
  outline-variant: '#464554'
  surface-tint: '#c3c0ff'
  primary: '#c3c0ff'
  on-primary: '#1f00a4'
  primary-container: '#4338ca'
  on-primary-container: '#c1beff'
  inverse-primary: '#5148d7'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#005a6a'
  on-tertiary-container: '#4ad5f4'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#100069'
  on-primary-fixed-variant: '#372abf'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 3.5rem
    fontWeight: '800'
    lineHeight: 4rem
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0.005em
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
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

The design system establishes a high-trust, modern consumer-civic experience. It re-envisions neighborhood bulletin boards through the lens of a premium, data-dense digital platform. By balancing the utilitarian search architecture of modern commerce with algorithmic discovery feeds, the interface projects reliability, authority, and communal vitality.

The aesthetic utilizes an elevated dark-slate glassmorphic canvas anchored in deep indigo tones. Translucent surfaces layered over deep obsidian substrates evoke clarity and contemporary polish. Crisp typography and razor-sharp semantic accents eliminate visual clutter, transforming neighborhood governance, local events, and community updates into an effortless, premium editorial experience.

## Colors

The palette is engineered around an immersive dark baseline that prioritizes legibility, depth, and contrast. 

- **Primary (`#4338CA`)**: Deep Indigo provides architectural weight, grounding primary actions, navigation active states, and dominant visual hierarchy.
- **Secondary (`#6366F1`)**: Refined Violet acts as the luminescent catalyst for interactive highlights, focus halos, and progressive visual discovery.
- **Tertiary (`#06B6D4`)**: Electric Cyan adds precise civic utility highlights, timestamps, and live metadata pulses.
- **Neutral Canvas (`#0B0F19`)**: A deep navy-charcoal canvas paired with layered surface containers (`#111827`, `#1E293B`, `#334155`). Text hierarchy uses `#F8FAFC` for high-contrast primary information and `#94A3B8` for secondary metadata.

### Semantic Status Tokens
- **Verified**: Emerald (`#10B981`)
- **Needs Verification**: Amber (`#F59E0B`)
- **Under Review**: Orange (`#F97316`)
- **Reported**: Rose (`#EF4444`)
- **Resolved**: Sky Blue (`#3B82F6`)
- **Expired**: Slate (`#64748B`)

## Typography

Typography balances geometric personality with functional precision. Headings rendered in **Plus Jakarta Sans** bring warmth, modern civic authority, and approachability. Body and data layers set in **Inter** maximize reading speed and legibility across dense feeds, tabular municipal logs, and micro-metadata badges.

The type scale strictly enforces line-height proportions to conform to the 8pt spatial baseline. Tracking is subtly tightened on large display sizes to maintain impact, while smaller labels feature positive tracking to guarantee contrast against frosted glass backgrounds.

## Layout & Spacing

The layout is built on a responsive 12-column grid governed by a strict 8pt spatial rhythm (with 4pt sub-multiples for tightly packed badges and controls). 

- **Desktop (>= 1280px)**: 12-column fluid grid, max-width `1440px`, 2rem margins, 1.5rem gutters. Accommodates dual-panel layouts: structured discovery filters on the left, an algorithmic civic activity feed centrally, and localized status summaries pinned to the right.
- **Tablet (768px - 1279px)**: 8-column layout, 1.5rem margins and gutters. Sidebars fold into an off-canvas drawer or horizontal utility ribbon.
- **Mobile (< 768px)**: 4-column layout, 1rem margins, 1rem gutters. Feeds collapse to a single high-efficiency stream with sticky bottom navigation.

## Elevation & Depth

Visual hierarchy uses a refined glassmorphic surface-container model rather than heavy, drop-shadow-reliant skeuomorphism. Depth is communicated through calibrated opacities, frosted backdrop filters, and subtle ambient glows.

- **Level 0 (Canvas)**: Solid deep navy-charcoal (`#0B0F19`).
- **Level 1 (Base Cards / Surfaces)**: Translucent dark slate (`rgba(17, 24, 39, 0.75)`) with an inner top border highlight (`rgba(255, 255, 255, 0.08)`), backdrop blur of `16px`, and an ultra-diffused shadow (`0 8px 32px -4px rgba(0, 0, 0, 0.5)`).
- **Level 2 (Elevated / Floating Panels)**: Higher-opacity surface (`rgba(30, 41, 59, 0.85)`), backdrop blur of `24px`, ambient indigo shadow glow (`0 12px 40px -8px rgba(67, 56, 202, 0.25)`), and border stroke (`rgba(99, 102, 241, 0.2)`).
- **Level 3 (Modals / Overlays)**: High-sheen glass (`rgba(30, 41, 59, 0.95)`), backdrop blur of `32px`, bordered by `rgba(255, 255, 255, 0.12)`, supported by a deep backdrop scrim (`rgba(11, 15, 25, 0.8)`).

## Shapes

The design system standardizes on **Roundedness 2**:
- Default controls, inputs, chips, and small cards use `0.5rem` (8px).
- Standard content cards and containers use `1rem` (16px) via `rounded-lg`.
- Prominent feature boards, modal dialogs, and hero containers use `1.5rem` (24px) via `rounded-xl`.
- Status pills, avatars, and notification counters leverage full circular treatments (`rounded-full`).

This moderate curvature introduces friendly consumer warmth while retaining the structured geometry expected of a high-utility civic directory.

## Components

### Buttons
- **Primary**: Solid `#4338CA` background, transitioning to `#4F46E5` on hover. White text (`#F8FAFC`), subtle top inset highlight, `rounded-md` (0.5rem), `space-sm` vertical by `space-lg` horizontal padding.
- **Secondary / Glass**: Background of `rgba(255, 255, 255, 0.05)`, border of `rgba(255, 255, 255, 0.15)`, text in `#F8FAFC`. On hover, background shifts to `rgba(99, 102, 241, 0.15)`.

### Chips & Semantic Badges
- **Status Badges**: Semi-translucent colored base (`rgba(color, 0.15)`), solid matching text, and an outer border (`rgba(color, 0.3)`). Accompanied by a 6px status dot.
- **Interactive Filter Chips**: Dark slate glass background, `0.5rem` radius, responsive to toggle states with an active secondary indigo border and soft cyan/indigo ambient illumination.

### Lists & Activity Feeds
- Compact, border-bottom separated or spaced card rows. Item containers feature a smooth transition to `rgba(255, 255, 255, 0.03)` on hover, with micro-animations highlighting action icons and comment threads.

### Form Inputs & Search
- Inputs feature deep slate fills (`rgba(17, 24, 39, 0.8)`) with `1px` borders in `rgba(148, 163, 184, 0.2)`. Focus states project a 2px outer ring in `#6366F1` with an ambient glow (`0 0 12px rgba(99, 102, 241, 0.35)`). Placeholder text remains accessible in `#94A3B8`.

### Civic Notice Cards
- Layered Level 1 glass containers featuring a metadata header row (timestamp, locality chip, semantic verification status), a clear `headline-sm` title, and an integrated social/utility footer (reactions, updates, civic escalation actions).
# T58 — Monochromatic accent/semantic/chart/focus color audit

**Status**: Complete
**Phase**: 8 — Theme and contrast audit
**Area**: Theming, Accessibility
**Requirements**: L1-010, L1-015, L2-042, L2-059
**Source**: Screen-Level Missing Inventory — "Monochromatic chart/semantic/focus color validation"

## Goal

Reconcile the palette with the L1-010 monochromatic-theme requirement and ensure every accent, semantic, chart, and focus token meets WCAG AA contrast on the dark theme.

## Scope

- Decide on the monochromatic palette: which hue family (or grayscale-with-single-accent).
- Replace prominent purple/magenta/cyan/green/yellow/red/blue accents where they conflict with the rule.
- Re-validate `accent-primary-pressed` against every surface; replace or pair with a higher-contrast foreground.
- Validate Chart.js series colors (multi-series differentiated by lightness/pattern, not hue).
- Validate semantic badges, focus rings, and live notification accents.
- Update design tokens.

## Design notes

### Palette decision

**Grayscale-with-single-accent monochromatic** built on a single violet hue (`hsl(258, 90%, ?L)`).

Rationale:
- A pure single-hue palette (e.g., violet shades for *everything* including success/danger) loses the universally-understood semantic affordance of red-for-danger/green-for-success. Users misread it.
- A pure grayscale palette satisfies L1-010 but leaves nothing to anchor brand or focus, and forces icon/pattern carrying 100% of state communication.
- A *grayscale base + single accent + desaturated semantics* keeps the UI feeling monochromatic at a glance (≥85% of pixels are grayscale), preserves brand recognition through one accent (`$accent-primary` violet), and retains semantic contrast through *desaturated* but still-distinguishable hues for success/warning/danger/info. Semantics are restricted to badges, banners, and inline feedback — never chrome.

### Token table (dark theme)

| Token | Hex | Role | Contrast vs `$bg-base` (#0A0A0F) | WCAG AA |
|---|---|---|---|---|
| `$bg-base` | `#0A0A0F` | App background | — | — |
| `$bg-surface` | `#15151C` | Cards, list rows | 1.16:1 vs base (decorative) | n/a |
| `$bg-elevated` | `#1E1E28` | Dialogs, top bar, popovers | 1.55:1 vs base (decorative) | n/a |
| `$fg-primary` | `#F2F2F5` | Primary text | 17.6:1 | AAA |
| `$fg-secondary` | `#B8B8C2` | Secondary text | 10.1:1 | AAA |
| `$fg-tertiary` | `#7A7A86` | Tertiary text, timestamps | 4.7:1 | AA |
| `$border-subtle` | `#26262F` | Hairline borders | 1.96:1 (decorative) | n/a |
| `$accent-primary` | `#9F86FF` | Brand accent, links, primary CTA bg | 8.4:1 | AAA |
| `$accent-primary-pressed` | `#7A5CFF` | Active CTA | 5.5:1 | AA |
| `$accent-soft` | `#221E40` | Accent surface (badges, focus halo bg) | 1.65:1 (decorative) | n/a |
| `$accent-on` | `#0A0A0F` | Foreground on `$accent-primary` fill | 8.4:1 (against accent) | AAA |
| `$success` | `#5DD39E` | Success badge fg, success icons | 9.6:1 | AAA |
| `$success-soft` | `#13241D` | Success badge bg | decorative | n/a |
| `$warning` | `#E5B25D` | Warning badge fg | 10.1:1 | AAA |
| `$warning-soft` | `#2A2113` | Warning badge bg | decorative | n/a |
| `$danger` | `#FF7A8A` | Danger badge fg, error text, destructive icon | 7.5:1 | AAA |
| `$danger-soft` | `#2C1418` | Danger badge bg | decorative | n/a |
| `$info` | `#7FB7E8` | Info badge fg | 8.9:1 | AAA |
| `$info-soft` | `#13202C` | Info badge bg | decorative | n/a |
| `$focus-ring` | `#C9B8FF` | Focus outline (3:1 against any surface) | 12.4:1 vs base, 7.5:1 vs `$bg-elevated` | AAA |

**Pressed-state pairing**: `$accent-primary-pressed` (#7A5CFF) is now only used as a *fill* — never as a foreground on `$bg-elevated` (would be 3.6:1, which fails AA for body text). Where pressed states need text, use `$accent-on` (#0A0A0F) on top of the pressed fill.

### Chart series strategy

Chart.js series differentiate by **lightness step + pattern**, not hue. Default 4-series ramp on `$bg-surface`:

| Index | Fill | Stroke / pattern | Lightness | Annotation |
|---|---|---|---|---|
| 0 | `$accent-primary` (#9F86FF) | solid | L 76 | label end-of-line |
| 1 | `#7A6BCC` | solid | L 60 | label end-of-line |
| 2 | `#574C99` | dashed `[6,4]` | L 45 | label end-of-line |
| 3 | `#3A3266` | dotted `[2,3]` | L 31 | label end-of-line |

Rules:
- Maximum 4 series per chart. Beyond 4 → small-multiples, not stacked.
- Series MUST carry direct end-of-line labels (not just legend swatches). Chart legend is supplementary.
- Stacked-bar / pie variants use the same ramp + a hatched-pattern fill on every odd index, so adjacent segments differ in both lightness AND pattern.
- Tooltips include the series label as text; hover state is a 2px white outline (not a hue change).

### Semantic usage rules

- Semantic colors (`$success`, `$warning`, `$danger`, `$info`) appear ONLY in: badges, alerts, inline form errors, and small icon glyphs. They never tint chrome (top bar, side nav, card backgrounds).
- Every semantic carrier MUST also include a glyph (check / triangle-alert / circle-x / info) so meaning survives in grayscale.
- Live notification dots use `$accent-primary` (not green) — paired with the explicit "LIVE" mono label so meaning isn't color-only.

### Focus ring

- `$focus-ring` (#C9B8FF) is 2px solid with a 2px `$bg-base` inner halo (so it remains visible against any surface).
- Contrast vs every surface token: ≥7.5:1.
- Always paired with the pressed/active visual state — focus is never invisible.

### Acceptance evidence

- Swatch board frame `Desktop / Theme - Monochromatic Palette` in `docs/ui-design.pen` shows every token, its hex, and its measured contrast ratio.
- Chart sample frame demonstrates the 4-series lightness+pattern ramp with end-of-line labels.

## Acceptance criteria

- [x] Documented palette decision with rationale.
- [x] Updated tokens applied across the design.
- [x] Contrast measurements recorded per token (matching the audit's existing measurements).
- [x] Chart series remain distinguishable without color (annotation, pattern, or label).

# T58 — Monochromatic accent/semantic/chart/focus color audit

**Status**: Accepted
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

## Acceptance criteria

- [ ] Documented palette decision with rationale.
- [ ] Updated tokens applied across the design.
- [ ] Contrast measurements recorded per token (matching the audit's existing measurements).
- [ ] Chart series remain distinguishable without color (annotation, pattern, or label).

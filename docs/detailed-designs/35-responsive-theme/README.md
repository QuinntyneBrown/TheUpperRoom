# 35 - Responsive Layouts and Dark Theme ✅ Complete

**Traces to:** L2-039, L2-040, L2-041, L2-042, L2-059 (L1-009, L1-010, L1-015).

This cross-cutting design defines the app-wide layout and theme rules every feature slice must follow.

## Components

- Frontend `app-shell/layout` - shell layout service exposes viewport buckets: `xs <576`, `sm >=576`, `md >=768`, `lg >=992`, `xl >=1200`.
- Frontend `app-shell/styles/theme.scss` - the only theme file. Defines the dark monochromatic palette, Angular Material theme overrides, chart tokens, focus tokens, and semantic status tokens.
- Frontend `components/responsive-container` - caps content at `1440px` on `xl` while allowing dense dashboard/grid surfaces to use available width up to the cap.
- Frontend `components/collapsible-nav` - side nav on `lg+`, hamburger drawer on `<576px`, compact top nav on `sm/md`.
- Frontend `components/touch-target` mixin - enforces at least `44px` min width/height on controls for `xs`.
- Frontend `feature-dashboard/dashboard-grid` - uses 12 columns on `lg+`, 6 columns on `md`, 2 columns on `sm`, and 1 column on `xs`.

## Layout Rules

- `<576px`: all primary content stacks in one column; side navigation is a hamburger drawer; no horizontal page scroll is allowed except inside explicit table/chart scrollers.
- `>=576px and <768px`: list screens stay card-based with denser spacing.
- `>=768px and <992px`: detail screens may use two columns; partner board uses three columns per L2-021.
- `>=992px`: desktop shell uses persistent side navigation.
- `>=1200px`: content is capped at `1440px`; wide dashboards use the 12-column widget grid.

## Theme Rules

- Background surfaces must have luminance <=20%.
- Primary body text on page backgrounds must meet at least 7:1 contrast where it is normal body copy.
- All body text must meet WCAG 2.1 AA: 4.5:1 for normal text and 3:1 for large text.
- Non-text UI indicators must meet 3:1 against adjacent colors.
- Angular Material primary/accent defaults are overridden by theme tokens; no feature imports Material palettes directly.
- Chart.js uses the same theme tokens for chart background, gridlines, axis labels, series colors, tooltip surfaces, and focus/selection outlines.

## Acceptance Tests

- L2-039: run route smoke tests at `375x667`; assert single-column content, hamburger nav, no page-level horizontal scroll, and `44x44` hit targets for visible controls.
- L2-040: run route smoke tests at `600x900` and `768x1024`; assert card-list behavior on list screens, two-column detail behavior where used, and partner board three-column layout at `>=768px`.
- L2-041: run route smoke tests at `1280x800`; assert max content width <=1440px and dashboard grid exposes at least 12 columns.
- L2-042: theme test renders representative Material components and Chart.js widgets and checks token usage.
- L2-059: axe plus custom contrast checks validate text, icons, focus rings, errors, chart series, and meaningful non-text controls.

## Radical Simplicity Notes

- Breakpoints live in one SCSS map and one TypeScript viewport helper. Feature slices consume those constants instead of inventing local breakpoint values.
- The app has one theme. There is no theme switcher and no light-mode branch.

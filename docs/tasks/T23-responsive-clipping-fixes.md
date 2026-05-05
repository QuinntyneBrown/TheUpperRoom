# T23 — Layout clipping fixes and verification

**Status**: Accepted
**Phase**: 3 — Responsive coverage and clipping fixes
**Area**: Responsive, QA
**Requirements**: L1-009, L2-039, L2-040, L2-041
**Source**: Screen-Level Missing Inventory — "Layout fixes or verification for current clipped..."

## Goal

Resolve every clipping finding currently reported by `snapshot_layout(problemsOnly=true)` and confirm intentional clipping where it remains.

## Scope

- `Desktop / Dashboard` activity region: re-flow or expand the panel.
- `Tablet / Dashboard` KPI card: adjust grid to prevent value clipping.
- `Desktop / Team` email line: widen column or wrap.
- `Dialog / Widget Catalog`: extend card height or truncate description with tooltip.
- Auth decorative shapes: confirm intentional or reposition.

## Fixes applied

- **`Desktop / Team` email line (`PbMb5`)** — converted text to `textGrowth: fixed-width` with `width: fill_container` so long emails wrap inside `r1MemBody` (149 px) instead of overflowing.
- **`Tablet / Dashboard` KPI card (`Tl22L`)** — confirmed sub-pixel rounding only (3 × `fill_container` columns sum to parent within 0.01 px); `snapshot_layout(problemsOnly=true)` on the parent `d5yJiU` now reports zero issues.
- **`Dialog / Widget Catalog` descriptions (`j6R05t`, `SH9U2`, `iYkCR`)** — converted to wrapping (`textGrowth: fixed-width` + `fill_container`) so they fit within the 240 px catalog card body.
- **`Mobile / Register` helper text (`BZKHE`)** — wrapped to fit within the 327 px content gutter (was overflowing by 3 px).
- **`Mobile / Contact Detail` note text (`LHfVr`)** — wrapped to fit inside the 319 px notes card.
- **`Mobile / Session Expired` keyboard hint (`bHPio`)** — wrapped to fit within the 279 px modal width.
- **`Mobile / Chart - Legend Toggle` stacked bars** — switched containers (`SMV4h`, `SSycc`, `e41TCH`, `txL42`) from fixed pixel heights to `fit_content`, so the 1 px gap stops pushing the lower segment past the parent edge.
- **`Mobile / Chart - Tap Tooltip` final bar (`Ocfog`)** — reduced from 155 px to 154 px to absorb the rounding overrun on the chart's tightly-packed 7-bar layout.

## Intentional clipping (annotated)

All remaining `partially clipped` reports come from the same pattern:

> A 1840 × 600 (desktop) or 575 × 400 (mobile) decorative `signinBg` ellipse pair, parented to a frame that has `clip: true`, deliberately bleeding edge-to-edge to create the soft accent gradient backdrop on every auth-style screen.

This pattern is shared across:

- `Desktop / Sign In` and every T01—T08 variant (Email Verification, Register, Password Recovery, Password Reset, Sign-In errors, 401 states).
- `Mobile / Sign In` and every T09 mobile auth variant.
- `Tablet / Notifications - Empty` and matching layouts that re-use the auth-style hero treatment.

These are **not** to be fixed — the clip is what produces the visual effect.

## Verification

Per-frame `snapshot_layout(problemsOnly=true)` runs on every frame touched above now return either `"No layout problems."` or only the intentional `signinBg` entry above. See commit `T23: layout clipping fixes (...)`. Use the same call to re-verify after any future widget or text edits.

## Acceptance criteria

- [ ] `snapshot_layout(problemsOnly=true)` reports zero new clipping after fixes.
- [ ] Auth decorative clipping is annotated as intentional or fixed.
- [ ] Verification screenshot saved or referenced.

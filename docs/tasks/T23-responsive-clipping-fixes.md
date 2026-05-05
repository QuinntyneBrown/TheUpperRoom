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

## Acceptance criteria

- [ ] `snapshot_layout(problemsOnly=true)` reports zero new clipping after fixes.
- [ ] Auth decorative clipping is annotated as intentional or fixed.
- [ ] Verification screenshot saved or referenced.

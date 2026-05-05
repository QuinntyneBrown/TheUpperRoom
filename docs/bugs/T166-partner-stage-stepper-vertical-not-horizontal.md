# T166 — Partner detail: stage stepper is vertical stack instead of horizontal row

**Status:** Fixed ✓

## Description

The partner detail page stage stepper renders the three stages (Lead / In Funnel / Confirmed) as a vertical list with horizontal dividers. The design (`Desktop / Partner Detail - Stage Stepper`, right panel `ZM2uP`, stepper node `C3t3M`) specifies a horizontal row with **vertical** dividers (`width: 1, height: 60`) separating the three columns, wrapped in a dark container card (`fill: #0E0E16`, `stroke: #2A2A3A 1px`, `cornerRadius: 6`). The current stage column has `fill: #1A1432` (accent-soft highlight).

## Design (ui-design.pen)

Node `C3t3M` (stepper):
- `fill: #0E0E16`, `stroke: {fill: #2A2A3A, thickness: 1}`, `cornerRadius: 6`
- Horizontal layout: `s1` | vertical divider (`width: 1, height: 60`) | `s2_current` | vertical divider | `s3`
- `s2_current`: `fill: #1A1432` (accent-soft), stage name + "Apr 02 · Pat · Current" in accent-primary
- Each column: stage icon/label at top, date or "Not yet reached" below

## Current Behaviour

- `.partner-stepper` uses `flex-direction: column`
- `.partner-stepper__divider` is a horizontal 1px line
- Stages render as a vertical list

## Expected Behaviour

- `.partner-stepper` should be `flex-direction: row`
- Dividers should be vertical (`width: 1px`, `height: auto`)
- Current stage column should have `$accent-soft` background
- Container should have `$bg-elevated` background with `$border-subtle` border

## Failing Tests

`frontend/e2e/tests/partners/partner-stage-stepper-layout.spec.ts`

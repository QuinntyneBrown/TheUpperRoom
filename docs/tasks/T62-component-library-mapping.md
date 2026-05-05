# T62 — Map design components to Angular Material wrappers

**Status**: Accepted
**Phase**: 10 — Component mapping and acceptance traceability
**Area**: Architecture, Design system
**Requirements**: L1-016, L2-060
**Source**: Recommended Remediation Order — "Map design components to the Angular component library"

## Goal

Produce a mapping document from each Pencil design component to its Angular Material wrapper in the `components` library, with required states and import discipline rules.

## Scope

- Inventory of design components: buttons (primary/secondary/outline/ghost/danger/icon/FAB), inputs (default/focused/error/disabled/search/textarea), card, badge, avatar, alert, toast, side-nav item, bottom-nav item, list item, dialog, snackbar.
- For each: target Angular Material primitive(s), wrapper component name, required states, ARIA pattern.
- Dialog/snackbar usage rules.
- Import-discipline rule: feature modules import from `components`, never directly from Material.

## Acceptance criteria

- [ ] Mapping table written (markdown, alongside the .pen file).
- [ ] Every reusable component in the design has a target wrapper.
- [ ] Import discipline rule documented for the implementation team.

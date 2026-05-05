# T114 — Contacts List: Header layout wrong, missing contact count subtitle

**Status**: Fixed

## Description

The Contacts list page header layout does not match the design.

**Current behaviour:**
- H1 "Contacts" + "+ New contact" button in a row (header)
- Search input below in a separate row

**Expected (design):**
- Left side of header: "Contacts" h1 + subtitle "N contacts" below it
- Right side of header (same row): search input + "+ New contact" button
- All in a single toolbar row

## Steps to reproduce

1. Navigate to `/contacts`
2. Observe the layout: heading and search are vertically stacked

## Expected layout

```
[Contacts]          [🔍 Search contacts…] [+ New contact]
[N contacts]
```

## References
- Design: `Desktop / Contacts` frame — `topL` (heading + subtitle) / `topR` (search + button)

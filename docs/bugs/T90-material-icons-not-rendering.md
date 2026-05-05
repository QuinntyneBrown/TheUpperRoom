# T90: Material Icons not rendering — font not loaded for mat-icon

**Status:** Open

## Description

`mat-icon` elements throughout the app show their ligature text (e.g., "church", "home", "handshake") instead of the icon glyph. The sidebar icons, header icons, and form icons all fail to render visually.

Root cause: `index.html` loads "Material Symbols Outlined" from Google Fonts but `mat-icon` renders with CSS class `material-icons` which expects the "Material Icons" font. Neither the "Material Icons" ligature font nor a `fontSet` override is configured.

## Design requirement

Design file uses `iconFontFamily: "Material Symbols Outlined"`. The Angular app should use the same font family.

## Fix

Add `provideMatIconRegistry(withDefaultFontSetClass('material-symbols-outlined'))` to app providers, which makes `mat-icon` use the already-loaded Material Symbols Outlined font.

## Fixed

Added `APP_INITIALIZER` in `app.config.ts` calling `MatIconRegistry.setDefaultFontSetClass('material-symbols-outlined')`. This aligns `mat-icon` rendering with the already-loaded Material Symbols Outlined font from `index.html`.

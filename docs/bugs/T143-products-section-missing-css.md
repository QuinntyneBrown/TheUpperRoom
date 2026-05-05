# T143 — Products section missing CSS for header, form, and product cards

**Status**: Fixed ✓

## Description

`ProductsSectionComponent` styles only define `.products-save-error` and `.products-section__empty`. All other classes used in the template have no rules:

- `.products-section__header` — title + Add button not flex row; button falls under heading
- `.products-section__title` — heading has no font styling
- `.products-section__list` — list container has no layout
- `.product-card` — product card has no background/border/padding
- `.product-card__name`, `.product-card__desc`, `.product-card__links`, `.product-card__link` — no styling
- `.product-form__field` — label + input have no vertical stack layout
- `.product-form__row` — repo/demo URL inputs not in flex row
- `.product-form__error` — validation errors have no color
- `.product-form__actions` — save/cancel buttons not flex row
- Form `input`/`textarea` inside `ur-dialog` — browser default white background, not dark theme

## Fix

Add missing CSS to `ProductsSectionComponent` styles array.

## References

- Component: `frontend/projects/feature-hackathons/src/lib/products-section/products-section.ts`
- Template: `frontend/projects/feature-hackathons/src/lib/products-section/products-section.html`

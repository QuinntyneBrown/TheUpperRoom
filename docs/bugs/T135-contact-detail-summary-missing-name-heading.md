# T135 — Contact detail page: summary card missing the contact's full name as a heading

**Status**: Fixed ✓

## Description

On `/contacts/:id`, the contact's name appears only in the breadcrumb ("Contacts / Jane Doe") but NOT as a prominent heading in the main content area. The summary card shows email, phone, and city but has no `<h1>` or `<h2>` with the full name.

Users who land on the detail page (e.g., from a search result) have to look at the small breadcrumb text to know whose record they're viewing.

## Fix

Add the contact's full name as a heading at the top of the `.contact-detail__summary` section.

## References

- Route: `/contacts/:id`
- Component: `frontend/projects/feature-contacts/src/lib/contact-detail-page/contact-detail-page.html`

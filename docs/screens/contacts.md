# Contacts (List)

The active contacts list with search, filter, deletion toast, and search result states.

## How to navigate

1. Sign in (see [sign-in](sign-in.md)).
2. From the side nav, click **Contacts** → `/contacts` (`uZess` / `CxTEa` / `zNrW2`).
3. To reach the variant states:
   - **Filter Sheet** (`FaD6I`) — on mobile, tap the filter icon in the page header.
   - **Deleted Toast** (`DC5tu`) — delete a contact (see [contact delete dialog](dialog-contact-delete-confirmation.md)); the list returns with the toast.
   - **Search Min Length** (`r6sAM`) — focus the search box and type 1 character.
   - **Search Loading** (`rKuy7`) — type ≥ minimum length; observed while the request is pending.
   - **Search Results with Highlights** (`DgUJ2`) / **Mobile Search Results** (`jsXJE`) — type a query that matches existing contacts.
   - **Search No Results** (`cpRf1`) — type a query that matches nothing.
   - **Search Error** (`zLsjJ`) — perform a search while the API errors.

## Designs

Frames in `docs/ui-design.pen`:

| Frame Name | Frame ID | Viewport | State |
| ---------- | -------- | -------- | ----- |
| Desktop / Contacts | `uZess` | Desktop 1440×1024 | Default list |
| Mobile / Contacts | `CxTEa` | Mobile 375×812 | Default list |
| Tablet / Contacts | `zNrW2` | Tablet 768×1024 | Default list |
| Mobile / Contacts - Filter Sheet | `FaD6I` | Mobile | Filter bottom sheet |
| Desktop / Contact List - Deleted Toast | `DC5tu` | Desktop | Toast after delete |
| Desktop / Contacts - Search Results with Highlights | `DgUJ2` | Desktop | Search results with term highlights |
| Mobile / Contacts - Search Results | `jsXJE` | Mobile | Search results |
| Desktop / Contacts - Search Min Length | `r6sAM` | Desktop | Below min query length |
| Desktop / Contacts - Search Loading | `rKuy7` | Desktop | Search loading |
| Desktop / Contacts - Search No Results | `cpRf1` | Desktop | No matches |
| Desktop / Contacts - Search Error | `zLsjJ` | Desktop | Search error |

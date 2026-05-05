# The Upper Room — UI Flows

Step-by-step instructions for every user-facing flow in the application.

---

## Table of Contents

1. [Authentication](#authentication)
   - [Register](#1-register)
   - [Verify Email](#2-verify-email)
   - [Sign In](#3-sign-in)
   - [Forgot Password](#4-forgot-password)
   - [Reset Password](#5-reset-password)
   - [Sign Out](#6-sign-out)
2. [Contacts](#contacts)
   - [View Contacts List](#7-view-contacts-list)
   - [Create Contact](#8-create-contact)
   - [View Contact Detail](#9-view-contact-detail)
   - [Edit Contact](#10-edit-contact)
   - [Delete Contact](#11-delete-contact)
   - [Search Contacts](#12-search-contacts)
   - [Add Note to Contact](#13-add-note-to-contact)
   - [Edit Contact Note](#14-edit-contact-note)
   - [Delete Contact Note](#15-delete-contact-note)
3. [Partners](#partners)
   - [View Partners List](#16-view-partners-list)
   - [View Partners Board (Kanban)](#17-view-partners-board-kanban)
   - [Create Partner](#18-create-partner)
   - [View Partner Detail](#19-view-partner-detail)
   - [Edit Partner](#20-edit-partner)
   - [Change Partner Stage](#21-change-partner-stage)
   - [Link Contact to Partner](#22-link-contact-to-partner)
   - [Delete Partner](#23-delete-partner)
4. [Hackathons](#hackathons)
   - [View Hackathons List](#24-view-hackathons-list)
   - [Create Hackathon](#25-create-hackathon)
   - [View Hackathon Detail](#26-view-hackathon-detail)
   - [Change Hackathon Stage (4 D's)](#27-change-hackathon-stage-4-ds)
   - [Edit Hackathon](#28-edit-hackathon)
   - [Add Hackathon Product](#29-add-hackathon-product)
   - [Delete Hackathon](#30-delete-hackathon)
5. [Team](#team)
   - [View Local Team](#31-view-local-team)
   - [Invite Team Member](#32-invite-team-member)
   - [Remove Team Member](#33-remove-team-member)
   - [Edit Member Roles](#34-edit-member-roles)
   - [View Global Teams](#35-view-global-teams)
6. [Dashboard](#dashboard)
   - [View Dashboard](#36-view-dashboard)
   - [Add Widget](#37-add-widget)
   - [Remove Widget](#38-remove-widget)
   - [Undo Remove Widget](#39-undo-remove-widget)
   - [Reorder / Resize Widgets](#40-reorder--resize-widgets)

---

## Authentication

### 1. Register

**Route:** `/auth/register`

1. Navigate to `/auth/register` (or follow a team invite link — the token is pre-filled automatically).
2. Fill in all required fields:
   - **Display Name** — your full name as it will appear to teammates.
   - **Email** — must be a valid, unique address.
   - **Password** — minimum 12 characters; must include uppercase, lowercase, a digit, and a symbol.
   - **City** — the city you represent.
3. Click **Create account**.
4. The button shows "Creating account…" while the request is in flight.
5. **Success:** A confirmation banner appears — "Check your inbox." Open the verification email and click the link to activate your account.
6. **If you used an invite link:** Email verification is skipped; you are taken directly to the dashboard.
7. **Errors:**
   - Field validation errors appear below the relevant input.
   - Duplicate email returns a generic error without confirming whether the address exists.
   - Server errors show a toast: "Registration failed. Please try again."

---

### 2. Verify Email

**Route:** `/auth/verify?token={token}` (arrived via email link)

1. Open the verification email sent after registration.
2. Click the activation link.
3. The page shows "Verifying email…" with a spinner.
4. **Success:** Redirected to `/auth/sign-in`.
5. **Failure (expired or already-used link):** An error message is displayed; request a new verification email if needed.

---

### 3. Sign In

**Route:** `/auth/sign-in`

1. Navigate to `/auth/sign-in`.
   - If you were redirected from a protected page, an info banner reminds you where you were headed.
2. Enter your **Email** and **Password**.
3. Click **Sign in**.
4. The button shows "Signing in…" while the request processes.
5. **Success:** Redirected to `/dashboard` (or the original destination if redirected).
6. **Errors:**
   - Unverified account: "Please verify your email before signing in."
   - Wrong credentials: "Invalid email or password."
   - Too many failed attempts (5+ within 15 minutes): Account temporarily locked.

---

### 4. Forgot Password

**Route:** `/auth/forgot-password`

1. On the sign-in page, click **Forgot password?**
2. Enter your **Email** address.
3. Click **Submit** (button shows "Sending…").
4. A generic success message is always shown: "If an email exists, a password reset link has been sent."
5. Open your email and click the reset link (valid for 60 minutes).

---

### 5. Reset Password

**Route:** `/auth/reset?token={token}&email={email}` (arrived via email link)

1. Click the reset link in your email.
2. The page loads with your email pre-filled (read-only).
3. Enter a **New Password** (must meet strength requirements).
4. Click **Reset Password** (button shows "Resetting…").
5. **Success:** All existing sessions are invalidated; redirected to `/auth/sign-in`.
6. **Errors:**
   - Expired or already-used link: "The link is expired or has already been used."
   - Weak password: Field-level error shown.

---

### 6. Sign Out

**Triggered from:** Header menu (any authenticated page)

1. Click your account menu or the sign-out button in the header.
2. Session is invalidated on the server.
3. Session cookie is cleared; SignalR connection is closed.
4. Redirected to `/auth/sign-in`.

---

## Contacts

### 7. View Contacts List

**Route:** `/contacts`

1. Click **Contacts** in the navigation.
2. The page loads a table of contacts (25 per page, sorted by last name ascending by default).
3. A brief loading skeleton is shown while data fetches.
4. **Columns:** First Name | Last Name | Email | City.
5. Click any column header to sort ascending; click again to sort descending.
6. Use **Previous** / **Next** buttons at the bottom to page through results.
7. Click any row to open the contact detail page.

---

### 8. Create Contact

**Triggered from:** "New contact" button on the contacts list

1. Click **New contact**.
2. Fill in the form:
   - **First Name** *(required)*
   - **Last Name** *(required)*
   - **Email** *(optional)*
   - **Phone** *(optional — E.164 format)*
   - **City** *(optional)*
   - **Notes** *(optional — max 4,000 characters)*
3. Click **Save**.
4. The button shows "Saving…" while the request processes.
5. **Success:** Redirected to the new contact's detail page; a "Contact saved" toast appears.
6. **Errors:**
   - Validation errors appear below the affected field.
   - Server errors show a toast: "Error creating contact."

---

### 9. View Contact Detail

**Route:** `/contacts/:id`

1. Click a contact row in the list (or navigate directly to the URL).
2. The page displays:
   - Full name, email, phone, city.
   - Created date, last modified date, and who made each change.
   - A notes panel (most-recent note at the top).
3. If you lack delete permission, an info banner indicates that.
4. Use the **Edit** button to open the edit form.
5. Use the **Delete** button (if visible) to begin the delete flow.

---

### 10. Edit Contact

**Route:** `/contacts/:id/edit`

1. On the contact detail page, click **Edit**.
2. The form opens pre-populated with the current values.
3. Modify any fields.
4. Click **Save**.
5. **Success:** Redirected to the detail page; "Contact saved" toast appears.
6. **Conflict (someone else edited the contact simultaneously):**
   - A conflict dialog shows your pending changes (left) versus the server's current values (right).
   - Choose **Keep mine** to retry with the latest server version, or **Discard mine** to abandon your changes.
7. **Errors:** Field-level messages or a general error toast.

---

### 11. Delete Contact

**Triggered from:** Contact detail page (requires City Lead or Admin role)

1. On the contact detail page, click **Delete**.
2. A confirmation dialog appears: "Delete this contact? This cannot be undone."
3. Click **Delete** to confirm.
4. The contact is soft-deleted (removed from all lists immediately).
5. Redirected to `/contacts`; a "Contact deleted" toast appears.

---

### 12. Search Contacts

**Triggered from:** Search box on the contacts list

1. Click the search box on the contacts list page.
2. Type at least 2 characters.
3. Results appear after a 250 ms pause (searches first name, last name, email, phone, and note content).
4. Each result shows the contact's name, city, and a snippet with the matched text highlighted.
5. Click a result to open the contact detail page.
6. Click **Clear search** (or delete the text) to return to the full list.

---

### 13. Add Note to Contact

**Triggered from:** Notes panel on the contact detail page

1. On the contact detail page, scroll to the **Notes** panel.
2. Click the "Add a note" text area.
3. Type your note (1–4,000 characters; a character counter is shown).
4. Click **Add**.
5. **Success:** The note appears at the top of the list with your name and the current timestamp.
6. **Error:** Toast shows "Failed to add note."

---

### 14. Edit Contact Note

**Triggered from:** Edit icon on a note (own notes, or if you are a City Lead / Admin)

1. Click the edit icon on the note you want to change.
2. The note text becomes an editable text area.
3. Make your changes.
4. Click **Save**.
5. **Success:** Note is updated in place.
6. **Error:** Toast shown.

---

### 15. Delete Contact Note

**Triggered from:** Delete icon on a note (own notes, or if you are a City Lead / Admin)

1. Click the delete icon on the note.
2. A confirmation prompt appears: "Delete this note?"
3. Click **Confirm**.
4. **Success:** Note is removed from the list.
5. **Error:** Toast shown.

---

## Partners

### 16. View Partners List

**Route:** `/partners`

1. Click **Partners** in the navigation.
2. The page loads all partners as cards, each showing: name, city, and funnel stage.
3. Use the **stage filter chips** (Lead / In Funnel / Confirmed) to narrow the list; multiple chips can be active simultaneously.
4. Click a card to open the partner detail page.
5. **Empty state:** "No partners found" with an **Add first partner** button.

---

### 17. View Partners Board (Kanban)

**Route:** `/partners/board`

1. Navigate to **Partners → Board** (or `/partners/board`).
2. Three columns are displayed: **Lead** | **In Funnel** | **Confirmed**.
3. Each column shows a card count and the partner cards within it.
4. **Desktop:** Drag a card from one column and drop it into another to change the partner's stage.
   - A loading state shows while the change is saved.
   - If the save fails, the card snaps back and an error toast is shown.
5. **Mobile:** Drag-and-drop is not available; use the stage selector on the partner detail page instead.
6. Other connected users see stage changes in real time (within ~2 seconds).

---

### 18. Create Partner

**Triggered from:** "Add Partner" button on the partners list

1. Click **Add Partner**.
2. Fill in the form:
   - **Organization Name** *(required)*
   - **City** *(required)*
   - **Website** *(optional — must start with http:// or https://)*
   - **Funnel Stage** *(required — defaults to "Lead")*
   - **Description** *(optional)*
3. Click **Save** (button shows "Saving…").
4. **Success:** Redirected to the new partner's detail page; "Partner saved" toast appears.
5. **Errors:** Field-level messages or a general error toast.

---

### 19. View Partner Detail

**Route:** `/partners/:id`

1. Click a partner card from the list or board.
2. The page displays:
   - Organization name, website (clickable), city.
   - Current funnel stage and a stage history timeline.
   - An **Associated Contacts** section listing linked contacts.
   - A **Notes** panel (identical to contact notes).
3. Use **Edit** to modify the partner or **Delete** to remove it.

---

### 20. Edit Partner

**Route:** `/partners/:id/edit`

1. On the partner detail page, click **Edit**.
2. The form pre-populates with current values.
3. Modify fields as needed.
4. Click **Save**.
5. **Success:** Redirected to the detail page; "Partner saved" toast appears.
6. **Errors:** Field-level messages or a general error toast.

---

### 21. Change Partner Stage

**Triggered from:** Stage selector on the partner detail page

1. On the partner detail page, locate the **Funnel Stage** selector.
2. Click the desired stage: **Lead**, **In Funnel**, or **Confirmed**.
3. The stage updates immediately.
4. A new entry is added to the stage history timeline: "Changed from X to Y by [You] at [Time]."
5. A "Stage updated" toast appears.
6. Other connected users see the change in real time.
7. **Error:** Stage reverts to the previous value; error toast shown.

---

### 22. Link Contact to Partner

**Triggered from:** Partner detail → Associated Contacts section

1. On the partner detail page, click **Add Contact** in the Associated Contacts section.
2. A dialog appears with two options:
   - **Link Existing Contact:** Search for and select a contact from your team's list.
   - **Create New Contact:** Fill in a short contact form to create and link in one step.
3. Select or create the contact.
4. Click **Link** (or **Save** for a new contact).
5. **Success:** The contact appears in the Associated Contacts list; "Contact linked" toast shown.
6. To remove a contact link, click the **Remove** button next to that contact (the contact itself is not deleted).

---

### 23. Delete Partner

**Triggered from:** Partner detail page (requires City Lead or Admin role)

1. On the partner detail page, click **Delete**.
2. Confirmation dialog: "Delete this partner? Associated contacts will be unlinked but not deleted."
3. Click **Delete** to confirm.
4. The partner is soft-deleted; associated contacts are detached but remain in the contacts list.
5. Redirected to `/partners`; "Partner deleted" toast appears.

---

## Hackathons

### 24. View Hackathons List

**Route:** `/hackathons`

1. Click **Hackathons** in the navigation.
2. The page loads a list of hackathons showing: title, host city, start/end dates, and current 4 D's stage.
3. Click a row to open the hackathon detail page.
4. **Empty state:** Shows an encouraging message with a **Create Hackathon** button.

---

### 25. Create Hackathon

**Triggered from:** "Create Hackathon" button on the hackathons list

1. Click **Create Hackathon**.
2. Fill in the form:
   - **Title** *(required)*
   - **Start Date** *(required — date picker)*
   - **End Date** *(required — must be on or after start date)*
   - **Host City** *(required)*
   - **Associated Partners** *(optional — multi-select checkbox list)*
3. Click **Create** (button shows "Saving…").
4. **Success:** Redirected to the new hackathon detail page (starts in the **Discover** stage); "Hackathon saved" toast appears.
5. **Errors:** Field-level messages (e.g., "End date must be after start date") or a general error toast.

---

### 26. View Hackathon Detail

**Route:** `/hackathons/:id`

1. Click a hackathon from the list.
2. The page displays:
   - Title, host city, start and end dates.
   - A **4 D's progress indicator**: Discover → Design → Develop → Deploy (current stage highlighted).
   - A stage history timeline.
   - An **Associated Partners** section.
   - A **Products** section listing software built during the hackathon.
3. Use **Edit** to modify details or **Delete** to remove the hackathon.
4. Stage changes made by other users appear in real time.

---

### 27. Change Hackathon Stage (4 D's)

**Triggered from:** Stage indicator on the hackathon detail page

1. On the hackathon detail page, locate the **4 D's** stage indicator.
2. Click the stage you want to move to: **Discover**, **Design**, **Develop**, or **Deploy**.
3. The stage updates immediately.
4. A history entry is added: "Changed from X to Y by [You] at [Time]."
5. "Stage updated" toast appears.
6. Other connected users see the change in real time.
7. **Error:** Stage reverts; error toast shown.

---

### 28. Edit Hackathon

**Route:** `/hackathons/:id/edit`

1. On the hackathon detail page, click **Edit**.
2. The form pre-populates with current values (title, dates, city, associated partners).
3. Modify fields as needed.
4. Click **Save**.
5. **Success:** Redirected to the detail page; "Hackathon saved" toast appears.
6. **Errors:** Field-level messages or a general error toast.

---

### 29. Add Hackathon Product

**Triggered from:** Products section on the hackathon detail page

1. On the hackathon detail page, scroll to **Products**.
2. Click **Add Product**.
3. A dialog appears with fields:
   - **Product Name** *(required)*
   - **Description** *(optional)*
   - **Repository / Demo Link** *(optional)*
4. Fill in the fields and click **Add**.
5. **Success:** The product appears in the Products list.
6. Each product can be edited or deleted via icons on its card (if you have permission).

---

### 30. Delete Hackathon

**Triggered from:** Hackathon detail page (requires City Lead or Admin role)

1. On the hackathon detail page, click **Delete**.
2. Confirmation dialog appears.
3. Click **Delete** to confirm.
4. The hackathon is soft-deleted.
5. Redirected to `/hackathons`; "Hackathon deleted" toast appears.

---

## Team

### 31. View Local Team

**Route:** `/team`

1. Click **Team** (or **My Team**) in the navigation.
2. The page loads your city team's member list.
3. Each card shows the member's name and their assigned roles.
4. If you are a City Lead or Admin, an **Invite Member** button appears in the header and a **Remove** button appears on each member card.

---

### 32. Invite Team Member

**Triggered from:** "Invite Member" button on the local team page (City Lead or Admin only)

1. Click **Invite Member**.
2. A dialog appears with:
   - **Email** *(required)*
   - **Roles** *(required — check at least one)*:
     - City Lead
     - Prayer Lead
     - Event Lead
     - Communication Lead
3. Enter the invitee's email and select their role(s).
4. Click **Invite** (button shows "Sending…").
5. **Success:** Dialog closes; team list refreshes; "Invitation sent" toast appears.
   - The invitee receives an email with a registration link containing their invite token.
   - Once they register, they are added to the team and email verification is skipped.
6. **Errors:** Email field error or a general error toast.

---

### 33. Remove Team Member

**Triggered from:** Remove button on a member card (City Lead or Admin only)

1. On the local team page, click **Remove** on the member's card.
2. Confirmation dialog: "Remove this team member? They will lose access."
3. Click **Remove** to confirm (button shows "Removing…").
4. **Success:** Member removed from the list; "Member removed" toast appears.
5. **Error:** Error toast shown.

---

### 34. Edit Member Roles

**Triggered from:** Edit icon on a member card (City Lead or Admin only)

1. On the local team page, click the edit icon on a member card.
2. A dialog opens showing the member's current roles as checkboxes.
3. Check or uncheck roles:
   - City Lead
   - Prayer Lead
   - Event Lead
   - Communication Lead
4. Click **Save**.
5. **Success:** Roles updated immediately; they take effect on the member's next request.
6. **Error:** Error toast shown.

---

### 35. View Global Teams

**Route:** `/teams`

1. Click **Teams** (or **Cities**) in the navigation.
2. The page loads all city teams globally.
3. Each team shows: city name, role counts, and active hackathon count.
   - No private data (contacts, partner notes) is visible.
4. Type in the search bar (≥2 characters, 300 ms debounce) to filter by city name.
5. Click a team to view its read-only detail page.
6. Use pagination controls if there are more than 25 teams.

---

## Dashboard

### 36. View Dashboard

**Route:** `/dashboard`

1. Sign in; you are taken to `/dashboard` by default.
2. Your personalized dashboard loads, showing a grid of widgets.
3. **Empty state:** "Your dashboard is empty. Add your first widget!" with an **Add Widget** button.
4. Connection status is visible in the header; real-time updates arrive automatically.

---

### 37. Add Widget

**Triggered from:** "Add Widget" button on the dashboard

1. Click **Add Widget**.
2. A widget catalog dialog opens showing available widget types (e.g., Line Chart).
3. Each widget type shows a preview and short description.
4. Click the widget you want to add.
5. The widget is placed on the dashboard grid.
6. The layout is auto-saved; a "Widget added" toast appears.

---

### 38. Remove Widget

**Triggered from:** Remove (×) button on a widget's header

1. On the dashboard, click the **×** button in the top-right corner of the widget you want to remove.
2. The widget is removed from the grid immediately.
3. An "Undo" toast appears: "Widget removed — **Undo**" (auto-dismisses after 8 seconds).

---

### 39. Undo Remove Widget

**Triggered from:** "Undo" button in the removal toast

1. After removing a widget, click **Undo** in the toast before it disappears (8-second window).
2. The widget is restored to its previous position.
3. Layout is saved automatically.

---

### 40. Reorder / Resize Widgets

**Triggered from:** Dragging widgets on the dashboard

1. **Reorder:** Click and hold a widget, then drag it to a new position in the grid. Release to drop.
2. **Resize:** Click and drag the resize handle in the widget's bottom-right corner to change its dimensions.
3. After you stop dragging, the layout is auto-saved after a 300 ms delay.
4. **Success:** "Dashboard saved" toast appears briefly.
5. **Failure:** "Failed to save dashboard" toast with a **Retry** button.

---

## Common UI Patterns

| Pattern | Behavior |
|---|---|
| **Loading state** | Button text changes to "Saving…" / "Loading…"; spinner shown |
| **Success toast** | Green, appears bottom-left, auto-dismisses after ~3 seconds |
| **Error toast** | Red, appears bottom-left, may include a Retry button |
| **Confirmation dialogs** | Always appear before destructive actions (delete, remove) |
| **Field validation** | Errors appear below the field; submit button disabled until corrected |
| **Real-time updates** | Changes by other users arrive via SignalR within ~2 seconds, no refresh needed |
| **Conflict resolution** | Side-by-side diff dialog when two users edit the same record simultaneously |
| **Pagination** | 25 items per page; Previous / Next controls at the bottom of lists |
| **Search debounce** | 250–300 ms delay after the last keystroke before a search fires |

---

## Role Permissions Summary

| Action | Admin | City Lead | Event Lead | Communication Lead | Prayer Lead |
|---|:---:|:---:|:---:|:---:|:---:|
| Create / edit contacts | ✓ | ✓ | ✓ | ✓ | — |
| Delete contacts | ✓ | ✓ | — | — | — |
| Manage partners | ✓ | ✓ | ✓ | ✓ | — |
| Delete partners | ✓ | ✓ | — | — | — |
| Manage hackathons | ✓ | ✓ | ✓ | — | — |
| Delete hackathons | ✓ | ✓ | — | — | — |
| Invite / remove members | ✓ | ✓ | — | — | — |
| Edit member roles | ✓ | ✓ | — | — | — |
| Add notes | ✓ | ✓ | ✓ | ✓ | ✓ |
| Read-only access | ✓ | ✓ | ✓ | ✓ | ✓ |

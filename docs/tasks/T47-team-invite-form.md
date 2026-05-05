# T47 — Team invite form

**Status**: Accepted
**Phase**: 6 — Team administration and authorization
**Area**: Team
**Requirements**: L1-006, L2-027
**Source**: Screen-Level Missing Inventory — "Team invite form"

## Goal

Replace the placeholder "+ Invite member" button with a functional invite flow.

## Scope

- Invite dialog: email, optional display-name suggestion, role selection (City Lead, Prayer Lead, Event Lead, Communication Lead).
- Submitting, validation-error, and success states.
- Sent confirmation toast and listing the pending invite in a "Pending invites" subsection.
- Forbidden state for non-leads.
- Resend / revoke invite actions on pending invites.

## Acceptance criteria

- [ ] Invite dialog designed with all states.
- [ ] Pending-invite list UI on the team screen.
- [ ] Invite-link completion (signup landing) state designed (links to T01/T02).
- [ ] Mobile variant per T21.

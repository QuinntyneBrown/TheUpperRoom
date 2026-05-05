# T08 — 401 unauthenticated state

**Status**: Accepted
**Phase**: 1 — Authentication and session edge states
**Area**: Authorization
**Requirements**: L1-002, L2-007
**Source**: Screen-Level Missing Inventory — "401 unauthenticated state"

## Goal

Distinct from the existing 403 access-denied screen, define what the user sees when an API call returns 401 and the route guard cannot resolve a valid session.

## Scope

- Route-guard redirect to sign-in with a "Please sign in to continue" toast.
- Optional 401 standalone screen for direct deep-link visits when refresh fails.
- Loading/redirect intermediate state (spinner + neutral copy) so the flicker is not jarring.

## Acceptance criteria

- [ ] `Desktop / Sign In - Returning` (or sign-in with toast) shows the redirect copy.
- [ ] Route-guard loading state exists as a documented frame or annotation.
- [ ] Distinct from 403 access denied (T53).

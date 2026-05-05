// Traces to: 78 - Playwright POM foundation
// L2-063: verifies fixture wiring — auth and contacts page objects are reachable
import { expect, test } from '../fixtures';

test('auth page object exposes signIn', ({ auth }) => {
  expect(typeof auth.signIn).toBe('function');
});

test('contacts page object exposes openCreateForm', ({ contacts }) => {
  expect(typeof contacts.openCreateForm).toBe('function');
});

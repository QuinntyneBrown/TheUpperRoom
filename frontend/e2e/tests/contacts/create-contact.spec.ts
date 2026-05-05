// Traces to: 08 — Create Contact
// L2-009 AC: city lead creates contact, redirected to contact detail; validation errors shown
import { test, expect } from '../../fixtures';

test.describe('Create Contact', () => {
  test('city lead creates a contact and is redirected to detail page', async ({ page, contacts }) => {
    await contacts.gotoCreate();
    await contacts.fillForm({ firstName: 'Ava', lastName: 'Lee', notes: 'Met at partner kickoff.' });
    await contacts.submit();
    await expect(page).toHaveURL(/\/contacts\/[a-f0-9-]+/);
  });

  test('missing first name shows validation error', async ({ page, contacts }) => {
    await contacts.gotoCreate();
    await contacts.fillForm({ firstName: '', lastName: 'Lee' });
    await contacts.submit();
    await expect(page.getByText(/first name.*required/i)).toBeVisible();
  });

  test('invalid email shows field-level error', async ({ page, contacts }) => {
    await contacts.gotoCreate();
    await contacts.fillForm({ firstName: 'Ava', lastName: 'Lee', email: 'not-an-email' });
    await contacts.submit();
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });
});

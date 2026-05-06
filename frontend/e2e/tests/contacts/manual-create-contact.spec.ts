// Ad-hoc create-contact verification driven by Playwright CLI.
// Signs in as city lead, creates a contact, then asserts the API confirms it persisted.
import { test, expect } from '../../fixtures';

test.describe('@manual create contact persists', () => {
  test('city lead creates a contact and it appears via API', async ({ auth, contacts, page }) => {
    const suffix = Date.now();
    const firstName = `Ada${suffix}`;
    const lastName = 'Lovelace';
    const email = `ada+${suffix}@example.test`;

    await auth.signInAs('city-lead');
    await contacts.gotoCreate();
    await contacts.fillForm({ firstName, lastName, email, phone: '555-0142' });
    await contacts.submit();
    await page.waitForURL(/\/contacts\/[a-f0-9-]+$/);

    const id = page.url().match(/contacts\/([a-f0-9-]+)$/)?.[1];
    expect(id).toBeTruthy();

    const apiResp = await page.request.get(`/api/contacts/${id}`);
    expect(apiResp.ok()).toBeTruthy();
    const body = await apiResp.json();
    expect(body.firstName).toBe(firstName);
    expect(body.lastName).toBe(lastName);
    expect(body.email).toBe(email);
  });
});

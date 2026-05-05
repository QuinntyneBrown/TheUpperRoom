// T101 — role chips should show display labels, not raw enum values
import { test, expect } from '../../fixtures';

const MOCK_MEMBERS = [
  { id: 'm1', displayName: 'Alice Brown', roles: ['PrayerLead', 'EventLead'], email: 'alice@example.com', isActive: true },
];

test.describe('Role chip display labels', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/teams/local', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_MEMBERS) });
    });
    await page.goto('/team');
  });

  test('shows "Prayer Lead" not "PrayerLead"', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Prayer Lead' }).first()).toBeVisible();
  });

  test('shows "Event Lead" not "EventLead"', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Event Lead' }).first()).toBeVisible();
  });

  test('shows "Communication Lead" not "CommunicationLead"', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Communication Lead' }).first()).toBeVisible();
  });
});

// Traces to: T113 — Invite dialog role checkboxes show raw enum values
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Invite dialog role labels', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test.beforeEach(async ({ page, auth }) => {
    await auth.signInAs('city-lead');
    await page.goto('/team');
    await page.getByTestId('invite-member-button').click();
  });

  test('shows "City Lead" not "CityLead"', async ({ page }) => {
    await expect(page.getByTestId('invite-dialog')).toContainText('City Lead');
    await expect(page.getByTestId('invite-dialog')).not.toContainText('CityLead');
  });

  test('shows "Prayer Lead" not "PrayerLead"', async ({ page }) => {
    await expect(page.getByTestId('invite-dialog')).toContainText('Prayer Lead');
    await expect(page.getByTestId('invite-dialog')).not.toContainText('PrayerLead');
  });

  test('shows "Event Lead" not "EventLead"', async ({ page }) => {
    await expect(page.getByTestId('invite-dialog')).toContainText('Event Lead');
    await expect(page.getByTestId('invite-dialog')).not.toContainText('EventLead');
  });

  test('shows "Communication Lead" not "CommunicationLead"', async ({ page }) => {
    await expect(page.getByTestId('invite-dialog')).toContainText('Communication Lead');
    await expect(page.getByTestId('invite-dialog')).not.toContainText('CommunicationLead');
  });
});

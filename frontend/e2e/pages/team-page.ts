import { expect, Page } from '@playwright/test';

export class TeamPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/team');
  }

  async invite(email: string) {
    await this.goto();
    await this.page.getByTestId('invite-member-button').click();
    await this.page.getByLabel('Email address').fill(email);
    await this.page.getByLabel('PrayerLead').check();
    await this.page.getByRole('button', { name: /send invite/i }).click();
    await expect(this.page.getByTestId('invite-dialog')).not.toBeVisible();
  }

  private async memberRowByEmail(email: string) {
    await this.goto();
    return this.page.getByRole('row').filter({ hasText: email }).first();
  }

  async assertSelfRole(role: string) {
    await this.goto();
    await expect(this.page.getByTestId(`role-chip-${role}`).filter({ hasAttribute: 'aria-pressed', value: 'true' }).first()).toBeVisible();
  }

  async assignRole(email: string, role: string) {
    const row = await this.memberRowByEmail(email);
    const chip = row.getByTestId(`role-chip-${role}`);
    if ((await chip.getAttribute('aria-pressed')) !== 'true') {
      await chip.click();
      await expect(chip).toHaveAttribute('aria-pressed', 'true');
    }
  }

  async revokeRole(email: string, role: string) {
    const row = await this.memberRowByEmail(email);
    const chip = row.getByTestId(`role-chip-${role}`);
    if ((await chip.getAttribute('aria-pressed')) === 'true') {
      await chip.click();
      await expect(chip).toHaveAttribute('aria-pressed', 'false');
    }
  }

  async remove(email: string) {
    const row = await this.memberRowByEmail(email);
    await row.getByRole('button', { name: /remove/i }).click();
    await this.page.getByRole('button', { name: /confirm remove/i }).click();
    await expect(this.page.getByRole('row').filter({ hasText: email })).not.toBeVisible();
  }
}

import { expect, Page } from '@playwright/test';
import { AuthPages } from './auth-pages';

export class AdminPage {
  private auth: AuthPages;

  constructor(private page: Page) {
    this.auth = new AuthPages(page);
  }

  async signInAs(role: 'admin') {
    await this.auth.signInAs(role);
  }

  deletedContacts = {
    assertContains: async (name: string) => {
      await this.page.goto('/admin/contacts/deleted');
      await expect(this.page.getByRole('row').filter({ hasText: name }).first()).toBeVisible();
    },
    restore: async (name: string) => {
      await this.page.goto('/admin/contacts/deleted');
      const row = this.page.getByRole('row').filter({ hasText: name }).first();
      await row.locator('[data-testid^="restore-contact-"]').click();
      await expect(row).not.toBeVisible();
    },
  };

  deletedHackathons = {
    assertContains: async (title: string) => {
      await this.page.goto('/admin/hackathons/deleted');
      await expect(this.page.getByRole('row').filter({ hasText: title }).first()).toBeVisible();
    },
    restore: async (title: string) => {
      await this.page.goto('/admin/hackathons/deleted');
      const row = this.page.getByRole('row').filter({ hasText: title }).first();
      await row.locator('[data-testid^="restore-hackathon-"]').click();
      await expect(row).not.toBeVisible();
    },
  };
}

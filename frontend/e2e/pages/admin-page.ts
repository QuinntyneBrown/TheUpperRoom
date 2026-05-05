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
      await row.getByRole('button', { name: /restore/i }).click();
      await expect(row).not.toBeVisible();
    },
  };
}

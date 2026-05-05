import { Page } from '@playwright/test';

export class ContactsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/contacts');
  }

  async openCreateForm() {
    await this.goto();
    await this.page.getByTestId('create-contact-button').click();
  }

  createForm() {
    return this.page.getByTestId('contact-create-form');
  }

  contactCard(name: string) {
    return this.page.getByTestId(`contact-card-${name}`);
  }

  searchInput() {
    return this.page.getByTestId('contact-search-input');
  }
}

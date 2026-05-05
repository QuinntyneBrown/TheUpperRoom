import { Page } from '@playwright/test';

export class PartnersPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/partners');
  }

  async openCreateForm() {
    await this.goto();
    await this.page.getByTestId('create-partner-button').click();
  }

  createForm() {
    return this.page.getByTestId('partner-create-form');
  }

  partnerCard(name: string) {
    return this.page.getByTestId(`partner-card-${name}`);
  }

  board() {
    return this.page.getByTestId('partner-board');
  }
}

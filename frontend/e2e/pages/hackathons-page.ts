import { Page } from '@playwright/test';

export class HackathonsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/hackathons');
  }

  async openCreateForm() {
    await this.goto();
    await this.page.getByTestId('create-hackathon-button').click();
  }

  createForm() {
    return this.page.getByTestId('hackathon-create-form');
  }

  hackathonCard(name: string) {
    return this.page.getByTestId(`hackathon-card-${name}`);
  }
}

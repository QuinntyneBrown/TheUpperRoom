import { Page } from '@playwright/test';

export class TeamPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/team');
  }

  memberRow(email: string) {
    return this.page.getByTestId(`team-member-${email}`);
  }

  inviteButton() {
    return this.page.getByTestId('invite-member-button');
  }

  inviteForm() {
    return this.page.getByTestId('invite-member-form');
  }
}

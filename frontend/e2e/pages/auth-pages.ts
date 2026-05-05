import { Page } from '@playwright/test';

export class AuthPages {
  constructor(private page: Page) {}

  async signIn(email: string, password: string) {
    await this.page.goto('/sign-in');
    await this.page.getByTestId('email-input').fill(email);
    await this.page.getByTestId('password-input').fill(password);
    await this.page.getByTestId('sign-in-submit').click();
  }

  async signUp(email: string, password: string) {
    await this.page.goto('/sign-up');
    await this.page.getByTestId('email-input').fill(email);
    await this.page.getByTestId('password-input').fill(password);
    await this.page.getByTestId('sign-up-submit').click();
  }

  async signOut() {
    await this.page.getByTestId('profile-menu-trigger').click();
    await this.page.getByTestId('sign-out-button').click();
    await this.page.getByTestId('sign-out-confirm').click();
  }
}

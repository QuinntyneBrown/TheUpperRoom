import { Page } from '@playwright/test';

export class AuthPages {
  constructor(private page: Page) {}

  async signIn(email: string, password: string) {
    await this.page.goto('/sign-in');
    await this.page.getByTestId('email-input').fill(email);
    await this.page.getByTestId('password-input').fill(password);
    await this.page.getByTestId('sign-in-submit').click();
  }

  async signUp(opts: { email: string; password: string; displayName: string; city: string }) {
    await this.page.goto('/auth/register');
    await this.page.getByLabel('Display name').fill(opts.displayName);
    await this.page.getByLabel('Email').fill(opts.email);
    await this.page.getByLabel('Password').fill(opts.password);
    await this.page.getByLabel('City').fill(opts.city);
    await this.page.getByRole('button', { name: /create account/i }).click();
  }

  async signOut() {
    await this.page.getByTestId('profile-menu-trigger').click();
    await this.page.getByTestId('sign-out-button').click();
    await this.page.getByTestId('sign-out-confirm').click();
  }
}

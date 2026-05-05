import { Page } from '@playwright/test';

export class AuthPages {
  constructor(private page: Page) {}

  async register(opts: { email: string; password: string; displayName: string; teamName?: string; city?: string }) {
    await this.page.goto('/auth/register');
    await this.page.getByLabel('Display name').fill(opts.displayName);
    await this.page.getByLabel('Email').fill(opts.email);
    await this.page.getByLabel('Password').fill(opts.password);
    await this.page.getByLabel('City').fill(opts.city ?? opts.teamName ?? 'Test City');
    await this.page.getByRole('button', { name: /create account/i }).click();
  }

  async signUp(opts: { email: string; password: string; displayName: string; city: string }) {
    return this.register({ ...opts });
  }

  async verifyEmail(link: string) {
    await this.page.goto(link);
  }

  async signIn(email: string, password: string) {
    await this.page.goto('/auth/sign-in');
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: /sign in/i }).click();
  }

  async signOut() {
    await this.page.getByTestId('profile-menu-trigger').click();
    await this.page.getByTestId('sign-out-button').click();
  }

  async assertOnDashboard() {
    await this.page.waitForURL(/\/dashboard/);
  }

  async assertOnSignIn() {
    await this.page.waitForURL(/\/auth\/sign-in/);
  }

  async expireSession() {
    // Plant an invalid auth cookie to simulate a server-expired token
    await this.page.context().addCookies([{
      name: '.AspNetCore.Identity.Application',
      value: 'expired-invalid-token',
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
    }]);
  }

  async tryNavigateToDashboard() {
    await this.page.goto('/dashboard');
  }

  async signInAs(role: 'city-lead' | 'admin') {
    await this.page.request.post('/api/dev/seed');
    const creds: Record<string, { email: string; password: string }> = {
      'city-lead': { email: 'cityLead@test.com', password: 'Str0ng!Pass#99' },
      'admin': { email: 'admin@test.com', password: 'Str0ng!Pass#99' },
    };
    const { email, password } = creds[role];
    await this.signIn(email, password);
    await this.assertOnDashboard();
  }
}

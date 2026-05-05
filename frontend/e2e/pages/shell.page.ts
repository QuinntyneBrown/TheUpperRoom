import { Page } from '@playwright/test';

export class ShellPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  sideNav() {
    return this.page.getByTestId('side-nav');
  }

  hamburger() {
    return this.page.getByTestId('hamburger');
  }

  bottomNav() {
    return this.page.getByTestId('bottom-nav');
  }

  async hasNoHorizontalScroll() {
    return this.page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth
    );
  }
}

import { Page } from '@playwright/test';

export class GlobalSearchOverlay {
  constructor(private page: Page) {}

  async open() {
    await this.page.getByTestId('global-search-trigger').click();
  }

  input() {
    return this.page.getByTestId('global-search-input');
  }

  results() {
    return this.page.getByTestId('global-search-results');
  }

  result(index: number) {
    return this.page.getByTestId(`global-search-result-${index}`);
  }
}

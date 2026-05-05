import { expect, Page } from '@playwright/test';

export class GlobalSearchOverlay {
  constructor(private page: Page) {}

  async open() {
    await this.page.getByTestId('global-search-trigger').click();
    await expect(this.page.getByTestId('search-overlay')).toBeVisible();
  }

  async query(term: string) {
    await this.page.getByTestId('search-input').fill(term);
    await this.page.waitForTimeout(400); // debounce
  }

  async assertGroups(groups: string[]) {
    for (const group of groups) {
      await expect(this.page.getByTestId('search-results').getByText(group)).toBeVisible();
    }
  }

  async selectResult(label: string) {
    await this.page.getByTestId('search-results').getByText(label).click();
  }

  async assertNavigatedTo(pattern: RegExp) {
    await this.page.waitForURL(pattern);
  }

  input() {
    return this.page.getByTestId('search-input');
  }

  results() {
    return this.page.getByTestId('search-results');
  }

  result(index: number) {
    return this.page.getByTestId(`global-search-result-${index}`);
  }
}

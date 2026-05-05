import { Page } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/dashboard');
  }

  grid() {
    return this.page.getByTestId('dashboard-grid');
  }

  addWidgetButton() {
    return this.page.getByTestId('add-widget-button');
  }

  widget(id: string) {
    return this.page.getByTestId(`widget-${id}`);
  }
}

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

  emptyState() {
    return this.page.getByTestId('dashboard-empty');
  }

  addWidgetCta() {
    return this.page.getByTestId('add-widget-cta');
  }

  addWidgetHeaderBtn() {
    return this.page.getByTestId('add-widget-btn');
  }

  catalogDialog() {
    return this.page.getByTestId('widget-catalog-dialog');
  }

  catalogItem(type: string) {
    return this.page.getByTestId(`widget-type-${type}`);
  }

  anyWidget() {
    return this.page.locator('[data-testid^="widget-"]').first();
  }
}

import { expect, Page } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/dashboard');
  }

  async assertEmpty() {
    await expect(this.page.getByTestId('dashboard-empty')).toBeVisible();
  }

  async addWidget(type: string) {
    await this.page.getByTestId('add-widget-btn').click();
    await this.page.getByTestId(`widget-type-${type}`).click();
    await expect(this.page.getByTestId('widget-catalog-dialog')).not.toBeVisible();
  }

  private widgetByType(type: string) {
    return this.page.locator('[data-testid^="widget-"]').filter({ hasText: type });
  }

  async removeWidget(type: string) {
    await this.widgetByType(type).getByRole('button', { name: /remove widget/i }).click();
    await expect(this.widgetByType(type)).not.toBeVisible();
  }

  async assertHasWidget(type: string) {
    await expect(this.widgetByType(type)).toBeVisible();
  }

  async assertNoWidget(type: string) {
    await expect(this.widgetByType(type)).not.toBeVisible();
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

  undoSnackbar() {
    return this.page.getByTestId('undo-snackbar');
  }

  undoRemoveBtn() {
    return this.page.getByTestId('undo-remove-btn');
  }

  savedToast() {
    return this.page.getByTestId('layout-saved-toast');
  }

  saveErrorToast() {
    return this.page.getByTestId('layout-save-error-toast');
  }

  async addFirstWidget() {
    await this.page.getByTestId('add-widget-btn').click();
    await this.page.locator('[data-testid^="widget-type-"]').first().click();
  }
}

import { expect, Page } from '@playwright/test';

export class HackathonsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/hackathons');
  }

  async create(opts: {
    title: string;
    startDate: string;
    endDate: string;
    hostCity: string;
    partnerNames?: string[];
  }) {
    await this.page.goto('/hackathons/new');
    await this.page.getByLabel('Title').fill(opts.title);
    await this.page.getByLabel('Host city').fill(opts.hostCity);
    await this.page.getByLabel('Start date').fill(opts.startDate);
    await this.page.getByLabel('End date').fill(opts.endDate);
    if (opts.partnerNames) {
      for (const name of opts.partnerNames) {
        const checkbox = this.page.getByLabel(name);
        if (await checkbox.count() > 0) await checkbox.check();
      }
    }
    await this.page.getByTestId('plan-hackathon-btn').click();
    await this.page.waitForURL(/\/hackathons\/[a-f0-9-]+$/);
  }

  async assertOnDetail(title: string) {
    await this.page.waitForURL(/\/hackathons\/[a-f0-9-]+$/);
    await expect(this.page.getByTestId('hackathon-title')).toContainText(title);
  }

  async update(opts: { title: string }) {
    await this.page.getByTestId('hackathon-edit-link').click();
    await this.page.waitForURL(/\/hackathons\/[a-f0-9-]+\/edit/);
    await this.page.getByLabel('Title').fill(opts.title);
    await this.page.getByTestId('hackathon-edit-save-btn').click();
    await this.page.waitForURL(/\/hackathons\/[a-f0-9-]+$/);
  }

  async changeStage(stage: string) {
    await this.page.getByTestId(`stage-step-${stage}`).click();
    await expect(this.page.getByTestId(`stage-step-${stage}`)).toHaveAttribute('aria-current', 'step');
  }

  async addProduct(opts: { title: string; description?: string }) {
    await this.page.getByTestId('add-product-btn').click();
    await this.page.getByLabel('Name').fill(opts.title);
    if (opts.description) await this.page.getByLabel(/description/i).fill(opts.description);
    await this.page.getByTestId('submit-product-btn').click();
    await expect(this.page.getByText(opts.title)).toBeVisible();
  }

  async delete() {
    await this.page.getByTestId('hackathon-more-btn').click();
    await this.page.getByTestId('hackathon-delete-menu-item').click();
    await this.page.getByTestId('confirm-delete-hackathon-btn').click();
    await this.page.waitForURL(/\/hackathons$/);
  }

  async openCreateForm() {
    await this.goto();
    await this.page.getByTestId('create-hackathon-button').click();
  }

  createForm() {
    return this.page.getByTestId('hackathon-create-form');
  }

  hackathonCard(id: string) {
    return this.page.getByTestId(`hackathon-card-${id}`);
  }

  savedToast() {
    return this.page.getByTestId('hackathon-saved-toast');
  }

  deletedToast() {
    return this.page.getByTestId('hackathon-deleted-toast');
  }
}

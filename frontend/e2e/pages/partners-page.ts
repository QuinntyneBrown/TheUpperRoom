import { expect, Page } from '@playwright/test';

export class PartnersPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/partners');
  }

  async create(opts: { name: string; city?: string }) {
    await this.page.goto('/partners/new');
    await this.page.getByLabel('Organization name').fill(opts.name);
    await this.page.getByLabel('City').fill(opts.city ?? 'Test City');
    await this.page.getByTestId('add-partner-btn').click();
    await this.page.waitForURL(/\/partners\/[a-f0-9-]+$/);
  }

  async associateContact(name: string) {
    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.join(' ') || 'Contact';
    await this.page.getByTestId('add-contact-btn').click();
    await this.page.getByTestId('new-contact-first-name').fill(firstName);
    await this.page.getByTestId('new-contact-last-name').fill(lastName);
    await this.page.getByTestId('create-link-btn').click();
    await expect(this.page.getByText(name)).toBeVisible();
  }

  async addNote(body: string) {
    await this.page.getByLabel('New note').fill(body);
    await this.page.getByTestId('add-note-btn').click();
    await expect(this.page.getByText(body)).toBeVisible();
  }

  async changeStage() {
    await this.page.getByTestId('stage-advance-btn').click();
    await expect(this.page.getByTestId('stage-advance-btn')).toBeVisible();
  }

  assertListChip(stageLabel: string) {
    return {
      showsPartner: async (partnerName: string) => {
        await this.page.goto('/partners');
        await this.page.getByRole('option', { name: stageLabel }).click();
        await expect(this.page.getByText(partnerName)).toBeVisible();
      },
    };
  }

  async openBoard() {
    await this.page.goto('/partners/board');
  }

  assertBoard(stage: string) {
    return {
      contains: async (partnerName: string) => {
        const col = this.page.getByTestId(`column-${stage}`);
        await expect(col.getByText(partnerName)).toBeVisible();
      },
    };
  }

  async update(opts: { name: string }) {
    await this.page.getByTestId('partner-edit-link').click();
    await this.page.waitForURL(/\/partners\/[a-f0-9-]+\/edit/);
    await this.page.getByTestId('partner-name-input').fill(opts.name);
    await this.page.getByTestId('partner-edit-save-btn').click();
    await this.page.waitForURL(/\/partners\/[a-f0-9-]+$/);
  }

  async delete(partnerName: string) {
    await expect(this.page.getByTestId('partner-name')).toContainText(partnerName);
    await this.page.getByTestId('partner-delete-btn').click();
    await this.page.getByTestId('confirm-delete-partner-btn').click();
    await this.page.waitForURL(/\/partners$/);
  }

  async openCreateForm() {
    await this.goto();
    await this.page.getByTestId('create-partner-button').click();
  }

  createForm() {
    return this.page.getByTestId('partner-create-form');
  }

  partnerCard(name: string) {
    return this.page.getByTestId(`partner-card-${name}`);
  }

  board() {
    return this.page.getByTestId('partner-board');
  }

  stageSuccessToast() {
    return this.page.getByTestId('stage-success-toast');
  }

  linkedToast() {
    return this.page.getByTestId('linked-toast');
  }

  savedToast() {
    return this.page.getByTestId('partner-saved-toast');
  }

  deletedToast() {
    return this.page.getByTestId('partner-deleted-toast');
  }
}

import { expect, Page } from '@playwright/test';

export class ContactsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/contacts');
  }

  async gotoCreate() {
    await this.page.goto('/contacts/new');
  }

  async fillForm(opts: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    city?: string;
    notes?: string;
  }) {
    await this.page.getByLabel('First name').fill(opts.firstName);
    await this.page.getByLabel('Last name').fill(opts.lastName);
    if (opts.email) await this.page.getByLabel('Email').fill(opts.email);
    if (opts.phone) await this.page.getByLabel('Phone').fill(opts.phone);
    if (opts.city) await this.page.getByLabel('City').fill(opts.city);
    if (opts.notes) await this.page.getByLabel('Notes').fill(opts.notes);
  }

  async submit() {
    await this.page.getByRole('button', { name: /save|create/i }).click();
  }

  async gotoDetail(id: string) {
    await this.page.goto(`/contacts/${id}`);
  }

  async create(opts: { name: string; email?: string; phone?: string }) {
    const [firstName, ...rest] = opts.name.split(' ');
    const lastName = rest.join(' ') || 'Contact';
    await this.gotoCreate();
    await this.fillForm({ firstName, lastName, email: opts.email, phone: opts.phone });
    await this.page.getByRole('button', { name: /create contact/i }).click();
    await this.page.waitForURL(/\/contacts\/[a-f0-9-]+$/);
  }

  async assertOnDetail(name: string) {
    await this.page.waitForURL(/\/contacts\/[a-f0-9-]+$/);
    await expect(this.page.getByTestId('contact-name')).toContainText(name.split(' ')[0]);
  }

  async update(opts: { name: string }) {
    await this.page.getByRole('link', { name: /edit/i }).click();
    await this.page.waitForURL(/\/contacts\/[a-f0-9-]+\/edit/);
    await this.page.getByLabel('First name').clear();
    await this.page.getByLabel('First name').fill(opts.name);
    await this.page.getByRole('button', { name: /save changes/i }).click();
    await this.page.waitForURL(/\/contacts\/[a-f0-9-]+$/);
  }

  async addNote(body: string) {
    await this.page.getByLabel('New note').fill(body);
    await this.page.getByRole('button', { name: /add note/i }).click();
    await expect(this.page.getByText(body)).toBeVisible();
  }

  async delete() {
    await this.page.getByRole('button', { name: /delete/i }).first().click();
    await this.page.getByRole('button', { name: /delete contact/i }).click();
    await this.page.waitForURL(/\/contacts$/);
  }

  async assertInList(name: string) {
    await this.goto();
    await expect(this.page.getByRole('row').filter({ hasText: name }).first()).toBeVisible();
  }

  contactName() {
    return this.page.getByTestId('contact-name');
  }

  notesSection() {
    return this.page.getByTestId('contact-notes-section');
  }

  contactCard(name: string) {
    return this.page.getByTestId(`contact-card-${name}`);
  }

  searchInput() {
    return this.page.getByTestId('contact-search-input');
  }
}

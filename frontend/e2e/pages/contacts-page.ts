import { Page } from '@playwright/test';

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

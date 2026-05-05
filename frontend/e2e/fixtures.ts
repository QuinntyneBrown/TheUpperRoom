// Traces to: 78 - Playwright POM foundation
// L2-063: extended test fixture exposing domain page objects
import { test as base, expect } from '@playwright/test';
import { AuthPages } from './pages/auth-pages';
import { ContactsPage } from './pages/contacts-page';
import { DashboardPage } from './pages/dashboard-page';
import { HackathonsPage } from './pages/hackathons-page';
import { NotificationsPanel } from './pages/notifications-panel';
import { PartnersPage } from './pages/partners-page';
import { TeamPage } from './pages/team-page';
import { GlobalSearchOverlay } from './pages/global-search-overlay';
import { Mailbox } from './mailbox';

type Fixtures = {
  auth: AuthPages;
  contacts: ContactsPage;
  dashboard: DashboardPage;
  hackathons: HackathonsPage;
  notifications: NotificationsPanel;
  partners: PartnersPage;
  team: TeamPage;
  search: GlobalSearchOverlay;
  mailbox: Mailbox;
};

export const test = base.extend<Fixtures>({
  auth: async ({ page }, use) => use(new AuthPages(page)),
  contacts: async ({ page }, use) => use(new ContactsPage(page)),
  dashboard: async ({ page }, use) => use(new DashboardPage(page)),
  hackathons: async ({ page }, use) => use(new HackathonsPage(page)),
  notifications: async ({ page }, use) => use(new NotificationsPanel(page)),
  partners: async ({ page }, use) => use(new PartnersPage(page)),
  team: async ({ page }, use) => use(new TeamPage(page)),
  search: async ({ page }, use) => use(new GlobalSearchOverlay(page)),
  mailbox: async ({}, use) => use(new Mailbox()),
});

export { expect };

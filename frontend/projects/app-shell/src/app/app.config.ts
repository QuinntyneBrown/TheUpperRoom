import { APP_INITIALIZER, ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { csrfInterceptor } from './services/csrf.interceptor';
import { correlationInterceptor } from './services/correlation.interceptor';
import { errorLoggingInterceptor } from './services/error-logging.interceptor';
import { AUTH_SERVICE, AuthService, CONTACT_SERVICE, ContactService, DASHBOARD_SERVICE, DashboardService, HACKATHON_SERVICE, HackathonService, HEALTH_SERVICE, HealthService, METRIC_SERVICE, MetricService, NOTIFICATION_SERVICE, NotificationService, PARTNER_SERVICE, PartnerService, REALTIME_SERVICE, RealtimeService, SEARCH_SERVICE, SearchService, TEAM_SERVICE, TeamService } from 'api';
import { ContactCreatePageComponent, ContactDetailPageComponent, ContactEditPageComponent, ContactsListPageComponent } from 'feature-contacts';
import { DashboardPageComponent } from 'feature-dashboard';
import { HackathonDetailPageComponent, HackathonEditPageComponent, HackathonListPageComponent } from 'feature-hackathons';
import { GlobalTeamDetailPageComponent, GlobalTeamsPageComponent, LocalTeamPageComponent } from 'feature-team';
import { DeletedContactsPageComponent, DeletedHackathonsPageComponent } from 'feature-admin';
import { PartnerDetailPageComponent, PartnerEditPageComponent, PartnerListPageComponent, PartnersBoardPageComponent } from 'feature-partners';
import { NoAccessPageComponent, RecoverPageComponent, RegisterPageComponent, ResetPageComponent, SignInPageComponent, VerifyPageComponent } from 'feature-auth';
import { GlobalErrorHandler } from './global-error-handler';
import { PlaceholderPageComponent } from './placeholder-page';
import { LayoutTestComponent } from './test/layout-test';
import { DialogTestComponent } from './test/dialog-test';
import { FormTestComponent } from './test/form-test';
import { authGuard } from './route-guards/auth.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: APP_INITIALIZER, useFactory: (r: MatIconRegistry) => () => r.setDefaultFontSetClass('material-symbols-outlined'), deps: [MatIconRegistry], multi: true },
    provideHttpClient(withInterceptors([correlationInterceptor, csrfInterceptor, errorLoggingInterceptor])),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HEALTH_SERVICE, useClass: HealthService },
    { provide: AUTH_SERVICE, useClass: AuthService },
    { provide: CONTACT_SERVICE, useClass: ContactService },
    { provide: PARTNER_SERVICE, useClass: PartnerService },
    { provide: HACKATHON_SERVICE, useClass: HackathonService },
    { provide: TEAM_SERVICE, useClass: TeamService },
    { provide: DASHBOARD_SERVICE, useClass: DashboardService },
    { provide: METRIC_SERVICE, useClass: MetricService },
    { provide: NOTIFICATION_SERVICE, useClass: NotificationService },
    { provide: SEARCH_SERVICE, useClass: SearchService },
    { provide: REALTIME_SERVICE, useClass: RealtimeService },
    provideRouter([
      { path: 'dashboard', title: 'Dashboard – The Upper Room', component: DashboardPageComponent, canActivate: [authGuard] },
      { path: 'team', title: 'My Team – The Upper Room', component: LocalTeamPageComponent },
      { path: 'teams', title: 'All Teams – The Upper Room', component: GlobalTeamsPageComponent },
      { path: 'teams/:id', title: 'Team – The Upper Room', component: GlobalTeamDetailPageComponent },
      { path: 'hackathons', title: 'Hackathons – The Upper Room', component: HackathonListPageComponent },
      { path: 'hackathons/new', title: 'New Hackathon – The Upper Room', component: HackathonListPageComponent, data: { openCreate: true } },
      { path: 'hackathons/:id', title: 'Hackathon – The Upper Room', component: HackathonDetailPageComponent },
      { path: 'hackathons/:id/edit', title: 'Edit Hackathon – The Upper Room', component: HackathonEditPageComponent },
      { path: 'partners', title: 'Partners – The Upper Room', component: PartnerListPageComponent },
      { path: 'partners/board', title: 'Partners Board – The Upper Room', component: PartnersBoardPageComponent },
      { path: 'partners/new', title: 'New Partner – The Upper Room', component: PartnerListPageComponent, data: { openCreate: true } },
      { path: 'partners/:id', title: 'Partner – The Upper Room', component: PartnerDetailPageComponent },
      { path: 'partners/:id/edit', title: 'Edit Partner – The Upper Room', component: PartnerEditPageComponent },
      { path: 'contacts', title: 'Contacts – The Upper Room', component: ContactsListPageComponent },
      { path: 'contacts/new', title: 'New Contact – The Upper Room', component: ContactCreatePageComponent },
      { path: 'contacts/:id', title: 'Contact – The Upper Room', component: ContactDetailPageComponent },
      { path: 'contacts/:id/edit', title: 'Edit Contact – The Upper Room', component: ContactEditPageComponent },
      { path: 'admin/contacts/deleted', title: 'Deleted Contacts – The Upper Room', component: DeletedContactsPageComponent },
      { path: 'admin/hackathons/deleted', title: 'Deleted Hackathons – The Upper Room', component: DeletedHackathonsPageComponent },
      { path: 'no-access', title: 'No Access – The Upper Room', component: NoAccessPageComponent },
      { path: 'auth/forgot-password', title: 'Forgot Password – The Upper Room', component: RecoverPageComponent },
      { path: 'auth/register', title: 'Register – The Upper Room', component: RegisterPageComponent },
      { path: 'auth/reset-password', title: 'Reset Password – The Upper Room', component: ResetPageComponent },
      { path: 'auth/sign-in', title: 'Sign in – The Upper Room', component: SignInPageComponent },
      { path: 'auth/verify', title: 'Verify Email – The Upper Room', component: VerifyPageComponent },
      { path: 'prayer', title: 'Prayer – The Upper Room', component: PlaceholderPageComponent },
      { path: 'reports', title: 'Reports – The Upper Room', component: PlaceholderPageComponent },
      { path: 'settings', title: 'Settings – The Upper Room', component: PlaceholderPageComponent },
      { path: 'more', title: 'More – The Upper Room', component: PlaceholderPageComponent },
      { path: 'test/layout', component: LayoutTestComponent },
      { path: 'test/dialog', component: DialogTestComponent },
      { path: 'test/form', component: FormTestComponent },
    ]),
  ],
};

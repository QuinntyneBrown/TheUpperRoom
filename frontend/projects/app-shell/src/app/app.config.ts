import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { csrfInterceptor } from './services/csrf.interceptor';
import { errorLoggingInterceptor } from './services/error-logging.interceptor';
import { AUTH_SERVICE, AuthService, CONTACT_SERVICE, ContactService, HEALTH_SERVICE, HealthService, PARTNER_SERVICE, PartnerService } from 'api';
import { ContactCreatePageComponent, ContactDetailPageComponent, ContactEditPageComponent, ContactsListPageComponent } from 'feature-contacts';
import { PartnerCreatePageComponent, PartnersBoardPageComponent } from 'feature-partners';
import { NoAccessPageComponent, RecoverPageComponent, RegisterPageComponent, ResetPageComponent, SignInPageComponent, VerifyPageComponent } from 'feature-auth';
import { GlobalErrorHandler } from './global-error-handler';
import { LayoutTestComponent } from './test/layout-test';
import { DialogTestComponent } from './test/dialog-test';
import { FormTestComponent } from './test/form-test';
import { DashboardPageComponent } from './dashboard/dashboard-page';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([csrfInterceptor, errorLoggingInterceptor])),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HEALTH_SERVICE, useClass: HealthService },
    { provide: AUTH_SERVICE, useClass: AuthService },
    { provide: CONTACT_SERVICE, useClass: ContactService },
    { provide: PARTNER_SERVICE, useClass: PartnerService },
    provideRouter([
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'partners', component: PartnersBoardPageComponent },
      { path: 'partners/new', component: PartnerCreatePageComponent },
      { path: 'contacts', component: ContactsListPageComponent },
      { path: 'contacts/new', component: ContactCreatePageComponent },
      { path: 'contacts/:id', component: ContactDetailPageComponent },
      { path: 'contacts/:id/edit', component: ContactEditPageComponent },
      { path: 'no-access', component: NoAccessPageComponent },
      { path: 'auth/forgot-password', component: RecoverPageComponent },
      { path: 'auth/register', component: RegisterPageComponent },
      { path: 'auth/reset', component: ResetPageComponent },
      { path: 'auth/sign-in', component: SignInPageComponent },
      { path: 'auth/verify', component: VerifyPageComponent },
      { path: 'test/layout', component: LayoutTestComponent },
      { path: 'test/dialog', component: DialogTestComponent },
      { path: 'test/form', component: FormTestComponent },
    ]),
  ],
};

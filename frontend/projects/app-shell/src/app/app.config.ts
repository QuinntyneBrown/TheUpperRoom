import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { csrfInterceptor } from './services/csrf.interceptor';
import { errorLoggingInterceptor } from './services/error-logging.interceptor';
import { HEALTH_SERVICE, HealthService } from 'api';
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
    provideRouter([
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'test/layout', component: LayoutTestComponent },
      { path: 'test/dialog', component: DialogTestComponent },
      { path: 'test/form', component: FormTestComponent },
    ]),
  ],
};

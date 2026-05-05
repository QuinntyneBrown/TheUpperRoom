import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { LayoutTestComponent } from './test/layout-test';
import { DashboardPageComponent } from './dashboard/dashboard-page';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter([
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'test/layout', component: LayoutTestComponent },
    ]),
  ],
};

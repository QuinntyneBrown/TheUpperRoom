import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationCancel, NavigationEnd, NavigationError, Router, RouterLink, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { filter, map, startWith } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AUTH_SERVICE, HEALTH_SERVICE, REALTIME_SERVICE } from 'api';
import { UrSideNavItemComponent, UrBottomNavItemComponent, UrLiveRegionComponent } from 'components';
import { NotificationCenterComponent } from 'feature-notifications';
import { GlobalSearchOverlayComponent } from 'feature-search';
import { GlobalToastService } from './services/global-toast.service';

const WORKSPACE_ITEMS = [
  { icon: 'home', label: 'Dashboard', route: '/dashboard', testId: 'nav-dashboard' },
  { icon: 'handshake', label: 'Partners', route: '/partners', testId: 'nav-partners' },
  { icon: 'contacts', label: 'Contacts', route: '/contacts', testId: 'nav-contacts' },
  { icon: 'rocket_launch', label: 'Hackathons', route: '/hackathons', testId: 'nav-hackathons' },
  { icon: 'diversity_3', label: 'Team', route: '/team', testId: 'nav-team' },
  { icon: 'volunteer_activism', label: 'Prayer', route: '/prayer', testId: 'nav-prayer' },
];

const GLOBAL_ITEMS = [
  { icon: 'public', label: 'Cities', route: '/teams', testId: 'nav-teams' },
  { icon: 'insights', label: 'Reports', route: '/reports', testId: 'nav-reports' },
  { icon: 'settings', label: 'Settings', route: '/settings', testId: 'nav-settings' },
];

const BOTTOM_NAV_ITEMS = [
  { icon: 'home', label: 'Home', route: '/dashboard', testId: 'bottom-nav-dashboard' },
  { icon: 'handshake', label: 'Partners', route: '/partners', testId: 'bottom-nav-partners' },
  { icon: 'rocket_launch', label: 'Hacks', route: '/hackathons', testId: 'bottom-nav-hackathons' },
  { icon: 'more_horiz', label: 'More', route: '/more', testId: 'bottom-nav-more' },
];

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    UrSideNavItemComponent,
    UrBottomNavItemComponent,
    UrLiveRegionComponent,
    MatMenuModule,
    NotificationCenterComponent,
    GlobalSearchOverlayComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private bpo = inject(BreakpointObserver);
  private healthService = inject(HEALTH_SERVICE);
  private realtimeSvc = inject(REALTIME_SERVICE);
  private authSvc = inject(AUTH_SERVICE);
  private router = inject(Router);
  private toastSvc = inject(GlobalToastService);

  errorToast = toSignal(this.toastSvc.error$, { initialValue: null });

  readonly workspaceItems = WORKSPACE_ITEMS;
  readonly globalItems = GLOBAL_ITEMS;
  readonly bottomNavItems = BOTTOM_NAV_ITEMS;

  resolving = signal(true);

  private firstNavDone = false;

  isDesktop = toSignal(
    this.bpo.observe('(min-width: 1280px)').pipe(map((r) => r.matches)),
    { initialValue: window.matchMedia('(min-width: 1280px)').matches }
  );

  isMobile = toSignal(
    this.bpo.observe('(max-width: 767px)').pipe(map((r) => r.matches)),
    { initialValue: window.matchMedia('(max-width: 767px)').matches }
  );

  connectionState = toSignal(this.realtimeSvc.connectionState$, { initialValue: 'disconnected' as const });

  isOffline = computed(() => this.connectionState() === 'disconnected');

  sidenavMode = computed<'side' | 'over'>(() =>
    this.isDesktop() ? 'side' : 'over'
  );

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url)
    )
  );

  private isAuthRoute = computed(() => (this.currentUrl() ?? '').startsWith('/auth'));

  sidenavOpened = computed(() => this.isDesktop() && !this.isAuthRoute());

  doSignOut() {
    this.authSvc.signOut().subscribe({
      next: () => this.router.navigateByUrl('/auth/sign-in?signedOut=1'),
      error: () => this.router.navigateByUrl('/auth/sign-in?signedOut=1'),
    });
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (this.firstNavDone) return;
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.firstNavDone = true;
        this.resolving.set(false);
      }
    });
    this.healthService.get().subscribe();
    this.realtimeSvc.connect();
  }
}

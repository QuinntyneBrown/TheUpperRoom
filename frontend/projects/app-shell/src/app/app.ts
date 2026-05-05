import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationCancel, NavigationEnd, NavigationError, Router, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';
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

const WORKSPACE_ITEMS = [
  { icon: 'home', label: 'Dashboard', route: '/dashboard' },
  { icon: 'handshake', label: 'Partners', route: '/partners' },
  { icon: 'contacts', label: 'Contacts', route: '/contacts' },
  { icon: 'rocket_launch', label: 'Hackathons', route: '/hackathons' },
  { icon: 'diversity_3', label: 'Team', route: '/team' },
  { icon: 'volunteer_activism', label: 'Prayer', route: '/prayer' },
];

const GLOBAL_ITEMS = [
  { icon: 'public', label: 'Cities', route: '/teams' },
  { icon: 'insights', label: 'Reports', route: '/reports' },
  { icon: 'settings', label: 'Settings', route: '/settings' },
];

const BOTTOM_NAV_ITEMS = [
  { icon: 'home', label: 'Home', route: '/dashboard' },
  { icon: 'handshake', label: 'Partners', route: '/partners' },
  { icon: 'rocket_launch', label: 'Hacks', route: '/hackathons' },
  { icon: 'more_horiz', label: 'More', route: '/more' },
];

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
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

  readonly workspaceItems = WORKSPACE_ITEMS;
  readonly globalItems = GLOBAL_ITEMS;
  readonly bottomNavItems = BOTTOM_NAV_ITEMS;

  healthStatus = signal('...');
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

  sidenavOpened = computed(() => this.isDesktop());

  doSignOut() {
    this.authSvc.signOut().subscribe({
      next: () => this.router.navigateByUrl('/auth/sign-in'),
      error: () => this.router.navigateByUrl('/auth/sign-in'),
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
    this.healthService.get().subscribe({
      next: (r) => this.healthStatus.set(r.status.toUpperCase()),
      error: () => this.healthStatus.set('ERROR'),
    });
    this.realtimeSvc.connect();
  }
}

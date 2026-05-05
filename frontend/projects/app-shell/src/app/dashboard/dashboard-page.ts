import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';

@Component({
  selector: 'ur-dashboard-page',
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  private bpo = inject(BreakpointObserver);

  private isDesktop = toSignal(
    this.bpo.observe('(min-width: 1280px)').pipe(map((r) => r.matches)),
    { initialValue: window.matchMedia('(min-width: 1280px)').matches }
  );

  private isMedium = toSignal(
    this.bpo.observe('(min-width: 992px)').pipe(map((r) => r.matches)),
    { initialValue: window.matchMedia('(min-width: 992px)').matches }
  );

  private isTablet = toSignal(
    this.bpo.observe('(min-width: 768px)').pipe(map((r) => r.matches)),
    { initialValue: window.matchMedia('(min-width: 768px)').matches }
  );

  cols = computed(() => {
    if (this.isDesktop()) return 12;
    if (this.isMedium()) return 6;
    if (this.isTablet()) return 2;
    return 1;
  });
}

import { BreakpointObserver } from '@angular/cdk/layout';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

export type ViewportBucket = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Injectable({ providedIn: 'root' })
export class ViewportService {
  private bpo = inject(BreakpointObserver);

  private xl = toSignal(
    this.bpo.observe('(min-width: 1200px)').pipe(map((r) => r.matches)),
    { initialValue: matchMedia('(min-width: 1200px)').matches }
  );
  private lg = toSignal(
    this.bpo.observe('(min-width: 992px)').pipe(map((r) => r.matches)),
    { initialValue: matchMedia('(min-width: 992px)').matches }
  );
  private md = toSignal(
    this.bpo.observe('(min-width: 768px)').pipe(map((r) => r.matches)),
    { initialValue: matchMedia('(min-width: 768px)').matches }
  );
  private sm = toSignal(
    this.bpo.observe('(min-width: 576px)').pipe(map((r) => r.matches)),
    { initialValue: matchMedia('(min-width: 576px)').matches }
  );

  bucket = computed<ViewportBucket>(() => {
    if (this.xl()) return 'xl';
    if (this.lg()) return 'lg';
    if (this.md()) return 'md';
    if (this.sm()) return 'sm';
    return 'xs';
  });

  isDesktop = computed(() => this.lg());
  isMobile = computed(() => !this.sm());
}

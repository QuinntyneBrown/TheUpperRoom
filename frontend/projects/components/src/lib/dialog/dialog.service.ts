import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { InjectionToken, Injectable, Injector, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export const UR_DIALOG_DATA = new InjectionToken<unknown>('UR_DIALOG_DATA');

export interface UrDialogConfig<D = unknown> {
  data?: D;
  ariaLabel?: string;
  panelClass?: string | string[];
  disableClose?: boolean;
}

export class UrDialogRef<R = unknown> {
  private readonly subject = new Subject<R | undefined>();
  readonly closed$: Observable<R | undefined> = this.subject.asObservable();
  private disposed = false;

  constructor(
    private readonly overlayRef: OverlayRef,
    private readonly previousFocus: HTMLElement | null,
  ) {}

  close(result?: R): void {
    if (this.disposed) return;
    this.disposed = true;
    this.subject.next(result);
    this.subject.complete();
    this.overlayRef.dispose();
    this.previousFocus?.focus();
  }
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  private overlay = inject(Overlay);
  private parentInjector = inject(Injector);

  open<T, R = unknown, D = unknown>(component: ComponentType<T>, config?: UrDialogConfig<D>): UrDialogRef<R> {
    const previousFocus = (document.activeElement as HTMLElement) ?? null;
    const panelClasses = config?.panelClass
      ? (Array.isArray(config.panelClass) ? config.panelClass : [config.panelClass])
      : [];

    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'ur-dialog-backdrop',
      panelClass: ['ur-dialog-pane', ...panelClasses],
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      disposeOnNavigation: true,
    });

    const dialogRef = new UrDialogRef<R>(overlayRef, previousFocus);

    const injector = Injector.create({
      providers: [
        { provide: UrDialogRef, useValue: dialogRef },
        { provide: UR_DIALOG_DATA, useValue: config?.data ?? null },
      ],
      parent: this.parentInjector,
    });

    overlayRef.attach(new ComponentPortal(component, null, injector));

    if (!config?.disableClose) {
      overlayRef.backdropClick().subscribe(() => dialogRef.close());
      overlayRef.keydownEvents().subscribe(e => { if (e.key === 'Escape') dialogRef.close(); });
    }

    overlayRef.hostElement.setAttribute('role', 'dialog');
    overlayRef.hostElement.setAttribute('aria-modal', 'true');
    if (config?.ariaLabel) overlayRef.hostElement.setAttribute('aria-label', config.ariaLabel);

    return dialogRef;
  }
}

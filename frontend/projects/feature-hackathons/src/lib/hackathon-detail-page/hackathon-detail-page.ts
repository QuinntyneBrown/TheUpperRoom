import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HACKATHON_SERVICE, HackathonDetailDto, HackathonStage, REALTIME_SERVICE } from 'api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DialogService } from 'components';
import { ProductsSectionComponent } from '../products-section/products-section';
import { DeleteHackathonDialogComponent } from '../delete-hackathon-dialog/delete-hackathon-dialog';
import { Subscription } from 'rxjs';

const STAGES: { value: HackathonStage; label: string; marker: string; description: string }[] = [
  { value: 'Discover', label: 'Discover', marker: 'D1', description: 'Listen to the Spirit. Identify Kingdom problems worth solving.' },
  { value: 'Design', label: 'Design', marker: 'D2', description: 'Pray and shape the solution. Form teams and define scope.' },
  { value: 'Develop', label: 'Develop', marker: 'D3', description: 'Build the solution during the 48-hour development sprint.' },
  { value: 'Deploy', label: 'Deploy', marker: 'D4', description: 'Demo, ship, and steward what was built.' },
];

@Component({
  selector: 'ur-hackathon-detail-page',
  templateUrl: './hackathon-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe, MatButtonModule, MatIconModule, MatMenuModule, ProductsSectionComponent],
  styles: [`
    .hackathon-detail { display: flex; flex-direction: column; height: 100%; }
    .hackathon-detail__header { display: flex; align-items: flex-start; justify-content: space-between; padding: 32px 32px 0; }
    .hackathon-detail__back { display: inline-flex; align-items: center; gap: 4px; font-size: 0.875rem; color: var(--ur-accent-primary, #9f86ff); text-decoration: none; margin-bottom: 12px; }
    .hackathon-detail__back-icon { font-size: 18px; width: 18px; height: 18px; }
    .hackathon-detail__title { margin: 0 0 6px; font-size: 1.875rem; font-weight: 600; color: var(--ur-fg-primary, #fff); }
    .hackathon-detail__meta { margin: 0; font-size: 1rem; color: var(--ur-fg-secondary, #a1a1aa); }
    .hackathon-detail__header-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; padding-top: 4px; }
    .hackathon-detail__body { display: flex; flex-direction: column; gap: 24px; padding: 24px 32px 32px; }
    .hackathon-detail__section-title { margin: 0 0 12px; font-size: 0.875rem; font-weight: 600; color: var(--ur-fg-secondary, #a1a1aa); text-transform: uppercase; letter-spacing: 0.05em; }
    .hackathon-partners { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
    .hackathon-partners__item { font-size: 0.875rem; color: var(--ur-fg-primary, #fff); padding: 8px 12px; border-radius: 6px; background: var(--ur-bg-surface, #101018); border: 1px solid var(--ur-border-subtle, #222233); }
    .hackathon-history { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
    .hackathon-history__item { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; padding: 8px 12px; border-radius: 6px; background: var(--ur-bg-surface, #101018); border: 1px solid var(--ur-border-subtle, #222233); }
    .hackathon-history__from { color: var(--ur-fg-secondary, #a1a1aa); }
    .hackathon-history__arrow { font-size: 16px; width: 16px; height: 16px; color: var(--ur-fg-muted, #a8a8b5); }
    .hackathon-history__to { color: var(--ur-fg-primary, #fff); font-weight: 500; }
    .hackathon-history__time { margin-left: auto; color: var(--ur-fg-muted, #a8a8b5); font-size: 0.75rem; }
    .hackathon-toast {
      position: fixed; top: 16px; right: 24px; display: flex; align-items: center;
      gap: 10px; padding: 12px 16px; border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-surface, #16161f); color: #fff; font-size: 0.875rem; font-weight: 500;
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .hackathon-toast mat-icon { font-size: 18px; width: 18px; height: 18px; color: var(--ur-success, #34d399); }
    .hackathon-toast--error { border: 1px solid var(--ur-danger, #f87171); }
    .hackathon-toast--error mat-icon { color: var(--ur-danger, #f87171); font-size: 18px; width: 18px; height: 18px; }
    .hackathon-detail-loading { display: flex; flex-direction: column; gap: 16px; padding: 24px 0; }
    .hackathon-detail-loading__title { height: 28px; width: 50%; border-radius: 6px; background: var(--ur-border-default, #2a2a3a); animation: hd-pulse 1.4s ease-in-out infinite; }
    .hackathon-detail-loading__meta { height: 16px; width: 35%; border-radius: 4px; background: var(--ur-border-default, #2a2a3a); animation: hd-pulse 1.4s ease-in-out infinite; }
    .hackathon-detail-loading__block { height: 80px; border-radius: 6px; background: var(--ur-border-default, #2a2a3a); animation: hd-pulse 1.4s ease-in-out infinite; }
    @keyframes hd-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
    .four-d-cards { display: flex; flex-direction: row; gap: 16px; }
    .d-card {
      display: flex; flex-direction: column; gap: 16px; padding: 20px; flex: 1; min-width: 0;
      border-radius: 8px; background: var(--ur-bg-elevated, #101018);
      border: 1px solid var(--ur-border-subtle, #222233);
    }
    .d-card--active { border-color: var(--ur-accent-primary, #9f86ff); }
    .d-card--done { border-color: var(--ur-accent-primary, #9f86ff); }
    .d-card__top { display: flex; align-items: center; justify-content: space-between; }
    .d-card__phase { display: flex; align-items: center; gap: 12px; }
    .d-card__marker {
      display: flex; align-items: center; justify-content: center;
      width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
      font-family: var(--ur-font-heading, inherit); font-size: 0.875rem; font-weight: 600;
    }
    .d-card__marker--accent {
      background: var(--ur-accent-soft, #1a1432);
      border: 1px solid var(--ur-accent-primary, #9f86ff);
      color: var(--ur-accent-primary, #9f86ff);
    }
    .d-card__marker--muted {
      background: var(--ur-bg-base, #0e0e16);
      border: 1px solid var(--ur-border-default, #2a2a3a);
      color: var(--ur-fg-muted, #a8a8b5);
    }
    .d-card__label { font-family: var(--ur-font-heading, inherit); font-size: 1.125rem; font-weight: 600; color: var(--ur-fg-primary, #fff); }
    .d-card__badge {
      padding: 2px 8px; border-radius: 999px; font-size: 0.75rem; font-weight: 500; border: none; cursor: pointer;
    }
    .d-card__badge--done { background: color-mix(in srgb, var(--ur-accent-primary, #9f86ff) 15%, transparent); color: var(--ur-accent-primary, #9f86ff); }
    .d-card__badge--active { background: color-mix(in srgb, var(--ur-accent-primary, #9f86ff) 15%, transparent); color: var(--ur-accent-primary, #9f86ff); }
    .d-card__badge--upcoming { background: var(--ur-bg-base, #0e0e16); color: var(--ur-fg-muted, #a8a8b5); }
    .d-card__desc { font-size: 0.875rem; color: var(--ur-fg-secondary, #a1a1aa); line-height: 1.5; }
  `],
})
export class HackathonDetailPageComponent implements OnInit, OnDestroy {
  private hackathons = inject(HACKATHON_SERVICE);
  private realtime = inject(REALTIME_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(DialogService);

  hackathon = signal<HackathonDetailDto | null>(null);
  loading = signal(true);
  notFound = signal(false);
  changingStage = signal(false);
  deleting = signal(false);
  deleteError = signal(false);
  changeStageError = signal(false);
  stageToast = signal(false);
  savedToast = signal(false);
  stages = STAGES;

  private deleteErrorTimer?: ReturnType<typeof setTimeout>;
  private changeStageErrorTimer?: ReturnType<typeof setTimeout>;
  private stageToastTimer?: ReturnType<typeof setTimeout>;
  private savedToastTimer?: ReturnType<typeof setTimeout>;

  stageIndex = computed(() => {
    const h = this.hackathon();
    if (!h) return 0;
    return this.stages.findIndex(s => s.value === h.stage);
  });

  private sub?: Subscription;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.hackathons.getById(id).subscribe({
      next: (h) => { this.hackathon.set(h); this.loading.set(false); },
      error: () => { this.notFound.set(true); this.loading.set(false); },
    });

    if (this.route.snapshot.queryParamMap.get('saved') === '1') {
      this.savedToast.set(true);
      this.savedToastTimer = setTimeout(() => this.savedToast.set(false), 3000);
      this.router.navigate([], { replaceUrl: true, relativeTo: this.route, queryParams: {} });
    }

    this.realtime.connect().catch(() => {});
    this.sub = this.realtime.events$.subscribe((event) => {
      if (event['eventType'] === 'hackathonStageChanged' && event['hackathonId'] === id) {
        this.hackathon.update((h) => h ? { ...h, stage: event['toStage'] as HackathonStage } : h);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    clearTimeout(this.deleteErrorTimer);
    clearTimeout(this.changeStageErrorTimer);
    clearTimeout(this.stageToastTimer);
    clearTimeout(this.savedToastTimer);
  }

  onDeleteClick(): void {
    if (!this.hackathon()) return;
    this.dialog.open<DeleteHackathonDialogComponent, boolean>(DeleteHackathonDialogComponent, {
      ariaLabel: 'Delete hackathon',
    }).closed$.subscribe(confirmed => { if (confirmed === true) this.confirmDelete(); });
  }

  private confirmDelete(): void {
    const h = this.hackathon();
    if (!h) return;
    this.deleting.set(true);
    this.hackathons.delete(h.id).subscribe({
      next: () => this.router.navigate(['/hackathons'], { queryParams: { deleted: '1' } }),
      error: () => {
        this.deleting.set(false);
        clearTimeout(this.deleteErrorTimer);
        this.deleteError.set(true);
        this.deleteErrorTimer = setTimeout(() => this.deleteError.set(false), 4000);
      },
    });
  }

  changeStage(stage: HackathonStage): void {
    const h = this.hackathon();
    if (!h || h.stage === stage || this.changingStage()) return;
    this.changingStage.set(true);
    this.hackathons.changeStage(h.id, stage).subscribe({
      next: () => {
        this.hackathon.update((current) => current ? {
          ...current,
          stage,
          history: [
            { id: crypto.randomUUID(), fromStage: current.stage, toStage: stage, changedById: '', changedAt: new Date().toISOString() },
            ...current.history,
          ],
        } : current);
        this.changingStage.set(false);
        clearTimeout(this.stageToastTimer);
        this.stageToast.set(true);
        this.stageToastTimer = setTimeout(() => this.stageToast.set(false), 3000);
      },
      error: () => {
        this.changingStage.set(false);
        clearTimeout(this.changeStageErrorTimer);
        this.changeStageError.set(true);
        this.changeStageErrorTimer = setTimeout(() => this.changeStageError.set(false), 4000);
      },
    });
  }
}

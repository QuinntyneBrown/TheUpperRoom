import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HACKATHON_SERVICE, HackathonDetailDto, HackathonStage, REALTIME_SERVICE } from 'api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UrButtonComponent, UrDialogComponent } from 'components';
import { ProductsSectionComponent } from '../products-section/products-section';
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
  imports: [RouterLink, DatePipe, MatButtonModule, MatIconModule, MatMenuModule, UrButtonComponent, UrDialogComponent, ProductsSectionComponent],
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
      background: var(--ur-bg-overlay, #1e293b); color: #fff; font-size: 0.875rem; font-weight: 500;
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .hackathon-toast mat-icon { font-size: 18px; width: 18px; height: 18px; color: var(--ur-success, #34d399); }
    .hackathon-toast--error { border: 1px solid var(--ur-danger, #f87171); }
    .hackathon-toast--error mat-icon { color: var(--ur-danger, #f87171); font-size: 18px; width: 18px; height: 18px; }
    .hackathon-detail-loading { display: flex; flex-direction: column; gap: 16px; padding: 24px 0; }
    .hackathon-detail-loading__title { height: 28px; width: 50%; border-radius: 6px; background: var(--ur-skeleton-bg, #f1f5f9); animation: hd-pulse 1.4s ease-in-out infinite; }
    .hackathon-detail-loading__meta { height: 16px; width: 35%; border-radius: 4px; background: var(--ur-skeleton-bg, #f1f5f9); animation: hd-pulse 1.4s ease-in-out infinite; }
    .hackathon-detail-loading__block { height: 80px; border-radius: 6px; background: var(--ur-skeleton-bg, #f1f5f9); animation: hd-pulse 1.4s ease-in-out infinite; }
    @keyframes hd-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
    .four-d-cards { display: flex; flex-direction: column; gap: 12px; }
    .d-card {
      display: flex; flex-direction: column; gap: 12px; padding: 20px;
      border-radius: 12px; background: var(--ur-bg-surface, #1e293b);
      border: 1px solid var(--ur-border-subtle, #334155);
    }
    .d-card--active { border-color: var(--ur-accent-primary, #6366f1); }
    .d-card--done { border-color: var(--ur-accent-primary, #6366f1); }
    .d-card__top { display: flex; align-items: center; justify-content: space-between; }
    .d-card__phase { display: flex; align-items: center; gap: 12px; }
    .d-card__marker {
      display: flex; align-items: center; justify-content: center;
      width: 36px; height: 36px; border-radius: 8px;
      font-family: var(--ur-font-heading, inherit); font-size: 0.875rem; font-weight: 600;
    }
    .d-card__marker--accent {
      background: var(--ur-accent-soft, rgba(99,102,241,0.15));
      border: 1px solid var(--ur-accent-primary, #6366f1);
      color: var(--ur-accent-primary, #6366f1);
    }
    .d-card__marker--muted {
      background: var(--ur-bg-elevated, #334155);
      border: 1px solid var(--ur-border-default, #475569);
      color: var(--ur-fg-secondary, #94a3b8);
    }
    .d-card__label { font-family: var(--ur-font-heading, inherit); font-size: 1.125rem; font-weight: 600; color: var(--ur-fg-primary, #f1f5f9); }
    .d-card__badge {
      padding: 2px 8px; border-radius: 999px; font-size: 0.75rem; font-weight: 500;
    }
    .d-card__badge--done { background: var(--ur-accent-soft, rgba(99,102,241,0.15)); color: var(--ur-accent-primary, #6366f1); }
    .d-card__badge--active { background: var(--ur-accent-soft, rgba(99,102,241,0.15)); color: var(--ur-accent-primary, #6366f1); }
    .d-card__badge--upcoming { background: var(--ur-bg-elevated, #334155); color: var(--ur-fg-secondary, #94a3b8); }
    .d-card__desc { font-size: 0.875rem; color: var(--ur-fg-secondary, #94a3b8); line-height: 1.5; }
  `],
})
export class HackathonDetailPageComponent implements OnInit, OnDestroy {
  private hackathons = inject(HACKATHON_SERVICE);
  private realtime = inject(REALTIME_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  hackathon = signal<HackathonDetailDto | null>(null);
  loading = signal(true);
  notFound = signal(false);
  changingStage = signal(false);
  showDeleteDialog = signal(false);
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

  confirmDelete(): void {
    const h = this.hackathon();
    if (!h) return;
    this.deleting.set(true);
    this.hackathons.delete(h.id).subscribe({
      next: () => this.router.navigate(['/hackathons'], { queryParams: { deleted: '1' } }),
      error: () => {
        this.deleting.set(false);
        this.showDeleteDialog.set(false);
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

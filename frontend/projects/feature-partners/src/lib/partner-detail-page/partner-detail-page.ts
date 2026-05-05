import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AUTH_SERVICE, PARTNER_SERVICE, PartnerDetailDto, PartnerStage, REALTIME_SERVICE } from 'api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { UrButtonComponent, UrDialogComponent } from 'components';
import { NotesPanelComponent } from 'feature-contacts';
import { PartnerContactsPanelComponent } from '../partner-contacts-panel/partner-contacts-panel';
import { Subscription } from 'rxjs';

const STAGES: { value: PartnerStage; label: string }[] = [
  { value: 'Lead', label: 'Lead' },
  { value: 'InFunnel', label: 'In funnel' },
  { value: 'Confirmed', label: 'Confirmed' },
];

@Component({
  selector: 'ur-partner-detail-page',
  templateUrl: './partner-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe, MatButtonModule, MatIconModule, MatMenuModule, MatFormFieldModule, MatInputModule, FormsModule, UrButtonComponent, UrDialogComponent, NotesPanelComponent, PartnerContactsPanelComponent],
  styles: [`
    .partner-toast {
      position: fixed; top: 16px; right: 24px; display: flex; align-items: center;
      gap: 10px; padding: 12px 16px; border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-surface, #16161f); color: #fff; font-size: 0.875rem; font-weight: 500;
      border: 1px solid var(--ur-success, #22c55e);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .partner-toast mat-icon { color: var(--ur-success, #22c55e); font-size: 18px; width: 18px; height: 18px; }
    .partner-toast--error { border-color: var(--ur-danger, #f87171); }
    .partner-toast--error mat-icon { color: var(--ur-danger, #f87171); }
    .partner-detail__header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; padding: 16px 20px; border-bottom: 1px solid var(--ur-border-subtle); background: var(--ur-bg-surface); }
    .partner-detail__breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; color: var(--ur-fg-secondary); }
    .partner-detail__back-icon { font-size: 18px; width: 18px; height: 18px; color: var(--ur-fg-secondary); }
    .partner-detail__breadcrumb-link { color: var(--ur-fg-secondary); text-decoration: none; }
    .partner-detail__breadcrumb-link:hover { text-decoration: underline; }
    .partner-detail__breadcrumb-name { color: var(--ur-fg-primary); font-weight: 500; }
    .partner-detail__header-actions { display: flex; align-items: center; gap: 8px; }
    .partner-detail__permission-banner {
      display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 6px; margin-top: 8px;
      background: var(--ur-info-bg, #eff6ff); color: var(--ur-info-fg, #1d4ed8);
      border: 1px solid var(--ur-info-border, #bfdbfe); font-size: 0.875rem;
    }
    .partner-detail__permission-banner mat-icon { font-size: 16px; width: 16px; height: 16px; flex-shrink: 0; }
    .partner-detail-loading { display: flex; flex-direction: column; gap: 16px; padding: 24px 0; }
    .partner-detail-loading__title { height: 28px; width: 40%; border-radius: 6px; background: var(--ur-border-default, #2a2a3a); animation: pd-pulse 1.4s ease-in-out infinite; }
    .partner-detail-loading__line { height: 16px; border-radius: 4px; background: var(--ur-border-default, #2a2a3a); animation: pd-pulse 1.4s ease-in-out infinite; }
    .partner-detail-loading__line--wide { width: 60%; }
    .partner-detail-loading__line--medium { width: 45%; }
    .partner-detail-loading__line--narrow { width: 30%; }
    @keyframes pd-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
    .partner-detail__body { display: flex; gap: 24px; padding: 32px; align-items: flex-start; }
    .partner-detail__left { width: 340px; flex-shrink: 0; }
    .partner-detail__right { flex: 1; display: flex; flex-direction: column; gap: 20px; min-width: 0; }
    .partner-hero-card {
      display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 24px;
      border-radius: 12px; background: var(--ur-bg-surface, #16161f);
      border: 1px solid var(--ur-border-subtle, #222233); text-align: center;
    }
    .partner-hero-card__icon {
      width: 72px; height: 72px; border-radius: 12px;
      background: var(--ur-accent-soft, rgba(99,102,241,0.15));
      border: 1px solid var(--ur-accent-primary, #6366f1);
      display: flex; align-items: center; justify-content: center;
      color: var(--ur-accent-primary, #6366f1); font-size: 1.5rem; font-weight: 600;
      text-transform: uppercase; user-select: none;
    }
    .partner-hero-card__name { margin: 0; font-size: 1.125rem; font-weight: 600; color: var(--ur-fg-primary, #f1f5f9); }
    .partner-hero-card__meta { margin: 4px 0 0; font-size: 0.875rem; color: var(--ur-fg-secondary, #94a3b8); }
    .partner-stage-card {
      padding: 24px; border-radius: 12px; background: var(--ur-bg-surface, #16161f);
      border: 1px solid var(--ur-border-subtle, #222233); display: flex; flex-direction: column; gap: 16px;
    }
    .partner-stage-card__hd { display: flex; align-items: center; justify-content: space-between; }
    .partner-stage-card__label { font-size: 0.75rem; font-weight: 600; color: var(--ur-fg-muted, #64748b); letter-spacing: 0.05em; }
    .partner-stage-card__history-link { font-size: 0.75rem; color: var(--ur-accent-primary, #6366f1); text-decoration: none; }
    .partner-stepper {
      display: flex; flex-direction: row; gap: 0;
      border-radius: 6px; background: var(--ur-bg-base, #0e0e16);
      border: 1px solid var(--ur-border-default, #2a2a3a); overflow: hidden;
    }
    .partner-stepper__divider { width: 1px; background: var(--ur-border-default, #2a2a3a); flex-shrink: 0; }
    .partner-stepper__step {
      display: flex; flex-direction: column; justify-content: center; gap: 4px;
      padding: 12px; flex: 1; min-width: 0;
    }
    .partner-stepper__step--current { background: var(--ur-accent-soft, #1a1432); }
    .partner-stepper__step-hd { display: flex; align-items: center; gap: 8px; }
    .partner-stepper__dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .partner-stepper__dot--current { background: var(--ur-accent-primary, #9f86ff); }
    .partner-stepper__dot--future { background: var(--ur-border-default, #2a2a3a); }
    .partner-stepper__check { font-size: 16px; width: 16px; height: 16px; color: var(--ur-accent-primary, #9f86ff); }
    .partner-stepper__name { font-size: 0.875rem; font-weight: 500; color: var(--ur-fg-primary, #f1f5f9); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .partner-stepper__step--complete .partner-stepper__name { color: var(--ur-fg-secondary, #a1a1aa); }
    .partner-stepper__step--future .partner-stepper__name { color: var(--ur-fg-muted, #7a7a87); }
    .partner-stepper__date { font-size: 0.6875rem; font-family: var(--ur-font-mono, 'Geist Mono', monospace); color: var(--ur-fg-muted, #7a7a87); }
    .partner-stepper__not-reached { font-size: 0.6875rem; font-family: var(--ur-font-mono, 'Geist Mono', monospace); color: var(--ur-fg-muted, #7a7a87); }
    .partner-stepper__current-badge {
      font-size: 0.6875rem; font-family: var(--ur-font-mono, 'Geist Mono', monospace); font-weight: 600;
      color: var(--ur-accent-primary, #9f86ff);
    }
    .partner-stage-card__actions { display: flex; align-items: center; gap: 8px; }
    .partner-stage-card__spacer { flex: 1; }
    .partner-stage-card__hint { margin: 0; font-size: 0.8125rem; color: var(--ur-fg-muted, #64748b); }
    .partner-history {
      padding: 20px; border-radius: 12px; background: var(--ur-bg-surface, #16161f);
      border: 1px solid var(--ur-border-subtle, #222233); display: flex; flex-direction: column; gap: 12px;
    }
    .partner-history__hd { display: flex; align-items: center; justify-content: space-between; }
    .partner-history__hd-left { display: flex; align-items: center; gap: 8px; }
    .partner-history__label { font-size: 0.75rem; font-weight: 600; color: var(--ur-fg-muted, #64748b); letter-spacing: 0.05em; }
    .partner-history__live { display: flex; align-items: center; gap: 4px; font-size: 0.625rem; font-weight: 700; color: var(--ur-accent-primary, #6366f1); }
    .partner-history__live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ur-accent-primary, #6366f1); animation: live-pulse 1.5s ease-in-out infinite; }
    @keyframes live-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
    .partner-history__empty { margin: 0; font-size: 0.875rem; color: var(--ur-fg-disabled, #64748b); }
    .partner-history__timeline { display: flex; flex-direction: column; gap: 12px; }
    .partner-history__entry { display: flex; align-items: flex-start; gap: 12px; }
    .partner-history__marker { display: flex; flex-direction: column; align-items: center; }
    .partner-history__dot { width: 10px; height: 10px; border-radius: 50%; background: var(--ur-accent-primary, #6366f1); flex-shrink: 0; margin-top: 4px; }
    .partner-history__line { width: 2px; flex: 1; background: var(--ur-border-subtle, #222233); margin-top: 4px; min-height: 20px; }
    .partner-history__body { flex: 1; }
    .partner-history__change { display: flex; align-items: center; gap: 6px; font-size: 0.875rem; flex-wrap: wrap; }
    .partner-history__from, .partner-history__to { color: var(--ur-fg-primary, #f1f5f9); font-weight: 500; }
    .partner-history__arrow { font-size: 16px; width: 16px; height: 16px; color: var(--ur-fg-muted, #64748b); }
    .partner-history__date { color: var(--ur-fg-muted, #64748b); font-size: 0.75rem; }
  `],
})
export class PartnerDetailPageComponent implements OnInit, OnDestroy {
  private partners = inject(PARTNER_SERVICE);
  private realtime = inject(REALTIME_SERVICE);
  private auth = inject(AUTH_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  partner = signal<PartnerDetailDto | null>(null);
  loading = signal(true);
  notFound = signal(false);
  changingStage = signal(false);
  currentUserId = signal('');
  showDeleteDialog = signal(false);
  deleting = signal(false);
  canDelete = signal(false);
  stages = STAGES;

  stageToast = signal(false);
  linkedToast = signal(false);
  linkedContactId = signal<string | null>(null);
  savedToast = signal(false);
  deleteError = signal(false);
  changeStageError = signal(false);

  showStageDialog = signal(false);
  pendingStage = signal<PartnerStage | null>(null);
  stageReason = '';

  private stageToastTimer?: ReturnType<typeof setTimeout>;
  private linkedToastTimer?: ReturnType<typeof setTimeout>;
  private savedToastTimer?: ReturnType<typeof setTimeout>;
  private deleteErrorTimer?: ReturnType<typeof setTimeout>;
  private changeStageErrorTimer?: ReturnType<typeof setTimeout>;

  stageIndex = computed(() => {
    const p = this.partner();
    if (!p) return 0;
    return this.stages.findIndex(s => s.value === p.stage);
  });

  partnerInitials = computed(() => {
    const words = (this.partner()?.name ?? '').trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '';
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  });

  getEntryForStage(stageValue: string) {
    return this.partner()?.history.find(h => h.toStage === stageValue);
  }

  private sub?: Subscription;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.partners.getById(id).subscribe({
      next: (p) => { this.partner.set(p); this.loading.set(false); },
      error: () => { this.notFound.set(true); this.loading.set(false); },
    });
    this.auth.me().subscribe({
      next: (u) => {
        this.currentUserId.set(u.id);
        this.canDelete.set(u.roles.includes('Admin') || u.roles.includes('CityLead'));
      },
    });

    if (this.route.snapshot.queryParamMap.get('saved') === '1') {
      this.savedToast.set(true);
      this.savedToastTimer = setTimeout(() => this.savedToast.set(false), 3000);
      this.router.navigate([], { replaceUrl: true, relativeTo: this.route, queryParams: {} });
    }

    this.realtime.connect().catch(() => {});
    this.sub = this.realtime.events$.subscribe((event) => {
      if (event['eventType'] === 'partnerStageChanged' && event['partnerId'] === id) {
        this.partner.update((p) => p ? { ...p, stage: event['toStage'] as PartnerStage } : p);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    clearTimeout(this.stageToastTimer);
    clearTimeout(this.linkedToastTimer);
    clearTimeout(this.savedToastTimer);
    clearTimeout(this.deleteErrorTimer);
    clearTimeout(this.changeStageErrorTimer);
  }

  confirmDelete(): void {
    const p = this.partner();
    if (!p) return;
    this.deleting.set(true);
    this.partners.delete(p.id).subscribe({
      next: () => this.router.navigate(['/partners'], { queryParams: { deleted: '1' } }),
      error: () => {
        this.deleting.set(false);
        this.showDeleteDialog.set(false);
        clearTimeout(this.deleteErrorTimer);
        this.deleteError.set(true);
        this.deleteErrorTimer = setTimeout(() => this.deleteError.set(false), 4000);
      },
    });
  }

  openStageDialog(stage: PartnerStage): void {
    this.pendingStage.set(stage);
    this.stageReason = '';
    this.showStageDialog.set(true);
  }

  confirmStageChange(): void {
    const stage = this.pendingStage();
    if (!stage) return;
    this.showStageDialog.set(false);
    this.changeStage(stage);
  }

  changeStage(stage: PartnerStage): void {
    const p = this.partner();
    if (!p || p.stage === stage) return;
    this.changingStage.set(true);
    this.partners.changeStage(p.id, stage).subscribe({
      next: () => {
        this.partner.update((current) => current ? {
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

  onContactLinked(contactId: string): void {
    clearTimeout(this.linkedToastTimer);
    this.linkedContactId.set(contactId);
    this.linkedToast.set(true);
    this.linkedToastTimer = setTimeout(() => this.linkedToast.set(false), 4000);
  }

  stageLabel(stage: string): string {
    return this.stages.find(s => s.value === stage)?.label ?? stage;
  }

  scrollToNotes(): void {
    document.querySelector('ur-notes-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

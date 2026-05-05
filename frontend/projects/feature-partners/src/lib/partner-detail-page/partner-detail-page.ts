import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AUTH_SERVICE, PARTNER_SERVICE, PartnerDetailDto, PartnerStage, REALTIME_SERVICE } from 'api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
  imports: [RouterLink, DatePipe, MatButtonModule, MatIconModule, UrButtonComponent, UrDialogComponent, NotesPanelComponent, PartnerContactsPanelComponent],
  styles: [`
    .partner-toast {
      position: fixed; top: 16px; right: 24px; display: flex; align-items: center;
      gap: 10px; padding: 12px 16px; border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-overlay, #1e293b); color: #fff; font-size: 0.875rem; font-weight: 500;
      border: 1px solid var(--ur-success, #22c55e);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .partner-toast mat-icon { color: var(--ur-success, #22c55e); font-size: 18px; width: 18px; height: 18px; }
    .partner-toast--error { border-color: var(--ur-error-fg, #dc2626); }
    .partner-toast--error mat-icon { color: var(--ur-error-fg, #dc2626); }
    .partner-detail__permission-banner {
      display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 6px; margin-top: 8px;
      background: var(--ur-info-bg, #eff6ff); color: var(--ur-info-fg, #1d4ed8);
      border: 1px solid var(--ur-info-border, #bfdbfe); font-size: 0.875rem;
    }
    .partner-detail__permission-banner mat-icon { font-size: 16px; width: 16px; height: 16px; flex-shrink: 0; }
  `],
})
export class PartnerDetailPageComponent implements OnInit, OnDestroy {
  private partners = inject(PARTNER_SERVICE);
  private realtime = inject(REALTIME_SERVICE);
  private auth = inject(AUTH_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  partner = signal<PartnerDetailDto | null>(null);
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

  private stageToastTimer?: ReturnType<typeof setTimeout>;
  private linkedToastTimer?: ReturnType<typeof setTimeout>;
  private savedToastTimer?: ReturnType<typeof setTimeout>;
  private deleteErrorTimer?: ReturnType<typeof setTimeout>;

  stageIndex = computed(() => {
    const p = this.partner();
    if (!p) return 0;
    return this.stages.findIndex(s => s.value === p.stage);
  });

  getEntryForStage(stageValue: string) {
    return this.partner()?.history.find(h => h.toStage === stageValue);
  }

  private sub?: Subscription;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.partners.getById(id).subscribe({
      next: (p) => this.partner.set(p),
      error: () => this.notFound.set(true),
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
      error: () => this.changingStage.set(false),
    });
  }

  onContactLinked(contactId: string): void {
    clearTimeout(this.linkedToastTimer);
    this.linkedContactId.set(contactId);
    this.linkedToast.set(true);
    this.linkedToastTimer = setTimeout(() => this.linkedToast.set(false), 4000);
  }
}

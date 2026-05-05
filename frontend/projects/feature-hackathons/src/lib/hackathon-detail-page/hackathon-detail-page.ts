import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HACKATHON_SERVICE, HackathonDetailDto, HackathonStage, REALTIME_SERVICE } from 'api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UrButtonComponent, UrDialogComponent } from 'components';
import { ProductsSectionComponent } from '../products-section/products-section';
import { Subscription } from 'rxjs';

const STAGES: { value: HackathonStage; label: string }[] = [
  { value: 'Discover', label: 'Discover' },
  { value: 'Define', label: 'Define' },
  { value: 'Design', label: 'Design' },
  { value: 'Develop', label: 'Develop' },
  { value: 'Launch', label: 'Launch' },
];

@Component({
  selector: 'ur-hackathon-detail-page',
  templateUrl: './hackathon-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe, MatButtonModule, MatIconModule, UrButtonComponent, UrDialogComponent, ProductsSectionComponent],
  styles: [`
    .hackathon-toast {
      position: fixed; top: 16px; right: 24px; display: flex; align-items: center;
      gap: 10px; padding: 12px 16px; border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-overlay, #1e293b); color: #fff; font-size: 0.875rem; font-weight: 500;
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .hackathon-toast--error { border: 1px solid var(--ur-error-fg, #dc2626); }
    .hackathon-toast--error mat-icon { color: var(--ur-error-fg, #dc2626); font-size: 18px; width: 18px; height: 18px; }
  `],
})
export class HackathonDetailPageComponent implements OnInit, OnDestroy {
  private hackathons = inject(HACKATHON_SERVICE);
  private realtime = inject(REALTIME_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  hackathon = signal<HackathonDetailDto | null>(null);
  notFound = signal(false);
  changingStage = signal(false);
  showDeleteDialog = signal(false);
  deleting = signal(false);
  deleteError = signal(false);
  changeStageError = signal(false);
  stages = STAGES;

  private deleteErrorTimer?: ReturnType<typeof setTimeout>;
  private changeStageErrorTimer?: ReturnType<typeof setTimeout>;

  stageIndex = computed(() => {
    const h = this.hackathon();
    if (!h) return 0;
    return this.stages.findIndex(s => s.value === h.stage);
  });

  private sub?: Subscription;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.hackathons.getById(id).subscribe({
      next: (h) => this.hackathon.set(h),
      error: () => this.notFound.set(true),
    });

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
  }

  confirmDelete(): void {
    const h = this.hackathon();
    if (!h) return;
    this.deleting.set(true);
    this.hackathons.delete(h.id).subscribe({
      next: () => this.router.navigateByUrl('/hackathons'),
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

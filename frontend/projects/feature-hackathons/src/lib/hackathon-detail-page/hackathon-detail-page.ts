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
  stages = STAGES;

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
  }

  confirmDelete(): void {
    const h = this.hackathon();
    if (!h) return;
    this.deleting.set(true);
    this.hackathons.delete(h.id).subscribe({
      next: () => this.router.navigateByUrl('/hackathons'),
      error: () => this.deleting.set(false),
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
      error: () => this.changingStage.set(false),
    });
  }
}

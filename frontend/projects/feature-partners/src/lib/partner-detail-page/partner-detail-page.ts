import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PARTNER_SERVICE, PartnerDetailDto, PartnerStage, REALTIME_SERVICE } from 'api';
import { UrButtonComponent } from 'components';
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
  imports: [RouterLink, DatePipe, UrButtonComponent],
})
export class PartnerDetailPageComponent implements OnInit, OnDestroy {
  private partners = inject(PARTNER_SERVICE);
  private realtime = inject(REALTIME_SERVICE);
  private route = inject(ActivatedRoute);

  partner = signal<PartnerDetailDto | null>(null);
  notFound = signal(false);
  changingStage = signal(false);
  stages = STAGES;

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

    this.realtime.connect().catch(() => {});
    this.sub = this.realtime.events$.subscribe((event) => {
      if (event['eventType'] === 'partnerStageChanged' && event['partnerId'] === id) {
        this.partner.update((p) => p ? { ...p, stage: event['toStage'] as PartnerStage } : p);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
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
      },
      error: () => this.changingStage.set(false),
    });
  }
}

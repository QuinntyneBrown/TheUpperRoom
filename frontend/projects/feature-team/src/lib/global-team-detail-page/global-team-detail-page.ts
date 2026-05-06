import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TEAM_SERVICE, GlobalTeamDetailDto } from 'api';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ur-global-team-detail-page',
  templateUrl: './global-team-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatIconModule],
  styles: [`
    .global-team-detail { padding: 24px; }
    .global-team-detail__back { display: inline-flex; align-items: center; gap: 4px; font-size: 0.875rem; color: var(--ur-fg-secondary, #94a3b8); text-decoration: none; margin-bottom: 16px; }
    .global-team-detail__back:hover { color: var(--ur-fg-primary, #f1f5f9); }
    .global-team-detail__back mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .global-team-detail__title { margin: 0 0 8px; font-size: 1.5rem; font-weight: 700; color: var(--ur-fg-primary, #f1f5f9); }
    .global-team-detail__stats { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 20px; }
    .global-team-detail__stat { display: flex; flex-direction: column-reverse; padding: 16px 20px; border-radius: 8px; background: var(--ur-bg-surface, #16161f); border: 1px solid var(--ur-border-subtle, #222233); min-width: 140px; }
    .global-team-detail__stat-value { font-size: 1.75rem; font-weight: 700; color: var(--ur-fg-primary, #f1f5f9); margin: 0; }
    .global-team-detail__stat-label { font-size: 0.8125rem; color: var(--ur-fg-muted, #64748b); margin: 4px 0 0; }
    .global-team-detail__loading { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
    .global-team-detail__loading-row { height: 40px; border-radius: 6px; background: var(--ur-border-default, #2a2a3a); animation: detail-pulse 1.4s ease-in-out infinite; }
    @keyframes detail-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
    .global-team-detail__error { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 8px; margin-top: 12px; background: color-mix(in srgb, var(--ur-danger, #f87171) 12%, transparent); color: var(--ur-danger, #f87171); border: 1px solid color-mix(in srgb, var(--ur-danger, #f87171) 40%, transparent); font-size: 0.875rem; }
  `],
})
export class GlobalTeamDetailPageComponent implements OnInit {
  private team = inject(TEAM_SERVICE);
  private route = inject(ActivatedRoute);

  detail = signal<GlobalTeamDetailDto | null>(null);
  loading = signal(true);
  loadError = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.team.getGlobalTeam(id).subscribe({
      next: (d) => { this.detail.set(d); this.loading.set(false); },
      error: () => { this.loading.set(false); this.loadError.set(true); },
    });
  }
}

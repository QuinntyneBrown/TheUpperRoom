import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TEAM_SERVICE, GlobalTeamSummaryDto } from 'api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'ur-global-teams-page',
  templateUrl: './global-teams-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterModule, MatButtonModule, MatIconModule],
  styles: [`
    .global-teams-page { display: flex; flex-direction: column; height: 100%; }
    .global-teams-page__header {
      display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;
      padding: 16px 20px; border-bottom: 1px solid var(--ur-border-subtle, #334155);
      background: var(--ur-bg-surface, #1e293b);
    }
    .global-teams-page__title { margin: 0; font-size: 1.125rem; font-weight: 600; color: var(--ur-fg-primary, #f1f5f9); }
    .global-teams-page__search { padding: 12px 20px; border-bottom: 1px solid var(--ur-border-subtle, #334155); }
    .global-teams-page__search-input {
      width: 100%; max-width: 360px; height: 36px; padding: 0 12px; border-radius: 6px;
      border: 1px solid var(--ur-border-default, #475569);
      background: var(--ur-bg-elevated, #0f172a); color: var(--ur-fg-primary, #f1f5f9); font-size: 0.875rem; outline: none;
    }
    .global-teams-page__search-input:focus { border-color: var(--ur-accent-primary, #6366f1); }
    .teams-table {
      width: 100%; border-collapse: collapse; display: table;
    }
    .teams-table thead { background: var(--ur-bg-elevated, #0f172a); }
    .teams-table th, .teams-table td { padding: 10px 16px; text-align: left; font-size: 0.875rem; border-bottom: 1px solid var(--ur-border-subtle, #334155); }
    .teams-table th { color: var(--ur-fg-secondary, #94a3b8); font-weight: 500; }
    .teams-table td { color: var(--ur-fg-primary, #f1f5f9); }
    .teams-table tbody tr:hover { background: var(--ur-bg-elevated, #0f172a); }
    .teams-cards { display: none; flex-direction: column; gap: 12px; padding: 20px; }
    .team-card {
      padding: 16px; border-radius: 8px; background: var(--ur-bg-surface, #1e293b);
      border: 1px solid var(--ur-border-subtle, #334155); display: flex; flex-direction: column; gap: 4px;
    }
    .team-card__city { margin: 0; font-size: 0.9375rem; font-weight: 600; color: var(--ur-fg-primary, #f1f5f9); }
    .team-card__members, .team-card__hackathons, .team-card__partners { margin: 0; font-size: 0.8125rem; color: var(--ur-fg-secondary, #94a3b8); }
    .global-teams-page__total { margin: 0; padding: 10px 20px; font-size: 0.8125rem; color: var(--ur-fg-muted, #64748b); border-top: 1px solid var(--ur-border-subtle, #334155); }
    @media (max-width: 767px) {
      .teams-table { display: none; }
      .teams-cards { display: flex; }
    }
    .teams-load-error {
      display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 8px; margin: 16px 0;
      background: var(--ur-error-bg, #fef2f2); color: var(--ur-error-fg, #dc2626);
      border: 1px solid var(--ur-error-border, #fecaca); font-size: 0.875rem;
    }
    .teams-load-error mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }
    .teams-loading { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
    .teams-loading__row { height: 40px; border-radius: 6px; background: var(--ur-skeleton-bg, #f1f5f9); animation: teams-pulse 1.4s ease-in-out infinite; }
    @keyframes teams-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
    .global-teams-page__empty {
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      padding: 48px 24px; text-align: center; color: var(--ur-fg-muted, #64748b);
    }
    .global-teams-page__empty mat-icon { font-size: 48px; width: 48px; height: 48px; opacity: 0.4; }
    .global-teams-page__empty p { margin: 0; font-size: 0.9375rem; }
  `],
})
export class GlobalTeamsPageComponent implements OnInit {
  private team = inject(TEAM_SERVICE);

  teams = signal<GlobalTeamSummaryDto[]>([]);
  total = signal(0);
  page = signal(1);
  searchTerm = signal('');
  loadError = signal(false);
  loading = signal(true);

  private search$ = new Subject<string>();

  ngOnInit(): void {
    this.loadTeams();
    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        const search = term.length >= 2 ? term : undefined;
        return this.team.listGlobalTeams(1, 25, search).pipe(
          catchError(() => of(null))
        );
      })
    ).subscribe((r) => { if (r) { this.teams.set(r.rows); this.total.set(r.total); this.page.set(1); } });
  }

  loadTeams(): void {
    this.loadError.set(false);
    this.loading.set(true);
    const term = this.searchTerm();
    const search = term.length >= 2 ? term : undefined;
    this.team.listGlobalTeams(this.page(), 25, search).subscribe({
      next: (r) => { this.teams.set(r.rows); this.total.set(r.total); this.loading.set(false); },
      error: () => { this.loading.set(false); this.loadError.set(true); },
    });
  }

  onSearch(value: string): void {
    this.searchTerm.set(value);
    this.search$.next(value);
  }
}

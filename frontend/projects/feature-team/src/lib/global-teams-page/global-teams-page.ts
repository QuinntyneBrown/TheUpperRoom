import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TEAM_SERVICE, GlobalTeamSummaryDto } from 'api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'ur-global-teams-page',
  templateUrl: './global-teams-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatButtonModule, MatIconModule],
  styles: [`
    .teams-load-error {
      display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 8px; margin: 16px 0;
      background: var(--ur-error-bg, #fef2f2); color: var(--ur-error-fg, #dc2626);
      border: 1px solid var(--ur-error-border, #fecaca); font-size: 0.875rem;
    }
    .teams-load-error mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }
  `],
})
export class GlobalTeamsPageComponent implements OnInit {
  private team = inject(TEAM_SERVICE);

  teams = signal<GlobalTeamSummaryDto[]>([]);
  total = signal(0);
  page = signal(1);
  searchTerm = signal('');
  loadError = signal(false);

  private search$ = new Subject<string>();

  ngOnInit(): void {
    this.loadTeams();
    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        const search = term.length >= 2 ? term : undefined;
        return this.team.listGlobalTeams(1, 25, search);
      })
    ).subscribe({ next: (r) => { this.teams.set(r.rows); this.total.set(r.total); this.page.set(1); } });
  }

  loadTeams(): void {
    this.loadError.set(false);
    const term = this.searchTerm();
    const search = term.length >= 2 ? term : undefined;
    this.team.listGlobalTeams(this.page(), 25, search).subscribe({
      next: (r) => { this.teams.set(r.rows); this.total.set(r.total); },
      error: () => this.loadError.set(true),
    });
  }

  onSearch(value: string): void {
    this.searchTerm.set(value);
    this.search$.next(value);
  }
}

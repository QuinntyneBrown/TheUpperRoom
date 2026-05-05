import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TEAM_SERVICE, GlobalTeamSummaryDto } from 'api';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'ur-global-teams-page',
  templateUrl: './global-teams-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class GlobalTeamsPageComponent implements OnInit {
  private team = inject(TEAM_SERVICE);

  teams = signal<GlobalTeamSummaryDto[]>([]);
  total = signal(0);
  page = signal(1);
  searchTerm = signal('');

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
    const term = this.searchTerm();
    const search = term.length >= 2 ? term : undefined;
    this.team.listGlobalTeams(this.page(), 25, search)
      .subscribe({ next: (r) => { this.teams.set(r.rows); this.total.set(r.total); } });
  }

  onSearch(value: string): void {
    this.searchTerm.set(value);
    this.search$.next(value);
  }
}

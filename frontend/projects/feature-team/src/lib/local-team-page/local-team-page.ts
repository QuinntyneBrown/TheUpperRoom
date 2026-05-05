import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TEAM_SERVICE, TeamMemberDto } from 'api';

@Component({
  selector: 'ur-local-team-page',
  templateUrl: './local-team-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocalTeamPageComponent implements OnInit {
  private team = inject(TEAM_SERVICE);

  members = signal<TeamMemberDto[]>([]);

  ngOnInit(): void {
    this.team.getLocalTeam().subscribe({ next: (m) => this.members.set(m) });
  }
}

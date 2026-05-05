import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TEAM_SERVICE, TeamMemberDto } from 'api';
import { UrButtonComponent } from 'components';
import { InviteDialogComponent } from '../invite-dialog/invite-dialog';

@Component({
  selector: 'ur-local-team-page',
  templateUrl: './local-team-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UrButtonComponent, InviteDialogComponent],
})
export class LocalTeamPageComponent implements OnInit {
  private team = inject(TEAM_SERVICE);

  members = signal<TeamMemberDto[]>([]);
  showInvite = signal(false);

  ngOnInit(): void {
    this.team.getLocalTeam().subscribe({ next: (m) => this.members.set(m) });
  }

  onInvited(): void {
    this.showInvite.set(false);
    this.team.getLocalTeam().subscribe({ next: (m) => this.members.set(m) });
  }
}

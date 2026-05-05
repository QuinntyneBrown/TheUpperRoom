import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { AUTH_SERVICE, TEAM_SERVICE, TeamMemberDto } from 'api';
import { UrButtonComponent } from 'components';
import { InviteDialogComponent } from '../invite-dialog/invite-dialog';
import { RoleChipEditorComponent } from '../role-chip-editor/role-chip-editor';

@Component({
  selector: 'ur-local-team-page',
  templateUrl: './local-team-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UrButtonComponent, InviteDialogComponent, RoleChipEditorComponent],
})
export class LocalTeamPageComponent implements OnInit {
  private team = inject(TEAM_SERVICE);
  private auth = inject(AUTH_SERVICE);

  members = signal<TeamMemberDto[]>([]);
  showInvite = signal(false);
  currentRoles = signal<string[]>([]);

  canEdit = computed(() =>
    this.currentRoles().includes('Admin') || this.currentRoles().includes('CityLead')
  );

  ngOnInit(): void {
    this.auth.me().subscribe({ next: (me) => this.currentRoles.set(me.roles) });
    this.loadTeam();
  }

  loadTeam(): void {
    this.team.getLocalTeam().subscribe({ next: (m) => this.members.set(m) });
  }

  onInvited(): void {
    this.showInvite.set(false);
    this.loadTeam();
  }
}

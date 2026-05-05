import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AUTH_SERVICE, TEAM_SERVICE, TeamMemberDto } from 'api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UrButtonComponent, UrDialogComponent } from 'components';
import { InviteDialogComponent } from '../invite-dialog/invite-dialog';
import { RoleChipEditorComponent } from '../role-chip-editor/role-chip-editor';

@Component({
  selector: 'ur-local-team-page',
  templateUrl: './local-team-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, UrButtonComponent, UrDialogComponent, InviteDialogComponent, RoleChipEditorComponent],
  styles: [`
    .team-load-error {
      display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 8px; margin: 16px 0;
      background: var(--ur-error-bg, #fef2f2); color: var(--ur-error-fg, #dc2626);
      border: 1px solid var(--ur-error-border, #fecaca); font-size: 0.875rem;
    }
    .team-load-error mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }
  `],
})
export class LocalTeamPageComponent implements OnInit, OnDestroy {
  private team = inject(TEAM_SERVICE);
  private auth = inject(AUTH_SERVICE);

  members = signal<TeamMemberDto[]>([]);
  loadError = signal(false);
  showInvite = signal(false);
  removingMember = signal<TeamMemberDto | null>(null);
  currentRoles = signal<string[]>([]);

  canEdit = computed(() =>
    this.currentRoles().includes('Admin') || this.currentRoles().includes('CityLead')
  );

  ngOnInit(): void {
    this.auth.me().subscribe({ next: (me) => this.currentRoles.set(me.roles) });
    this.loadTeam();
  }

  ngOnDestroy(): void {}

  loadTeam(): void {
    this.loadError.set(false);
    this.team.getLocalTeam().subscribe({
      next: (m) => this.members.set(m),
      error: () => this.loadError.set(true),
    });
  }

  onInvited(): void {
    this.showInvite.set(false);
    this.loadTeam();
  }

  confirmRemove(): void {
    const m = this.removingMember();
    if (!m) return;
    this.team.removeMember(m.id).subscribe({
      next: () => {
        this.removingMember.set(null);
        this.loadTeam();
      },
    });
  }
}

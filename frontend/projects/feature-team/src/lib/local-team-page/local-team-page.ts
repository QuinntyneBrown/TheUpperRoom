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
    .team-error-toast, .team-success-toast {
      position: fixed; top: 16px; right: 24px; display: flex; align-items: center;
      gap: 10px; padding: 12px 16px; border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-overlay, #1e293b); color: #fff; font-size: 0.875rem; font-weight: 500;
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .team-error-toast { border: 1px solid var(--ur-error-fg, #dc2626); }
    .team-error-toast mat-icon { color: var(--ur-error-fg, #dc2626); font-size: 18px; width: 18px; height: 18px; }
    .team-success-toast { border: 1px solid var(--ur-success, #22c55e); }
    .team-success-toast mat-icon { color: var(--ur-success, #22c55e); font-size: 18px; width: 18px; height: 18px; }
    .team-loading { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
    .team-loading__row { height: 48px; border-radius: 6px; background: var(--ur-skeleton-bg, #f1f5f9); animation: team-pulse 1.4s ease-in-out infinite; }
    @keyframes team-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
    .team-page__empty {
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      padding: 48px 24px; text-align: center; color: var(--ur-fg-muted, #64748b);
    }
    .team-page__empty mat-icon { font-size: 48px; width: 48px; height: 48px; opacity: 0.4; }
    .team-page__empty p { margin: 0; font-size: 0.9375rem; }
  `],
})
export class LocalTeamPageComponent implements OnInit, OnDestroy {
  private team = inject(TEAM_SERVICE);
  private auth = inject(AUTH_SERVICE);

  members = signal<TeamMemberDto[]>([]);
  loading = signal(true);
  loadError = signal(false);
  removeError = signal(false);
  removeSuccess = signal(false);
  showInvite = signal(false);
  removingMember = signal<TeamMemberDto | null>(null);
  currentRoles = signal<string[]>([]);

  private removeErrorTimer?: ReturnType<typeof setTimeout>;
  private removeSuccessTimer?: ReturnType<typeof setTimeout>;

  canEdit = computed(() =>
    this.currentRoles().includes('Admin') || this.currentRoles().includes('CityLead')
  );

  ngOnInit(): void {
    this.auth.me().subscribe({
      next: (me) => this.currentRoles.set(me.roles),
      error: () => { /* roles default to empty — user cannot edit */ },
    });
    this.loadTeam();
  }

  ngOnDestroy(): void {
    clearTimeout(this.removeErrorTimer);
    clearTimeout(this.removeSuccessTimer);
  }

  loadTeam(): void {
    this.loadError.set(false);
    this.loading.set(true);
    this.team.getLocalTeam().subscribe({
      next: (m) => { this.members.set(m); this.loading.set(false); },
      error: () => { this.loading.set(false); this.loadError.set(true); },
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
        clearTimeout(this.removeSuccessTimer);
        this.removeSuccess.set(true);
        this.removeSuccessTimer = setTimeout(() => this.removeSuccess.set(false), 3000);
        this.loadTeam();
      },
      error: () => {
        this.removingMember.set(null);
        clearTimeout(this.removeErrorTimer);
        this.removeError.set(true);
        this.removeErrorTimer = setTimeout(() => this.removeError.set(false), 4000);
      },
    });
  }
}

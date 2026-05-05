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
    .team-page { display: flex; flex-direction: column; height: 100%; }
    .team-page__header {
      display: flex; align-items: center; justify-content: space-between;
      height: 64px; padding: 0 16px 0 24px; flex-shrink: 0;
      background: var(--ur-bg-elevated, #101018);
      border-bottom: 1px solid var(--ur-border-subtle, #222233);
    }
    .team-page__title { margin: 0; font-size: 1.125rem; font-weight: 600; color: var(--ur-fg-primary, #f1f5f9); font-family: var(--ur-font-heading, 'Geist', sans-serif); }
    .team-page__header-actions { display: flex; align-items: center; gap: 12px; }
    .team-page__content { flex: 1; overflow-y: auto; padding: 24px; }
    .team-load-error {
      display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 8px; margin: 16px 0;
      background: color-mix(in srgb, var(--ur-danger, #f87171) 12%, transparent);
      color: var(--ur-danger, #f87171);
      border: 1px solid color-mix(in srgb, var(--ur-danger, #f87171) 40%, transparent); font-size: 0.875rem;
    }
    .team-load-error mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }
    .team-error-toast, .team-success-toast {
      position: fixed; top: 16px; right: 24px; display: flex; align-items: center;
      gap: 10px; padding: 12px 16px; border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-surface, #16161f); color: #fff; font-size: 0.875rem; font-weight: 500;
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .team-error-toast { border: 1px solid var(--ur-danger, #f87171); }
    .team-error-toast mat-icon { color: var(--ur-danger, #f87171); font-size: 18px; width: 18px; height: 18px; }
    .team-success-toast { border: 1px solid var(--ur-success, #22c55e); }
    .team-success-toast mat-icon { color: var(--ur-success, #22c55e); font-size: 18px; width: 18px; height: 18px; }
    .team-loading { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
    .team-loading__row { height: 48px; border-radius: 6px; background: var(--ur-border-default, #2a2a3a); animation: team-pulse 1.4s ease-in-out infinite; }
    @keyframes team-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
    .team-page__empty {
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      padding: 48px 24px; text-align: center; color: var(--ur-fg-muted, #a8a8b5);
    }
    .team-page__empty mat-icon { font-size: 48px; width: 48px; height: 48px; opacity: 0.4; }
    .team-page__empty p { margin: 0; font-size: 0.9375rem; }
    .team-table {
      width: 100%; border-collapse: collapse; font-size: 0.875rem;
      th { text-align: left; padding: 10px 12px; color: var(--ur-fg-muted, #a8a8b5); font-weight: 500; border-bottom: 1px solid var(--ur-border-subtle, #222233); }
      td { padding: 12px; vertical-align: middle; border-bottom: 1px solid var(--ur-border-subtle, #222233); color: var(--ur-fg-primary, #fff); }
      tr:last-child td { border-bottom: none; }
    }
    .team-cards { display: none; }
    @media (max-width: 767px) {
      .team-table { display: none; }
      .team-cards { display: flex; flex-direction: column; gap: 12px; margin-top: 12px; }
      .team-card { padding: 16px; border-radius: 8px; background: var(--ur-bg-surface, #16161f); border: 1px solid var(--ur-border-subtle, #222233); }
      .team-card__name { margin: 0 0 8px; font-weight: 600; color: var(--ur-fg-primary, #fff); }
      .team-card__email { margin: 6px 0; font-size: 0.8125rem; color: var(--ur-fg-secondary, #a1a1aa); }
      .team-card__status { font-size: 0.75rem; color: var(--ur-fg-muted, #a8a8b5); }
    }
    .team-role-grid {
      display: flex; flex-wrap: wrap; gap: 20px;
    }
    .team-role-card {
      flex: 1 1 calc(50% - 10px); min-width: 260px; display: flex; flex-direction: column; gap: 16px;
      padding: 20px; border-radius: 8px; background: var(--ur-bg-elevated, #101018);
      border: 1px solid var(--ur-border-subtle, #222233);
    }
    .team-role-card__header { display: flex; align-items: center; justify-content: space-between; }
    .team-role-card__label { font-size: 0.875rem; font-weight: 600; color: var(--ur-fg-primary, #fff); }
    .team-role-card__count { font-size: 0.6875rem; color: var(--ur-fg-muted, #a8a8b5); font-family: 'Geist Mono', monospace; }
    .team-role-card__member {
      display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 6px;
      background: var(--ur-bg-surface, #16161f);
    }
    .team-role-card__member-name { font-size: 0.875rem; font-weight: 500; color: var(--ur-fg-primary, #fff); flex: 1; }
    .team-role-card__empty {
      display: flex; align-items: center; justify-content: center; padding: 24px;
      font-size: 0.75rem; color: var(--ur-fg-muted, #a8a8b5); border: 1px dashed var(--ur-border-default, #2a2a3a);
      border-radius: 6px;
    }
  `],
})
export class LocalTeamPageComponent implements OnInit, OnDestroy {
  private team = inject(TEAM_SERVICE);
  private auth = inject(AUTH_SERVICE);

  readonly roleCards = [
    { key: 'CityLead', label: 'City Lead' },
    { key: 'PrayerLead', label: 'Prayer Lead' },
    { key: 'EventLead', label: 'Event Lead' },
    { key: 'CommunicationLead', label: 'Communication Lead' },
  ];

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

  membersByRole = computed(() => {
    const all = this.members();
    const map: Record<string, TeamMemberDto[]> = {};
    for (const card of this.roleCards) map[card.key] = [];
    for (const m of all) {
      for (const r of m.roles) {
        if (map[r]) map[r].push(m);
      }
    }
    return map;
  });

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

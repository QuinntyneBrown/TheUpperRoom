import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TEAM_SERVICE } from 'api';

const SUBORDINATE_ROLES = ['PrayerLead', 'EventLead', 'CommunicationLead'] as const;
type SubRole = (typeof SUBORDINATE_ROLES)[number];

const ROLE_LABELS: Record<SubRole, string> = {
  PrayerLead: 'Prayer Lead',
  EventLead: 'Event Lead',
  CommunicationLead: 'Communication Lead',
};

@Component({
  selector: 'ur-role-chip-editor',
  templateUrl: './role-chip-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  styles: [`
    .role-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .role-chip {
      padding: 3px 10px; border-radius: 99px; font-size: 0.8125rem; cursor: pointer;
      border: 1px solid var(--ur-border-default, #475569);
      background: transparent; color: var(--ur-fg-muted, #64748b);
      transition: background 0.15s, color 0.15s, border-color 0.15s;
    }
    .role-chip--active {
      background: var(--ur-accent-primary, #6366f1); color: #fff;
      border-color: var(--ur-accent-primary, #6366f1);
    }
    .role-chip--disabled { opacity: 0.6; cursor: default; }
    .role-chip-error {
      display: flex; align-items: center; gap: 6px; margin-top: 6px; font-size: 0.8rem;
      color: var(--ur-error-fg, #dc2626);
    }
    .role-chip-error mat-icon { font-size: 14px; width: 14px; height: 14px; flex-shrink: 0; }
  `],
})
export class RoleChipEditorComponent implements OnDestroy {
  private team = inject(TEAM_SERVICE);

  memberId = input.required<string>();
  memberRoles = input.required<string[]>();
  canEdit = input<boolean>(false);

  changed = output<void>();

  saving = signal(false);
  toggleError = signal(false);

  private toggleErrorTimer?: ReturnType<typeof setTimeout>;

  readonly roles: SubRole[] = [...SUBORDINATE_ROLES];
  readonly roleLabel = (role: SubRole) => ROLE_LABELS[role];

  ngOnDestroy(): void {
    clearTimeout(this.toggleErrorTimer);
  }

  hasRole(role: SubRole): boolean {
    return this.memberRoles().includes(role);
  }

  toggle(role: SubRole): void {
    if (!this.canEdit() || this.saving()) return;
    const action = this.hasRole(role) ? 'remove' : 'add';
    this.saving.set(true);
    this.team.assignRole(this.memberId(), { role, action }).subscribe({
      next: () => { this.saving.set(false); this.changed.emit(); },
      error: () => {
        this.saving.set(false);
        clearTimeout(this.toggleErrorTimer);
        this.toggleError.set(true);
        this.toggleErrorTimer = setTimeout(() => this.toggleError.set(false), 4000);
      },
    });
  }
}

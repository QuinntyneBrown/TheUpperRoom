import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { TEAM_SERVICE } from 'api';

const SUBORDINATE_ROLES = ['PrayerLead', 'EventLead', 'CommunicationLead'] as const;
type SubRole = (typeof SUBORDINATE_ROLES)[number];

@Component({
  selector: 'ur-role-chip-editor',
  templateUrl: './role-chip-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleChipEditorComponent {
  private team = inject(TEAM_SERVICE);

  memberId = input.required<string>();
  memberRoles = input.required<string[]>();
  canEdit = input<boolean>(false);

  changed = output<void>();

  saving = signal(false);

  readonly roles: SubRole[] = [...SUBORDINATE_ROLES];

  hasRole(role: SubRole): boolean {
    return this.memberRoles().includes(role);
  }

  toggle(role: SubRole): void {
    if (!this.canEdit() || this.saving()) return;
    const action = this.hasRole(role) ? 'remove' : 'add';
    this.saving.set(true);
    this.team.assignRole(this.memberId(), { role, action }).subscribe({
      next: () => { this.saving.set(false); this.changed.emit(); },
      error: () => this.saving.set(false),
    });
  }
}

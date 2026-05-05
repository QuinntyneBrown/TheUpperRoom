import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { TEAM_SERVICE } from 'api';
import { UrButtonComponent, UrDialogComponent } from 'components';

const ALL_ROLES = ['CityLead', 'PrayerLead', 'EventLead', 'CommunicationLead'];

@Component({
  selector: 'ur-invite-dialog',
  templateUrl: './invite-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UrButtonComponent, UrDialogComponent],
})
export class InviteDialogComponent {
  private team = inject(TEAM_SERVICE);

  closed = output<void>();
  invited = output<void>();

  allRoles = ALL_ROLES;
  email = signal('');
  selectedRoles = signal<Set<string>>(new Set());
  saving = signal(false);
  errors = signal<Record<string, string>>({});

  toggleRole(role: string): void {
    this.selectedRoles.update(s => {
      const next = new Set(s);
      next.has(role) ? next.delete(role) : next.add(role);
      return next;
    });
  }

  submit(): void {
    const errs: Record<string, string> = {};
    if (!this.email().trim()) errs['email'] = 'Email is required.';
    if (this.selectedRoles().size === 0) errs['roles'] = 'At least one role is required.';
    this.errors.set(errs);
    if (Object.keys(errs).length) return;

    this.saving.set(true);
    this.team.invite({
      email: this.email().trim(),
      roles: [...this.selectedRoles()],
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.invited.emit();
      },
      error: () => this.saving.set(false),
    });
  }
}

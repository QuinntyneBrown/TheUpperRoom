import { ChangeDetectionStrategy, Component, inject, OnDestroy, output, signal } from '@angular/core';
import { TEAM_SERVICE } from 'api';
import { MatIconModule } from '@angular/material/icon';
import { UrButtonComponent, UrDialogComponent } from 'components';

const ALL_ROLES = ['CityLead', 'PrayerLead', 'EventLead', 'CommunicationLead'];
const ROLE_LABELS: Record<string, string> = {
  CityLead: 'City Lead',
  PrayerLead: 'Prayer Lead',
  EventLead: 'Event Lead',
  CommunicationLead: 'Communication Lead',
};

@Component({
  selector: 'ur-invite-dialog',
  templateUrl: './invite-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, UrButtonComponent, UrDialogComponent],
  styles: [`
    .invite-save-error {
      display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 6px; margin-bottom: 12px;
      background: var(--ur-error-bg, #fef2f2); color: var(--ur-error-fg, #dc2626);
      border: 1px solid var(--ur-error-border, #fecaca); font-size: 0.875rem;
    }
    .invite-save-error mat-icon { font-size: 16px; width: 16px; height: 16px; flex-shrink: 0; }
  `],
})
export class InviteDialogComponent implements OnDestroy {
  private team = inject(TEAM_SERVICE);

  closed = output<void>();
  invited = output<void>();

  allRoles = ALL_ROLES;
  roleLabel = (role: string) => ROLE_LABELS[role] ?? role;
  email = signal('');
  selectedRoles = signal<Set<string>>(new Set());
  saving = signal(false);
  saveError = signal(false);
  errors = signal<Record<string, string>>({});

  private saveErrorTimer?: ReturnType<typeof setTimeout>;

  ngOnDestroy(): void {
    clearTimeout(this.saveErrorTimer);
  }

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
      error: () => {
        this.saving.set(false);
        clearTimeout(this.saveErrorTimer);
        this.saveError.set(true);
        this.saveErrorTimer = setTimeout(() => this.saveError.set(false), 4000);
      },
    });
  }
}

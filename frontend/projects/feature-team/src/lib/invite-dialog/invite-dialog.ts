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
    .invite-form { display: flex; flex-direction: column; gap: 16px; }
    .invite-form__field { display: flex; flex-direction: column; gap: 6px; }
    .invite-form__field label, .invite-form__label {
      font-size: 0.875rem; font-weight: 500; color: var(--ur-fg-secondary, #94a3b8);
    }
    .invite-form__field input[type=email] {
      height: 38px; padding: 0 12px; border-radius: 6px; width: 100%; box-sizing: border-box;
      border: 1px solid var(--ur-border-default, #475569);
      background: var(--ur-bg-elevated, #0f172a); color: var(--ur-fg-primary, #f1f5f9);
      font-size: 0.875rem; outline: none;
    }
    .invite-form__field input[type=email]:focus { border-color: var(--ur-accent-primary, #6366f1); }
    .invite-form__roles { display: flex; flex-wrap: wrap; gap: 8px 16px; }
    .invite-form__role-opt { display: flex; align-items: center; gap: 6px; font-size: 0.875rem; color: var(--ur-fg-primary, #f1f5f9); cursor: pointer; }
    .invite-form__actions { display: flex; justify-content: flex-end; gap: 8px; }
    .invite-form__error { font-size: 0.75rem; color: var(--ur-error-fg, #dc2626); }
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

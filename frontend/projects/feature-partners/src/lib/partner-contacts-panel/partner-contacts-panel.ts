import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PARTNER_SERVICE, PartnerContactDto, CreateContactForPartnerRequest } from 'api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UrButtonComponent } from 'components';

@Component({
  selector: 'ur-partner-contacts-panel',
  templateUrl: './partner-contacts-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule, MatIconModule, UrButtonComponent],
  styles: [`
    .partner-contacts__hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .partner-contacts__label { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; color: var(--ur-fg-secondary, #94a3b8); }
    .partner-contacts__empty {
      display: flex; align-items: center; gap: 8px; padding: 12px 0;
      color: var(--ur-fg-muted, #64748b); font-size: 0.875rem;
    }
    .partner-contacts__empty mat-icon { font-size: 18px; width: 18px; height: 18px; opacity: 0.6; }
    .partner-contacts__empty p { margin: 0; }
    .partner-contacts__row { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--ur-border-subtle, #334155); }
    .partner-contacts__row:last-of-type { border-bottom: none; }
    .partner-contacts__avatar {
      width: 32px; height: 32px; border-radius: 50%; background: var(--ur-accent-primary, #6366f1);
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: 600; flex-shrink: 0;
    }
    .partner-contacts__body { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
    .partner-contacts__name { font-size: 0.875rem; font-weight: 500; color: var(--ur-accent-primary, #6366f1); text-decoration: none; }
    .partner-contacts__name:hover { text-decoration: underline; }
    .partner-contacts__email { font-size: 0.8125rem; color: var(--ur-fg-muted, #64748b); }
    .partner-contacts__new-form { display: flex; flex-direction: column; gap: 8px; padding: 12px 0; }
    .partner-contacts__new-banner {
      font-size: 0.8125rem; color: var(--ur-fg-secondary, #94a3b8); padding: 8px 10px;
      background: var(--ur-bg-elevated, #0f172a); border-radius: 6px;
    }
    .partner-contacts__new-row { display: flex; gap: 8px; }
    .partner-contacts__new-form input {
      flex: 1; height: 36px; padding: 0 10px; border-radius: 6px; font-size: 0.875rem; outline: none;
      border: 1px solid var(--ur-border-default, #475569);
      background: var(--ur-bg-elevated, #0f172a); color: var(--ur-fg-primary, #f1f5f9);
    }
    .partner-contacts__new-form input:focus { border-color: var(--ur-accent-primary, #6366f1); }
    .partner-contacts__new-actions { display: flex; justify-content: flex-end; gap: 8px; }
    .contacts-remove-error {
      display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 6px; margin-top: 8px;
      background: var(--ur-error-bg, #fef2f2); color: var(--ur-error-fg, #dc2626);
      border: 1px solid var(--ur-error-border, #fecaca); font-size: 0.875rem;
    }
    .contacts-remove-error mat-icon { font-size: 16px; width: 16px; height: 16px; flex-shrink: 0; }
  `],
})
export class PartnerContactsPanelComponent implements OnInit, OnDestroy {
  private partners = inject(PARTNER_SERVICE);

  partnerId = input.required<string>();
  initialContacts = input<PartnerContactDto[]>([]);

  contactLinked = output<string>();

  contacts = signal<PartnerContactDto[]>([]);
  showNewForm = signal(false);
  saving = signal(false);
  removeError = signal(false);
  createLinkError = signal(false);

  private removeErrorTimer?: ReturnType<typeof setTimeout>;
  private createLinkErrorTimer?: ReturnType<typeof setTimeout>;

  firstName = signal('');
  lastName = signal('');
  email = signal('');

  ngOnInit(): void {
    this.contacts.set(this.initialContacts());
  }

  ngOnDestroy(): void {
    clearTimeout(this.removeErrorTimer);
    clearTimeout(this.createLinkErrorTimer);
  }

  openNewForm(): void {
    this.firstName.set('');
    this.lastName.set('');
    this.email.set('');
    this.showNewForm.set(true);
  }

  cancelNew(): void {
    this.showNewForm.set(false);
  }

  createAndLink(): void {
    if (!this.firstName().trim() || !this.lastName().trim()) return;
    this.saving.set(true);
    const req: CreateContactForPartnerRequest = {
      firstName: this.firstName().trim(),
      lastName: this.lastName().trim(),
      email: this.email().trim() || undefined,
    };
    this.partners.createAndLinkContact(this.partnerId(), req).subscribe({
      next: (res) => {
        this.contacts.update(cs => [...cs, {
          id: res.contactId,
          firstName: req.firstName,
          lastName: req.lastName,
          email: req.email,
        }]);
        this.showNewForm.set(false);
        this.saving.set(false);
        this.contactLinked.emit(res.contactId);
      },
      error: () => {
        this.saving.set(false);
        clearTimeout(this.createLinkErrorTimer);
        this.createLinkError.set(true);
        this.createLinkErrorTimer = setTimeout(() => this.createLinkError.set(false), 4000);
      },
    });
  }

  remove(contactId: string): void {
    this.partners.removeContact(this.partnerId(), contactId).subscribe({
      next: () => this.contacts.update(cs => cs.filter(c => c.id !== contactId)),
      error: () => {
        clearTimeout(this.removeErrorTimer);
        this.removeError.set(true);
        this.removeErrorTimer = setTimeout(() => this.removeError.set(false), 4000);
      },
    });
  }

  initials(c: PartnerContactDto): string {
    return (c.firstName[0] ?? '') + (c.lastName[0] ?? '');
  }
}

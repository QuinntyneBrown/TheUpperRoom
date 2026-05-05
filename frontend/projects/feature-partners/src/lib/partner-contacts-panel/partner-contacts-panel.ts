import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
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
})
export class PartnerContactsPanelComponent implements OnInit {
  private partners = inject(PARTNER_SERVICE);

  partnerId = input.required<string>();
  initialContacts = input<PartnerContactDto[]>([]);

  contactLinked = output<string>();

  contacts = signal<PartnerContactDto[]>([]);
  showNewForm = signal(false);
  saving = signal(false);

  firstName = signal('');
  lastName = signal('');
  email = signal('');

  ngOnInit(): void {
    this.contacts.set(this.initialContacts());
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
      error: () => this.saving.set(false),
    });
  }

  remove(contactId: string): void {
    this.partners.removeContact(this.partnerId(), contactId).subscribe({
      next: () => this.contacts.update(cs => cs.filter(c => c.id !== contactId)),
    });
  }

  initials(c: PartnerContactDto): string {
    return (c.firstName[0] ?? '') + (c.lastName[0] ?? '');
  }
}

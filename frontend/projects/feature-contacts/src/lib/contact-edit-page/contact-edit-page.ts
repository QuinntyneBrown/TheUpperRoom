import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { A11yModule } from '@angular/cdk/a11y';
import { CONTACT_SERVICE, ContactDto } from 'api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UrButtonComponent } from 'components';
import { ContactFormComponent, ContactFormInitial, ContactFormValue } from '../contact-form/contact-form';

@Component({
  selector: 'ur-contact-edit-page',
  templateUrl: './contact-edit-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A11yModule, ContactFormComponent, RouterLink, MatButtonModule, MatIconModule, UrButtonComponent],
  styles: [`
    .conflict-dialog {
      position: fixed; inset: 0; z-index: 500; display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.5);
    }
    .conflict-dialog__panel {
      background: var(--ur-bg-surface, #fff); border-radius: 12px; padding: 24px;
      max-width: 720px; width: 100%; margin: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.25);
    }
    .conflict-dialog__title { margin: 0 0 8px; font-size: 1.125rem; font-weight: 600; }
    .conflict-dialog__subtitle { margin: 0 0 20px; color: var(--ur-fg-muted, #64748b); font-size: 0.875rem; }
    .conflict-dialog__columns { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
    .conflict-col__heading { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 2px solid; }
    .conflict-col--yours .conflict-col__heading { color: var(--ur-accent-primary, #8b5cf6); border-color: var(--ur-accent-primary, #8b5cf6); }
    .conflict-col--server .conflict-col__heading { color: var(--ur-fg-muted, #64748b); border-color: var(--ur-border-default, #e2e8f0); }
    .conflict-field { margin-bottom: 8px; }
    .conflict-field__label { font-size: 0.7rem; color: var(--ur-fg-muted, #64748b); text-transform: uppercase; }
    .conflict-field__value { font-size: 0.875rem; padding: 4px 0; min-height: 20px; }
    .conflict-dialog__actions { display: flex; justify-content: flex-end; gap: 12px; }
    .contact-edit__back {
      display: inline-flex; align-items: center; gap: 6px;
      color: var(--ur-fg-secondary, #94a3b8); font-size: 0.875rem;
      text-decoration: none; margin-bottom: 12px;
    }
    .contact-edit__back:hover { color: var(--ur-fg-primary, #f1f5f9); }
    .contact-edit__back mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .edit-error-toast {
      position: fixed; top: 16px; right: 24px; display: flex; align-items: center;
      gap: 10px; padding: 12px 16px; border-radius: 8px; z-index: 500;
      background: var(--ur-bg-surface, #16161f); color: #fff; font-size: 0.875rem; font-weight: 500;
      border: 1px solid var(--ur-danger, #f87171); box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .edit-error-toast mat-icon { color: var(--ur-danger, #f87171); font-size: 18px; width: 18px; height: 18px; }
    .contact-edit-loading { display: flex; flex-direction: column; gap: 16px; padding: 24px 0; }
    .contact-edit-loading__title { height: 24px; width: 30%; border-radius: 6px; background: var(--ur-border-default, #2a2a3a); animation: ce-pulse 1.4s ease-in-out infinite; }
    .contact-edit-loading__field { height: 48px; border-radius: 6px; background: var(--ur-border-default, #2a2a3a); animation: ce-pulse 1.4s ease-in-out infinite; }
    @keyframes ce-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
  `],
})
export class ContactEditPageComponent implements OnInit, OnDestroy {
  private contacts = inject(CONTACT_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  contact = signal<ContactDto | null>(null);
  initial = signal<ContactFormInitial | null>(null);
  errors = signal<Record<string, string[]>>({});
  fetching = signal(true);
  loading = signal(false);
  saveError = signal(false);
  conflict = signal(false);
  notFound = signal(false);
  serverContact = signal<ContactDto | null>(null);
  pendingValue = signal<ContactFormValue | null>(null);

  private saveErrorTimer?: ReturnType<typeof setTimeout>;

  ngOnDestroy(): void {
    clearTimeout(this.saveErrorTimer);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.contacts.getById(id).subscribe({
      next: (c) => {
        this.contact.set(c);
        this.initial.set({ firstName: c.firstName, lastName: c.lastName, email: c.email, phone: c.phone, city: c.city });
        this.fetching.set(false);
      },
      error: () => { this.notFound.set(true); this.fetching.set(false); },
    });
  }

  save(value: ContactFormValue): void {
    const c = this.contact();
    if (!c) return;
    this.loading.set(true);
    this.errors.set({});
    this.conflict.set(false);

    this.contacts.update(c.id, { ...value, version: c.version }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/contacts', c.id], { queryParams: { saved: '1' } });
      },
      error: (err: { status: number; error?: { fields?: Record<string, string[]> } }) => {
        this.loading.set(false);
        if (err.status === 409) {
          this.pendingValue.set(value);
          this.contacts.getById(c.id).subscribe({
            next: (serverContact) => {
              this.serverContact.set(serverContact);
              this.conflict.set(true);
            },
          });
        } else if (err.status === 400 && err.error?.fields) {
          this.errors.set(err.error.fields);
        } else {
          clearTimeout(this.saveErrorTimer);
          this.saveError.set(true);
          this.saveErrorTimer = setTimeout(() => this.saveError.set(false), 4000);
        }
      },
    });
  }

  keepMine(): void {
    const server = this.serverContact();
    const pending = this.pendingValue();
    if (!server || !pending) return;
    this.conflict.set(false);
    this.contact.update((c) => c ? { ...c, version: server.version } : c);
    this.save(pending);
  }

  discardMine(): void {
    const c = this.contact();
    if (!c) return;
    this.conflict.set(false);
    this.router.navigate(['/contacts', c.id]);
  }
}

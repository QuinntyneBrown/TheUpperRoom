import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CONTACT_SERVICE, ContactDto } from 'api';
import { ContactFormComponent, ContactFormInitial, ContactFormValue } from '../contact-form/contact-form';

@Component({
  selector: 'ur-contact-edit-page',
  templateUrl: './contact-edit-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContactFormComponent, RouterLink],
})
export class ContactEditPageComponent implements OnInit {
  private contacts = inject(CONTACT_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  contact = signal<ContactDto | null>(null);
  initial = signal<ContactFormInitial | null>(null);
  errors = signal<Record<string, string[]>>({});
  loading = signal(false);
  conflict = signal(false);
  notFound = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.contacts.getById(id).subscribe({
      next: (c) => {
        this.contact.set(c);
        this.initial.set({ firstName: c.firstName, lastName: c.lastName, email: c.email, phone: c.phone, city: c.city });
      },
      error: () => this.notFound.set(true),
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
        this.router.navigateByUrl(`/contacts/${c.id}`);
      },
      error: (err: { status: number; error?: { fields?: Record<string, string[]> } }) => {
        this.loading.set(false);
        if (err.status === 409) {
          this.conflict.set(true);
        } else if (err.status === 400 && err.error?.fields) {
          this.errors.set(err.error.fields);
        }
      },
    });
  }
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CONTACT_SERVICE } from 'api';
import { ContactFormComponent, ContactFormValue } from '../contact-form/contact-form';

@Component({
  selector: 'ur-contact-create-page',
  templateUrl: './contact-create-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContactFormComponent],
})
export class ContactCreatePageComponent {
  private contacts = inject(CONTACT_SERVICE);
  private router = inject(Router);

  errors = signal<Record<string, string[]>>({});
  loading = signal(false);

  save(value: ContactFormValue): void {
    this.loading.set(true);
    this.errors.set({});

    this.contacts.create(value).subscribe({
      next: ({ id }) => {
        this.loading.set(false);
        this.router.navigateByUrl(`/contacts/${id}`);
      },
      error: (err: { status: number; error?: { fields?: Record<string, string[]> } }) => {
        this.loading.set(false);
        if (err.status === 400 && err.error?.fields) {
          this.errors.set(err.error.fields);
        }
      },
    });
  }
}

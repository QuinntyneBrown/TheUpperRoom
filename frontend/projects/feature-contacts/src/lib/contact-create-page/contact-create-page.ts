import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CONTACT_SERVICE } from 'api';
import { MatIconModule } from '@angular/material/icon';
import { ContactFormComponent, ContactFormValue } from '../contact-form/contact-form';

@Component({
  selector: 'ur-contact-create-page',
  templateUrl: './contact-create-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContactFormComponent, MatIconModule],
  styles: [`
    .page-container__subtitle {
      margin: 4px 0 16px;
      color: var(--ur-fg-secondary, #a1a1aa);
      font-size: 0.875rem;
    }
    .create-error-toast {
      position: fixed; top: 16px; right: 24px; display: flex; align-items: center;
      gap: 10px; padding: 12px 16px; border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-surface, #16161f); color: #fff; font-size: 0.875rem; font-weight: 500;
      border: 1px solid var(--ur-danger, #f87171); box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .create-error-toast mat-icon { color: var(--ur-danger, #f87171); font-size: 18px; width: 18px; height: 18px; }
  `],
})
export class ContactCreatePageComponent implements OnDestroy {
  private contacts = inject(CONTACT_SERVICE);
  private router = inject(Router);

  errors = signal<Record<string, string[]>>({});
  loading = signal(false);
  saveError = signal(false);

  private saveErrorTimer?: ReturnType<typeof setTimeout>;

  ngOnDestroy(): void {
    clearTimeout(this.saveErrorTimer);
  }

  save(value: ContactFormValue): void {
    this.loading.set(true);
    this.errors.set({});

    this.contacts.create(value).subscribe({
      next: ({ id }) => {
        this.loading.set(false);
        this.router.navigate(['/contacts', id], { queryParams: { saved: '1' } });
      },
      error: (err: { status: number; error?: { fields?: Record<string, string[]> } }) => {
        this.loading.set(false);
        if (err.status === 400 && err.error?.fields) {
          this.errors.set(err.error.fields);
        } else {
          clearTimeout(this.saveErrorTimer);
          this.saveError.set(true);
          this.saveErrorTimer = setTimeout(() => this.saveError.set(false), 4000);
        }
      },
    });
  }
}

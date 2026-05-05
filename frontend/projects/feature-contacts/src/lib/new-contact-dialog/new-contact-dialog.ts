import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CONTACT_SERVICE } from 'api';
import { UrButtonComponent, UrDialogComponent, UrInputComponent } from 'components';

@Component({
  selector: 'ur-new-contact-dialog',
  templateUrl: './new-contact-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, UrButtonComponent, UrDialogComponent, UrInputComponent],
  styles: [`
    .ncd-form { display: flex; flex-direction: column; gap: 16px; }
    .ncd-row { display: flex; gap: 16px; }
    .ncd-row > * { flex: 1; min-width: 0; }
    .ncd-hint { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; color: var(--ur-fg-disabled, #64748b); margin: 0; }
    .ncd-hint mat-icon { font-size: 14px; width: 14px; height: 14px; }
  `],
})
export class NewContactDialogComponent implements OnDestroy {
  private contacts = inject(CONTACT_SERVICE);
  private router = inject(Router);

  closed = output<void>();

  firstName = signal('');
  lastName = signal('');
  email = signal('');
  phone = signal('');
  city = signal('');
  errors = signal<Record<string, string[]>>({});
  loading = signal(false);

  canSave = computed(() =>
    !!this.firstName().trim() && !!this.lastName().trim() && !!this.email().trim() && !this.loading()
  );

  private saveErrorTimer?: ReturnType<typeof setTimeout>;

  ngOnDestroy(): void {
    clearTimeout(this.saveErrorTimer);
  }

  fieldError(field: string): string {
    return this.errors()[field]?.[0] ?? '';
  }

  save(): void {
    if (!this.canSave()) return;
    this.loading.set(true);
    this.errors.set({});
    this.contacts.create({
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email() || undefined,
      phone: this.phone() || undefined,
      city: this.city() || undefined,
    }).subscribe({
      next: ({ id }) => {
        this.loading.set(false);
        this.closed.emit();
        this.router.navigate(['/contacts', id], { queryParams: { saved: '1' } });
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

import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { UrButtonComponent, UrInputComponent, UrTextareaComponent } from 'components';

export interface ContactFormValue {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  city?: string;
  notes?: string;
}

@Component({
  selector: 'ur-contact-form',
  templateUrl: './contact-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UrButtonComponent, UrInputComponent, UrTextareaComponent],
})
export class ContactFormComponent {
  errors = input<Record<string, string[]>>({});
  loading = input(false);
  showNotes = input(true);
  submitLabel = input('Save');

  formSubmit = output<ContactFormValue>();

  firstName = signal('');
  lastName = signal('');
  email = signal('');
  phone = signal('');
  city = signal('');
  notes = signal('');

  fieldError(field: string): string {
    return this.errors()[field]?.[0] ?? '';
  }

  submit(): void {
    this.formSubmit.emit({
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email() || undefined,
      phone: this.phone() || undefined,
      city: this.city() || undefined,
      notes: this.notes() || undefined,
    });
  }
}

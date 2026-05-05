import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PARTNER_SERVICE, PartnerStage } from 'api';
import { UrButtonComponent, UrDialogComponent } from 'components';

const STAGES: { value: PartnerStage; label: string }[] = [
  { value: 'Lead', label: 'Lead' },
  { value: 'InFunnel', label: 'In funnel' },
  { value: 'Confirmed', label: 'Confirmed' },
];

@Component({
  selector: 'ur-partner-create-page',
  templateUrl: './partner-create-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, UrButtonComponent, UrDialogComponent],
})
export class PartnerCreatePageComponent {
  private partners = inject(PARTNER_SERVICE);
  private router = inject(Router);

  stages = STAGES;
  name = signal('');
  city = signal('');
  website = signal('');
  stage = signal<PartnerStage>('Lead');
  description = signal('');
  saving = signal(false);
  errors = signal<Record<string, string>>({});

  submit(): void {
    const errs: Record<string, string> = {};
    if (!this.name().trim()) errs['name'] = 'Organization name is required.';
    if (!this.city().trim()) errs['city'] = 'City is required.';
    const w = this.website().trim();
    if (w) {
      try {
        const url = new URL(w);
        if (url.protocol !== 'http:' && url.protocol !== 'https:')
          errs['website'] = 'Website must be a valid http/https URL.';
      } catch {
        errs['website'] = 'Website must be a valid http/https URL.';
      }
    }
    this.errors.set(errs);
    if (Object.keys(errs).length) return;

    this.saving.set(true);
    this.partners.create({
      name: this.name().trim(),
      city: this.city().trim(),
      website: w || undefined,
      stage: this.stage(),
      description: this.description().trim() || undefined,
    }).subscribe({
      next: (res) => this.router.navigate(['/partners', res.id]),
      error: () => this.saving.set(false),
    });
  }

  cancel(): void {
    this.router.navigateByUrl('/partners');
  }
}

import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PARTNER_SERVICE, PartnerStage } from 'api';
import { MatIconModule } from '@angular/material/icon';
import { UrButtonComponent, UrDialogComponent, UrInputComponent } from 'components';

const STAGES: { value: PartnerStage; label: string }[] = [
  { value: 'Lead', label: 'Lead' },
  { value: 'InFunnel', label: 'In funnel' },
  { value: 'Confirmed', label: 'Confirmed' },
];

@Component({
  selector: 'ur-partner-create-page',
  templateUrl: './partner-create-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatIconModule, UrButtonComponent, UrDialogComponent, UrInputComponent],
  styles: [`
    .partner-form { display: flex; flex-direction: column; gap: 16px; }
    .partner-form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .partner-form__field { display: flex; flex-direction: column; gap: 6px; }
    .partner-form__label { font-size: 0.8125rem; font-weight: 500; color: var(--ur-fg-secondary, #a1a1aa); }
    .partner-form__error { font-size: 0.75rem; color: var(--ur-danger, #ef4444); }
    .partner-form__stage-opts { display: flex; gap: 8px; flex-wrap: wrap; }
    .partner-form__stage-opt {
      padding: 6px 16px; border-radius: 6px; border: 1px solid var(--ur-border-default, #2a2a3a);
      background: var(--ur-bg-input, #0f172a); color: var(--ur-fg-secondary, #a1a1aa);
      font-size: 0.875rem; cursor: pointer;
    }
    .partner-form__stage-opt--selected {
      background: var(--ur-accent-primary, #9f86ff); border-color: var(--ur-accent-primary, #9f86ff);
      color: #fff; font-weight: 600;
    }
    .partner-form textarea {
      background: var(--ur-bg-input, #0f172a); border: 1px solid var(--ur-border-default, #2a2a3a);
      border-radius: 6px; color: var(--ur-fg-primary, #f1f5f9); font-size: 0.875rem; font-family: inherit;
      padding: 10px 12px; outline: none; width: 100%; box-sizing: border-box; resize: vertical;
    }
    .partner-form textarea:focus { border-color: var(--ur-accent-primary, #9f86ff); }
    .partner-form__actions { display: flex; align-items: center; justify-content: flex-end; gap: 12px; padding-top: 4px; }
    .create-error-toast {
      position: fixed; top: 16px; right: 24px; display: flex; align-items: center;
      gap: 10px; padding: 12px 16px; border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-surface, #16161f); color: #fff; font-size: 0.875rem; font-weight: 500;
      border: 1px solid var(--ur-danger, #f87171); box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .create-error-toast mat-icon { color: var(--ur-danger, #f87171); font-size: 18px; width: 18px; height: 18px; }
  `],
})
export class PartnerCreatePageComponent implements OnDestroy {
  private partners = inject(PARTNER_SERVICE);
  private router = inject(Router);

  stages = STAGES;
  name = signal('');
  city = signal('');
  website = signal('');
  stage = signal<PartnerStage>('Lead');
  description = signal('');
  saving = signal(false);
  saveError = signal(false);
  errors = signal<Record<string, string>>({});

  private saveErrorTimer?: ReturnType<typeof setTimeout>;

  ngOnDestroy(): void {
    clearTimeout(this.saveErrorTimer);
  }

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
      next: (res) => this.router.navigate(['/partners', res.id], { queryParams: { saved: '1' } }),
      error: () => {
        this.saving.set(false);
        clearTimeout(this.saveErrorTimer);
        this.saveError.set(true);
        this.saveErrorTimer = setTimeout(() => this.saveError.set(false), 4000);
      },
    });
  }

  cancel(): void {
    this.router.navigateByUrl('/partners');
  }
}

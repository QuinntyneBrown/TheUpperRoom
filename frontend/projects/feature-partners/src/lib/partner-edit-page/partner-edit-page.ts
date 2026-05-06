import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PARTNER_SERVICE, PartnerDetailDto } from 'api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UrButtonComponent } from 'components';

@Component({
  selector: 'ur-partner-edit-page',
  templateUrl: './partner-edit-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink, MatButtonModule, MatIconModule, UrButtonComponent],
  styles: [`
    .partner-edit { display: flex; flex-direction: column; height: 100%; }
    .partner-edit__header { display: flex; align-items: center; gap: 8px; padding: 12px 24px; border-bottom: 1px solid var(--ur-border-subtle, #222233); background: var(--ur-bg-elevated, #0f172a); height: 56px; }
    .partner-edit__back { display: flex; align-items: center; gap: 6px; color: var(--ur-accent-primary, #9f86ff); font-size: 0.875rem; font-weight: 500; text-decoration: none; }
    .partner-edit__back:hover { text-decoration: underline; }
    .partner-edit__back mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .partner-edit__center { flex: 1; display: flex; justify-content: center; padding: 48px; }
    .partner-edit__card { width: 100%; max-width: 760px; background: var(--ur-bg-surface, #101018); border: 1px solid var(--ur-border-subtle, #222233); border-radius: 1.5rem; padding: 48px; display: flex; flex-direction: column; gap: 24px; }
    .partner-edit__heading { margin: 0; font-size: 1.125rem; font-weight: 600; color: var(--ur-fg-primary, #fff); }
    .partner-edit__card form { display: flex; flex-direction: column; gap: 24px; }
    .partner-edit__row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .partner-edit__field { display: flex; flex-direction: column; gap: 6px; }
    .partner-edit__field label { font-size: 0.8125rem; font-weight: 500; color: var(--ur-fg-secondary, #94a3b8); }
    .partner-edit__field input, .partner-edit__field textarea {
      background: var(--ur-bg-input, #0f172a); border: 1px solid var(--ur-border-default, #2a2a3a);
      border-radius: 6px; color: var(--ur-fg-primary, #f1f5f9); font-size: 0.875rem; font-family: inherit;
      padding: 10px 12px; outline: none; width: 100%; box-sizing: border-box; resize: vertical;
    }
    .partner-edit__field input:focus, .partner-edit__field textarea:focus { border-color: var(--ur-accent-primary, #9f86ff); }
    .partner-edit__error { font-size: 0.75rem; color: var(--ur-danger, #ef4444); }
    .partner-edit__actions { display: flex; align-items: center; justify-content: flex-end; gap: 12px; padding-top: 8px; }
    .partner-edit__conflict { margin: 16px 24px; padding: 12px 16px; border-radius: 8px; background: var(--ur-warning-soft, #fef9c3); color: var(--ur-warning-fg, #854d0e); border: 1px solid var(--ur-warning, #ca8a04); font-size: 0.875rem; }
    .edit-error-toast {
      position: fixed; top: 16px; right: 24px; display: flex; align-items: center;
      gap: 10px; padding: 12px 16px; border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-surface, #16161f); color: #fff; font-size: 0.875rem; font-weight: 500;
      border: 1px solid var(--ur-danger, #f87171); box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .edit-error-toast mat-icon { color: var(--ur-danger, #f87171); font-size: 18px; width: 18px; height: 18px; }
    .partner-edit-loading { display: flex; flex-direction: column; gap: 16px; padding: 24px; }
    .partner-edit-loading__title { height: 24px; width: 30%; border-radius: 6px; background: var(--ur-border-default, #2a2a3a); animation: pe-pulse 1.4s ease-in-out infinite; }
    .partner-edit-loading__field { height: 48px; border-radius: 6px; background: var(--ur-border-default, #2a2a3a); animation: pe-pulse 1.4s ease-in-out infinite; }
    @keyframes pe-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
  `],
})
export class PartnerEditPageComponent implements OnInit, OnDestroy {
  private partners = inject(PARTNER_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  partner = signal<PartnerDetailDto | null>(null);
  loading = signal(true);
  notFound = signal(false);
  saving = signal(false);
  saveError = signal(false);
  conflict = signal(false);
  errors = signal<Record<string, string>>({});

  private saveErrorTimer?: ReturnType<typeof setTimeout>;

  name = signal('');
  city = signal('');
  website = signal('');
  description = signal('');

  ngOnDestroy(): void {
    clearTimeout(this.saveErrorTimer);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.partners.getById(id).subscribe({
      next: (p) => {
        this.partner.set(p);
        this.name.set(p.name);
        this.city.set(p.city);
        this.website.set(p.website ?? '');
        this.description.set(p.description ?? '');
        this.loading.set(false);
      },
      error: () => { this.notFound.set(true); this.loading.set(false); },
    });
  }

  save(): void {
    const p = this.partner();
    if (!p) return;

    const errs: Record<string, string> = {};
    if (!this.name().trim()) errs['name'] = 'Name is required.';
    if (!this.city().trim()) errs['city'] = 'City is required.';
    this.errors.set(errs);
    if (Object.keys(errs).length) return;

    this.saving.set(true);
    this.conflict.set(false);
    this.partners.update(p.id, {
      name: this.name().trim(),
      city: this.city().trim(),
      website: this.website().trim() || undefined,
      description: this.description().trim() || undefined,
      version: p.version,
    }).subscribe({
      next: () => this.router.navigate(['/partners', p.id], { queryParams: { saved: '1' } }),
      error: (err: { status: number }) => {
        this.saving.set(false);
        if (err.status === 409) {
          this.conflict.set(true);
        } else {
          clearTimeout(this.saveErrorTimer);
          this.saveError.set(true);
          this.saveErrorTimer = setTimeout(() => this.saveError.set(false), 4000);
        }
      },
    });
  }

  cancel(): void {
    const p = this.partner();
    if (p) this.router.navigate(['/partners', p.id]);
    else this.router.navigateByUrl('/partners');
  }
}

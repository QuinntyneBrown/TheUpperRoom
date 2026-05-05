import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PARTNER_SERVICE, PartnerDetailDto } from 'api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UrButtonComponent } from 'components';

@Component({
  selector: 'ur-partner-edit-page',
  templateUrl: './partner-edit-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule, MatIconModule, UrButtonComponent],
  styles: [`
    .edit-error-toast {
      position: fixed; top: 16px; right: 24px; display: flex; align-items: center;
      gap: 10px; padding: 12px 16px; border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-overlay, #1e293b); color: #fff; font-size: 0.875rem; font-weight: 500;
      border: 1px solid var(--ur-error-fg, #dc2626); box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .edit-error-toast mat-icon { color: var(--ur-error-fg, #dc2626); font-size: 18px; width: 18px; height: 18px; }
    .partner-edit-loading { display: flex; flex-direction: column; gap: 16px; padding: 24px 0; }
    .partner-edit-loading__title { height: 24px; width: 30%; border-radius: 6px; background: var(--ur-skeleton-bg, #f1f5f9); animation: pe-pulse 1.4s ease-in-out infinite; }
    .partner-edit-loading__field { height: 48px; border-radius: 6px; background: var(--ur-skeleton-bg, #f1f5f9); animation: pe-pulse 1.4s ease-in-out infinite; }
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

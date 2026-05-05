import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, signal } from '@angular/core';
import { HACKATHON_SERVICE, ProductDto } from 'api';
import { MatIconModule } from '@angular/material/icon';
import { UrButtonComponent, UrDialogComponent } from 'components';

@Component({
  selector: 'ur-products-section',
  templateUrl: './products-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, UrButtonComponent, UrDialogComponent],
  styles: [`
    .products-save-error {
      display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 6px; margin-top: 8px;
      background: var(--ur-error-bg, #fef2f2); color: var(--ur-error-fg, #dc2626);
      border: 1px solid var(--ur-error-border, #fecaca); font-size: 0.875rem;
    }
    .products-save-error mat-icon { font-size: 16px; width: 16px; height: 16px; flex-shrink: 0; }
    .products-section__empty {
      display: flex; align-items: center; gap: 8px; padding: 12px 0;
      color: var(--ur-fg-muted, #64748b); font-size: 0.875rem;
    }
    .products-section__empty mat-icon { font-size: 18px; width: 18px; height: 18px; opacity: 0.6; }
    .products-section__empty p { margin: 0; }
  `],
})
export class ProductsSectionComponent implements OnDestroy {
  private hackathons = inject(HACKATHON_SERVICE);

  hackathonId = input.required<string>();
  initialProducts = input<ProductDto[]>([]);

  products = signal<ProductDto[]>([]);
  showForm = signal(false);
  saving = signal(false);
  saveError = signal(false);
  errors = signal<Record<string, string>>({});
  name = signal('');
  description = signal('');
  repoUrl = signal('');
  demoUrl = signal('');

  private saveErrorTimer?: ReturnType<typeof setTimeout>;

  ngOnDestroy(): void {
    clearTimeout(this.saveErrorTimer);
  }

  ngOnInit(): void {
    this.products.set(this.initialProducts());
  }

  openForm(): void {
    this.name.set('');
    this.description.set('');
    this.repoUrl.set('');
    this.demoUrl.set('');
    this.errors.set({});
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
  }

  submit(): void {
    const errs: Record<string, string> = {};
    if (!this.name().trim()) errs['name'] = 'Name is required.';
    const validateUrl = (val: string, field: string) => {
      if (!val.trim()) return;
      try {
        const u = new URL(val.trim());
        if (u.protocol !== 'http:' && u.protocol !== 'https:') errs[field] = 'Must be a valid http/https URL.';
      } catch { errs[field] = 'Must be a valid http/https URL.'; }
    };
    validateUrl(this.repoUrl(), 'repoUrl');
    validateUrl(this.demoUrl(), 'demoUrl');
    this.errors.set(errs);
    if (Object.keys(errs).length) return;

    this.saving.set(true);
    this.hackathons.addProduct(this.hackathonId(), {
      name: this.name().trim(),
      description: this.description().trim() || undefined,
      repoUrl: this.repoUrl().trim() || undefined,
      demoUrl: this.demoUrl().trim() || undefined,
      memberUserIds: [],
      memberContactIds: [],
    }).subscribe({
      next: (res) => {
        this.products.update(ps => [...ps, {
          id: res.id,
          name: this.name().trim(),
          description: this.description().trim() || undefined,
          repoUrl: this.repoUrl().trim() || undefined,
          demoUrl: this.demoUrl().trim() || undefined,
          members: [],
        }]);
        this.showForm.set(false);
        this.saving.set(false);
      },
      error: () => {
        this.saving.set(false);
        clearTimeout(this.saveErrorTimer);
        this.saveError.set(true);
        this.saveErrorTimer = setTimeout(() => this.saveError.set(false), 4000);
      },
    });
  }
}

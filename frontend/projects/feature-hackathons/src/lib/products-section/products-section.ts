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
    .products-section__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .products-section__title { margin: 0; font-size: 1rem; font-weight: 600; color: var(--ur-fg-primary, #fff); }
    .products-section__list { display: flex; flex-direction: column; gap: 8px; }
    .product-card { padding: 14px 16px; border-radius: 8px; background: var(--ur-bg-surface, #101018); border: 1px solid var(--ur-border-subtle, #222233); }
    .product-card__name { margin: 0 0 4px; font-size: 0.9375rem; font-weight: 600; color: var(--ur-fg-primary, #fff); }
    .product-card__desc { margin: 0 0 8px; font-size: 0.875rem; color: var(--ur-fg-secondary, #a1a1aa); }
    .product-card__links { display: flex; gap: 10px; }
    .product-card__link { font-size: 0.8125rem; color: var(--ur-accent-primary, #9f86ff); text-decoration: none; }
    .product-card__link:hover { text-decoration: underline; }
    .product-form__field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
    .product-form__field label { font-size: 0.8125rem; color: var(--ur-fg-secondary, #a1a1aa); }
    .product-form__field input, .product-form__field textarea {
      height: 36px; padding: 0 10px; border-radius: 6px; font-size: 0.875rem; outline: none; resize: none;
      border: 1px solid var(--ur-border-default, #2a2a3a);
      background: var(--ur-bg-elevated, #16161f); color: var(--ur-fg-primary, #fff);
    }
    .product-form__field textarea { height: 64px; padding: 8px 10px; }
    .product-form__field input:focus, .product-form__field textarea:focus { border-color: var(--ur-accent-primary, #9f86ff); }
    .product-form__row { display: flex; gap: 10px; }
    .product-form__row .product-form__field { flex: 1; margin-bottom: 0; }
    .product-form__error { font-size: 0.75rem; color: var(--ur-danger, #f87171); }
    .product-form__actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }
    .products-save-error {
      display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 6px; margin-top: 8px;
      background: var(--ur-danger-soft, #2a1212); color: var(--ur-danger, #f87171);
      border: 1px solid var(--ur-danger, #f87171); font-size: 0.875rem;
    }
    .products-save-error mat-icon { font-size: 16px; width: 16px; height: 16px; flex-shrink: 0; }
    .products-section__empty {
      display: flex; align-items: center; gap: 8px; padding: 12px 0;
      color: var(--ur-fg-muted, #a8a8b5); font-size: 0.875rem;
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

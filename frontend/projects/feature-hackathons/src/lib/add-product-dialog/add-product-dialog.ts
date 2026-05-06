import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { HACKATHON_SERVICE, ProductDto } from 'api';
import { MatIconModule } from '@angular/material/icon';
import { UR_DIALOG_DATA, UrButtonComponent, UrDialogComponent, UrDialogRef } from 'components';

export interface AddProductDialogData {
  hackathonId: string;
}

@Component({
  selector: 'ur-add-product-dialog',
  imports: [MatIconModule, UrDialogComponent, UrButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
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
  `],
  template: `
    <ur-dialog title="Add product" closeLabel="Cancel" (closed)="ref.close()" data-testid="add-product-dialog">
      <form (submit)="$event.preventDefault(); submit()" class="product-form">
        <div class="product-form__field">
          <label for="productName">Name</label>
          <input id="productName" type="text" [value]="name()" (input)="name.set($any($event.target).value)" aria-describedby="productName-error" />
          @if (errors()['name']) {
            <span id="productName-error" class="product-form__error">{{ errors()['name'] }}</span>
          }
        </div>
        <div class="product-form__field">
          <label for="productDesc">Description (optional)</label>
          <textarea id="productDesc" rows="2" [value]="description()" (input)="description.set($any($event.target).value)"></textarea>
        </div>
        <div class="product-form__row">
          <div class="product-form__field">
            <label for="productRepo">Repo URL (optional)</label>
            <input id="productRepo" type="url" [value]="repoUrl()" (input)="repoUrl.set($any($event.target).value)" aria-describedby="productRepo-error" />
            @if (errors()['repoUrl']) {
              <span id="productRepo-error" class="product-form__error">{{ errors()['repoUrl'] }}</span>
            }
          </div>
          <div class="product-form__field">
            <label for="productDemo">Demo URL (optional)</label>
            <input id="productDemo" type="url" [value]="demoUrl()" (input)="demoUrl.set($any($event.target).value)" aria-describedby="productDemo-error" />
            @if (errors()['demoUrl']) {
              <span id="productDemo-error" class="product-form__error">{{ errors()['demoUrl'] }}</span>
            }
          </div>
        </div>
        <div class="product-form__actions">
          <ur-button type="button" variant="ghost" (click)="ref.close()">Cancel</ur-button>
          <ur-button type="submit" [disabled]="saving()" data-testid="submit-product-btn">{{ saving() ? 'Saving…' : 'Add product' }}</ur-button>
        </div>
        @if (saveError()) {
          <div class="products-save-error" data-testid="products-save-error" role="alert">
            <mat-icon>error_outline</mat-icon>
            <span>Failed to save product. Please try again.</span>
          </div>
        }
      </form>
    </ur-dialog>
  `,
})
export class AddProductDialogComponent implements OnDestroy {
  private hackathons = inject(HACKATHON_SERVICE);
  ref = inject<UrDialogRef<ProductDto>>(UrDialogRef);
  data = inject<AddProductDialogData>(UR_DIALOG_DATA);

  name = signal('');
  description = signal('');
  repoUrl = signal('');
  demoUrl = signal('');
  saving = signal(false);
  saveError = signal(false);
  errors = signal<Record<string, string>>({});

  private saveErrorTimer?: ReturnType<typeof setTimeout>;

  ngOnDestroy(): void {
    clearTimeout(this.saveErrorTimer);
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
    this.hackathons.addProduct(this.data.hackathonId, {
      name: this.name().trim(),
      description: this.description().trim() || undefined,
      repoUrl: this.repoUrl().trim() || undefined,
      demoUrl: this.demoUrl().trim() || undefined,
      memberUserIds: [],
      memberContactIds: [],
    }).subscribe({
      next: (res) => {
        const product: ProductDto = {
          id: res.id,
          name: this.name().trim(),
          description: this.description().trim() || undefined,
          repoUrl: this.repoUrl().trim() || undefined,
          demoUrl: this.demoUrl().trim() || undefined,
          members: [],
        };
        this.saving.set(false);
        this.ref.close(product);
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

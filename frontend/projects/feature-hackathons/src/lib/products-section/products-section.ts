import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { ProductDto } from 'api';
import { MatIconModule } from '@angular/material/icon';
import { DialogService, UrButtonComponent } from 'components';
import { AddProductDialogComponent, AddProductDialogData } from '../add-product-dialog/add-product-dialog';

@Component({
  selector: 'ur-products-section',
  templateUrl: './products-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, UrButtonComponent],
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
    .products-section__empty {
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      padding: 32px 16px; text-align: center;
      color: var(--ur-fg-muted, #a8a8b5); font-size: 0.875rem;
    }
    .products-section__empty-icon-wrap {
      display: inline-flex; align-items: center; justify-content: center;
      width: 64px; height: 64px; border-radius: 9999px;
      background: var(--ur-bg-input, #1a1a25);
      border: 1px solid var(--ur-border-default, #2a2a3a);
    }
    .products-section__empty-icon-wrap mat-icon { font-size: 28px; width: 28px; height: 28px; color: var(--ur-fg-muted, #7a7a87); }
    .products-section__empty p { margin: 0; }
  `],
})
export class ProductsSectionComponent implements OnInit {
  private dialog = inject(DialogService);

  hackathonId = input.required<string>();
  initialProducts = input<ProductDto[]>([]);

  products = signal<ProductDto[]>([]);

  ngOnInit(): void {
    this.products.set(this.initialProducts());
  }

  onAddClick(): void {
    this.dialog.open<AddProductDialogComponent, ProductDto, AddProductDialogData>(
      AddProductDialogComponent,
      { data: { hackathonId: this.hackathonId() }, ariaLabel: 'Add product' },
    ).closed$.subscribe(product => {
      if (product) this.products.update(ps => [...ps, product]);
    });
  }
}

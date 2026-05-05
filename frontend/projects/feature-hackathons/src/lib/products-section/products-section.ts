import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { inject } from '@angular/core';
import { HACKATHON_SERVICE, ProductDto } from 'api';
import { UrButtonComponent, UrDialogComponent } from 'components';

@Component({
  selector: 'ur-products-section',
  templateUrl: './products-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UrButtonComponent, UrDialogComponent],
})
export class ProductsSectionComponent {
  private hackathons = inject(HACKATHON_SERVICE);

  hackathonId = input.required<string>();
  initialProducts = input<ProductDto[]>([]);

  products = signal<ProductDto[]>([]);
  showForm = signal(false);
  saving = signal(false);
  errors = signal<Record<string, string>>({});
  name = signal('');
  description = signal('');
  repoUrl = signal('');
  demoUrl = signal('');

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
      error: () => this.saving.set(false),
    });
  }
}

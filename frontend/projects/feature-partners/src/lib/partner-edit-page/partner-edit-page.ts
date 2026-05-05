import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PARTNER_SERVICE, PartnerDetailDto } from 'api';
import { MatIconModule } from '@angular/material/icon';
import { UrButtonComponent } from 'components';

@Component({
  selector: 'ur-partner-edit-page',
  templateUrl: './partner-edit-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIconModule, UrButtonComponent],
})
export class PartnerEditPageComponent implements OnInit {
  private partners = inject(PARTNER_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  partner = signal<PartnerDetailDto | null>(null);
  notFound = signal(false);
  saving = signal(false);
  conflict = signal(false);
  errors = signal<Record<string, string>>({});

  name = signal('');
  city = signal('');
  website = signal('');
  description = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.partners.getById(id).subscribe({
      next: (p) => {
        this.partner.set(p);
        this.name.set(p.name);
        this.city.set(p.city);
        this.website.set(p.website ?? '');
        this.description.set(p.description ?? '');
      },
      error: () => this.notFound.set(true),
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
      next: () => this.router.navigate(['/partners', p.id]),
      error: (err: { status: number }) => {
        this.saving.set(false);
        if (err.status === 409) this.conflict.set(true);
      },
    });
  }

  cancel(): void {
    const p = this.partner();
    if (p) this.router.navigate(['/partners', p.id]);
    else this.router.navigateByUrl('/partners');
  }
}

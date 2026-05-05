import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HACKATHON_SERVICE, PARTNER_SERVICE, PartnerListRow } from 'api';
import { UrButtonComponent, UrDialogComponent } from 'components';

@Component({
  selector: 'ur-hackathon-create-page',
  templateUrl: './hackathon-create-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UrButtonComponent, UrDialogComponent],
})
export class HackathonCreatePageComponent implements OnInit {
  private hackathons = inject(HACKATHON_SERVICE);
  private partners = inject(PARTNER_SERVICE);
  private router = inject(Router);

  title = signal('');
  startDate = signal('');
  endDate = signal('');
  hostCity = signal('');
  saving = signal(false);
  errors = signal<Record<string, string>>({});
  allPartners = signal<PartnerListRow[]>([]);
  selectedPartnerIds = signal<Set<string>>(new Set());

  ngOnInit(): void {
    this.partners.list().subscribe({ next: (rows) => this.allPartners.set(rows) });
  }

  togglePartner(id: string): void {
    this.selectedPartnerIds.update(s => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  submit(): void {
    const errs: Record<string, string> = {};
    if (!this.title().trim()) errs['title'] = 'Title is required.';
    if (!this.hostCity().trim()) errs['hostCity'] = 'Host city is required.';
    if (!this.startDate()) errs['startDate'] = 'Start date is required.';
    if (!this.endDate()) errs['endDate'] = 'End date is required.';
    if (this.startDate() && this.endDate() && this.endDate() < this.startDate())
      errs['endDate'] = 'End date must be on or after start date.';
    this.errors.set(errs);
    if (Object.keys(errs).length) return;

    this.saving.set(true);
    this.hackathons.create({
      title: this.title().trim(),
      startDate: this.startDate(),
      endDate: this.endDate(),
      hostCity: this.hostCity().trim(),
      partnerIds: [...this.selectedPartnerIds()],
    }).subscribe({
      next: (res) => this.router.navigate(['/hackathons', res.id]),
      error: () => this.saving.set(false),
    });
  }

  cancel(): void {
    this.router.navigateByUrl('/hackathons');
  }
}

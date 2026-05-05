import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HACKATHON_SERVICE, PARTNER_SERVICE, PartnerListRow } from 'api';
import { MatIconModule } from '@angular/material/icon';
import { UrButtonComponent, UrDialogComponent } from 'components';

@Component({
  selector: 'ur-hackathon-create-page',
  templateUrl: './hackathon-create-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, UrButtonComponent, UrDialogComponent],
  styles: [`
    .create-error-toast {
      position: fixed; top: 16px; right: 24px; display: flex; align-items: center;
      gap: 10px; padding: 12px 16px; border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-overlay, #1e293b); color: #fff; font-size: 0.875rem; font-weight: 500;
      border: 1px solid var(--ur-error-fg, #dc2626); box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .create-error-toast mat-icon { color: var(--ur-error-fg, #dc2626); font-size: 18px; width: 18px; height: 18px; }
  `],
})
export class HackathonCreatePageComponent implements OnInit, OnDestroy {
  private hackathons = inject(HACKATHON_SERVICE);
  private partners = inject(PARTNER_SERVICE);
  private router = inject(Router);

  title = signal('');
  startDate = signal('');
  endDate = signal('');
  hostCity = signal('');
  saving = signal(false);
  saveError = signal(false);
  errors = signal<Record<string, string>>({});
  allPartners = signal<PartnerListRow[]>([]);
  selectedPartnerIds = signal<Set<string>>(new Set());

  private saveErrorTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.partners.list().subscribe({
      next: (rows) => this.allPartners.set(rows),
      error: () => { /* partners are optional; silently continue with empty list */ },
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.saveErrorTimer);
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
      error: () => {
        this.saving.set(false);
        clearTimeout(this.saveErrorTimer);
        this.saveError.set(true);
        this.saveErrorTimer = setTimeout(() => this.saveError.set(false), 4000);
      },
    });
  }

  cancel(): void {
    this.router.navigateByUrl('/hackathons');
  }
}

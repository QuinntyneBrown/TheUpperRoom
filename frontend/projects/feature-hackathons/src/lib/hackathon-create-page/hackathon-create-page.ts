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
    .hackathon-form { display: flex; flex-direction: column; gap: 16px; }
    .hackathon-form__field { display: flex; flex-direction: column; gap: 6px; }
    .hackathon-form__field label, .hackathon-form__label {
      font-size: 0.875rem; font-weight: 500; color: var(--ur-fg-secondary, #94a3b8);
    }
    .hackathon-form__field input[type=text],
    .hackathon-form__field input[type=date] {
      height: 38px; padding: 0 12px; border-radius: 6px;
      border: 1px solid var(--ur-border-default, #475569);
      background: var(--ur-bg-elevated, #0f172a); color: var(--ur-fg-primary, #f1f5f9);
      font-size: 0.875rem; outline: none; width: 100%;
    }
    .hackathon-form__field input:focus { border-color: var(--ur-accent-primary, #6366f1); }
    .hackathon-form__row { display: flex; gap: 16px; }
    .hackathon-form__row .hackathon-form__field { flex: 1; }
    .hackathon-form__error { font-size: 0.75rem; color: var(--ur-error-fg, #dc2626); }
    .hackathon-form__partners { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
    .hackathon-form__partner-opt { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; color: var(--ur-fg-primary, #f1f5f9); cursor: pointer; }
    .hackathon-form__actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }
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
      next: (res) => this.router.navigate(['/hackathons', res.id], { queryParams: { saved: '1' } }),
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

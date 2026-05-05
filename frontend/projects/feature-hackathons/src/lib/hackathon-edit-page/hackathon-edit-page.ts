import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HACKATHON_SERVICE, PARTNER_SERVICE, PartnerListRow } from 'api';
import { MatIconModule } from '@angular/material/icon';
import { UrButtonComponent } from 'components';

@Component({
  selector: 'ur-hackathon-edit-page',
  imports: [MatIconModule, UrButtonComponent],
  styles: [`
    .edit-error-toast {
      position: fixed; top: 16px; right: 24px; display: flex; align-items: center;
      gap: 10px; padding: 12px 16px; border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-overlay, #1e293b); color: #fff; font-size: 0.875rem; font-weight: 500;
      border: 1px solid var(--ur-error-fg, #dc2626); box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .edit-error-toast mat-icon { color: var(--ur-error-fg, #dc2626); font-size: 18px; width: 18px; height: 18px; }
  `],
  template: `
    <div class="hackathon-edit-page">
      <h1>Edit Hackathon</h1>
      <form (ngSubmit)="submit()">
        <label>
          Title
          <input type="text" [value]="title()" (input)="title.set($any($event.target).value)" />
          @if (errors()['title']) { <span class="error">{{ errors()['title'] }}</span> }
        </label>
        <label>
          Start Date
          <input type="date" [value]="startDate()" (input)="startDate.set($any($event.target).value)" />
        </label>
        <label>
          End Date
          <input type="date" [value]="endDate()" (input)="endDate.set($any($event.target).value)" />
          @if (errors()['endDate']) { <span class="error">{{ errors()['endDate'] }}</span> }
        </label>
        <label>
          Host City
          <input type="text" [value]="hostCity()" (input)="hostCity.set($any($event.target).value)" />
        </label>
        <div class="form-actions">
          <ur-button type="submit" [disabled]="saving()">Save</ur-button>
          <ur-button variant="secondary" type="button" (click)="cancel()">Cancel</ur-button>
        </div>
      </form>
    </div>
    @if (saveError()) {
      <div class="edit-error-toast" data-testid="edit-save-error-toast" role="alert">
        <mat-icon>error_outline</mat-icon>
        <span>Save failed. Please try again.</span>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HackathonEditPageComponent implements OnDestroy {
  private hackathonSvc = inject(HACKATHON_SERVICE);
  private partnerSvc = inject(PARTNER_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private id = this.route.snapshot.paramMap.get('id')!;

  title = signal('');
  startDate = signal('');
  endDate = signal('');
  hostCity = signal('');
  saving = signal(false);
  saveError = signal(false);
  errors = signal<Record<string, string>>({});
  private partnerIds = signal<string[]>([]);
  allPartners = signal<PartnerListRow[]>([]);

  private saveErrorTimer?: ReturnType<typeof setTimeout>;

  ngOnDestroy(): void {
    clearTimeout(this.saveErrorTimer);
  }

  constructor() {
    this.hackathonSvc.getById(this.id).subscribe(h => {
      this.title.set(h.title);
      this.startDate.set(h.startDate);
      this.endDate.set(h.endDate);
      this.hostCity.set(h.hostCity);
      this.partnerIds.set(h.partners.map(p => p.id));
    });
    this.partnerSvc.list().subscribe(rows => this.allPartners.set(rows));
  }

  submit(): void {
    const errs: Record<string, string> = {};
    if (!this.title().trim()) errs['title'] = 'Title is required.';
    if (!this.hostCity().trim()) errs['hostCity'] = 'Host city is required.';
    if (this.startDate() && this.endDate() && this.endDate() < this.startDate())
      errs['endDate'] = 'End date must be on or after start date.';
    this.errors.set(errs);
    if (Object.keys(errs).length) return;

    this.saving.set(true);
    this.hackathonSvc.update(this.id, {
      title: this.title().trim(),
      startDate: this.startDate(),
      endDate: this.endDate(),
      hostCity: this.hostCity().trim(),
      partnerIds: this.partnerIds(),
    }).subscribe({
      next: () => this.router.navigate(['/hackathons', this.id]),
      error: () => {
        this.saving.set(false);
        clearTimeout(this.saveErrorTimer);
        this.saveError.set(true);
        this.saveErrorTimer = setTimeout(() => this.saveError.set(false), 4000);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/hackathons', this.id]);
  }
}

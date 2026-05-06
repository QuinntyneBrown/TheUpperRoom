import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HACKATHON_SERVICE, PARTNER_SERVICE, PartnerListRow } from 'api';
import { MatIconModule } from '@angular/material/icon';
import { UrButtonComponent } from 'components';

@Component({
  selector: 'ur-hackathon-edit-page',
  imports: [MatIconModule, UrButtonComponent, RouterLink],
  styles: [`
    .edit-error-toast {
      position: fixed; top: 16px; right: 24px; display: flex; align-items: center;
      gap: 10px; padding: 12px 16px; border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-surface, #16161f); color: #fff; font-size: 0.875rem; font-weight: 500;
      border: 1px solid var(--ur-danger, #f87171); box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .edit-error-toast mat-icon { color: var(--ur-danger, #f87171); font-size: 18px; width: 18px; height: 18px; }
    .hackathon-edit-loading { display: flex; flex-direction: column; gap: 14px; padding: 24px; max-width: 480px; }
    .hackathon-edit-loading__title { height: 32px; width: 60%; border-radius: 6px; background: var(--ur-border-default, #2a2a3a); animation: edit-pulse 1.4s ease-in-out infinite; }
    .hackathon-edit-loading__field { height: 48px; border-radius: 6px; background: var(--ur-border-default, #2a2a3a); animation: edit-pulse 1.4s ease-in-out infinite; }
    @keyframes edit-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
    .hackathon-edit-not-found { padding: 24px; color: var(--ur-fg-muted, #a8a8b5); }
  `],
  template: `
    @if (loading()) {
      <div class="hackathon-edit-loading" data-testid="hackathon-edit-loading" aria-busy="true" aria-label="Loading hackathon">
        <div class="hackathon-edit-loading__title"></div>
        <div class="hackathon-edit-loading__field"></div>
        <div class="hackathon-edit-loading__field"></div>
        <div class="hackathon-edit-loading__field"></div>
      </div>
    } @else if (notFound()) {
      <div class="hackathon-edit-not-found" data-testid="hackathon-edit-not-found" role="alert">
        <h1 data-testid="hackathon-edit-not-found-title">Hackathon not found</h1>
        <a routerLink="/hackathons">Back to hackathons</a>
      </div>
    } @else {
    <div class="hackathon-edit-page">
      <h1 data-testid="hackathon-edit-title">Edit hackathon</h1>
      <form (ngSubmit)="submit()">
        <label>
          Title <span aria-hidden="true">*</span>
          <input id="editTitle" type="text" required [value]="title()" (input)="title.set($any($event.target).value)" aria-describedby="editTitle-error" />
          @if (errors()['title']) { <span id="editTitle-error" class="error">{{ errors()['title'] }}</span> }
        </label>
        <label>
          Start date
          <input type="date" [value]="startDate()" (input)="startDate.set($any($event.target).value)" />
        </label>
        <label>
          End date
          <input id="editEndDate" type="date" [value]="endDate()" (input)="endDate.set($any($event.target).value)" aria-describedby="editEndDate-error" />
          @if (errors()['endDate']) { <span id="editEndDate-error" class="error">{{ errors()['endDate'] }}</span> }
        </label>
        <label>
          Host city <span aria-hidden="true">*</span>
          <input type="text" required [value]="hostCity()" (input)="hostCity.set($any($event.target).value)" />
        </label>
        <div class="form-actions">
          <ur-button variant="ghost" type="button" (click)="cancel()">Cancel</ur-button>
          <ur-button type="submit" [disabled]="saving()" data-testid="hackathon-edit-save-btn">
            {{ saving() ? 'Saving…' : 'Save changes' }}
          </ur-button>
        </div>
      </form>
    </div>
    }
    @if (saveError()) {
      <div class="edit-error-toast" data-testid="edit-save-error-toast" role="alert">
        <mat-icon aria-hidden="true">error_outline</mat-icon>
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
  loading = signal(true);
  notFound = signal(false);
  errors = signal<Record<string, string>>({});
  private partnerIds = signal<string[]>([]);
  allPartners = signal<PartnerListRow[]>([]);

  private saveErrorTimer?: ReturnType<typeof setTimeout>;

  ngOnDestroy(): void {
    clearTimeout(this.saveErrorTimer);
  }

  constructor() {
    this.hackathonSvc.getById(this.id).subscribe({
      next: (h) => {
        this.title.set(h.title);
        this.startDate.set(h.startDate);
        this.endDate.set(h.endDate);
        this.hostCity.set(h.hostCity);
        this.partnerIds.set(h.partners.map(p => p.id));
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); this.notFound.set(true); },
    });
    this.partnerSvc.list().subscribe({
      next: (rows) => this.allPartners.set(rows),
      error: () => { /* partners are optional in edit */ },
    });
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
      next: () => this.router.navigate(['/hackathons', this.id], { queryParams: { saved: '1' } }),
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

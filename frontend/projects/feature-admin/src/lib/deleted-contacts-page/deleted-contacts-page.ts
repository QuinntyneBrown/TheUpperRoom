import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { CONTACT_SERVICE, DeletedContactDto } from 'api';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { UrButtonComponent } from 'components';

@Component({
  selector: 'lib-deleted-contacts-page',
  imports: [DatePipe, RouterLink, MatButtonModule, MatIconModule, MatTableModule, UrButtonComponent],
  template: `
    <div class="deleted-contacts-page">
      <h1 data-testid="deleted-contacts-title">Deleted contacts</h1>
      @if (loading()) {
        <div class="admin-skeleton" data-testid="deleted-contacts-loading" aria-busy="true" aria-label="Loading deleted contacts">
          @for (row of [1,2,3]; track row) {
            <div class="admin-skeleton__row">
              <div class="admin-skeleton__cell admin-skeleton__cell--name"></div>
              <div class="admin-skeleton__cell admin-skeleton__cell--date"></div>
              <div class="admin-skeleton__cell admin-skeleton__cell--action"></div>
            </div>
          }
        </div>
      } @else if (loadError()) {
        <div class="admin-error" data-testid="deleted-contacts-error" role="alert">
          <mat-icon aria-hidden="true">error_outline</mat-icon>
          <span data-testid="deleted-contacts-load-error-message">Failed to load deleted contacts.</span>
          <ur-button variant="secondary" (pressed)="load()" data-testid="deleted-contacts-retry-btn">Retry</ur-button>
        </div>
      } @else if (rows().length === 0) {
        <div class="admin-empty" data-testid="deleted-contacts-empty">
          <div class="admin-empty__icon-wrap" data-testid="deleted-contacts-empty-icon-wrap" aria-hidden="true">
            <mat-icon aria-hidden="true">archive</mat-icon>
          </div>
          <h2 data-testid="deleted-contacts-empty-title">Nothing in the archive</h2>
          <p data-testid="deleted-contacts-empty-subtitle">Soft-deleted contacts show up here for 30 days before being purged.</p>
          <a routerLink="/contacts" data-testid="deleted-contacts-empty-back-link">Back to active contacts</a>
        </div>
      } @else {
        <table mat-table [dataSource]="rows()" aria-label="Deleted contacts" data-testid="deleted-contacts-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef scope="col">Name</th>
            <td mat-cell *matCellDef="let row">{{ row.name }}</td>
          </ng-container>
          <ng-container matColumnDef="deletedAt">
            <th mat-header-cell *matHeaderCellDef scope="col">Deleted</th>
            <td mat-cell *matCellDef="let row">{{ row.deletedAt | date:'short' }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef scope="col"></th>
            <td mat-cell *matCellDef="let row">
              <ur-button variant="ghost" [disabled]="restoring() === row.id" (pressed)="restore(row.id)" [attr.data-testid]="'restore-contact-' + row.id">
                {{ restoring() === row.id ? 'Restoring…' : 'Restore' }}
              </ur-button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns" [attr.data-testid]="'deleted-contact-row-' + row.id"></tr>
        </table>
      }
    </div>
    @if (restoreError()) {
      <div class="admin-toast admin-toast--error" data-testid="restore-error-toast" role="alert">
        <mat-icon aria-hidden="true">error_outline</mat-icon>
        <span data-testid="restore-error-toast-message">Restore failed. Please try again.</span>
      </div>
    }
  `,
  styles: [`
    .admin-error {
      display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 8px; margin: 16px 0;
      background: color-mix(in srgb, var(--ur-danger, #f87171) 12%, transparent); color: var(--ur-danger, #f87171);
      border: 1px solid color-mix(in srgb, var(--ur-danger, #f87171) 40%, transparent); font-size: 0.875rem;
    }
    .admin-error mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }
    @keyframes dcp-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
    .admin-skeleton { display: flex; flex-direction: column; gap: 10px; margin: 16px 0; }
    .admin-skeleton__row {
      display: flex; align-items: center; gap: 16px; padding: 12px 0;
      border-bottom: 1px solid var(--ur-border-subtle, #e2e8f0);
    }
    .admin-skeleton__cell {
      height: 14px; border-radius: 4px;
      background: var(--ur-bg-skeleton, #e2e8f0);
      animation: dcp-pulse 1.4s ease-in-out infinite;
    }
    .admin-skeleton__cell--name { width: 40%; }
    .admin-skeleton__cell--date { width: 20%; }
    .admin-skeleton__cell--action { width: 10%; margin-left: auto; }
    .admin-empty {
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      padding: 48px 24px; color: var(--ur-fg-muted, #64748b); text-align: center;
    }
    .admin-empty mat-icon { font-size: 36px; width: 36px; height: 36px; color: var(--ur-accent-primary, #9f86ff); }
    .admin-empty__icon-wrap { display: inline-flex; align-items: center; justify-content: center; width: 72px; height: 72px; border-radius: 9999px; background: var(--ur-accent-soft, rgba(159, 134, 255, 0.12)); border: 1px solid var(--ur-accent-primary, #9f86ff); }
    .admin-empty p { margin: 0; font-size: 0.9rem; }
    .admin-toast {
      position: fixed; top: 16px; right: 24px; display: flex; align-items: center;
      gap: 10px; padding: 12px 16px; border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-surface, #16161f); color: #fff; font-size: 0.875rem; font-weight: 500;
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .admin-toast--error { border: 1px solid var(--ur-danger, #f87171); }
    .admin-toast--error mat-icon { color: var(--ur-danger, #f87171); font-size: 18px; width: 18px; height: 18px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeletedContactsPageComponent implements OnDestroy {
  private contactSvc = inject(CONTACT_SERVICE);
  readonly columns = ['name', 'deletedAt', 'actions'];
  rows = signal<DeletedContactDto[]>([]);
  loading = signal(true);
  loadError = signal(false);
  restoring = signal<string | null>(null);
  restoreError = signal(false);

  private restoreErrorTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.load();
  }

  ngOnDestroy(): void {
    clearTimeout(this.restoreErrorTimer);
  }

  load(): void {
    this.loadError.set(false);
    this.loading.set(true);
    this.contactSvc.listDeleted().subscribe({
      next: data => { this.rows.set(data); this.loading.set(false); },
      error: () => { this.loading.set(false); this.loadError.set(true); },
    });
  }

  restore(id: string): void {
    this.restoring.set(id);
    this.contactSvc.restore(id).subscribe({
      next: () => {
        this.rows.update(r => r.filter(c => c.id !== id));
        this.restoring.set(null);
      },
      error: () => {
        this.restoring.set(null);
        clearTimeout(this.restoreErrorTimer);
        this.restoreError.set(true);
        this.restoreErrorTimer = setTimeout(() => this.restoreError.set(false), 4000);
      },
    });
  }
}

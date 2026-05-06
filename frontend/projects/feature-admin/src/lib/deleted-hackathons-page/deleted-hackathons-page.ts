import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { HACKATHON_SERVICE, DeletedHackathonDto } from 'api';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { UrButtonComponent } from 'components';

@Component({
  selector: 'lib-deleted-hackathons-page',
  imports: [DatePipe, MatButtonModule, MatIconModule, MatTableModule, UrButtonComponent],
  template: `
    <div class="deleted-hackathons-page">
      <h1 data-testid="deleted-hackathons-title">Deleted hackathons</h1>
      @if (loading()) {
        <div class="admin-skeleton" data-testid="deleted-hackathons-loading" aria-busy="true" aria-label="Loading deleted hackathons">
          @for (row of [1,2,3]; track row) {
            <div class="admin-skeleton__row">
              <div class="admin-skeleton__cell admin-skeleton__cell--title"></div>
              <div class="admin-skeleton__cell admin-skeleton__cell--date"></div>
              <div class="admin-skeleton__cell admin-skeleton__cell--action"></div>
            </div>
          }
        </div>
      } @else if (loadError()) {
        <div class="admin-error" data-testid="deleted-hackathons-error" role="alert">
          <mat-icon aria-hidden="true">error_outline</mat-icon>
          <span data-testid="deleted-hackathons-load-error-message">Failed to load deleted hackathons.</span>
          <ur-button variant="secondary" (pressed)="load()" data-testid="deleted-hackathons-retry-btn">Retry</ur-button>
        </div>
      } @else if (rows().length === 0) {
        <div class="admin-empty" data-testid="deleted-hackathons-empty">
          <div class="admin-empty__icon-wrap" data-testid="deleted-hackathons-empty-icon-wrap" aria-hidden="true">
            <mat-icon aria-hidden="true">rocket_launch</mat-icon>
          </div>
          <h2 data-testid="deleted-hackathons-empty-title">No deleted hackathons</h2>
        </div>
      } @else {
        <table mat-table [dataSource]="rows()" aria-label="Deleted hackathons" data-testid="deleted-hackathons-table">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef scope="col">Title</th>
            <td mat-cell *matCellDef="let row">{{ row.title }}</td>
          </ng-container>
          <ng-container matColumnDef="deletedAt">
            <th mat-header-cell *matHeaderCellDef scope="col">Deleted</th>
            <td mat-cell *matCellDef="let row">{{ row.deletedAt | date:'short' }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef scope="col"></th>
            <td mat-cell *matCellDef="let row">
              <ur-button variant="ghost" [disabled]="restoring() === row.id" (pressed)="restore(row.id)" [attr.data-testid]="'restore-hackathon-' + row.id">
                {{ restoring() === row.id ? 'Restoring…' : 'Restore' }}
              </ur-button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns"></tr>
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
    @keyframes dhp-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
    .admin-skeleton { display: flex; flex-direction: column; gap: 10px; margin: 16px 0; }
    .admin-skeleton__row {
      display: flex; align-items: center; gap: 16px; padding: 12px 0;
      border-bottom: 1px solid var(--ur-border-subtle, #e2e8f0);
    }
    .admin-skeleton__cell {
      height: 14px; border-radius: 4px;
      background: var(--ur-bg-skeleton, #e2e8f0);
      animation: dhp-pulse 1.4s ease-in-out infinite;
    }
    .admin-skeleton__cell--title { width: 45%; }
    .admin-skeleton__cell--date { width: 20%; }
    .admin-skeleton__cell--action { width: 10%; margin-left: auto; }
    .admin-empty {
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      padding: 48px 24px; color: var(--ur-fg-muted, #64748b); text-align: center;
    }
    .admin-empty__icon-wrap {
      display: inline-flex; align-items: center; justify-content: center;
      width: 96px; height: 96px; border-radius: 9999px;
      background: var(--ur-bg-input, #1a1a25);
      border: 1px solid var(--ur-border-default, #2a2a3a);
    }
    .admin-empty__icon-wrap mat-icon { font-size: 40px; width: 40px; height: 40px; color: var(--ur-fg-muted, #7a7a87); }
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
export class DeletedHackathonsPageComponent implements OnDestroy {
  private hackathonSvc = inject(HACKATHON_SERVICE);
  readonly columns = ['title', 'deletedAt', 'actions'];
  rows = signal<DeletedHackathonDto[]>([]);
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
    this.hackathonSvc.listDeleted().subscribe({
      next: data => { this.rows.set(data); this.loading.set(false); },
      error: () => { this.loading.set(false); this.loadError.set(true); },
    });
  }

  restore(id: string): void {
    this.restoring.set(id);
    this.hackathonSvc.restore(id).subscribe({
      next: () => {
        this.rows.update(r => r.filter(h => h.id !== id));
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

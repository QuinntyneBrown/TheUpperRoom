import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { CONTACT_SERVICE, DeletedContactDto } from 'api';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'lib-deleted-contacts-page',
  imports: [DatePipe, MatButtonModule, MatIconModule, MatTableModule],
  template: `
    <div class="deleted-contacts-page">
      <h1>Deleted Contacts</h1>
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
          <mat-icon>error_outline</mat-icon>
          <span>Failed to load deleted contacts.</span>
          <button mat-stroked-button data-testid="deleted-contacts-retry-btn" (click)="load()">Retry</button>
        </div>
      } @else if (rows().length === 0) {
        <div class="admin-empty" data-testid="deleted-contacts-empty">
          <mat-icon>person_off</mat-icon>
          <p>No deleted contacts.</p>
        </div>
      } @else {
        <table mat-table [dataSource]="rows()">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let row">{{ row.name }}</td>
          </ng-container>
          <ng-container matColumnDef="deletedAt">
            <th mat-header-cell *matHeaderCellDef>Deleted</th>
            <td mat-cell *matCellDef="let row">{{ row.deletedAt | date:'short' }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let row">
              <button mat-button [disabled]="restoring() === row.id" (click)="restore(row.id)">
                {{ restoring() === row.id ? 'Restoring…' : 'Restore' }}
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns"></tr>
        </table>
      }
    </div>
    @if (restoreError()) {
      <div class="admin-toast admin-toast--error" data-testid="restore-error-toast" role="alert">
        <mat-icon>error_outline</mat-icon>
        <span>Restore failed. Please try again.</span>
      </div>
    }
  `,
  styles: [`
    .admin-error {
      display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 8px; margin: 16px 0;
      background: var(--ur-error-bg, #fef2f2); color: var(--ur-error-fg, #dc2626);
      border: 1px solid var(--ur-error-border, #fecaca); font-size: 0.875rem;
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
    .admin-empty mat-icon { font-size: 48px; width: 48px; height: 48px; opacity: 0.4; }
    .admin-empty p { margin: 0; font-size: 0.9rem; }
    .admin-toast {
      position: fixed; top: 16px; right: 24px; display: flex; align-items: center;
      gap: 10px; padding: 12px 16px; border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-overlay, #1e293b); color: #fff; font-size: 0.875rem; font-weight: 500;
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .admin-toast--error { border: 1px solid var(--ur-error-fg, #dc2626); }
    .admin-toast--error mat-icon { color: var(--ur-error-fg, #dc2626); font-size: 18px; width: 18px; height: 18px; }
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

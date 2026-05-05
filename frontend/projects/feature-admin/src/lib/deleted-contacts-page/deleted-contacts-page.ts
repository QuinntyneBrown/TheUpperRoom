import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CONTACT_SERVICE, DeletedContactDto } from 'api';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'lib-deleted-contacts-page',
  imports: [DatePipe, MatButtonModule, MatTableModule],
  template: `
    <div class="deleted-contacts-page">
      <h1>Deleted Contacts</h1>
      @if (rows().length === 0) {
        <p>No deleted contacts.</p>
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
              <button mat-button (click)="restore(row.id)">Restore</button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns"></tr>
        </table>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeletedContactsPageComponent {
  private contactSvc = inject(CONTACT_SERVICE);
  readonly columns = ['name', 'deletedAt', 'actions'];
  rows = signal<DeletedContactDto[]>([]);

  constructor() {
    this.contactSvc.listDeleted().subscribe(data => this.rows.set(data));
  }

  restore(id: string): void {
    this.contactSvc.restore(id).subscribe(() =>
      this.rows.update(r => r.filter(c => c.id !== id))
    );
  }
}

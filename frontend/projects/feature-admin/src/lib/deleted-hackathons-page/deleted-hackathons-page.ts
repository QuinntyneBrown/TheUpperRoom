import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HACKATHON_SERVICE, DeletedHackathonDto } from 'api';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'lib-deleted-hackathons-page',
  imports: [DatePipe, MatButtonModule, MatTableModule],
  template: `
    <div class="deleted-hackathons-page">
      <h1>Deleted Hackathons</h1>
      @if (rows().length === 0) {
        <p>No deleted hackathons.</p>
      } @else {
        <table mat-table [dataSource]="rows()">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let row">{{ row.title }}</td>
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
export class DeletedHackathonsPageComponent {
  private hackathonSvc = inject(HACKATHON_SERVICE);
  readonly columns = ['title', 'deletedAt', 'actions'];
  rows = signal<DeletedHackathonDto[]>([]);

  constructor() {
    this.hackathonSvc.listDeleted().subscribe(data => this.rows.set(data));
  }

  restore(id: string): void {
    this.hackathonSvc.restore(id).subscribe(() =>
      this.rows.update(r => r.filter(h => h.id !== id))
    );
  }
}

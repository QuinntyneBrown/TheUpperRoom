import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { UrButtonComponent } from 'components';

@Component({
  selector: 'ur-no-access-page',
  templateUrl: './no-access-page.html',
  styles: [`
    .no-access-page__actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 16px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, UrButtonComponent],
})
export class NoAccessPageComponent {
  private location = inject(Location);
  private router = inject(Router);

  goBack(): void { this.location.back(); }
  goToDashboard(): void { this.router.navigateByUrl('/dashboard'); }
}

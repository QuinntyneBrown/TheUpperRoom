import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { UrButtonComponent } from 'components';

@Component({
  selector: 'ur-no-access-page',
  templateUrl: './no-access-page.html',
  styles: [`
    .no-access-page__icon-wrap {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      border-radius: 9999px;
      background: var(--ur-danger-soft, rgba(248, 113, 113, 0.12));
      border: 1px solid var(--ur-danger, #f87171);
    }
    .no-access-page__icon-wrap .no-access-page__icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: var(--ur-danger, #f87171);
    }
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

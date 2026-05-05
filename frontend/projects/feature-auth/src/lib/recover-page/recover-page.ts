import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AUTH_SERVICE } from 'api';
import { UrButtonComponent, UrInputComponent } from 'components';

@Component({
  selector: 'ur-recover-page',
  templateUrl: './recover-page.html',
  styleUrl: './recover-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UrButtonComponent, UrInputComponent, RouterLink],
})
export class RecoverPageComponent {
  private auth = inject(AUTH_SERVICE);

  email = signal('');
  submitted = signal(false);
  loading = signal(false);

  submit(): void {
    this.loading.set(true);
    this.auth.requestRecovery(this.email()).subscribe({
      next: () => { this.loading.set(false); this.submitted.set(true); },
      error: () => { this.loading.set(false); this.submitted.set(true); }, // Always show generic message
    });
  }
}

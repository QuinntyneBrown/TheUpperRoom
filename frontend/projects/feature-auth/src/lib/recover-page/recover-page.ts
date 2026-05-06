import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AUTH_SERVICE } from 'api';
import { UrAlertComponent, UrButtonComponent, UrInputComponent } from 'components';

@Component({
  selector: 'ur-recover-page',
  templateUrl: './recover-page.html',
  styleUrl: './recover-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatIconModule, UrAlertComponent, UrButtonComponent, UrInputComponent, RouterLink],
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

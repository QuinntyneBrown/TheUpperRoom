import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AUTH_SERVICE } from 'api';
import { MatIconModule } from '@angular/material/icon';
import { UrAlertComponent, UrButtonComponent, UrInputComponent } from 'components';

@Component({
  selector: 'ur-register-page',
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, UrAlertComponent, UrButtonComponent, UrInputComponent, RouterLink, MatIconModule],
})
export class RegisterPageComponent implements OnDestroy {
  private auth = inject(AUTH_SERVICE);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private inviteToken = this.route.snapshot.queryParamMap.get('invite') ?? undefined;

  email = signal('');
  password = signal('');
  displayName = signal('');
  city = signal('');
  errors = signal<Record<string, string[]>>({});
  submitted = signal(false);
  loading = signal(false);
  submitError = signal(false);

  private submitErrorTimer?: ReturnType<typeof setTimeout>;

  ngOnDestroy(): void {
    clearTimeout(this.submitErrorTimer);
  }

  submit(): void {
    this.loading.set(true);
    this.errors.set({});

    this.auth.register({
      email: this.email(),
      password: this.password(),
      displayName: this.displayName(),
      city: this.city(),
      inviteToken: this.inviteToken,
    }).subscribe({
      next: () => {
        this.loading.set(false);
        if (this.inviteToken) {
          this.router.navigateByUrl('/dashboard');
        } else {
          this.submitted.set(true);
        }
      },
      error: (err: { status: number; error?: { fields?: Record<string, string[]> } }) => {
        this.loading.set(false);
        if (err.status === 400 && err.error?.fields) {
          this.errors.set(err.error.fields);
        } else {
          clearTimeout(this.submitErrorTimer);
          this.submitError.set(true);
          this.submitErrorTimer = setTimeout(() => this.submitError.set(false), 4000);
        }
      },
    });
  }

  fieldError(field: string): string {
    return this.errors()[field]?.[0] ?? '';
  }
}

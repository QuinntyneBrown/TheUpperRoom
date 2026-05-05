import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AUTH_SERVICE } from 'api';
import { UrButtonComponent, UrInputComponent } from 'components';

@Component({
  selector: 'ur-sign-in-page',
  templateUrl: './sign-in-page.html',
  styleUrl: './sign-in-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UrButtonComponent, UrInputComponent, RouterLink],
})
export class SignInPageComponent {
  private auth = inject(AUTH_SERVICE);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  error = signal('');
  loading = signal(false);

  submit(): void {
    this.loading.set(true);
    this.error.set('');

    this.auth.signIn({ email: this.email(), password: this.password() }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/dashboard');
      },
      error: (err: { status: number }) => {
        this.loading.set(false);
        if (err.status === 403) {
          this.error.set('Please verify your email before signing in.');
        } else {
          this.error.set('Invalid email or password.');
        }
      },
    });
  }
}

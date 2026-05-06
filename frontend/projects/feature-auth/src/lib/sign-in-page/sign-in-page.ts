import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AUTH_SERVICE } from 'api';
import { MatIconModule } from '@angular/material/icon';
import { UrButtonComponent, UrInputComponent } from 'components';

@Component({
  selector: 'ur-sign-in-page',
  templateUrl: './sign-in-page.html',
  styleUrl: './sign-in-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, UrButtonComponent, UrInputComponent, RouterLink, MatIconModule],
})
export class SignInPageComponent implements OnInit {
  private auth = inject(AUTH_SERVICE);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = signal('');
  password = signal('');
  rememberMe = signal(false);
  error = signal('');
  loading = signal(false);
  returnUrl = signal('');
  showReturnToast = signal(false);

  ngOnInit(): void {
    const url = this.route.snapshot.queryParamMap.get('returnUrl') ?? '';
    this.returnUrl.set(url);
    if (url) this.showReturnToast.set(true);
  }

  submit(): void {
    this.loading.set(true);
    this.error.set('');

    this.auth.signIn({ email: this.email(), password: this.password() }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl(this.returnUrl() || '/dashboard');
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

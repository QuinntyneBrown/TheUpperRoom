import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AUTH_SERVICE } from 'api';
import { UrAlertComponent, UrButtonComponent, UrInputComponent } from 'components';

@Component({
  selector: 'ur-reset-page',
  templateUrl: './reset-page.html',
  styleUrl: './reset-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, UrAlertComponent, UrButtonComponent, UrInputComponent, RouterLink],
})
export class ResetPageComponent implements OnInit {
  private auth = inject(AUTH_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token = '';
  email = '';
  newPassword = signal('');
  confirmPassword = signal('');
  error = signal('');
  loading = signal(false);

  passwordsMatch = computed(() =>
    this.confirmPassword() === '' || this.newPassword() === this.confirmPassword()
  );

  canSubmit = computed(() =>
    this.newPassword().length >= 1 &&
    this.newPassword() === this.confirmPassword() &&
    !this.loading()
  );

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
  }

  submit(): void {
    if (!this.canSubmit()) return;
    this.loading.set(true);
    this.error.set('');
    this.auth.resetPassword({ email: this.email, token: this.token, newPassword: this.newPassword() }).subscribe({
      next: () => this.router.navigateByUrl('/auth/sign-in'),
      error: () => { this.loading.set(false); this.error.set('The link is expired or has already been used.'); },
    });
  }
}

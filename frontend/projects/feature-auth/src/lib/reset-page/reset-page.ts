import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AUTH_SERVICE } from 'api';
import { UrButtonComponent, UrInputComponent } from 'components';

@Component({
  selector: 'ur-reset-page',
  templateUrl: './reset-page.html',
  styleUrl: './reset-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UrButtonComponent, UrInputComponent, RouterLink],
})
export class ResetPageComponent implements OnInit {
  private auth = inject(AUTH_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token = '';
  email = '';
  newPassword = signal('');
  error = signal('');
  loading = signal(false);

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
  }

  submit(): void {
    this.loading.set(true);
    this.error.set('');
    this.auth.resetPassword({ email: this.email, token: this.token, newPassword: this.newPassword() }).subscribe({
      next: () => this.router.navigateByUrl('/auth/sign-in'),
      error: () => { this.loading.set(false); this.error.set('The link is expired or has already been used.'); },
    });
  }
}

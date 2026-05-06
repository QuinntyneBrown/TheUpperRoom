import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AUTH_SERVICE } from 'api';
import { UrButtonComponent } from 'components';

@Component({
  selector: 'ur-verify-page',
  templateUrl: './verify-page.html',
  styleUrl: './verify-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, UrButtonComponent],
})
export class VerifyPageComponent implements OnInit {
  private auth = inject(AUTH_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  status = signal<'verifying' | 'verified' | 'error'>('verifying');

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.auth.verify(token).subscribe({
      next: () => {
        this.status.set('verified');
        setTimeout(() => this.router.navigateByUrl('/auth/sign-in'), 3000);
      },
      error: () => this.status.set('error'),
    });
  }

  goToSignIn(): void {
    this.router.navigateByUrl('/auth/sign-in');
  }
}

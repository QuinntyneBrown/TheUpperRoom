import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AUTH_SERVICE } from 'api';

@Component({
  selector: 'ur-verify-page',
  templateUrl: './verify-page.html',
  styleUrl: './verify-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class VerifyPageComponent implements OnInit {
  private auth = inject(AUTH_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  status = signal<'verifying' | 'error'>('verifying');

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.auth.verify(token).subscribe({
      next: () => this.router.navigateByUrl('/auth/sign-in'),
      error: () => this.status.set('error'),
    });
  }
}

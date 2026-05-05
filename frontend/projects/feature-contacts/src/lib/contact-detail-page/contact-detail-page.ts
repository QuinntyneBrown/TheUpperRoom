import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { AUTH_SERVICE, CONTACT_SERVICE, ContactDto } from 'api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UrButtonComponent, UrDialogComponent } from 'components';
import { NotesPanelComponent } from '../notes-panel/notes-panel';

@Component({
  selector: 'ur-contact-detail-page',
  templateUrl: './contact-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule, MatIconModule, UrButtonComponent, UrDialogComponent, NotesPanelComponent],
  styles: [`
    .contact-toast {
      position: fixed; top: 16px; right: 24px; display: flex; align-items: center;
      gap: 10px; padding: 12px 16px; border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-overlay, #1e293b); color: #fff; font-size: 0.875rem; font-weight: 500;
      border: 1px solid var(--ur-success, #22c55e);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .contact-toast mat-icon { color: var(--ur-success, #22c55e); font-size: 18px; width: 18px; height: 18px; }
  `],
})
export class ContactDetailPageComponent implements OnInit, OnDestroy {
  private contacts = inject(CONTACT_SERVICE);
  private auth = inject(AUTH_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  contact = signal<ContactDto | null>(null);
  currentUserId = signal('');
  notFound = signal(false);
  showDeleteDialog = signal(false);
  deleting = signal(false);
  savedToast = signal(false);

  private savedToastTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.contacts.getById(id).subscribe({
      next: (c) => this.contact.set(c),
      error: () => this.notFound.set(true),
    });
    this.auth.me().subscribe({ next: (u) => this.currentUserId.set(u.id) });

    if (this.route.snapshot.queryParamMap.get('saved') === '1') {
      this.savedToast.set(true);
      this.savedToastTimer = setTimeout(() => this.savedToast.set(false), 3000);
      this.router.navigate([], { replaceUrl: true, relativeTo: this.route, queryParams: {} });
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.savedToastTimer);
  }

  confirmDelete(): void {
    const c = this.contact();
    if (!c) return;
    this.deleting.set(true);
    this.contacts.delete(c.id).subscribe({
      next: () => this.router.navigate(['/contacts'], { queryParams: { deleted: '1' } }),
      error: () => this.deleting.set(false),
    });
  }
}

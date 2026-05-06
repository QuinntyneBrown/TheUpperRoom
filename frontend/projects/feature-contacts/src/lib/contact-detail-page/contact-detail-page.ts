import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { AUTH_SERVICE, CONTACT_SERVICE, ContactDto } from 'api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DialogService } from 'components';
import { NotesPanelComponent } from '../notes-panel/notes-panel';
import { DeleteContactDialogComponent } from '../delete-contact-dialog/delete-contact-dialog';

@Component({
  selector: 'ur-contact-detail-page',
  templateUrl: './contact-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatMenuModule, NotesPanelComponent],
  styles: [`
    .contact-toast {
      position: fixed; top: 16px; right: 24px; display: flex; align-items: center;
      gap: 10px; padding: 12px 16px; border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-surface, #16161f); color: #fff; font-size: 0.875rem; font-weight: 500;
      border: 1px solid var(--ur-success, #22c55e);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .contact-toast mat-icon { color: var(--ur-success, #22c55e); font-size: 18px; width: 18px; height: 18px; }
    .contact-toast--error { border-color: var(--ur-danger, #f87171); }
    .contact-toast--error mat-icon { color: var(--ur-danger, #f87171); }
    .contact-detail__header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; padding: 16px 20px; border-bottom: 1px solid var(--ur-border-subtle); background: var(--ur-bg-surface); }
    .contact-detail__breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; color: var(--ur-fg-secondary); }
    .contact-detail__back-icon { font-size: 18px; width: 18px; height: 18px; color: var(--ur-fg-secondary); }
    .contact-detail__breadcrumb-link { color: var(--ur-fg-secondary); text-decoration: none; }
    .contact-detail__breadcrumb-link:hover { text-decoration: underline; }
    .contact-detail__breadcrumb-sep { color: var(--ur-fg-muted); }
    .contact-detail__breadcrumb-name { color: var(--ur-fg-primary); font-weight: 500; }
    .contact-detail__actions { display: flex; align-items: center; gap: 8px; }
    .contact-detail__permission-banner {
      display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 8px; margin-top: 8px;
      background: var(--ur-info-bg, #eff6ff); color: var(--ur-info-fg, #1d4ed8);
      border: 1px solid var(--ur-info-border, #bfdbfe); font-size: 0.875rem;
    }
    .contact-detail__permission-banner mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; margin-top: 1px; }
    .contact-detail__permission-banner-body { display: flex; flex-direction: column; gap: 2px; flex: 1; }
    .contact-detail__permission-banner-title { font-weight: 600; }
    .contact-detail__permission-banner-text { font-size: 0.8125rem; opacity: 0.85; }
    .contact-detail-loading { display: flex; flex-direction: column; gap: 16px; padding: 24px 0; }
    .contact-detail-loading__title { height: 28px; width: 40%; border-radius: 6px; background: var(--ur-border-default, #2a2a3a); animation: cd-pulse 1.4s ease-in-out infinite; }
    .contact-detail-loading__line { height: 16px; border-radius: 4px; background: var(--ur-border-default, #2a2a3a); animation: cd-pulse 1.4s ease-in-out infinite; }
    .contact-detail-loading__line--wide { width: 60%; }
    .contact-detail-loading__line--medium { width: 45%; }
    .contact-detail-loading__line--narrow { width: 30%; }
    @keyframes cd-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
    .contact-detail__body { display: flex; gap: 24px; padding: 32px; align-items: flex-start; }
    .contact-detail__summary {
      width: 340px; flex-shrink: 0; display: flex; flex-direction: column; gap: 12px;
      padding: 24px; border-radius: 12px; background: var(--ur-bg-surface, #16161f);
      border: 1px solid var(--ur-border-subtle, #222233);
    }
    .contact-detail__avatar {
      width: 96px; height: 96px; border-radius: 50%; align-self: center;
      display: flex; align-items: center; justify-content: center;
      background: var(--ur-accent-soft, #eef2ff); border: 1px solid var(--ur-accent-primary, #6366f1);
      color: var(--ur-accent-primary, #6366f1); font-size: 1.5rem; font-weight: 700;
      text-transform: uppercase; user-select: none;
    }
    .contact-detail__name { margin: 0 0 12px; font-size: 1.25rem; font-weight: 700; color: var(--ur-fg-primary, #f1f5f9); }
    .contact-detail__meta-row { display: flex; align-items: center; gap: 10px; font-size: 0.875rem; color: var(--ur-fg-secondary, #94a3b8); }
    .contact-detail__meta-row mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; color: var(--ur-fg-muted, #64748b); }
  `],
})
export class ContactDetailPageComponent implements OnInit, OnDestroy {
  private contacts = inject(CONTACT_SERVICE);
  private auth = inject(AUTH_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(DialogService);

  contact = signal<ContactDto | null>(null);
  loading = signal(true);
  currentUserId = signal('');
  notFound = signal(false);
  deleting = signal(false);
  deleteError = signal(false);
  savedToast = signal(false);
  canDelete = signal(false);

  private savedToastTimer?: ReturnType<typeof setTimeout>;
  private deleteErrorTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.contacts.getById(id).subscribe({
      next: (c) => { this.contact.set(c); this.loading.set(false); },
      error: () => { this.notFound.set(true); this.loading.set(false); },
    });
    this.auth.me().subscribe({
      next: (u) => {
        this.currentUserId.set(u.id);
        this.canDelete.set(u.roles.includes('Admin') || u.roles.includes('CityLead'));
      },
    });

    if (this.route.snapshot.queryParamMap.get('saved') === '1') {
      this.savedToast.set(true);
      this.savedToastTimer = setTimeout(() => this.savedToast.set(false), 3000);
      this.router.navigate([], { replaceUrl: true, relativeTo: this.route, queryParams: {} });
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.savedToastTimer);
    clearTimeout(this.deleteErrorTimer);
  }

  onDeleteClick(): void {
    const c = this.contact();
    if (!this.canDelete() || !c) return;
    this.dialog.open<DeleteContactDialogComponent, boolean>(DeleteContactDialogComponent, {
      ariaLabel: 'Delete contact',
      data: { contactName: `${c.firstName} ${c.lastName}` },
    }).closed$.subscribe(confirmed => { if (confirmed === true) this.confirmDelete(); });
  }

  private confirmDelete(): void {
    const c = this.contact();
    if (!c) return;
    this.deleting.set(true);
    this.contacts.delete(c.id).subscribe({
      next: () => this.router.navigate(['/contacts'], { queryParams: { deleted: '1' } }),
      error: () => {
        this.deleting.set(false);
        clearTimeout(this.deleteErrorTimer);
        this.deleteError.set(true);
        this.deleteErrorTimer = setTimeout(() => this.deleteError.set(false), 4000);
      },
    });
  }
}

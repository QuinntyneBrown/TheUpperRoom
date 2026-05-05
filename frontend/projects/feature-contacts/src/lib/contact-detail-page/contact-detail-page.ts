import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { AUTH_SERVICE, CONTACT_SERVICE, ContactDto } from 'api';
import { UrButtonComponent, UrDialogComponent } from 'components';
import { NotesPanelComponent } from '../notes-panel/notes-panel';

@Component({
  selector: 'ur-contact-detail-page',
  templateUrl: './contact-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, UrButtonComponent, UrDialogComponent, NotesPanelComponent],
})
export class ContactDetailPageComponent implements OnInit {
  private contacts = inject(CONTACT_SERVICE);
  private auth = inject(AUTH_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  contact = signal<ContactDto | null>(null);
  currentUserId = signal('');
  notFound = signal(false);
  showDeleteDialog = signal(false);
  deleting = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.contacts.getById(id).subscribe({
      next: (c) => this.contact.set(c),
      error: () => this.notFound.set(true),
    });
    this.auth.me().subscribe({ next: (u) => this.currentUserId.set(u.id) });
  }

  confirmDelete(): void {
    const c = this.contact();
    if (!c) return;
    this.deleting.set(true);
    this.contacts.delete(c.id).subscribe({
      next: () => this.router.navigateByUrl('/contacts'),
      error: () => this.deleting.set(false),
    });
  }
}

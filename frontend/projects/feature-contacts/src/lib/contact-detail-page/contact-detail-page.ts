import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CONTACT_SERVICE, ContactDto } from 'api';
import { UrButtonComponent, UrDialogComponent } from 'components';

@Component({
  selector: 'ur-contact-detail-page',
  templateUrl: './contact-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe, UrButtonComponent, UrDialogComponent],
})
export class ContactDetailPageComponent implements OnInit {
  private contacts = inject(CONTACT_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  contact = signal<ContactDto | null>(null);
  notFound = signal(false);
  showDeleteDialog = signal(false);
  deleting = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.contacts.getById(id).subscribe({
      next: (c) => this.contact.set(c),
      error: () => this.notFound.set(true),
    });
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

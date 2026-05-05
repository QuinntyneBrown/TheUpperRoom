import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CONTACT_SERVICE, ContactDto } from 'api';

@Component({
  selector: 'ur-contact-detail-page',
  templateUrl: './contact-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe],
})
export class ContactDetailPageComponent implements OnInit {
  private contacts = inject(CONTACT_SERVICE);
  private route = inject(ActivatedRoute);

  contact = signal<ContactDto | null>(null);
  notFound = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.contacts.getById(id).subscribe({
      next: (c) => this.contact.set(c),
      error: () => this.notFound.set(true),
    });
  }
}

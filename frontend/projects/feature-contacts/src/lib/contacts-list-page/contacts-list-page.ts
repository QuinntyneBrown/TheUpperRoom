import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CONTACT_SERVICE, ContactListRow, ContactListResult, ContactSearchResult, REALTIME_SERVICE } from 'api';
import { HighlightPipe, UrSearchComponent } from 'components';

type SortField = 'firstName' | 'lastName';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'ur-contacts-list-page',
  templateUrl: './contacts-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, UrSearchComponent, HighlightPipe],
})
export class ContactsListPageComponent implements OnInit {
  private contacts = inject(CONTACT_SERVICE);
  private realtime = inject(REALTIME_SERVICE);

  term = signal('');
  searchResults = signal<ContactSearchResult[]>([]);
  listResult = signal<ContactListResult>({ rows: [], total: 0 });
  page = signal(1);
  sortField = signal<SortField>('lastName');
  sortDir = signal<SortDir>('asc');
  loading = signal(false);

  private search$ = new Subject<string>();

  constructor() {
    this.search$
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        switchMap((t) => {
          if (t.length < 2) {
            this.searchResults.set([]);
            return of(null);
          }
          this.loading.set(true);
          return this.contacts.search(t);
        }),
        takeUntilDestroyed(),
      )
      .subscribe((res) => {
        if (res !== null) this.searchResults.set(res ?? []);
        this.loading.set(false);
      });

    this.realtime.events$
      .pipe(
        filter((e) => e.eventType === 'contactCreated'),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.loadPage());
  }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.loading.set(true);
    const sort = `${this.sortField()}:${this.sortDir()}`;
    this.contacts.list(this.page(), 25, sort).subscribe({
      next: (r) => { this.listResult.set(r); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  onSearch(value: string): void {
    this.term.set(value);
    if (value.length < 2) this.searchResults.set([]);
    this.search$.next(value);
  }

  toggleSort(field: SortField): void {
    if (this.sortField() === field) {
      this.sortDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortField.set(field);
      this.sortDir.set('asc');
    }
    this.page.set(1);
    this.loadPage();
  }

  goToPage(p: number): void {
    this.page.set(p);
    this.loadPage();
  }

  get totalPages(): number {
    return Math.ceil(this.listResult().total / 25);
  }

  get isSearching(): boolean {
    return this.term().length >= 2;
  }
}

import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
  imports: [RouterLink, MatButtonModule, MatIconModule, UrSearchComponent, HighlightPipe],
  styles: [`
    .contact-toast {
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      display: flex; align-items: center; gap: 10px; padding: 12px 16px;
      border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-overlay, #1e293b); color: #fff; font-size: 0.875rem; font-weight: 500;
      border: 1px solid var(--ur-success, #22c55e);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .contact-toast mat-icon { color: var(--ur-success, #22c55e); font-size: 18px; width: 18px; height: 18px; }
    .contacts-list-page__no-results {
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      padding: 48px 24px; text-align: center; color: var(--ur-fg-muted, #64748b);
    }
    .contacts-list-page__no-results mat-icon { font-size: 40px; width: 40px; height: 40px; opacity: 0.6; }
    .contacts-list-page__no-results p { margin: 0; font-size: 1rem; font-weight: 500; }
    .contact-search-skeleton { padding: 8px 0; }
    .contact-skeleton-row { padding: 10px 16px; display: flex; flex-direction: column; gap: 6px; }
    .contact-skeleton-row__line { height: 12px; border-radius: 4px; background: var(--ur-skeleton, #e2e8f0); animation: contact-shimmer 1.4s ease-in-out infinite; }
    .contact-skeleton-row__line--name { width: 55%; }
    .contact-skeleton-row__line--meta { width: 35%; }
    @keyframes contact-shimmer { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
  `],
})
export class ContactsListPageComponent implements OnInit, OnDestroy {
  private contacts = inject(CONTACT_SERVICE);
  private realtime = inject(REALTIME_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  term = signal('');
  searchResults = signal<ContactSearchResult[]>([]);
  listResult = signal<ContactListResult>({ rows: [], total: 0 });
  page = signal(1);
  sortField = signal<SortField>('lastName');
  sortDir = signal<SortDir>('asc');
  loading = signal(false);
  deletedToast = signal(false);

  private deletedToastTimer?: ReturnType<typeof setTimeout>;

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
    if (this.route.snapshot.queryParamMap.get('deleted') === '1') {
      this.deletedToast.set(true);
      this.deletedToastTimer = setTimeout(() => this.deletedToast.set(false), 3000);
      this.router.navigate([], { replaceUrl: true, relativeTo: this.route, queryParams: {} });
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.deletedToastTimer);
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

  clearSearch(): void {
    this.term.set('');
    this.searchResults.set([]);
    this.search$.next('');
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

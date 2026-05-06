import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CONTACT_SERVICE, ContactListRow, ContactListResult, ContactSearchResult, REALTIME_SERVICE } from 'api';
import { DialogService, HighlightPipe, UrButtonComponent, UrSearchComponent } from 'components';
import { NewContactDialogComponent } from '../new-contact-dialog/new-contact-dialog';

type SortField = 'firstName' | 'lastName';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'ur-contacts-list-page',
  templateUrl: './contacts-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule, MatIconModule, UrButtonComponent, UrSearchComponent, HighlightPipe],
  styles: [`
    .contacts-list-page { display: flex; flex-direction: column; height: 100%; }
    .contacts-list-page__header {
      display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
      padding: 12px 20px; border-bottom: 1px solid var(--ur-border-subtle, #222233);
      background: var(--ur-bg-surface, #16161f);
    }
    .contacts-list-page__header h1 { margin: 0; font-size: 1.125rem; font-weight: 600; color: var(--ur-fg-primary, #f1f5f9); }
    .contacts-list-page__header-left { display: flex; flex-direction: column; gap: 2px; }
    .contacts-list-page__header-right { display: flex; align-items: center; gap: 10px; }
    .contacts-list-page__subtitle { margin: 0; font-size: 0.75rem; color: var(--ur-fg-muted, #64748b); }
    .contacts-list-page__input {
      height: 36px; padding: 0 12px; border-radius: 6px;
      border: 1px solid var(--ur-border-default, #475569);
      background: var(--ur-bg-elevated, #0f172a); color: var(--ur-fg-primary, #f1f5f9);
      font-size: 0.875rem; outline: none; width: 240px;
    }
    .contacts-list-page__input:focus { border-color: var(--ur-accent-primary, #6366f1); }
    .contacts-list-page__table-wrap { flex: 1; overflow: auto; padding: 20px; }
    .contacts-table {
      width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden;
      background: var(--ur-bg-surface, #16161f); border: 1px solid var(--ur-border-subtle, #222233);
    }
    .contacts-table thead { background: var(--ur-bg-elevated, #0f172a); }
    .contacts-table th, .contacts-table td { padding: 10px 16px; text-align: left; font-size: 0.875rem; }
    .contacts-table th { color: var(--ur-fg-secondary, #94a3b8); font-weight: 500; border-bottom: 1px solid var(--ur-border-subtle, #222233); }
    .contacts-table td { color: var(--ur-fg-primary, #f1f5f9); border-bottom: 1px solid var(--ur-border-subtle, #222233); }
    .contacts-table tbody tr:last-child td { border-bottom: none; }
    .contacts-table tbody tr:hover { background: var(--ur-bg-elevated, #0f172a); }
    .contacts-table td a { color: var(--ur-accent-primary, #6366f1); text-decoration: none; }
    .contacts-table td a:hover { text-decoration: underline; }
    .sort-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px; color: var(--ur-fg-secondary, #94a3b8); font-size: 0.875rem; font-weight: 500; padding: 0; }
    .sort-icon { font-size: 14px; width: 14px; height: 14px; }
    .contacts-pagination { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 12px 20px; border-top: 1px solid var(--ur-border-subtle, #222233); font-size: 0.875rem; color: var(--ur-fg-secondary, #94a3b8); }
    .contacts-list-page__results { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; }
    .contact-result-card { border-bottom: 1px solid var(--ur-border-subtle, #222233); }
    .contact-result-card__link { display: flex; flex-direction: column; gap: 2px; padding: 12px 20px; text-decoration: none; }
    .contact-result-card__link:hover { background: var(--ur-bg-elevated, #0f172a); }
    .contact-result-card__name { font-size: 0.9375rem; font-weight: 500; color: var(--ur-fg-primary, #f1f5f9); }
    .contact-result-card__city { font-size: 0.8125rem; color: var(--ur-fg-secondary, #94a3b8); }
    .contact-result-card__snippet { font-size: 0.8125rem; color: var(--ur-fg-muted, #64748b); }
    .contacts-load-error {
      display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 8px; margin: 16px 0;
      background: color-mix(in srgb, var(--ur-danger, #f87171) 12%, transparent); color: var(--ur-danger, #f87171);
      border: 1px solid color-mix(in srgb, var(--ur-danger, #f87171) 40%, transparent); font-size: 0.875rem;
    }
    .contacts-load-error mat-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }
    .contact-toast {
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      display: flex; align-items: center; gap: 10px; padding: 12px 16px;
      border-radius: 8px; z-index: 1000;
      background: var(--ur-bg-surface, #16161f); color: #fff; font-size: 0.875rem; font-weight: 500;
      border: 1px solid var(--ur-success, #22c55e);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .contact-toast mat-icon { color: var(--ur-success, #22c55e); font-size: 18px; width: 18px; height: 18px; }
    .contacts-list-page__empty {
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      padding: 48px 24px; text-align: center; color: var(--ur-fg-muted, #64748b);
    }
    .contacts-list-page__empty-icon-wrap {
      display: inline-flex; align-items: center; justify-content: center;
      width: 96px; height: 96px; border-radius: 9999px;
      background: var(--ur-bg-input, #1a1a25);
      border: 1px solid var(--ur-border-default, #2a2a3a);
    }
    .contacts-list-page__empty-icon-wrap mat-icon { font-size: 40px; width: 40px; height: 40px; color: var(--ur-fg-muted, #7a7a87); }
    .contacts-list-page__no-results {
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      padding: 48px 24px; text-align: center; color: var(--ur-fg-muted, #64748b);
    }
    .contacts-list-page__no-results-icon-wrap {
      display: inline-flex; align-items: center; justify-content: center;
      width: 96px; height: 96px; border-radius: 9999px;
      background: var(--ur-bg-input, #1a1a25);
      border: 1px solid var(--ur-border-default, #2a2a3a);
    }
    .contacts-list-page__no-results-icon-wrap mat-icon { font-size: 40px; width: 40px; height: 40px; color: var(--ur-fg-muted, #7a7a87); }
    .contacts-list-page__empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 48px 24px; text-align: center; }
    .contacts-list-page__empty-icon-wrap { display: inline-flex; align-items: center; justify-content: center; width: 72px; height: 72px; border-radius: 9999px; background: var(--ur-accent-soft, rgba(159, 134, 255, 0.12)); border: 1px solid var(--ur-accent-primary, #9f86ff); }
    .contacts-list-page__empty-icon-wrap mat-icon { font-size: 36px; width: 36px; height: 36px; color: var(--ur-accent-primary, #9f86ff); }
    .contacts-list-page__no-results p { margin: 0; font-size: 1rem; font-weight: 500; }
    .contact-search-skeleton { padding: 8px 0; }
    .contact-skeleton-row { padding: 10px 16px; display: flex; flex-direction: column; gap: 6px; }
    .contact-skeleton-row__line { height: 12px; border-radius: 4px; background: var(--ur-border-default, #2a2a3a); animation: contact-shimmer 1.4s ease-in-out infinite; }
    .contact-skeleton-row__line--name { width: 55%; }
    .contact-skeleton-row__line--meta { width: 35%; }
    @keyframes contact-shimmer { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
    .contacts-list-loading { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
    .contacts-list-loading__row { height: 44px; border-radius: 6px; background: var(--ur-border-default, #2a2a3a); animation: contact-shimmer 1.4s ease-in-out infinite; }
  `],
})
export class ContactsListPageComponent implements OnInit, OnDestroy {
  private contacts = inject(CONTACT_SERVICE);
  private realtime = inject(REALTIME_SERVICE);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(DialogService);

  term = signal('');
  searchResults = signal<ContactSearchResult[]>([]);
  listResult = signal<ContactListResult>({ rows: [], total: 0 });
  page = signal(1);
  sortField = signal<SortField>('lastName');
  sortDir = signal<SortDir>('asc');
  loading = signal(true);
  loadError = signal(false);
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

  onNewContactClick(): void {
    this.dialog.open<NewContactDialogComponent, { contactId: string }>(NewContactDialogComponent, {
      ariaLabel: 'New contact',
    }).closed$.subscribe(result => {
      if (result?.contactId) {
        this.router.navigate(['/contacts', result.contactId], { queryParams: { saved: '1' } });
      }
    });
  }

  loadPage(): void {
    this.loading.set(true);
    this.loadError.set(false);
    const sort = `${this.sortField()}:${this.sortDir()}`;
    this.contacts.list(this.page(), 25, sort).subscribe({
      next: (r) => { this.listResult.set(r); this.loading.set(false); },
      error: () => { this.loading.set(false); this.loadError.set(true); },
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

  ariaSortFor(field: SortField): 'ascending' | 'descending' | 'none' {
    if (this.sortField() !== field) return 'none';
    return this.sortDir() === 'asc' ? 'ascending' : 'descending';
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

  get isBelowSearchMin(): boolean {
    return this.term().length > 0 && this.term().length < 2;
  }
}

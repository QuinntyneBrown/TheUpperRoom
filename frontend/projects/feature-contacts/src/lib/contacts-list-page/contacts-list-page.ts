import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, switchMap, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CONTACT_SERVICE, ContactSearchResult } from 'api';
import { HighlightPipe, UrSearchComponent } from 'components';

@Component({
  selector: 'ur-contacts-list-page',
  templateUrl: './contacts-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, UrSearchComponent, HighlightPipe],
})
export class ContactsListPageComponent {
  private contacts = inject(CONTACT_SERVICE);

  term = signal('');
  results = signal<ContactSearchResult[]>([]);
  searching = signal(false);

  private search$ = new Subject<string>();

  constructor() {
    this.search$
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        switchMap((t) => {
          if (t.length < 2) {
            this.results.set([]);
            return of(null);
          }
          this.searching.set(true);
          return this.contacts.search(t);
        }),
        takeUntilDestroyed(),
      )
      .subscribe((res) => {
        if (res !== null) {
          this.results.set(res ?? []);
        }
        this.searching.set(false);
      });
  }

  onSearch(value: string): void {
    this.term.set(value);
    if (value.length < 2) {
      this.results.set([]);
    }
    this.search$.next(value);
  }
}

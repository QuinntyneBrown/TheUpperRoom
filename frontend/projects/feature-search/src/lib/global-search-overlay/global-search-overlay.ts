import { ChangeDetectionStrategy, Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SEARCH_SERVICE, GlobalSearchResult, SearchResultItem } from 'api';
import { debounceTime, distinctUntilChanged, Subject, switchMap, of } from 'rxjs';

@Component({
  selector: 'ur-global-search-overlay',
  templateUrl: './global-search-overlay.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatIconModule, MatButtonModule],
})
export class GlobalSearchOverlayComponent implements OnInit {
  private searchSvc = inject(SEARCH_SERVICE);
  private router = inject(Router);

  open = signal(false);
  term = signal('');
  results = signal<GlobalSearchResult | null>(null);

  private search$ = new Subject<string>();

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      this.open.set(true);
    }
    if (e.key === 'Escape') this.open.set(false);
  }

  ngOnInit(): void {
    this.search$.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap((q) => q.length >= 2 ? this.searchSvc.search(q) : of(null))
    ).subscribe({ next: (r) => this.results.set(r) });
  }

  onInput(value: string): void {
    this.term.set(value);
    this.search$.next(value);
  }

  navigate(item: SearchResultItem): void {
    const routes: Record<string, string> = {
      contact: '/contacts',
      partner: '/partners',
      hackathon: '/hackathons',
    };
    const base = routes[item.type] ?? `/${item.type}s`;
    this.router.navigate([base, item.id]);
    this.open.set(false);
  }

  allGroups(): Array<{ label: string; items: SearchResultItem[] }> {
    const r = this.results();
    if (!r) return [];
    return [
      { label: 'Contacts', items: r.contacts },
      { label: 'Partners', items: r.partners },
      { label: 'Hackathons', items: r.hackathons },
      { label: 'Members', items: r.members },
    ].filter((g) => g.items.length > 0);
  }
}

import { ChangeDetectionStrategy, Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SEARCH_SERVICE, GlobalSearchResult, SearchResultItem } from 'api';
import { catchError, debounceTime, distinctUntilChanged, Subject, switchMap, of } from 'rxjs';

@Component({
  selector: 'ur-global-search-overlay',
  templateUrl: './global-search-overlay.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatIconModule, MatButtonModule],
  styles: [`
    .search-overlay__hint, .search-overlay__loading, .search-overlay__no-results {
      display: flex; align-items: center; gap: 10px; padding: 20px 16px;
      color: var(--ur-fg-muted, #64748b); font-size: 0.875rem;
    }
    .search-overlay__no-results { flex-direction: column; align-items: center; padding: 32px 16px; }
    .search-overlay__no-results mat-icon, .search-overlay__hint mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .search-overlay__no-results p { margin: 0; font-size: 0.9rem; font-weight: 500; }
    .search-overlay__spinner { animation: overlay-spin 1s linear infinite; font-size: 20px; width: 20px; height: 20px; }
    @keyframes overlay-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .search-overlay__keyboard-hint {
      display: flex; gap: 16px; padding: 10px 16px;
      border-top: 1px solid var(--ur-border-subtle, #222233);
      font-size: 0.75rem; color: var(--ur-fg-muted, #7a7a87);
    }
    .search-overlay__keyboard-hint kbd {
      font-family: var(--ur-font-mono, monospace);
      padding: 1px 6px; margin-right: 4px;
      border-radius: 4px;
      background: var(--ur-bg-elevated, #101018);
      border: 1px solid var(--ur-border-default, #2a2a3a);
    }
  `],
})
export class GlobalSearchOverlayComponent implements OnInit {
  private searchSvc = inject(SEARCH_SERVICE);
  private router = inject(Router);

  open = signal(false);
  term = signal('');
  results = signal<GlobalSearchResult | null>(null);
  searching = signal(false);

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
      switchMap((q) => {
        if (q.length < 2) { this.searching.set(false); return of(null); }
        this.searching.set(true);
        return this.searchSvc.search(q).pipe(
          catchError(() => { this.searching.set(false); return of(null); })
        );
      })
    ).subscribe((r) => { this.results.set(r); this.searching.set(false); });
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

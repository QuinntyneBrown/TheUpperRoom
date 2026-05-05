import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface SearchResultItem {
  id: string;
  label: string;
  type: string;
}

export interface GlobalSearchResult {
  contacts: SearchResultItem[];
  partners: SearchResultItem[];
  hackathons: SearchResultItem[];
  members: SearchResultItem[];
}

export interface ISearchService {
  search(q: string): Observable<GlobalSearchResult>;
}

export const SEARCH_SERVICE = new InjectionToken<ISearchService>('SEARCH_SERVICE');

@Injectable({ providedIn: 'root' })
export class SearchService implements ISearchService {
  private http = inject(HttpClient);

  search(q: string): Observable<GlobalSearchResult> {
    return this.http.get<GlobalSearchResult>('/api/search', { params: { q } });
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LiveRegionService {
  readonly message$ = new Subject<string>();

  announce(message: string, durationMs = 3000): void {
    this.message$.next(message);
    setTimeout(() => this.message$.next(''), durationMs);
  }
}

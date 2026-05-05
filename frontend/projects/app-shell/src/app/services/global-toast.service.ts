import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GlobalToastService {
  readonly error$ = new Subject<string | null>();
  private timer?: ReturnType<typeof setTimeout>;

  show(message: string): void {
    clearTimeout(this.timer);
    this.error$.next(message);
    this.timer = setTimeout(() => this.error$.next(null), 4000);
  }
}

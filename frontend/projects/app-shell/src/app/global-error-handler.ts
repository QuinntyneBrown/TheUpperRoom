import { ErrorHandler, Injectable, inject } from '@angular/core';
import { LogService } from './services/log.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private logService = inject(LogService);

  handleError(error: unknown): void {
    console.error(error);
    this.logService.report(error);
  }
}

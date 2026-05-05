import { ErrorHandler, Injectable, inject } from '@angular/core';
import { LogService } from './services/log.service';
import { GlobalToastService } from './services/global-toast.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private logService = inject(LogService);
  private toastSvc = inject(GlobalToastService);

  handleError(error: unknown): void {
    console.error(error);
    this.logService.report(error);
    this.toastSvc.show('Something went wrong. Please try again.');
  }
}

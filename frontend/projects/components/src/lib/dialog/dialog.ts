import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  booleanAttribute,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { A11yModule } from '@angular/cdk/a11y';

export type UrDialogVariant = 'default' | 'accent' | 'danger';

let nextDialogId = 0;

@Component({
  selector: 'ur-dialog',
  imports: [MatButtonModule, MatCardModule, MatIconModule, A11yModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrDialogComponent implements OnInit, OnDestroy {
  @Input() id = `ur-dialog-${nextDialogId++}`;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = '';
  @Input() variant: UrDialogVariant = 'default';
  @Input() closeLabel = 'Close';
  @Input({ transform: booleanAttribute }) showClose = true;
  @Input({ transform: booleanAttribute }) showActions = true;

  @Output() closed = new EventEmitter<void>();

  private previousFocus: HTMLElement | null = null;

  ngOnInit(): void {
    this.previousFocus = document.activeElement as HTMLElement;
  }

  ngOnDestroy(): void {
    this.previousFocus?.focus();
  }

  get dialogClass(): string {
    return ['ur-dialog', `ur-dialog--${this.variant}`].join(' ');
  }

  close(): void {
    this.closed.emit();
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
} from '@angular/core';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

export interface UrSegmentedControlOption {
  label: string;
  value: string;
  count?: number;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'ur-segmented-control',
  imports: [MatButtonToggleModule, MatIconModule],
  templateUrl: './segmented-control.html',
  styleUrl: './segmented-control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrSegmentedControlComponent {
  @Input() options: UrSegmentedControlOption[] = [];
  @Input() value = '';
  @Input() ariaLabel = 'Options';
  @Input({ transform: booleanAttribute }) disabled = false;

  @Output() valueChange = new EventEmitter<string>();

  onChange(event: MatButtonToggleChange): void {
    this.value = event.value;
    this.valueChange.emit(this.value);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

let nextInputId = 0;

@Component({
  selector: 'ur-input',
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrInputComponent {
  @Input() id = `ur-input-${nextInputId++}`;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() value = '';
  @Input() type = 'text';
  @Input() hint = '';
  @Input() error = '';
  @Input() errorTestId = '';
  @Input() autocomplete = 'off';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) readonly = false;
  @Input({ transform: booleanAttribute }) required = false;

  @Output() valueChange = new EventEmitter<string>();

  get describedBy(): string | null {
    if (this.error) {
      return `${this.id}-error`;
    }

    if (this.hint) {
      return `${this.id}-hint`;
    }

    return null;
  }

  onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(this.value);
  }
}

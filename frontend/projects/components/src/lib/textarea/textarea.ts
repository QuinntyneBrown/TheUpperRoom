import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
  numberAttribute,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

let nextTextareaId = 0;

@Component({
  selector: 'ur-textarea',
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './textarea.html',
  styleUrl: './textarea.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrTextareaComponent {
  @Input() id = `ur-textarea-${nextTextareaId++}`;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() value = '';
  @Input() hint = '';
  @Input() error = '';
  @Input() errorTestId = '';
  @Input({ transform: numberAttribute }) rows = 5;
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
    this.value = (event.target as HTMLTextAreaElement).value;
    this.valueChange.emit(this.value);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

let nextSearchId = 0;

@Component({
  selector: 'ur-search',
  imports: [MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrSearchComponent {
  @Input() id = `ur-search-${nextSearchId++}`;
  @Input() placeholder = 'Search';
  @Input() value = '';
  @Input() ariaLabel = 'Search';
  @Input() inputTestId = '';
  @Input({ transform: booleanAttribute }) disabled = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() submitted = new EventEmitter<string>();

  onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(this.value);
  }

  onSubmit(): void {
    this.submitted.emit(this.value);
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UrInputComponent } from 'components';

@Component({
  selector: 'ur-form-test',
  imports: [UrInputComponent],
  template: `
    <form>
      <ur-input
        id="name-field"
        label="Full name"
        [error]="'Name is required'"
        placeholder="Enter your name"
      />
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormTestComponent {}

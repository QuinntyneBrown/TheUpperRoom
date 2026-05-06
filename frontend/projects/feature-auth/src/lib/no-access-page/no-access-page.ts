import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ur-no-access-page',
  templateUrl: './no-access-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIconModule],
})
export class NoAccessPageComponent {}

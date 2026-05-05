import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'ur-partners-board-page',
  templateUrl: './partners-board-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterOutlet],
})
export class PartnersBoardPageComponent {}

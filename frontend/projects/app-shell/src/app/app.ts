import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HealthService } from 'api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private healthService = inject(HealthService);
  healthStatus = signal('...');

  ngOnInit() {
    this.healthService.get().subscribe({
      next: (r) => this.healthStatus.set(r.status.toUpperCase()),
      error: () => this.healthStatus.set('ERROR'),
    });
  }
}

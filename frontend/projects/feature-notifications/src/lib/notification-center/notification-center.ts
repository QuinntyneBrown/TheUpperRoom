import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UrButtonComponent } from 'components';
import { NOTIFICATION_SERVICE, NotificationDto, REALTIME_SERVICE } from 'api';
import { filter } from 'rxjs';

const NOTIFICATION_EVENTS = new Set([
  'contactCreated', 'partnerStageChanged', 'hackathonStageChanged',
  'noteAdded', 'teamMemberAdded', 'teamMemberRemoved', 'roleChanged',
]);

@Component({
  selector: 'ur-notification-center',
  templateUrl: './notification-center.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, MatIconModule, MatButtonModule, UrButtonComponent],
  styles: [`
    .notification-skeleton-row {
      padding: 12px 16px; display: flex; flex-direction: column; gap: 6px; border-bottom: 1px solid var(--ur-border, #e2e8f0);
    }
    .notification-skeleton-row__line {
      height: 12px; border-radius: 4px; background: var(--ur-border-default, #2a2a3a);
      animation: notif-shimmer 1.4s ease-in-out infinite;
    }
    .notification-skeleton-row__line--wide { width: 70%; }
    .notification-skeleton-row__line--narrow { width: 40%; }
    @keyframes notif-shimmer {
      0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; }
    }
    .notification-center__error {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      padding: 32px 16px; text-align: center; color: var(--ur-text-muted, #64748b);
    }
    .notification-center__error mat-icon { font-size: 32px; width: 32px; height: 32px; color: var(--ur-danger, #ef4444); }
    .notification-center__error p { margin: 0; font-weight: 500; color: inherit; }
    .notification-center__error-hint { font-size: 0.8rem; }
    .notification-center__empty {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      padding: 32px 16px; text-align: center; color: var(--ur-text-muted, #64748b);
    }
    .notification-center__empty mat-icon { font-size: 32px; width: 32px; height: 32px; color: var(--ur-accent-primary, #9f86ff); }
    .notification-center__empty-icon-wrap { display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 9999px; background: var(--ur-accent-soft, rgba(159, 134, 255, 0.12)); border: 1px solid var(--ur-accent-primary, #9f86ff); }
    .notification-center__empty p { margin: 0; font-size: 0.875rem; }
  `],
})
export class NotificationCenterComponent implements OnInit {
  private notifSvc = inject(NOTIFICATION_SERVICE);
  private realtimeSvc = inject(REALTIME_SERVICE);

  notifications = signal<NotificationDto[]>([]);
  unreadCount = signal(0);
  open = signal(false);
  loading = signal(false);
  loadError = signal(false);

  ngOnInit(): void {
    this.load();
    this.realtimeSvc.events$.pipe(
      filter((e) => NOTIFICATION_EVENTS.has(e.eventType))
    ).subscribe((e) => {
      this.unreadCount.update((c) => c + 1);
      this.notifications.update((prev) => [{
        id: crypto.randomUUID(),
        kind: e.eventType,
        entityType: '',
        entityId: String(e.entityId),
        actorId: String(e.actorId),
        createdAt: e.timestamp,
        isRead: false,
      }, ...prev]);
    });
  }

  load(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.notifSvc.list().subscribe({
      next: (r) => { this.notifications.set(r.rows); this.unreadCount.set(r.unreadCount); this.loading.set(false); },
      error: () => { this.loading.set(false); this.loadError.set(true); },
    });
  }

  toggle(): void {
    this.open.update((o) => !o);
  }

  markRead(id: string): void {
    this.notifSvc.markRead(id).subscribe({
      next: () => {
        this.notifications.update((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
        this.unreadCount.update((c) => Math.max(0, c - 1));
      }
    });
  }

  markAllRead(): void {
    this.notifSvc.markAllRead().subscribe({
      next: () => {
        this.notifications.update((prev) => prev.map((n) => ({ ...n, isRead: true })));
        this.unreadCount.set(0);
      }
    });
  }
}

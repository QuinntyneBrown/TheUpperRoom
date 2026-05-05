import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
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
  imports: [DatePipe, MatIconModule, MatButtonModule],
})
export class NotificationCenterComponent implements OnInit {
  private notifSvc = inject(NOTIFICATION_SERVICE);
  private realtimeSvc = inject(REALTIME_SERVICE);

  notifications = signal<NotificationDto[]>([]);
  unreadCount = signal(0);
  open = signal(false);

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
    this.notifSvc.list().subscribe({
      next: (r) => { this.notifications.set(r.rows); this.unreadCount.set(r.unreadCount); }
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

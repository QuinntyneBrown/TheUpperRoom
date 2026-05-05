import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface NotificationDto {
  id: string;
  kind: string;
  entityType: string;
  entityId: string;
  actorId: string;
  createdAt: string;
  isRead: boolean;
}

export interface NotificationsResult {
  rows: NotificationDto[];
  unreadCount: number;
}

export interface INotificationService {
  list(): Observable<NotificationsResult>;
  markRead(id: string): Observable<void>;
  markAllRead(): Observable<void>;
}

export const NOTIFICATION_SERVICE = new InjectionToken<INotificationService>('NOTIFICATION_SERVICE');

@Injectable({ providedIn: 'root' })
export class NotificationService implements INotificationService {
  private http = inject(HttpClient);

  list(): Observable<NotificationsResult> {
    return this.http.get<NotificationsResult>('/api/notifications');
  }

  markRead(id: string): Observable<void> {
    return this.http.post<void>(`/api/notifications/${id}/read`, {});
  }

  markAllRead(): Observable<void> {
    return this.http.post<void>('/api/notifications/read-all', {});
  }
}

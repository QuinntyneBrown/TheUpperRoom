import { Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';

export interface RealtimeEvent {
  eventType: string;
  entityId: string;
  actorId: string;
  timestamp: string;
  [key: string]: unknown;
}

export interface IRealtimeService {
  events$: Subject<RealtimeEvent>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export const REALTIME_SERVICE = new InjectionToken<IRealtimeService>('REALTIME_SERVICE');

// Exponential backoff: 1s, 2s, 4s, 8s, 16s, 32s, 60s, 60s, 60s... indefinitely
class ExponentialRetryPolicy implements signalR.IRetryPolicy {
  nextRetryDelayInMilliseconds(ctx: signalR.RetryContext): number {
    const delay = Math.min(1000 * Math.pow(2, ctx.previousRetryCount), 60_000);
    return delay;
  }
}

@Injectable({ providedIn: 'root' })
export class RealtimeService implements IRealtimeService, OnDestroy {
  events$ = new Subject<RealtimeEvent>();

  private hub = new signalR.HubConnectionBuilder()
    .withUrl('/hubs/team')
    .withAutomaticReconnect(new ExponentialRetryPolicy())
    .build();

  constructor() {
    this.hub.onreconnected(() => this.registerHandlers());
    this.registerHandlers();
  }

  private registerHandlers(): void {
    const forward = (payload: RealtimeEvent) => this.events$.next(payload);
    [
      'contactCreated',
      'partnerStageChanged',
      'hackathonStageChanged',
      'noteAdded',
      'teamMemberAdded',
      'teamMemberRemoved',
      'roleChanged',
      'metricInvalidated',
    ].forEach((event) => this.hub.on(event, forward));
  }

  async connect(): Promise<void> {
    if (this.hub.state === signalR.HubConnectionState.Disconnected) {
      await this.hub.start();
    }
  }

  async disconnect(): Promise<void> {
    await this.hub.stop();
  }

  ngOnDestroy(): void {
    this.hub.stop();
  }
}

import { Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';

export interface RealtimeEvent {
  eventType: string;
  entityId: string;
  actorId: string;
  timestamp: string;
  [key: string]: unknown;
}

export type ConnectionState = 'connected' | 'connecting' | 'disconnected';

export interface IRealtimeService {
  events$: Subject<RealtimeEvent>;
  connectionState$: BehaviorSubject<ConnectionState>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export const REALTIME_SERVICE = new InjectionToken<IRealtimeService>('REALTIME_SERVICE');

export function computeRetryDelay(previousRetryCount: number): number {
  return Math.min(1000 * Math.pow(2, previousRetryCount), 60_000);
}

class ExponentialRetryPolicy implements signalR.IRetryPolicy {
  nextRetryDelayInMilliseconds(ctx: signalR.RetryContext): number {
    return computeRetryDelay(ctx.previousRetryCount);
  }
}

@Injectable({ providedIn: 'root' })
export class RealtimeService implements IRealtimeService, OnDestroy {
  events$ = new Subject<RealtimeEvent>();
  connectionState$ = new BehaviorSubject<ConnectionState>('disconnected');

  private hub = new signalR.HubConnectionBuilder()
    .withUrl('/hubs/team')
    .withAutomaticReconnect(new ExponentialRetryPolicy())
    .build();

  constructor() {
    this.hub.onreconnecting(() => this.connectionState$.next('connecting'));
    this.hub.onreconnected(() => {
      this.connectionState$.next('connected');
      this.registerHandlers();
    });
    this.hub.onclose(() => this.connectionState$.next('disconnected'));
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
      'hackathonDeleted',
      'hackathonRestored',
    ].forEach((event) => this.hub.on(event, forward));
  }

  async connect(): Promise<void> {
    if (this.hub.state === signalR.HubConnectionState.Disconnected) {
      this.connectionState$.next('connecting');
      await this.hub.start();
      this.connectionState$.next('connected');
    }
  }

  async disconnect(): Promise<void> {
    this.connectionState$.next('disconnected');
    await this.hub.stop();
  }

  ngOnDestroy(): void {
    this.hub.stop();
  }
}

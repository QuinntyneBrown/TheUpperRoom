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

@Injectable({ providedIn: 'root' })
export class RealtimeService implements IRealtimeService, OnDestroy {
  events$ = new Subject<RealtimeEvent>();

  private hub = new signalR.HubConnectionBuilder()
    .withUrl('/hubs/team')
    .withAutomaticReconnect()
    .build();

  constructor() {
    this.hub.onreconnected(() => this.registerHandlers());
    this.registerHandlers();
  }

  private registerHandlers(): void {
    this.hub.on('partnerStageChanged', (payload: RealtimeEvent) => this.events$.next(payload));
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

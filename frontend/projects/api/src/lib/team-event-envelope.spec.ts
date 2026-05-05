// Traces to: 51 — Team Event Envelope Contract
// AC3: frontend RealtimeEvent interface matches envelope schema
import { describe, it, expect } from 'vitest';
import type { RealtimeEvent } from './realtime.service';

describe('RealtimeEvent envelope contract', () => {
  it('satisfies envelope schema with all five fields', () => {
    const envelope: RealtimeEvent = {
      eventType: 'contactCreated',
      entityId: '00000000-0000-0000-0000-000000000001',
      actorId: '00000000-0000-0000-0000-000000000002',
      timestamp: new Date().toISOString(),
      data: { id: '00000000-0000-0000-0000-000000000001' },
    };

    expect(envelope.eventType).toBe('contactCreated');
    expect(envelope.entityId).toBeTruthy();
    expect(envelope.actorId).toBeTruthy();
    expect(envelope.timestamp).toBeTruthy();
    expect(envelope.data).toBeTruthy();
  });
});

// Traces to: 50 — SignalR Connection Lifecycle
// L2-036: retry policy backoff, connectionState$ transitions
import { describe, it, expect } from 'vitest';
import { computeRetryDelay } from './realtime.service';

describe('computeRetryDelay', () => {
  it('returns 1s on first retry', () => {
    expect(computeRetryDelay(0)).toBe(1000);
  });

  it('returns 2s on second retry', () => {
    expect(computeRetryDelay(1)).toBe(2000);
  });

  it('returns 4s on third retry', () => {
    expect(computeRetryDelay(2)).toBe(4000);
  });

  it('returns 8s on fourth retry', () => {
    expect(computeRetryDelay(3)).toBe(8000);
  });

  it('returns 16s on fifth retry', () => {
    expect(computeRetryDelay(4)).toBe(16000);
  });

  it('returns 32s on sixth retry', () => {
    expect(computeRetryDelay(5)).toBe(32000);
  });

  it('caps at 60s from seventh retry onward', () => {
    expect(computeRetryDelay(6)).toBe(60000);
    expect(computeRetryDelay(7)).toBe(60000);
    expect(computeRetryDelay(100)).toBe(60000);
  });
});

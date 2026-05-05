// Traces to: 36 - Logging and Observability
// L2-045 AC2: correlation interceptor adds X-Correlation-Id to outgoing requests
import { describe, it, expect } from 'vitest';
import { buildCorrelationId } from '../services/correlation.interceptor';

describe('buildCorrelationId', () => {
  it('returns provided id when header present', () => {
    expect(buildCorrelationId('existing-id')).toBe('existing-id');
  });

  it('generates UUID when no id provided', () => {
    const id = buildCorrelationId(null);
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it('generates unique ids on each call', () => {
    const id1 = buildCorrelationId(null);
    const id2 = buildCorrelationId(null);
    expect(id1).not.toBe(id2);
  });
});

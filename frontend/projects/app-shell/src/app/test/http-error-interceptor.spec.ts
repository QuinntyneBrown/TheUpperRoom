// Traces to: 62 - HTTP error logging and sanitization
// L2-045 AC2/AC3: 4xx/5xx responses are logged with correlation ID; sensitive query params masked
import { describe, it, expect } from 'vitest';
import { maskSensitiveQueryParams } from '../services/http-error.utils';

describe('maskSensitiveQueryParams', () => {
  it('masks token query param', () => {
    const result = maskSensitiveQueryParams('https://api/data?token=abc123');
    expect(result).toContain('token=***');
    expect(result).not.toContain('abc123');
  });

  it('masks key query param', () => {
    const result = maskSensitiveQueryParams('https://api/data?key=secret');
    expect(result).toContain('key=***');
  });

  it('preserves non-sensitive query params', () => {
    const result = maskSensitiveQueryParams('https://api/data?page=2&limit=10');
    expect(result).toContain('page=2');
    expect(result).toContain('limit=10');
  });

  it('handles URL with no query params', () => {
    const result = maskSensitiveQueryParams('https://api/data');
    expect(result).toBe('https://api/data');
  });
});

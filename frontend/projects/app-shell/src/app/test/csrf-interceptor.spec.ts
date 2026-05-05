// Traces to: 69 - CSRF token flow
// L2-054: interceptor adds X-CSRF-TOKEN header on non-GET requests
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { addCsrfHeader, XSRF_COOKIE } from '../services/csrf.utils';

describe('addCsrfHeader', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: `${XSRF_COOKIE}=test-token-123`,
    });
  });

  afterEach(() => {
    Object.defineProperty(document, 'cookie', { writable: true, value: '' });
  });

  it('returns the token from cookie', () => {
    const token = addCsrfHeader();
    expect(token).toBe('test-token-123');
  });

  it('returns null when cookie is absent', () => {
    Object.defineProperty(document, 'cookie', { writable: true, value: '' });
    const token = addCsrfHeader();
    expect(token).toBeNull();
  });
});

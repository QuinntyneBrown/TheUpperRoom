// Traces to: 69 - CSRF token flow
// L2-054: CSRF token is read from cookie string and added as request header
import { describe, it, expect } from 'vitest';
import { parseCsrfToken, XSRF_COOKIE } from '../services/csrf.utils';

describe('parseCsrfToken', () => {
  it('returns the token from cookie string', () => {
    const token = parseCsrfToken(`${XSRF_COOKIE}=test-token-123`);
    expect(token).toBe('test-token-123');
  });

  it('handles multiple cookies', () => {
    const token = parseCsrfToken(`session=abc; ${XSRF_COOKIE}=my-csrf-value; theme=dark`);
    expect(token).toBe('my-csrf-value');
  });

  it('returns null when cookie is absent', () => {
    const token = parseCsrfToken('session=abc; theme=dark');
    expect(token).toBeNull();
  });

  it('returns null for empty cookie string', () => {
    const token = parseCsrfToken('');
    expect(token).toBeNull();
  });
});

// Traces to: 61 - Frontend global error logging
// L2-045 AC3: payload containing sensitive field names is stripped before transport
import { describe, it, expect } from 'vitest';
import { sanitizePayload } from '../services/sanitize';

describe('sanitizePayload', () => {
  it('strips password field', () => {
    const result = sanitizePayload({ message: 'err', password: 'secret' });
    expect(result).not.toHaveProperty('password');
  });

  it('strips token field', () => {
    const result = sanitizePayload({ message: 'err', token: 'abc123' });
    expect(result).not.toHaveProperty('token');
  });

  it('strips authorization field', () => {
    const result = sanitizePayload({ message: 'err', authorization: 'Bearer x' });
    expect(result).not.toHaveProperty('authorization');
  });

  it('strips cookie field', () => {
    const result = sanitizePayload({ message: 'err', cookie: 'session=x' });
    expect(result).not.toHaveProperty('cookie');
  });

  it('strips email field', () => {
    const result = sanitizePayload({ message: 'err', email: 'user@example.com' });
    expect(result).not.toHaveProperty('email');
  });

  it('preserves safe fields', () => {
    const result = sanitizePayload({ message: 'err', route: '/dashboard', level: 'error' });
    expect(result).toEqual({ message: 'err', route: '/dashboard', level: 'error' });
  });
});

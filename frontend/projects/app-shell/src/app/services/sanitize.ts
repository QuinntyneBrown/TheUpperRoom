const SENSITIVE_FIELDS = new Set(['password', 'token', 'authorization', 'cookie', 'session', 'email']);

export function sanitizePayload(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !SENSITIVE_FIELDS.has(key.toLowerCase()))
  );
}

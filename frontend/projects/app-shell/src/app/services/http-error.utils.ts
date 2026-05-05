const SENSITIVE_PARAMS = new Set(['token', 'key']);

export function maskSensitiveQueryParams(url: string): string {
  const [base, query] = url.split('?');
  if (!query) return url;

  const masked = query.split('&').map(pair => {
    const [name, value] = pair.split('=');
    return SENSITIVE_PARAMS.has(name.toLowerCase()) ? `${name}=***` : `${name}=${value}`;
  });

  return `${base}?${masked.join('&')}`;
}

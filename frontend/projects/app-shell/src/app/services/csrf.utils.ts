export const XSRF_COOKIE = 'XSRF-TOKEN';

export function parseCsrfToken(cookieString: string): string | null {
  const match = cookieString.split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(`${XSRF_COOKIE}=`));
  return match ? match.split('=').slice(1).join('=') : null;
}

export function addCsrfHeader(): string | null {
  return parseCsrfToken(document.cookie);
}

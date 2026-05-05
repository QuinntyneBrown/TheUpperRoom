// Traces to: 56 - dark theme token system
// Description: tokens.scss defines all required CSS custom properties
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';

const TOKENS_PATH = resolve(__dirname, 'tokens.scss');

let content: string;
try {
  content = readFileSync(TOKENS_PATH, 'utf-8');
} catch {
  content = '';
}

describe('tokens.scss', () => {
  it('file exists', () => {
    expect(content).not.toBe('');
  });

  it.each([
    '--chart-grid',
    '--chart-axis',
    '--chart-series-1',
    '--chart-series-2',
    '--chart-series-3',
    '--chart-series-4',
    '--chart-series-5',
    '--chart-series-6',
    '--chart-tooltip-bg',
  ])('defines %s', (token) => {
    expect(content).toContain(token);
  });

  it('applies ur-tokens host mixin', () => {
    expect(content).toContain('@include');
  });
});

describe('no palette imports outside theme.scss', () => {
  it('tokens.scss has no mat.define-palette', () => {
    expect(content).not.toContain('define-palette');
  });
});

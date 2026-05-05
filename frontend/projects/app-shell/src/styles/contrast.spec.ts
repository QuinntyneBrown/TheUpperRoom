// Traces to: 74 - contrast regression checks
// L2-059: every token pair passes WCAG contrast threshold
import { describe, it, expect } from 'vitest';

function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(fg: string, bg: string): number {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Adjacency map: [fg, bg, minRatio, label]
const PAIRS: [string, string, number, string][] = [
  // fg-primary (white) on every surface — AAA target (7:1)
  ['#ffffff', '#0a0a0f', 7, 'fg-primary on bg-base'],
  ['#ffffff', '#101018', 7, 'fg-primary on bg-surface'],
  ['#ffffff', '#16161f', 7, 'fg-primary on bg-elevated'],

  // fg-secondary / fg-muted on base surfaces — AA (4.5:1)
  ['#a1a1aa', '#0a0a0f', 4.5, 'fg-secondary on bg-base'],
  ['#a8a8b5', '#0a0a0f', 4.5, 'fg-muted on bg-base'],
  ['#a8a8b5', '#101018', 4.5, 'fg-muted on bg-surface'],

  // Accent on dark surfaces — AA (4.5:1)
  ['#9f86ff', '#0a0a0f', 4.5, 'accent-primary on bg-base'],
  ['#9f86ff', '#101018', 4.5, 'accent-primary on bg-surface'],

  // Error/danger on dark surfaces — AA (4.5:1)
  ['#f87171', '#0a0a0f', 4.5, 'danger on bg-base'],

  // Focus ring (accent) against surfaces — large-text / UI (3:1)
  ['#9f86ff', '#16161f', 3, 'focus-ring on bg-elevated'],

  // Status colors on dark — large-text (3:1)
  ['#34d399', '#0a0a0f', 3, 'success on bg-base'],
  ['#fbbf24', '#0a0a0f', 3, 'warning on bg-base'],
  ['#60a5fa', '#0a0a0f', 3, 'info on bg-base'],

  // Chart series on dark grid bg — large-text (3:1)
  ['#9f86ff', '#2a2a3a', 3, 'chart-series-1 on chart-grid'],
  ['#00f2ff', '#2a2a3a', 3, 'chart-series-3 on chart-grid'],
  ['#34d399', '#2a2a3a', 3, 'chart-series-4 on chart-grid'],
];

describe('WCAG contrast regression', () => {
  for (const [fg, bg, min, label] of PAIRS) {
    it(`${label} ≥ ${min}:1`, () => {
      const ratio = contrast(fg, bg);
      expect(
        ratio,
        `${label}: ${fg} on ${bg} = ${ratio.toFixed(2)}:1 (need ≥ ${min}:1)`
      ).toBeGreaterThanOrEqual(min);
    });
  }
});

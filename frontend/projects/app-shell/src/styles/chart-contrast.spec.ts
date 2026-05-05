// Traces to: 57 - chart and non-text contrast validation
// L2-059: chart series, focus rings, error states ≥3:1 non-text contrast
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
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const CHART_GRID = '#2a2a3a';
const CHART_TOOLTIP = '#1c1c28';
const SERIES = {
  1: '#9f86ff',
  2: '#bf40ff',
  3: '#00f2ff',
  4: '#34d399',
  5: '#fbbf24',
  6: '#f87171',
} as Record<number, string>;

const SURFACES = {
  'bg-base': '#0a0a0f',
  'bg-surface': '#101018',
  'bg-elevated': '#16161f',
  'bg-overlay': '#1c1c28',
};

const FOCUS_RING = '#9f86ff';
const ERROR_COLOR = '#f87171';

describe('chart series vs chart-grid (3:1)', () => {
  for (const [n, hex] of Object.entries(SERIES)) {
    it(`series-${n} (${hex}) vs chart-grid`, () => {
      expect(contrast(hex, CHART_GRID)).toBeGreaterThanOrEqual(3);
    });
  }
});

describe('chart series vs tooltip-bg (3:1)', () => {
  for (const [n, hex] of Object.entries(SERIES)) {
    it(`series-${n} (${hex}) vs tooltip-bg`, () => {
      expect(contrast(hex, CHART_TOOLTIP)).toBeGreaterThanOrEqual(3);
    });
  }
});

describe('focus-ring vs all surfaces (3:1)', () => {
  for (const [name, bg] of Object.entries(SURFACES)) {
    it(`focus-ring vs ${name}`, () => {
      expect(
        contrast(FOCUS_RING, bg),
        `focus-ring ${FOCUS_RING} on ${name} ${bg}`
      ).toBeGreaterThanOrEqual(3);
    });
  }
});

describe('error icon vs all surfaces (3:1)', () => {
  for (const [name, bg] of Object.entries(SURFACES)) {
    it(`error-color vs ${name}`, () => {
      expect(
        contrast(ERROR_COLOR, bg),
        `error ${ERROR_COLOR} on ${name} ${bg}`
      ).toBeGreaterThanOrEqual(3);
    });
  }
});

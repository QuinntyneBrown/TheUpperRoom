// Traces to: 47 — Dashboard Widget Catalog Add/Remove
// L2-033: catalog entries have correct defaults
import { describe, it, expect } from 'vitest';
import { WIDGET_CATALOG } from './widget-catalog';

describe('WIDGET_CATALOG', () => {
  it('contains kpi and line-chart entries', () => {
    const types = WIDGET_CATALOG.map(e => e.type);
    expect(types).toContain('kpi');
    expect(types).toContain('line-chart');
  });

  it('kpi has 2×2 default size', () => {
    const kpi = WIDGET_CATALOG.find(e => e.type === 'kpi')!;
    expect(kpi.cols).toBe(2);
    expect(kpi.rows).toBe(2);
  });

  it('line-chart has 4×3 default size', () => {
    const lc = WIDGET_CATALOG.find(e => e.type === 'line-chart')!;
    expect(lc.cols).toBe(4);
    expect(lc.rows).toBe(3);
  });

  it('kpi default config includes contacts.total metric', () => {
    const kpi = WIDGET_CATALOG.find(e => e.type === 'kpi')!;
    expect(kpi.defaultConfig['metric']).toBe('contacts.total');
  });

  it('line-chart default config includes contacts.created metric and 7d range', () => {
    const lc = WIDGET_CATALOG.find(e => e.type === 'line-chart')!;
    expect(lc.defaultConfig['metric']).toBe('contacts.created');
    expect(lc.defaultConfig['range']).toBe('7d');
  });

  it('every entry has a non-empty description', () => {
    for (const entry of WIDGET_CATALOG) {
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });
});

// Traces to: 48 — Dashboard Drag and Resize Persistence
// L2-033: gridster configured for drag, resize, swap, push
import { describe, it, expect, vi } from 'vitest';
import { buildGridsterOptions } from './gridster-options';

describe('buildGridsterOptions', () => {
  const opts = buildGridsterOptions(() => {});

  it('enables dragging', () => {
    expect(opts.draggable?.enabled).toBe(true);
  });

  it('enables resizing', () => {
    expect(opts.resizable?.enabled).toBe(true);
  });

  it('enables pushItems', () => {
    expect(opts.pushItems).toBe(true);
  });

  it('enables swap', () => {
    expect(opts.swap).toBe(true);
  });

  it('wires itemChangeCallback to the provided handler', () => {
    const handler = vi.fn();
    const o = buildGridsterOptions(handler);
    (o.itemChangeCallback as () => void)();
    expect(handler).toHaveBeenCalledOnce();
  });

  it('wires itemResizeCallback to the provided handler', () => {
    const handler = vi.fn();
    const o = buildGridsterOptions(handler);
    (o.itemResizeCallback as () => void)();
    expect(handler).toHaveBeenCalledOnce();
  });
});

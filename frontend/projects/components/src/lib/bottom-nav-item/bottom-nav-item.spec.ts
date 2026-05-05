// T88: ur-bottom-nav-item must expose href input and render an anchor
import { describe, it, expect } from 'vitest';
import { UrBottomNavItemComponent } from './bottom-nav-item';

describe('UrBottomNavItemComponent', () => {
  it('has href input defaulting to empty string', () => {
    const cmp = new UrBottomNavItemComponent();
    expect(cmp).toHaveProperty('href');
    expect(cmp.href).toBe('');
  });

  it('does not have selected EventEmitter (old API removed)', () => {
    const cmp = new UrBottomNavItemComponent() as unknown as Record<string, unknown>;
    expect(cmp['selected']).toBeUndefined();
  });
});

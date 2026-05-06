import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Component } from '@angular/core';
import { UrAlertComponent, UrAlertVariant } from './alert';

@Component({
  imports: [UrAlertComponent],
  template: `<ur-alert [variant]="variant" title="t" message="m" />`,
})
class HostComponent {
  variant: UrAlertVariant = 'info';
}

describe('UrAlertComponent role (BUG-192)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideAnimationsAsync()],
      imports: [HostComponent],
    }).compileComponents();
  });

  function role(variant: UrAlertVariant) {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.variant = variant;
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('mat-card')?.getAttribute('role');
  }

  it('uses role=status for info variant', () => {
    expect(role('info')).toBe('status');
  });
  it('uses role=status for success variant', () => {
    expect(role('success')).toBe('status');
  });
  it('uses role=alert for danger variant', () => {
    expect(role('danger')).toBe('alert');
  });
  it('uses role=alert for warning variant', () => {
    expect(role('warning')).toBe('alert');
  });
});

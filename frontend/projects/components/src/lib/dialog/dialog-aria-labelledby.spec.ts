import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Component } from '@angular/core';
import { UrDialogComponent } from './dialog';

@Component({
  imports: [UrDialogComponent],
  template: `<ur-dialog [title]="t"><div>content</div></ur-dialog>`,
})
class HostComponent {
  t = '';
}

describe('UrDialogComponent aria-labelledby (BUG-191)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideAnimationsAsync()],
      imports: [HostComponent],
    }).compileComponents();
  });

  it('omits aria-labelledby when title is empty', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog.getAttribute('aria-labelledby')).toBeNull();
  });

  it('sets aria-labelledby to the title id when title is present', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.t = 'Hello';
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    const labelledby = dialog.getAttribute('aria-labelledby');
    expect(labelledby).toBeTruthy();
    const titleEl = fixture.nativeElement.querySelector(`#${labelledby}`);
    expect(titleEl).not.toBeNull();
    expect(titleEl.textContent).toContain('Hello');
  });
});

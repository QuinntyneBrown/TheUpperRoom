import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Component } from '@angular/core';
import { UrTextareaComponent } from './textarea';

@Component({
  imports: [UrTextareaComponent],
  template: `<ur-textarea label="Notes" [required]="required" />`,
})
class HostComponent {
  required = false;
}

describe('UrTextareaComponent required indicator (BUG-190)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideAnimationsAsync()],
      imports: [HostComponent],
    }).compileComponents();
  });

  it('does not render * when required is false', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const star = fixture.nativeElement.querySelector('.ur-textarea__required');
    expect(star).toBeNull();
  });

  it('renders * (aria-hidden) when required is true', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.required = true;
    fixture.detectChanges();
    const star = fixture.nativeElement.querySelector('.ur-textarea__required');
    expect(star).not.toBeNull();
    expect(star.textContent.trim()).toBe('*');
    expect(star.getAttribute('aria-hidden')).toBe('true');
  });
});

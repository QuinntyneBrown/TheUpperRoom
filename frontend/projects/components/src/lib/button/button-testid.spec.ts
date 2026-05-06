import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrButtonComponent } from './button';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('UrButtonComponent testId', () => {
  let fixture: ComponentFixture<UrButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrButtonComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();
    fixture = TestBed.createComponent(UrButtonComponent);
  });

  it('applies testId to the inner button (primary)', () => {
    fixture.componentRef.setInput('testId', 'save-btn');
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn?.getAttribute('data-testid')).toBe('save-btn');
  });

  it('applies testId to the inner button (icon variant)', () => {
    fixture.componentRef.setInput('variant', 'icon');
    fixture.componentRef.setInput('testId', 'icon-btn');
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn?.getAttribute('data-testid')).toBe('icon-btn');
  });

  it('applies testId to the inner button (fab variant)', () => {
    fixture.componentRef.setInput('variant', 'fab');
    fixture.componentRef.setInput('testId', 'fab-btn');
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn?.getAttribute('data-testid')).toBe('fab-btn');
  });
});

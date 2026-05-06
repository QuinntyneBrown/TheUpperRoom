import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrLoadingStateComponent } from './loading-state';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('UrLoadingStateComponent a11y + testId', () => {
  let fixture: ComponentFixture<UrLoadingStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrLoadingStateComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();
    fixture = TestBed.createComponent(UrLoadingStateComponent);
  });

  it('sets aria-busy=true and aria-live=polite', () => {
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('mat-card');
    expect(card?.getAttribute('aria-busy')).toBe('true');
    expect(card?.getAttribute('aria-live')).toBe('polite');
  });

  it('applies testId', () => {
    fixture.componentRef.setInput('testId', 'my-loader');
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('mat-card');
    expect(card?.getAttribute('data-testid')).toBe('my-loader');
  });
});

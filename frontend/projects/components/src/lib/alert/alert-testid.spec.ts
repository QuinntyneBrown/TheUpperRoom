import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrAlertComponent } from './alert';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('UrAlertComponent testIds', () => {
  let fixture: ComponentFixture<UrAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrAlertComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();
    fixture = TestBed.createComponent(UrAlertComponent);
  });

  it('applies titleTestId and messageTestId', () => {
    fixture.componentRef.setInput('title', 'Heads up');
    fixture.componentRef.setInput('message', 'Something happened');
    fixture.componentRef.setInput('titleTestId', 'my-alert-title');
    fixture.componentRef.setInput('messageTestId', 'my-alert-message');
    fixture.detectChanges();
    const t = fixture.nativeElement.querySelector('.ur-alert__title');
    const m = fixture.nativeElement.querySelector('.ur-alert__message');
    expect(t?.getAttribute('data-testid')).toBe('my-alert-title');
    expect(m?.getAttribute('data-testid')).toBe('my-alert-message');
  });

  it('does not set data-testid when inputs are empty', () => {
    fixture.componentRef.setInput('title', 'Heads up');
    fixture.componentRef.setInput('message', 'Something happened');
    fixture.detectChanges();
    const t = fixture.nativeElement.querySelector('.ur-alert__title');
    const m = fixture.nativeElement.querySelector('.ur-alert__message');
    expect(t?.hasAttribute('data-testid')).toBe(false);
    expect(m?.hasAttribute('data-testid')).toBe(false);
  });
});

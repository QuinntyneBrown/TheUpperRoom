import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrInputComponent } from './input';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('UrInputComponent inputTestId', () => {
  let fixture: ComponentFixture<UrInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrInputComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();
    fixture = TestBed.createComponent(UrInputComponent);
  });

  it('applies inputTestId to underlying input', () => {
    fixture.componentRef.setInput('inputTestId', 'email-input');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input?.getAttribute('data-testid')).toBe('email-input');
  });

  it('does not set data-testid when inputTestId is empty', () => {
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input?.hasAttribute('data-testid')).toBe(false);
  });
});

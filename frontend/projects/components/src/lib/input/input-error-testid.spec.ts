import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrInputComponent } from './input';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('UrInputComponent errorTestId', () => {
  let fixture: ComponentFixture<UrInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrInputComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();
    fixture = TestBed.createComponent(UrInputComponent);
  });

  it('applies errorTestId to mat-error', () => {
    fixture.componentRef.setInput('error', 'Required');
    fixture.componentRef.setInput('errorTestId', 'email-error');
    fixture.detectChanges();
    const err = fixture.nativeElement.querySelector('mat-error');
    expect(err?.getAttribute('data-testid')).toBe('email-error');
  });
});

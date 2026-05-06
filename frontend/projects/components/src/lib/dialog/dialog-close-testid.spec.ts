import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrDialogComponent } from './dialog';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('UrDialogComponent closeTestId', () => {
  let fixture: ComponentFixture<UrDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrDialogComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();
    fixture = TestBed.createComponent(UrDialogComponent);
  });

  it('applies closeTestId to the close button', () => {
    fixture.componentRef.setInput('closeTestId', 'cancel-btn');
    fixture.detectChanges();
    const close = fixture.nativeElement.querySelector('.ur-dialog__close');
    expect(close?.getAttribute('data-testid')).toBe('cancel-btn');
  });

  it('does not set data-testid when closeTestId is empty', () => {
    fixture.detectChanges();
    const close = fixture.nativeElement.querySelector('.ur-dialog__close');
    expect(close?.hasAttribute('data-testid')).toBe(false);
  });
});

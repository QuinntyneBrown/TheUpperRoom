import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrDialogComponent } from './dialog';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('UrDialogComponent titleTestId', () => {
  let fixture: ComponentFixture<UrDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrDialogComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();
    fixture = TestBed.createComponent(UrDialogComponent);
  });

  it('applies titleTestId to the title element', () => {
    fixture.componentRef.setInput('title', 'Hello');
    fixture.componentRef.setInput('titleTestId', 'my-dialog-title');
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('.ur-dialog__title');
    expect(title?.getAttribute('data-testid')).toBe('my-dialog-title');
  });

  it('does not set data-testid when titleTestId is not provided', () => {
    fixture.componentRef.setInput('title', 'Hello');
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('.ur-dialog__title');
    expect(title?.hasAttribute('data-testid')).toBe(false);
  });
});

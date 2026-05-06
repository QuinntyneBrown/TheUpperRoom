import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrToastComponent } from './toast';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('UrToastComponent testIds and role', () => {
  let fixture: ComponentFixture<UrToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrToastComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();
    fixture = TestBed.createComponent(UrToastComponent);
  });

  it('applies title/message testIds', () => {
    fixture.componentRef.setInput('title', 'Saved');
    fixture.componentRef.setInput('message', 'Your changes are saved');
    fixture.componentRef.setInput('titleTestId', 'toast-title');
    fixture.componentRef.setInput('messageTestId', 'toast-msg');
    fixture.detectChanges();
    const t = fixture.nativeElement.querySelector('.ur-toast__title');
    const m = fixture.nativeElement.querySelector('.ur-toast__message');
    expect(t?.getAttribute('data-testid')).toBe('toast-title');
    expect(m?.getAttribute('data-testid')).toBe('toast-msg');
  });

  it('uses role=alert for danger variant', () => {
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('mat-card');
    expect(card?.getAttribute('role')).toBe('alert');
  });

  it('uses role=status for success variant', () => {
    fixture.componentRef.setInput('variant', 'success');
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('mat-card');
    expect(card?.getAttribute('role')).toBe('status');
  });
});

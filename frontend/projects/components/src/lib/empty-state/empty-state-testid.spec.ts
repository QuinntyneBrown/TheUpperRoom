import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrEmptyStateComponent } from './empty-state';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('UrEmptyStateComponent testIds', () => {
  let fixture: ComponentFixture<UrEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrEmptyStateComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();
    fixture = TestBed.createComponent(UrEmptyStateComponent);
  });

  it('applies titleTestId and messageTestId', () => {
    fixture.componentRef.setInput('title', 'Nothing here');
    fixture.componentRef.setInput('message', 'Add something to get started');
    fixture.componentRef.setInput('titleTestId', 'es-title');
    fixture.componentRef.setInput('messageTestId', 'es-msg');
    fixture.detectChanges();
    const t = fixture.nativeElement.querySelector('.ur-empty-state__title');
    const m = fixture.nativeElement.querySelector('.ur-empty-state__message');
    expect(t?.getAttribute('data-testid')).toBe('es-title');
    expect(m?.getAttribute('data-testid')).toBe('es-msg');
  });
});

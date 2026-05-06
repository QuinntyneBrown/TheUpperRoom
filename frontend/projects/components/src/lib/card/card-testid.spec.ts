import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrCardComponent } from './card';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('UrCardComponent testIds', () => {
  let fixture: ComponentFixture<UrCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrCardComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();
    fixture = TestBed.createComponent(UrCardComponent);
  });

  it('applies titleTestId/subtitleTestId', () => {
    fixture.componentRef.setInput('title', 'My card');
    fixture.componentRef.setInput('subtitle', 'A subtitle');
    fixture.componentRef.setInput('titleTestId', 'card-title');
    fixture.componentRef.setInput('subtitleTestId', 'card-subtitle');
    fixture.detectChanges();
    const t = fixture.nativeElement.querySelector('.ur-card__title');
    const s = fixture.nativeElement.querySelector('.ur-card__subtitle');
    expect(t?.getAttribute('data-testid')).toBe('card-title');
    expect(s?.getAttribute('data-testid')).toBe('card-subtitle');
  });
});

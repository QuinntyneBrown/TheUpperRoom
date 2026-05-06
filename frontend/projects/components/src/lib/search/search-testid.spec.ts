import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrSearchComponent } from './search';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('UrSearchComponent inputTestId', () => {
  let fixture: ComponentFixture<UrSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrSearchComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();
    fixture = TestBed.createComponent(UrSearchComponent);
  });

  it('applies inputTestId to underlying input', () => {
    fixture.componentRef.setInput('inputTestId', 'global-search');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input?.getAttribute('data-testid')).toBe('global-search');
  });
});

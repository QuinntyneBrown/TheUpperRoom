import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrSegmentedControlComponent } from './segmented-control';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('UrSegmentedControlComponent option testId', () => {
  let fixture: ComponentFixture<UrSegmentedControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrSegmentedControlComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();
    fixture = TestBed.createComponent(UrSegmentedControlComponent);
  });

  it('applies per-option testId', () => {
    fixture.componentRef.setInput('options', [
      { label: 'List', value: 'list', testId: 'view-list' },
      { label: 'Board', value: 'board', testId: 'view-board' },
    ]);
    fixture.detectChanges();
    const toggles = fixture.nativeElement.querySelectorAll('mat-button-toggle');
    expect(toggles[0]?.getAttribute('data-testid')).toBe('view-list');
    expect(toggles[1]?.getAttribute('data-testid')).toBe('view-board');
  });
});

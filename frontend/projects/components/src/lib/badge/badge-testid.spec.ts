import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrBadgeComponent } from './badge';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('UrBadgeComponent testId', () => {
  let fixture: ComponentFixture<UrBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrBadgeComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();
    fixture = TestBed.createComponent(UrBadgeComponent);
  });

  it('applies testId to the chip', () => {
    fixture.componentRef.setInput('testId', 'stage-badge');
    fixture.detectChanges();
    const chip = fixture.nativeElement.querySelector('mat-chip');
    expect(chip?.getAttribute('data-testid')).toBe('stage-badge');
  });
});

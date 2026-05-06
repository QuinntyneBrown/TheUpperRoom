import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrLiveRegionComponent } from './live-region';
import { LiveRegionService } from './live-region.service';

describe('UrLiveRegionComponent testid', () => {
  let fixture: ComponentFixture<UrLiveRegionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrLiveRegionComponent],
      providers: [LiveRegionService],
    }).compileComponents();
    fixture = TestBed.createComponent(UrLiveRegionComponent);
    fixture.detectChanges();
  });

  it('renders a div with data-testid="live-region"', () => {
    const div = fixture.nativeElement.querySelector('[data-testid="live-region"]');
    expect(div).toBeTruthy();
    expect(div?.getAttribute('aria-live')).toBe('polite');
  });
});

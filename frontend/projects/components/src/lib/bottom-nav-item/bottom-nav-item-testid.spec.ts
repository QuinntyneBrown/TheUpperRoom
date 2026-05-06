import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrBottomNavItemComponent } from './bottom-nav-item';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('UrBottomNavItemComponent testId', () => {
  let fixture: ComponentFixture<UrBottomNavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrBottomNavItemComponent],
      providers: [provideRouter([]), provideAnimationsAsync()],
    }).compileComponents();
    fixture = TestBed.createComponent(UrBottomNavItemComponent);
  });

  it('applies testId to the anchor', () => {
    fixture.componentRef.setInput('label', 'Home');
    fixture.componentRef.setInput('href', '/');
    fixture.componentRef.setInput('testId', 'bottom-nav-home');
    fixture.detectChanges();
    const a = fixture.nativeElement.querySelector('a');
    expect(a?.getAttribute('data-testid')).toBe('bottom-nav-home');
  });
});

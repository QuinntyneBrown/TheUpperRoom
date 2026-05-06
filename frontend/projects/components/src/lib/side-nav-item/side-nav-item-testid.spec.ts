import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrSideNavItemComponent } from './side-nav-item';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('UrSideNavItemComponent testId', () => {
  let fixture: ComponentFixture<UrSideNavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrSideNavItemComponent],
      providers: [provideRouter([]), provideAnimationsAsync()],
    }).compileComponents();
    fixture = TestBed.createComponent(UrSideNavItemComponent);
  });

  it('applies testId to anchor when href is set', () => {
    fixture.componentRef.setInput('label', 'Hackathons');
    fixture.componentRef.setInput('href', '/hackathons');
    fixture.componentRef.setInput('testId', 'nav-hackathons');
    fixture.detectChanges();
    const a = fixture.nativeElement.querySelector('a');
    expect(a?.getAttribute('data-testid')).toBe('nav-hackathons');
  });

  it('applies testId to button when href not set', () => {
    fixture.componentRef.setInput('label', 'Action');
    fixture.componentRef.setInput('testId', 'nav-action');
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn?.getAttribute('data-testid')).toBe('nav-action');
  });
});

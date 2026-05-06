import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrAvatarComponent } from './avatar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('UrAvatarComponent testId', () => {
  let fixture: ComponentFixture<UrAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrAvatarComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();
    fixture = TestBed.createComponent(UrAvatarComponent);
  });

  it('applies testId to the avatar wrapper', () => {
    fixture.componentRef.setInput('initials', 'SR');
    fixture.componentRef.setInput('testId', 'sam-avatar');
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('.ur-avatar');
    expect(span?.getAttribute('data-testid')).toBe('sam-avatar');
  });
});

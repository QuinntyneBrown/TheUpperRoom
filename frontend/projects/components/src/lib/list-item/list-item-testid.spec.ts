import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrListItemComponent } from './list-item';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('UrListItemComponent testId', () => {
  let fixture: ComponentFixture<UrListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrListItemComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();
    fixture = TestBed.createComponent(UrListItemComponent);
  });

  it('applies testId to anchor when href is set', () => {
    fixture.componentRef.setInput('title', 'Item');
    fixture.componentRef.setInput('href', '/x');
    fixture.componentRef.setInput('testId', 'item-x');
    fixture.detectChanges();
    const a = fixture.nativeElement.querySelector('a');
    expect(a?.getAttribute('data-testid')).toBe('item-x');
  });

  it('applies testId to button when href is empty', () => {
    fixture.componentRef.setInput('title', 'Item');
    fixture.componentRef.setInput('testId', 'btn-x');
    fixture.detectChanges();
    const b = fixture.nativeElement.querySelector('button');
    expect(b?.getAttribute('data-testid')).toBe('btn-x');
  });
});

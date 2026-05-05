// Traces to: 54 - list and detail responsive route patterns
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { UrListCardListComponent } from './list-card-list';

@Component({
  selector: 'test-host',
  imports: [UrListCardListComponent],
  template: `<ur-list-card-list><div class="item">Item 1</div><div class="item">Item 2</div></ur-list-card-list>`,
})
class TestHostComponent {}

describe('UrListCardListComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    await fixture.whenStable();
  });

  it('renders projected items', () => {
    const items = fixture.nativeElement.querySelectorAll('.item');
    expect(items.length).toBe(2);
  });

  it('applies the layout class', () => {
    const el = fixture.nativeElement.querySelector('ur-list-card-list');
    expect(el).toBeTruthy();
  });
});

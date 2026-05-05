// Traces to: 54 - list and detail responsive route patterns
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { UrDetailTwoColumnComponent } from './detail-two-column';

@Component({
  selector: 'test-host',
  imports: [UrDetailTwoColumnComponent],
  template: `
    <ur-detail-two-column>
      <div slot="main" class="main-slot">Main content</div>
      <div slot="aside" class="aside-slot">Aside content</div>
    </ur-detail-two-column>
  `,
})
class TestHostComponent {}

describe('UrDetailTwoColumnComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    await fixture.whenStable();
  });

  it('renders main slot content', () => {
    const el = fixture.nativeElement.querySelector('.main-slot');
    expect(el).toBeTruthy();
    expect(el.textContent.trim()).toBe('Main content');
  });

  it('renders aside slot content', () => {
    const el = fixture.nativeElement.querySelector('.aside-slot');
    expect(el).toBeTruthy();
    expect(el.textContent.trim()).toBe('Aside content');
  });

  it('renders the host element', () => {
    const el = fixture.nativeElement.querySelector('ur-detail-two-column');
    expect(el).toBeTruthy();
  });
});

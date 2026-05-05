import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPage } from './reset-page';

describe('ResetPage', () => {
  let component: ResetPage;
  let fixture: ComponentFixture<ResetPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

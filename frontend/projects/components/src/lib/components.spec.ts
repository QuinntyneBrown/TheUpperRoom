import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrButtonComponent } from './button/button';

describe('UrButtonComponent', () => {
  let component: UrButtonComponent;
  let fixture: ComponentFixture<UrButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UrButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

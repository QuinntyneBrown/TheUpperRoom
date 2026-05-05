import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturePartners } from './feature-partners';

describe('FeaturePartners', () => {
  let component: FeaturePartners;
  let fixture: ComponentFixture<FeaturePartners>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturePartners],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturePartners);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

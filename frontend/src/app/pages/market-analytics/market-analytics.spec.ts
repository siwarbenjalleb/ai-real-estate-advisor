import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketAnalytics } from './market-analytics.component';

describe('MarketAnalytics', () => {
  let component: MarketAnalytics;
  let fixture: ComponentFixture<MarketAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketAnalytics],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketAnalytics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

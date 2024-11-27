import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyAverageChartComponent } from './daily-average-chart.component';

describe('DailyAverageChartComponent', () => {
  let component: DailyAverageChartComponent;
  let fixture: ComponentFixture<DailyAverageChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyAverageChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyAverageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

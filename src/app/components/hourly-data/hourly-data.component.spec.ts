import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyDataComponent } from './hourly-data.component';

describe('HourlyDataComponent', () => {
  let component: HourlyDataComponent;
  let fixture: ComponentFixture<HourlyDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HourlyDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HourlyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

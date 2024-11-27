import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentSensorDataComponent } from './current-sensor-data.component';

describe('CurrentSensorDataComponent', () => {
  let component: CurrentSensorDataComponent;
  let fixture: ComponentFixture<CurrentSensorDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentSensorDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentSensorDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

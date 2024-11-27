import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LesservicesComponent } from './lesservices.component';

describe('LesservicesComponent', () => {
  let component: LesservicesComponent;
  let fixture: ComponentFixture<LesservicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LesservicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LesservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

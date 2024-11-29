import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursedashboardComponent } from './coursedashboard.component';

describe('CoursedashboardComponent', () => {
  let component: CoursedashboardComponent;
  let fixture: ComponentFixture<CoursedashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursedashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursedashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

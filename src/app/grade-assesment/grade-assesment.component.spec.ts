import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeAssesmentComponent } from './grade-assesment.component';

describe('GradeAssesmentComponent', () => {
  let component: GradeAssesmentComponent;
  let fixture: ComponentFixture<GradeAssesmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeAssesmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeAssesmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

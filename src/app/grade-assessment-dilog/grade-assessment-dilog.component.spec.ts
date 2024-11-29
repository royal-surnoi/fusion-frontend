import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeAssessmentDilogComponent } from './grade-assessment-dilog.component';

describe('GradeAssessmentDilogComponent', () => {
  let component: GradeAssessmentDilogComponent;
  let fixture: ComponentFixture<GradeAssessmentDilogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeAssessmentDilogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeAssessmentDilogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssessmentDialogComponent } from './create-assessment-dialog.component';

describe('CreateAssessmentDialogComponent', () => {
  let component: CreateAssessmentDialogComponent;
  let fixture: ComponentFixture<CreateAssessmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAssessmentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAssessmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

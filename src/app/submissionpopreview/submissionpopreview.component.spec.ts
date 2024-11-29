import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionpopreviewComponent } from './submissionpopreview.component';

describe('SubmissionpopreviewComponent', () => {
  let component: SubmissionpopreviewComponent;
  let fixture: ComponentFixture<SubmissionpopreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionpopreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionpopreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

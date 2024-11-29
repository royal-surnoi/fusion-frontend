import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionreviewComponent } from './submissionreview.component';

describe('SubmissionreviewComponent', () => {
  let component: SubmissionreviewComponent;
  let fixture: ComponentFixture<SubmissionreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

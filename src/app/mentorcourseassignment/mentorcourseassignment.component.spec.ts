import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorcourseassignmentComponent } from './mentorcourseassignment.component';

describe('MentorcourseassignmentComponent', () => {
  let component: MentorcourseassignmentComponent;
  let fixture: ComponentFixture<MentorcourseassignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorcourseassignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorcourseassignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

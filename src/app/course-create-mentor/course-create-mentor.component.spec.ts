import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCreateMentorComponent } from './course-create-mentor.component';

describe('CourseCreateMentorComponent', () => {
  let component: CourseCreateMentorComponent;
  let fixture: ComponentFixture<CourseCreateMentorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCreateMentorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseCreateMentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

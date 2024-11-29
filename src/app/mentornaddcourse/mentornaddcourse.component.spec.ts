import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentornaddcourseComponent } from './mentornaddcourse.component';

describe('MentornaddcourseComponent', () => {
  let component: MentornaddcourseComponent;
  let fixture: ComponentFixture<MentornaddcourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentornaddcourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentornaddcourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

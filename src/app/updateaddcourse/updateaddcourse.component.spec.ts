import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateaddcourseComponent } from './updateaddcourse.component';

describe('UpdateaddcourseComponent', () => {
  let component: UpdateaddcourseComponent;
  let fixture: ComponentFixture<UpdateaddcourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateaddcourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateaddcourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

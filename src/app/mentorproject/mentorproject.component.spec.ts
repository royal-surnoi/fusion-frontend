import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorprojectComponent } from './mentorproject.component';

describe('MentorprojectComponent', () => {
  let component: MentorprojectComponent;
  let fixture: ComponentFixture<MentorprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorprojectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MentorprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorquizComponent } from './mentorquiz.component';

describe('MentorquizComponent', () => {
  let component: MentorquizComponent;
  let fixture: ComponentFixture<MentorquizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorquizComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MentorquizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

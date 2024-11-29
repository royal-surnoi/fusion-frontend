import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorperspectiveComponent } from './mentorperspective.component';

describe('MentorperspectiveComponent', () => {
  let component: MentorperspectiveComponent;
  let fixture: ComponentFixture<MentorperspectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorperspectiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorperspectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

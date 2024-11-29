import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorPerspectiveComponent } from './mentor-perspective.component';

describe('MentorPerspectiveComponent', () => {
  let component: MentorPerspectiveComponent;
  let fixture: ComponentFixture<MentorPerspectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorPerspectiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorPerspectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

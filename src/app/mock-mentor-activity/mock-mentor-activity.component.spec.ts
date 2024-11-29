import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockMentorActivityComponent } from './mock-mentor-activity.component';

describe('MockMentorActivityComponent', () => {
  let component: MockMentorActivityComponent;
  let fixture: ComponentFixture<MockMentorActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockMentorActivityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MockMentorActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

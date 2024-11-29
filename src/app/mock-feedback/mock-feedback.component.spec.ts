import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockFeedbackComponent } from './mock-feedback.component';

describe('MockFeedbackComponent', () => {
  let component: MockFeedbackComponent;
  let fixture: ComponentFixture<MockFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockFeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MockFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

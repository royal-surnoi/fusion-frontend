import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockActivityComponent } from './mock-activity.component';

describe('MockActivityComponent', () => {
  let component: MockActivityComponent;
  let fixture: ComponentFixture<MockActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockActivityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MockActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

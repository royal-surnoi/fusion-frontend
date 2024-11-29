import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorOverviewComponent } from './mentor-overview.component';

describe('MentorOverviewComponent', () => {
  let component: MentorOverviewComponent;
  let fixture: ComponentFixture<MentorOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

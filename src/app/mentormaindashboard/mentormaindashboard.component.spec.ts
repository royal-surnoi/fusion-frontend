import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentormaindashboardComponent } from './mentormaindashboard.component';

describe('MentormaindashboardComponent', () => {
  let component: MentormaindashboardComponent;
  let fixture: ComponentFixture<MentormaindashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentormaindashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentormaindashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

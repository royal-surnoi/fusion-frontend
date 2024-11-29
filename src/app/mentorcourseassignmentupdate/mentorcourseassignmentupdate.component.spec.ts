import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorcourseassignmentupdateComponent } from './mentorcourseassignmentupdate.component';

describe('MentorcourseassignmentupdateComponent', () => {
  let component: MentorcourseassignmentupdateComponent;
  let fixture: ComponentFixture<MentorcourseassignmentupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorcourseassignmentupdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorcourseassignmentupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

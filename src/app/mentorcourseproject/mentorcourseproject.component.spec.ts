import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorcourseprojectComponent } from './mentorcourseproject.component';

describe('MentorcourseprojectComponent', () => {
  let component: MentorcourseprojectComponent;
  let fixture: ComponentFixture<MentorcourseprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorcourseprojectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorcourseprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

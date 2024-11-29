import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorcourseprojectupdateComponent } from './mentorcourseprojectupdate.component';

describe('MentorcourseprojectupdateComponent', () => {
  let component: MentorcourseprojectupdateComponent;
  let fixture: ComponentFixture<MentorcourseprojectupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorcourseprojectupdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorcourseprojectupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

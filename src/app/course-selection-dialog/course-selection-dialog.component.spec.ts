import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSelectionDialogComponent } from './course-selection-dialog.component';

describe('CourseSelectionDialogComponent', () => {
  let component: CourseSelectionDialogComponent;
  let fixture: ComponentFixture<CourseSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseSelectionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SudentcoursedetailComponent } from './sudentcoursedetail.component';

describe('SudentcoursedetailComponent', () => {
  let component: SudentcoursedetailComponent;
  let fixture: ComponentFixture<SudentcoursedetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SudentcoursedetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SudentcoursedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorupdatecourseComponent } from './mentorupdatecourse.component';

describe('MentorupdatecourseComponent', () => {
  let component: MentorupdatecourseComponent;
  let fixture: ComponentFixture<MentorupdatecourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorupdatecourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorupdatecourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

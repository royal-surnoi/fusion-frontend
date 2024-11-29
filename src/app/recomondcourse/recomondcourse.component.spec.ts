import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecomondcourseComponent } from './recomondcourse.component';

describe('RecomondcourseComponent', () => {
  let component: RecomondcourseComponent;
  let fixture: ComponentFixture<RecomondcourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecomondcourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecomondcourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

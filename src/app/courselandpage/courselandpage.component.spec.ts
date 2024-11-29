import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourselandpageComponent } from './courselandpage.component';

describe('CourselandpageComponent', () => {
  let component: CourselandpageComponent;
  let fixture: ComponentFixture<CourselandpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourselandpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourselandpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentmockComponent } from './studentmock.component';

describe('StudentmockComponent', () => {
  let component: StudentmockComponent;
  let fixture: ComponentFixture<StudentmockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentmockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentmockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentmentorComponent } from './assignmentmentor.component';

describe('AssignmentmentorComponent', () => {
  let component: AssignmentmentorComponent;
  let fixture: ComponentFixture<AssignmentmentorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentmentorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentmentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

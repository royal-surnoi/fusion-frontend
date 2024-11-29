import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssesmentDialogComponent } from './create-assesment-dialog.component';

describe('CreateAssesmentDialogComponent', () => {
  let component: CreateAssesmentDialogComponent;
  let fixture: ComponentFixture<CreateAssesmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAssesmentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAssesmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

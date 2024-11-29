import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentPaymentFormComponent } from './enrollment-payment-form.component';

describe('EnrollmentPaymentFormComponent', () => {
  let component: EnrollmentPaymentFormComponent;
  let fixture: ComponentFixture<EnrollmentPaymentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentPaymentFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentPaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

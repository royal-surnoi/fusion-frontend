import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OtpService } from '../otp.service';
import { EmployeeService } from '../employee.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-enrollment-payment-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, ToastModule, InputOtpModule, ButtonModule],
  templateUrl: './enrollment-payment-form.component.html',
  styleUrl: './enrollment-payment-form.component.css'
})
export class EnrollmentPaymentFormComponent implements OnInit {
  studid: any;
  firstName: any;
  lastName: any;
  phoneNumber: any;
  id: any;
  image?: any;
  otpForm: FormGroup;
  verifyForm: FormGroup;
  email!: string;

  private candidateSubject = new BehaviorSubject<any>(null);
  public candidate$ = this.candidateSubject.asObservable();
  courseId: any;
  otpValues: string[] = new Array(6);

  constructor(
    private fb: FormBuilder,
    private otpService: OtpService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.verifyForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', Validators.required],
      id: ['', Validators.required],
      courseId: ['', Validators.required]
    });
    this.otpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.courseId = params['courseId'];
      console.log("courseID1", this.courseId);
      this.verifyForm.patchValue({ courseId: this.courseId });
    });
    this.fetchCandidateDetails();
  }

  navigateToDashboard() {
    this.router.navigate(['/coursedashboard']);
  }

  fetchCandidateDetails(): void {
    this.studid = window.localStorage.getItem('id');
    if (this.studid) {
      this.employeeService.getbyid(this.studid).subscribe(
        (data: any) => {
      
          console.log('Candidate details fetched successfully:', data);
          this.firstName = data.firstName;
          this.lastName = data.lastName;
          this.id = data.id;
          this.phoneNumber = data.phoneNumber;
          this.image = this.createImageSrc(data.image);

          this.candidateSubject.next({
            firstName: this.firstName,
            lastName: this.lastName,
            id: this.id,
            phoneNumber: this.phoneNumber,
            image: this.image,
          });

          this.otpForm.patchValue({ email: data.email });
          this.verifyForm.patchValue({ 
            email: data.email, 
            id: data.id,
            courseId: this.courseId
          });
        },
        (error: any) => {
          console.error('Failed to fetch candidate details:', error);
        }
      );
    } else {
      console.error('No Candidate ID found. Cannot fetch candidate details.');
    }
  }

  private createImageSrc(imageData: string): string {
    return 'data:image/png;base64,' + imageData;
  }

  onSubmit(): void {
    if (this.verifyForm.valid) {
      const formData = this.verifyForm.value;
      console.log('Submitting form data:', formData);
      console.log('CourseId being sent:', formData.courseId);
      this.otpService.verifyOtp(formData.email, formData.otp, formData.id, formData.courseId).subscribe(
        response => {
          console.log('Success:', response);
          this.router.navigate(['/followcount']);
          alert(response);
        },
        error => {
          if (error.status === 200) {
            console.log('Success:', this.courseId);
            alert("Successfully logged in");
            this.router.navigate(['/coursedashboard'], { queryParams: { courseId: this.courseId } });
          } else {
            alert("Failed to verify OTP");
          }
        }
      );
    }
  }

  generateOtp(): void {
    if (this.otpForm.valid) {
      const email = this.otpForm.get('email')?.value;
      this.otpService.generateOtp(email).subscribe(
        response => {
          console.log('OTP generated:', response);
          alert('OTP has been sent to your email.');
        },
        error => {
          if (error.status === 200) {
            console.log('OTP has been sent to your email.');
            alert('OTP has been sent to your email.');
          } else {
            alert("Failed to generate OTP");
          }
        }
      );
    } else {
      alert('Please enter a valid email address.');
    }
  }
}
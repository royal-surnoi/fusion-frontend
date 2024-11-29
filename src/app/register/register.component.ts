import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  registrationForm!: FormGroup;
  registrationStatus: any;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  showPopup: boolean = false;

  constructor(private router: Router, private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, this.fullNameValidator]],
      email: ['', [Validators.required, this.customEmailValidator]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });
  }

  // Custom validator for full name
  fullNameValidator(control: AbstractControl): ValidationErrors | null {
    const nameRegex = /^[a-zA-Z\s]+$/;
    const isValidLength = control.value.length >= 5 && control.value.length <= 30;
    return nameRegex.test(control.value) && isValidLength ? null : { invalidFullName: true };
  }

  // Custom validator for email
  customEmailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!control.value.includes('@')) {
      return { missingAtSymbol: true };
    }
    if (!emailRegex.test(control.value)) {
      return { invalidDomain: true };
    }
    if (!control.value.endsWith('.com')) {
      return { invalidTld: true };
    }
    return null;
  }

  // Custom validator for password
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(control.value) ? null : { invalidPassword: true };
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup): ValidationErrors | null {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { passwordMismatch: true };
  }

  // Method to register the user
  register(): void {
      if (this.registrationForm.invalid) {
        // Mark all controls as touched to trigger validation messages
        this.registrationForm.markAllAsTouched();
        console.log('Form is invalid. All controls are marked as touched.');
        return;
      }
   
      this.showPopup = true;
      // Extract only the required fields for backend
      const { name, email, role, password } = this.registrationForm.value;
      const registrationData = { name, email, role, password };
      const baseUrl = environment.apiBaseUrl;
   
      this.http.post(`${baseUrl}/user/register`, registrationData)
        .subscribe({
          next: (response: any) => {
            console.log('Registration successful. Response:', response);
            this.registrationStatus = 'success';
            this.errorMessage = '';
            this.showPopup = true;
            console.log('showPopup set to:', this.showPopup);
            // this.showAlert('You have successfully registered! Please Login');
            this.router.navigate(['/login']);  // Navigate to the login page
          },
          error: (error: HttpErrorResponse) => {
            console.error('Registration failed. Error:', error);
            this.showPopup = false; // Hide popup if registration fails
            if (error.status === 409) {
              this.registrationStatus = 'conflict';
              this.errorMessage = 'This email is already registered. Please use a different email.';
            } else if (error.status === 500) {
              this.registrationStatus = 'serverError';
              this.errorMessage = 'There is an issue with the server. Please try again later.';
            } else {
              this.registrationStatus = 'failed';
              this.errorMessage = 'Registration failed. Please try again.';
            }
          }
        });
    }
   
   
    
    closePopup(): void {
      this.showPopup = false;
    }
   
    redirectToLogin(): void {
      this.showPopup = false;
      // this.router.navigate(['/login']);
    }
   

  // Method to toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Method to toggle confirm password visibility
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  // gotologin(){
  //     this.router.navigate(['/login']);
   
  // }
  
}

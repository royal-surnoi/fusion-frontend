import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MentorService } from '../mentor.service';

export interface Mentor {
  username: string;
  password: string;
}

@Component({
  selector: 'app-subregister',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './subregister.component.html',
  styleUrls: ['./subregister.component.css']
})
export class SubregisterComponent implements OnInit {
  registrationForm!: FormGroup;
  showPassword: boolean = false;
  registrationStatus: 'success' | 'failed' | 'alreadyRegistered' | null = null;
  showPopup: boolean = false;

  constructor(private fb: FormBuilder, private mentorService: MentorService, private router: Router) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator()]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  passwordValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

      return !passwordValid ? { invalidPassword: true } : null;
    };
  }
  registerMentor(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }
   
    const { username, password } = this.registrationForm.value;
    const userId = Number(localStorage.getItem('id'));
 
    this.showPopup = true;
    this.registrationStatus = null;
   
    this.mentorService.registerMentor(userId, { username, password }).subscribe({
      next: (response:any) => {
        this.registrationStatus = 'success';
      },
      error: (error: any) => {
        // console.error('Registration failed:', error);
        if (error.status === 409) {
          this.registrationStatus = 'alreadyRegistered';
        } else {
          this.registrationStatus = 'failed';
        }
      }
    });
  }
 
 
  redirectToLogin(): void {
    this.showPopup = false;
    this.router.navigate(['/sublogin']);
  }
  closePopup(): void {
    this.showPopup = false;
  }
}
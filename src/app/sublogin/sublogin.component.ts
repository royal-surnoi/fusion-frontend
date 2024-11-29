
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { SubauthService } from '../subauth.service';
 
@Component({
  selector: 'app-sublogin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sublogin.component.html',
  styleUrls: ['./sublogin.component.css']
})
export class SubloginComponent implements OnInit, OnDestroy {
  loginData = {
    username: '',
    password: ''
  };
  errorMessage: string = '';
  private subscription: Subscription = new Subscription();
  showPassword: boolean = false;
  showDetails: boolean = false;
  apiBaseUrl: string = environment.apiBaseUrl;
 
  // New properties for popup
  showPopup: boolean = false;
  loginStatus: 'success' | 'failed' | null = null;
 
  constructor(
    private router: Router,
    private http: HttpClient,
    private subauthService: SubauthService
  ) {}
 
  ngOnInit(): void {
    this.playVideo();
  }
 
  playVideo() {
    const videoElement = document.getElementById('background-video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.play().catch((error) => {
        console.error('Error trying to play the video:', error);
      });
    }
  }
 
  onSubmit(): void {
    const data = { email: this.loginData.username, password: this.loginData.password };
    console.log("Attempting to login with:", data);
    this.subscription.add(
      this.subauthService.login(this.loginData.username, this.loginData.password).subscribe({
        next: (response: any) => {
          console.log('Login Response:', response);
          const { token, username, mentorId } = response;
          localStorage.setItem('mentorToken', token);
          localStorage.setItem('mentorUsername', username);
          localStorage.setItem('mentorId', mentorId.toString());
          localStorage.setItem('mentorLoggedIn', 'true');
          this.loginStatus = 'success';
          this.showPopup = true;
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.errorMessage = 'Invalid username or password. Please try again.';
          } else if (error.status === 404) {
            this.errorMessage = 'User not found. Please check your credentials.';
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again later.';
          }
          this.loginStatus = 'failed';
          this.showPopup = true;
        }
      })
    );
  }
 
  navigateToHrRegister(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/subregister']);
  }
 
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
 
  closePopup(): void {
    this.showPopup = false;
    if (this.loginStatus === 'success') {
      this.router.navigate(['/mentorperspective']);
    }
  }
 
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
 
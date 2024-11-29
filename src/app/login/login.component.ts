import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string = "";
  password: string = "";
  errorMessage: string = '';
  private subscription: Subscription = new Subscription();
  showPassword: boolean = false;
  showDetails: boolean = false;
  apiBaseUrl: string = environment.apiBaseUrl;
  showPopup: boolean = false;
  loginStatus: 'success' | 'failed' | null = null;
 
  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
  ) {}
 
  ngOnInit() {
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
 
  login() {
    const data = { email: this.email, password: this.password };
    console.log("Attempting to login with:", data);
 
    // Get device information
    const deviceInfo = this.getDeviceInfo();
 
    // Set headers
    const headers = new HttpHeaders({
      'Device-Name': deviceInfo.name,
      'Device-Type': deviceInfo.type,
      'Device-Model': deviceInfo.model
    });
 
    this.subscription.add(
      this.http.post(`${this.apiBaseUrl}/user/login`, data, { headers: headers }).subscribe({
        next: (response: any) => {
          console.log("Login successful:", response);
          const { token, id, name, email } = response;
 
          if (this.authService.isBrowser()) {
            window.localStorage.setItem("token", token);
            window.localStorage.setItem("name", name);
            window.localStorage.setItem("id", id);
          }
 
          this.authService.setLoggedIn(true);
          this.authService.setName(name);
          this.authService.setId(id);
 
          // Now trigger the geolocation request AFTER login has completed
          this.requestLocationAfterLogin(id);
          this.startLocationAutoUpdate(id); // Start automatic location updates every 5 minutes
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.errorMessage = 'Invalid username or password. Please try again.';
          } else if (error.status === 404) {
            this.errorMessage = 'User not found. Please check your credentials.';
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again later.';
          }
          console.error('Login failed:', error);
          this.loginStatus = 'failed';
          this.showPopup = true;
        }
      })
    );
  }
 
  // Modified requestLocationAfterLogin method to use userId
  requestLocationAfterLogin(userId: string) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
 
          console.log('Location retrieved successfully:', latitude, longitude);
 
          // Send the location data to the server
          this.updateUserLocation(userId, latitude, longitude);
 
          // Optionally, navigate to feed page with location data
          this.router.navigate(['/feed'], { queryParams: { lat: latitude, lng: longitude } });
        },
        (error) => {
          console.error('Error retrieving location:', error);
          // Handle the error (user denied access or location services disabled)
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
 
  // Method to update user's location on the backend
  updateUserLocation(userId: string, latitude: number, longitude: number) {
    const locationData = { latitude, longitude }; // Only pass location in the body
 
    this.http.post(`${this.apiBaseUrl}/personalDetails/location?userId=${userId}`, locationData).subscribe({
      next: (response) => {
        console.log('User location updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating user location:', error);
      }
    });
  }
 
  // Start automatic location updates every 5 minutes
  startLocationAutoUpdate(userId: string) {
    console.log("Starting automatic location update every 6 hours...");
   
    setInterval(() => {
      console.log("Attempting to update location...");
     
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
           
            // Log the current location for debugging purposes
            console.log('Updating location automatically every 6 hours:', latitude, longitude);
 
            // Send the location data to the server
            this.updateUserLocation(userId, latitude, longitude);
          },
          (error) => {
            console.error('Error retrieving location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    }, 21600000); // 21600000 milliseconds = 2 hours
  }
 
  private getDeviceInfo(): { name: string, type: string, model: string } {
    let name = 'Unknown';
    let type = 'Unknown';
    let model = 'Unknown';
 
    // Detect device name and type
    if (/Windows/i.test(navigator.userAgent)) {
      name = "Windows";
      type = 'Desktop';
    } else if (/Macintosh/i.test(navigator.userAgent)) {
      name = "MacOS";
      type = 'Desktop';
    } else if (/Linux/i.test(navigator.userAgent)) {
      name = "Linux";
      type = 'Desktop';
    } else if (/Android/i.test(navigator.userAgent)) {
      name = "Android";
      type = 'Mobile';
    } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      name = "iOS";
      type = 'Mobile';
    }
 
    // Attempt to get a more specific model
    if (type === 'Desktop') {
      model = this.getDesktopModel();
    } else if (type === 'Mobile') {
      model = this.getMobileModel();
    }
    console.log('Device name:', name, type, 'Device model:', model)
    return { name, type, model };
  }
 
  private getDesktopModel(): string {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
 
    if (platform.includes('Win')) {
      return `${platform}-${userAgent.split('NT ')[1].split(';')[0]}`;
    } else if (platform.includes('Mac')) {
      const parts = userAgent.split('Mac OS X ')[1].split(')')[0].split('_');
      return `MacOS ${parts.join('.')}`;
    } else if (platform.includes('Linux')) {
      return 'Linux ' + platform;
    }
 
    return 'Unknown Desktop';
  }
 
  private getMobileModel(): string {
    const userAgent = navigator.userAgent;
    const match = userAgent.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      const parts = match[1].split(';');
      if (parts.length > 2) {
        return parts[2].trim();
      }
    }
    return 'Unknown Mobile';
  }
 
  // closePopup(): void {
  //   this.showPopup = false;
  //   if (this.loginStatus === 'success') {
  //     this.router.navigate(['/feed']);
  //   }
  // }
 
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
 
  navigateToHrRegister(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/register']);
  }
 
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
 
  hidePasswordDetails() {
    this.showDetails = false;
  }
 
  showPasswordDetails() {
    this.showDetails = true;
  }
 
  // ---------------------------------------------------personal details
 
 
  closePopup(): void {
    this.showPopup = false;
    if (this.loginStatus === 'success') {
      this.router.navigate(['/feed'],{ queryParams: { requireUserDetails: 'true' } });
    }
 
}
}
 
 
 

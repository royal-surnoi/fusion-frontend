import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  // private apiUrl = 'http://ec2-43-204-32-2.ap-south-1.compute.amazonaws.com:8080'; // Replace with your backend URL
  private apiUrl = 'http://ec2-13-235-67-148.ap-south-1.compute.amazonaws.com'; // Replace with your backend URL

  constructor(private http: HttpClient) { }

  generateOtp(email: string): Observable<any> {
    return this.http.post<any>(`${environment.apiBaseUrl}/enrollment/generateOtp`, { email });
  }
  

  verifyOtp(email: string, otp: string, userId: string, courseId: string): Observable<any> {
    let params = new HttpParams()
      .set('email', email)
      .set('otp', otp)
      .set('userId', userId)
      .set('courseId', courseId);
    return this.http.post<any>(`${environment.apiBaseUrl}/enrollment/verify`, null, { params });
  }
}

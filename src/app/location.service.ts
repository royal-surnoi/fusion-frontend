import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = 'http://ec2-13-235-67-148.ap-south-1.compute.amazonaws.com';  // Replace with your backend URL

  constructor(private http: HttpClient) { }

  // Update user location with latitude and longitude
  updateLocation(userId: number, latitude: number, longitude: number): Observable<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const location = { latitude, longitude };
    return this.http.post<void>(`${this.apiUrl}/personalDetails/location?userId=${userId}`, location, { headers });
  }
}
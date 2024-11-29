import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mentor } from './subregister/subregister.component';  // Ensure this path is correct

@Injectable({
  providedIn: 'root'
})
export class MentorService {
  private baseUrl = 'http://ec2-13-235-67-148.ap-south-1.compute.amazonaws.com/user';

  constructor(private http: HttpClient) { }

  registerMentor(userId: number, mentor: Mentor): Observable<any> {
    const url = `${this.baseUrl}/${userId}/registerMentor`;
    return this.http.post<any>(url, mentor, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
 
}
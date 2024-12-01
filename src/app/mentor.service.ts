import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mentor } from './subregister/subregister.component';  // Ensure this path is correct

@Injectable({
  providedIn: 'root'
})
export class MentorService {
  private baseUrl = 'http://34.230.34.88:8080/user';

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

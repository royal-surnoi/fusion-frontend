  import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

  @Injectable({
    providedIn: 'root'
  })
  export class SubauthService {
    private apiBaseUrl = environment.apiBaseUrl;
    handleError: any;

    constructor(private http: HttpClient) {}

    login(username: string, password: string): Observable<any> {
      const url = `${this.apiBaseUrl}/user/MentorLogin`;
      const body = new HttpParams()
        .set('username', username)
        .set('password', password);

      return this.http.post<any>(url, body.toString(), {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      });
    }

    logout(): void {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mentorToken');
        localStorage.removeItem('mentorUsername');
        localStorage.removeItem('mentorId');
        localStorage.removeItem('mentorLoggedIn');
      }
    }

    isMentorLoggedIn(): boolean {
      return localStorage.getItem('mentorLoggedIn') === 'true';
    }
  }

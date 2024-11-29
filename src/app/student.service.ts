import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface User {
  id: number;
  name: any;
  email: string;
  password: string;
}

export interface User1 {
  id: number;
  name: any;
  email: string;
  password: string;
  preferences: any;
  profession: string;
}

export interface Course {
  id: number;
  courseTitle: any;
  courseDescription: string;
  language: string;
  level: string;
  courseDuration: string;
  createdAt: string;
  updatedAt: string;
  lessons: any;
  submissions: any;
  user: User;
  user1: User1;
}
@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiBaseUrl = environment.apiBaseUrl;


  constructor(private http: HttpClient) { }


  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiBaseUrl}/user/find/${id}`);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiBaseUrl}/course/getBy/${id}`);
  }
}

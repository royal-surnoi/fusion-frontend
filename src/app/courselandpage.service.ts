
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class CourselandpageService {
 
  constructor(private http: HttpClient) { }
 
  getModulesByCourse(courseId: number): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/getModuleByCourse/${courseId}`);
  }
 
  getLessonsByModule(moduleId: number): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/lesson/module/${moduleId}`);
  }
 
  getCourseById(courseId: number): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/course/getBy/${courseId}`);
  }
 
  getVideosByCourse(courseId: number): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/video/courses/videos/${courseId}`);
  }
}
 
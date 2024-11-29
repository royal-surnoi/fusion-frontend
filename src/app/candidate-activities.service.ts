
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'
 
@Injectable({
  providedIn: 'root'
})
export class CandidateActivitiesService {
 
  constructor(private http: HttpClient) { }
  submitProject(userId: number, courseId: number, projectId: number, formData: FormData, courseType: string): Observable<any> {
    let url: string;
  
    if (courseType === 'course') {
      console.log(courseType,userId,projectId,"09090909")
      url = `${environment.apiBaseUrl}/saveSubmitProject/${userId}/${courseId}/${projectId}`;
    } else if (courseType === 'individual') {
      console.log(courseType,"09090909090")
      
      url = `${environment.apiBaseUrl}/project/submitNewProject?projectId=${projectId}&userId=${userId}`;
    } else {
      throw new Error('Invalid courseType. Must be either "course" or "individual".');
    }
    
    return this.http.post(url, formData);
  }
}
 
 
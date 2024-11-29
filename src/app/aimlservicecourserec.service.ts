import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class AimlservicecourserecService {
 
  private apiBaseUrl = environment.apiBaseUrl;
  handleError: any;
 
  constructor(private http: HttpClient) { }
 
//////////// course recommendatuins //////////////////
getHomeRecommendations(userId: number): Observable<any> {
  return this.http.post<any>(`${this.apiBaseUrl}/homeRecommendations`, { user_id: userId });
}
 
 
}
 
 
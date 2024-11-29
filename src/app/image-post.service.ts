import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
 
 
@Injectable({
  providedIn: 'root'
})
export class ImagePostService {
  private apiBaseUrl = `${environment.apiBaseUrl}/api/imagePosts`;
 
  constructor(private http: HttpClient) {}
 
  getAllImagePostsByUserId(userId:number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/user/${userId}`);
  }
  updateImagePost(id: number, imageDescription: string): Observable<any> {
    const params = new HttpParams().set('imageDescription', imageDescription);
 
    return this.http.put<any>(`${this.apiBaseUrl}/update/${id}`, null, { params });
}
 
 
  deleteImagePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/delete/${id}`);
  }
  likeImagePost(postId: number, userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/${postId}/like`, { userId });
  }
 
  shareImagePost(postId: number): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/${postId}/share`, {});
  }
 
  getCommentsByImagePostId(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/${postId}/comments`);
  }
 
  getLikeCount(postId: number): Observable<number> {
    return this.http.get<number>(`${this.apiBaseUrl}/${postId}/likeCount`);
  }
 
  getShareCount(postId: number): Observable<number> {
    return this.http.get<number>(`${this.apiBaseUrl}/${postId}/shareCount`);
  }
 
}
 
 
 
 
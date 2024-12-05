import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  loadArticles() {
    throw new Error('Method not implemented.');
  }


  private apiUrl = 'http://be.royalreddy.co.in:8080/api/articleposts';

  // private apiUrl = 'http://be.royalreddy.co.in:8080/api/articleposts';


 
  constructor(private http: HttpClient) {}
 
  getArticlesByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }
  updateArticlePost(id: number, article: string): Observable<any> {
    const params = new HttpParams().set('article', article);
    return this.http.put<any>(`${this.apiUrl}/${id}`, null, { params });
  }
  likeArticle(postId: number, userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${postId}/like`, { userId });
  }
  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
 
  shareArticle(postId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${postId}/share`, {});
  }
 
  getCommentsByArticleId(articleId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://be.royalreddy.co.in:8080/api/comments/article/${articleId}`);
  }
 
  addComment(articleId: number, comment: string): Observable<any> {
    return this.http.post<any>(`http://be.royalreddy.co.in:8080/api/comments/article/${articleId}`, { content: comment });
  }
  getTotalCommentsByArticlePostId(articlePostId: number): Observable<number> {
    return this.http.get<number>(`http://be.royalreddy.co.in:8080/api/count/articlepost/${articlePostId}`);
  }
}
 
 
 
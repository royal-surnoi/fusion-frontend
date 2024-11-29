import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { User } from './user.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private http: HttpClient) {
   
   
  }



  private apiUrl = 'http://ec2-13-235-67-148.ap-south-1.compute.amazonaws.com/user';




  searchUsers(term: string): Observable<User[]> {
    console.log('Searching users with term:', term);
    return this.http.get<User[]>(`${this.apiUrl}/search?query=${term}`).pipe(
      tap(users => console.log('Users returned from API:', users)),
      catchError(error => {
        console.error('Error searching users:', error);
        return of([]);
      })
    );
  }
}
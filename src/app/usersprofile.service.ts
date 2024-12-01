 
 
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of,forkJoin,throwError,EMPTY, interval } from 'rxjs';
import { map,tap, catchError,switchMap, startWith } from 'rxjs/operators';
import { AuthService } from './auth.service';
 
export interface User {
  id: number;
  name: string;
  isFollowed: boolean;
  followRequested: boolean;
  profilePic?: string; // Changed to profileImage
  role?: string;
  userImage?: string | null;
  profession:string ;
  followingCount?:number;
}
export interface Follow {
  id: number;
  followerId: number;
  followingId: number;
 
}
export interface FollowRequestUser {
  id: number;
  name: string;
  role?: string;
  userImage?: string;
}
 
 
 
@Injectable({
  providedIn: 'root'
})
export class UsersprofileService {
 
  private apiBaseUrl = 'http://34.230.34.88:8080';
  private apiUrl = 'http://34.230.34.88:8080/user/all';
 
  private incrementUrl = 'http://34.230.34.88:8080/follow/incrementCounts';
  private decrementUrl = 'http://34.230.34.88:8080/follow/decrementCounts';
  private followUrl = 'http://34.230.34.88:8080/follow/saveByIds';
  private apiUrll = 'http://34.230.34.88:8080/api/users';
 
 
 
 
  private followerCountSubject = new BehaviorSubject<number>(0);
    private followingCountSubject = new BehaviorSubject<number>(0);
   
    followerCount$ = this.followerCountSubject.asObservable();
    followingCount$ = this.followingCountSubject.asObservable();
   
 
  private usersSubject = new BehaviorSubject<User[]>([]);
  private followRequestsSubject = new BehaviorSubject<User[]>([]);
 
 private followedUsersSubject = new BehaviorSubject<number[]>([]);
  private followingUsersSubject = new BehaviorSubject<number[]>([]);
  private requestedUsersSubject = new BehaviorSubject<number[]>([]);
 
  private currentUser: { id: number; name: string; followers: number; following: number } = { id: 0, name: '', followers: 0, following: 0 };
 
  users$ = this.usersSubject.asObservable();
  followRequests$ = this.followRequestsSubject.asObservable();
  followedUsers$ = this.followedUsersSubject.asObservable();
  followingUsers$ = this.followedUsersSubject.asObservable();
  requestedUsers$ = this.requestedUsersSubject.asObservable();
  cdr: any;
 
  constructor(private http: HttpClient,private authService:AuthService) {
   
   
  }
 
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/user/find/${id}`);
  }
 
 
 
 
  getUserDetails(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiBaseUrl}/user/find/${userId}`);
  }
 
  setCurrentUser(user: { id: number; name: string; followers: number; following: number }) {
    this.currentUser = user;
    console.log('Current user set to:', this.currentUser);
   
 
  }
  getCurrentUser() {
    return this.currentUser;
  }
       
   
  // ==============================================
 
 
  updateFollowerCount(userId: number) {
    this.getFollowerCount(userId).subscribe(
      result => {
        this.followerCountSubject.next(result.count);
      },
      error => console.error('Error updating follower count:', error)
    );
  }
  updateFollowingCount(userId: number) {
    this.getFollowingCount(userId).subscribe(
      result => {
        this.followingCountSubject.next(result.count);
      },
      error => console.error('Error updating following count:', error)
    );
  }
 
 
 
  getUserById1(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrll}/${userId}`);
  }
 
  updateUserProfileImage(userId: number, formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    // headers.append('Content-Type', 'multipart/form-data'); // Not necessary with FormData
 
    return this.http.put<any>(`${this.apiUrl}/update/${userId}`, formData, { headers });
  }
 
 
 
 
 
  getFollowedUsers(): Observable<number[]> {
      const currentUserId = this.authService.getId();
      return this.http.get<number[]>(`${this.apiBaseUrl}/follow/followingWithCountEqualsToOne/${currentUserId}`).pipe(
        tap(followedUsers => this.followedUsersSubject.next(followedUsers)),
        catchError(error => {
          console.error('Error fetching followed users', error);
          return of([]);
        })
      );
    }
   
  getFollowingUsers(): Observable<number[]> {
    const currentUserId = this.authService.getId();
    return this.http.get<number[]>(`${this.apiBaseUrl}/follow/followingWithCountEqualsToOne/${currentUserId}`).pipe(
      tap(followingUsers => this.followingUsersSubject.next(followingUsers)),
      catchError(error => {
        console.error('Error fetching followed users', error);
        return of([]);
      })
    );
  }
 
 
      incrementCounts(userId: number, currentUserId: number): Observable<any> {
         console.log('Incrementing counts for userId:', userId, 'currentUserId:', currentUserId);
         return this.http.post<void>(`${this.apiBaseUrl}/follow/incrementCounts/${userId}/${currentUserId}`, {}).pipe(
           tap(() => console.log('Increment counts API call successful')),
           catchError(error => {
             console.error('Error in incrementCounts:', error);
             throw error;
           })
         );
       }
     
     
   updateCounts(followerId: number, followingId: number, url: string): Observable<void> {
 
    return this.http.post<void>(`${url}/${followerId}/${followingId}`, {});
  }
  getUserNameById(userId: number): Observable<{ name: string }> {
    return this.http.get<{ name: string,role:string }>(`${this.apiBaseUrl}/user/find/${userId}`).pipe(
      catchError(error => {
        console.error('Error fetching user name', error);
        return of({ name: 'Unknown User' });
      })
    );
  }
 
  getFollowerCount(userId: number): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiBaseUrl}/follow/sumFollowerCounts/${userId}`).pipe(
      tap(response => console.log(`Follower count for user ${userId}:`, response)),
      catchError(error => {
        console.error('Error fetching follower count', error);
        return of({ count: 0 });
      })
    );
  }
 
  getFollowingCount(userId: number): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiBaseUrl}/follow/sumFollowingCounts/${userId}`).pipe(
      tap(response => console.log(`Following count for user ${userId}:`, response)),
      catchError(error => {
        console.error('Error fetching following count', error);
        return of({ count: 0 });
      })
    );
  }
 
 getFollowers(userId: number): Observable<User[]> {
    const currentUserId = this.authService.getId();
    return this.http.get<any[]>(`${this.apiBaseUrl}/follow/followingWithCountEqualsToOne/${currentUserId}`).pipe(
      map(followers => followers.map(follower => ({
        id: follower.follower.id,
        name: follower.follower.name,
        role: follower.follower.role,
        userImage: follower.follower.userImage,
        isFollowed: true,
        followRequested: false // Since they are already followers, this should be false
      } as User))),
      catchError(error => {
        console.error('Error fetching followers:', error);
        return of([]);
      })
    );
  }
 
  getFollowing(userId: number): Observable<User[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/follow/followersWithCountEqualsToOne/${userId}`).pipe(
      switchMap(following => {
        const followingRequests$ = following.map(follow => 
          forkJoin({
            user: of(follow.following),
            followingCount: this.http.get<number>(`${this.apiBaseUrl}/follow/sumFollowingCounts/${follow.following.id}`)
          })
        );
        return forkJoin(followingRequests$);
      }),
      map(following => following.map(({ user, followingCount }) => ({
        ...user,
        isFollowed: true,
        followRequested: false,
        followingCount: followingCount
      } as User))),
      catchError(error => {
        console.error('Error fetching following users:', error);
        return of([]);
      })
    );
  }
   
 
}
 
 
 
 
 
 
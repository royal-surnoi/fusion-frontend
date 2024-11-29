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
  // Add any other properties that your Follow entity has
}
export interface FollowRequestUser {
  id: number;
  name: string;
  role?: string;
  userImage?: string;
}
export interface UserWithFollowerCount extends User {
  followerCount: number;
  followRequested: boolean;
}
 
@Injectable({
  providedIn: 'root'
})
export class UserService {
 
  private apiBaseUrl = 'http://54.162.84.143:8080';
  // private apiUrl = 'http://54.162.84.143:8080/user/all';
  // private apiUrl = 'http://54.162.84.143:8080/user/all';
  private apiUrl = 'http://54.162.84.143:8080/suggestFriendsRecommendations'
 
  private incrementUrl = 'http://54.162.84.143:8080/follow/incrementCounts';
  private decrementUrl = 'http://54.162.84.143:8080/follow/decrementCounts';
  private followUrl = 'http://54.162.84.143:8080/follow/saveByIds';
  private apiUrll = 'http://54.162.84.143:8080/api/users';
 
 private followRequestsUrl = 'http://54.162.84.143:8080/follow/zero-followers-following/followings'
 
 
 private readonly SENT_REQUESTS_KEY = 'sentFollowRequests';
  private readonly ACCEPTED_REQUESTS_KEY = 'acceptedFollowRequests';
 
 
  private acceptFollowRequestUrl = `${this.apiUrl}/follow/accept`;
  private ignoreFollowRequestUrl = `${this.apiUrl}/follow/ignore`;
  private unfollowUrl = `${this.apiUrl}/follow/unfollow`;
 
 
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
    this.fetchUsers();
    this.loadSentRequests();
    this.loadAcceptedRequests();
   
  }
 
  // fetchUsers() {
  //   const currentUserId = this.authService.getId();
 
  //   if (!currentUserId) {
  //     console.error('No user is currently logged in');
  //     this.usersSubject.next([]);
  //     return;
  //   }
 
  //   forkJoin({
  //     allUsers: this.http.get<User[]>(this.apiUrl),
  //     friends: this.http.get<any[]>(`${this.apiBaseUrl}/follow/followersWithCountEqualsToOne/${currentUserId}`),
  //     followRequests: this.http.get<number[]>(`${this.apiBaseUrl}/follow/zero-following-followers/followers/${currentUserId}`)
  //   }).pipe(
  //     map(({ allUsers, friends, followRequests }) => {
  //       const friendIds = friends.map(friend => {
  //         const isCurrentUserFollower = friend.follower.id === Number(currentUserId);
  //         return isCurrentUserFollower ? friend.following.id : friend.follower.id;
  //       });
 
  //       return allUsers
  //         .filter(user =>
  //           user.id !== Number(currentUserId) &&
  //           !friendIds.includes(user.id)
  //         )
  //         .map(user => ({
  //           ...user,
  //           followRequested: followRequests.includes(user.id)
  //         }))
  //         .reverse();
  //     }),
  //     switchMap(filteredUsers => {
  //       const usersWithCounts$ = filteredUsers.map(user =>
  //         this.http.get<number>(`${this.apiBaseUrl}/follow/sumFollowingCounts/${user.id}`).pipe(
  //           map(followingCount => ({
  //             ...user,
  //             followingCount: followingCount // Add the following count to the user object
  //           }))
  //         )
  //       );
 
  //       return forkJoin(usersWithCounts$);
  //     }),
  //     tap(usersWithCounts => {
  //       console.log('Filtered users with following counts:', usersWithCounts);
  //       this.usersSubject.next(usersWithCounts);
  //     }),
  //     catchError(error => {
  //       console.error('Error fetching users and following counts', error);
  //       return of([]);
  //     })
  //   ).subscribe();
  // }
 
  fetchUsers() {
    const currentUserId = this.authService.getId();
 
    if (!currentUserId) {
      console.error('No user is currently logged in');
      this.usersSubject.next([]);
      return;
    }
 
    forkJoin({
      suggestedUsers: this.http.post<number[]>(`${this.apiBaseUrl}/suggestFriendsRecommendations`, { user_id: currentUserId }),
      friends: this.http.get<any[]>(`${this.apiBaseUrl}/follow/followersWithCountEqualsToOne/${currentUserId}`),
      followRequests: this.http.get<number[]>(`${this.apiBaseUrl}/follow/zero-following-followers/followers/${currentUserId}`)
    }).pipe(
      switchMap(({ suggestedUsers, friends, followRequests }) => {
        const friendIds = friends.map(friend =>
          friend.follower.id === Number(currentUserId) ? friend.following.id : friend.follower.id
        );
 
        const filteredUserIds = suggestedUsers.filter(id =>
          id !== Number(currentUserId) && !friendIds.includes(id)
        );
 
        return forkJoin(
          filteredUserIds.map(id =>
            forkJoin({
              userDetails: this.getUserDetails(id),
              followingCount: this.http.get<number>(`${this.apiBaseUrl}/follow/sumFollowingCounts/${id}`)
            }).pipe(
              map(({ userDetails, followingCount }) => ({
                ...userDetails,
                followingCount,
                followRequested: followRequests.includes(id)
              }))
            )
          )
        );
      }),
      map(users => users.filter(user => user !== null)),
      tap(usersWithCounts => {
        console.log('Filtered users with following counts:', usersWithCounts);
        this.usersSubject.next(usersWithCounts);
      }),
      catchError(error => {
        console.error('Error fetching users and following counts', error);
        this.usersSubject.next([]);
        return of([]);
      })
    ).subscribe();
  }
 
 
 
 
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/user/find/${id}`);
  }
 
  fetchFollowRequests(userId: number): Observable<User[]> {
    return this.http.get<number[]>(`${this.apiBaseUrl}/follow/zero-followers-following/followings/${userId}`).pipe(
      switchMap(requestIds => {
        const userRequests$ = requestIds.map(id =>
          forkJoin({
            user: this.getUserDetails(id),
            followingCount: this.http.get<number>(`${this.apiBaseUrl}/follow/sumFollowingCounts/${id}`)
          })
        );
        return forkJoin(userRequests$);
      }),
      map(users => users.map(({ user, followingCount }) => ({
        ...user,
        isFollowed: false,
        followRequested: true,
        followingCount: followingCount
      } as User))),
      tap(requests => {
        console.log('Fetched follow requests:', requests);
        this.followRequestsSubject.next(requests);
      }),
      catchError(error => {
        console.error('Error fetching follow requests:', error);
        return of([]);
      })
    );
  }
   
  removeFollower(followerId: number, userId: number): Observable<any> {
    const params = new HttpParams()
      .set('followerId', followerId.toString())
      .set('followingId', userId.toString());

    return this.http.delete('http://54.162.84.143:8080/follow/deleteByIds', { params }).pipe(
      tap(() => {
        // Update the local users array
        const users = this.usersSubject.getValue();
        const updatedUsers = users.map(user =>
          user.id === followerId ? { ...user, isFollower: false } : user
        );
        this.removeFollowRequestFromList(followerId);
        this.usersSubject.next(updatedUsers);
 
        // Update follower and following counts
        this.updateFollowerCount(userId);
        this.updateFollowingCount(followerId);
      }),
      catchError(error => {
        console.error('Error removing follower', error);
        return throwError(() => new Error('Failed to remove follower'));
      })
    );
  }
 
  getUserDetails(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiBaseUrl}/user/find/${userId}`);
  }
 
  setCurrentUser(user: { id: number; name: string; followers: number; following: number }) {
    this.currentUser = user;
    console.log('Current user set to:', this.currentUser);
    this.fetchUsers();
    this.fetchFollowRequests(Number(this.currentUser.id));
  }
  getCurrentUser() {
    return this.currentUser;
  }
  followUser(userId: number): Observable<Follow> {
    const currentUserId = this.authService.getId();
    if (!currentUserId) {
      console.error('No user is currently logged in');
      return throwError(() => new Error('No user is logged in'));
    }
 
    let params = new HttpParams()
      .set('followerId', currentUserId)
      .set('followingId', userId.toString());
 
    console.log('Sending follow request with params:', params.toString());
 
    return this.http.post<Follow>(this.followUrl, null, { params: params }).pipe(
      tap((savedFollow) => {
        console.log(`Follow request sent and saved for user ID: ${userId}`, savedFollow);
        this.updateUserFollowStatus(userId, true);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error sending follow request:', error);
        return throwError(() => new Error('Failed to send follow request'));
      })
    );
  }
 
  private updateUserFollowStatus(userId: number, isRequested: boolean) {
    const users = this.usersSubject.getValue();
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, followRequested: isRequested } : user
    );
    this.usersSubject.next(updatedUsers);
  }
 
    unfollowUser(followerId: number, followingId: number): Observable<any> {
      const params = new HttpParams()
        .set('followerId', followerId.toString())
        .set('followingId', followingId.toString());
  
      return this.http.delete('http://54.162.84.143:8080/follow/deleteByIds', { params }).pipe(
        tap(() => {
          // Update the local users array
          const users = this.usersSubject.getValue();
          const updatedUsers = users.map(user =>
            user.id === followingId ? { ...user, isFollowed: false, followRequested: false } : user
          );
          this.usersSubject.next(updatedUsers);
 
          // Update follower and following counts
          this.updateFollowerCount(followerId);
          this.updateFollowingCount(followerId);
        }),
        catchError(error => {
          console.error('Error unfollowing user', error);
          return throwError(() => new Error('Failed to a user'));
        })
      );
    }
 
    cancelFollowRequest(userId: number): Observable<any> {
      const currentUserId = this.authService.getId();
      if (!currentUserId) {
        console.error('No user is currently logged in');
        return throwError(() => new Error('No user is logged in'));
      }
 
      let params = new HttpParams()
        .set('followerId', currentUserId)
        .set('followingId', userId.toString());
 
      return this.http.delete(`${this.apiBaseUrl}/follow/deleteByIds`, { params }).pipe(
        tap(() => {
          console.log(`Follow request cancelled for user ID: ${userId}`);
          this.updateUserFollowStatus(userId, false);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error cancelling follow request:', error);
          return throwError(() => new Error('Failed to cancel follow request'));
        })
      );
    }
   
    ignoreFollowRequest(requestingUserId: number): Observable<any> {
      const currentUserId = this.authService.getId();
      if (!currentUserId) {
        console.error('No user is currently logged in');
        return throwError(() => new Error('No user logged in'));
      }
 
      const params = new HttpParams()
        .set('followerId', requestingUserId.toString())
        .set('followingId', currentUserId.toString());
  
      return this.http.delete('http://54.162.84.143:8080/follow/deleteByIds', { params }).pipe(
        tap(() => {
          console.log('Follow request ignored successfully');
          const users = this.usersSubject.getValue();
          const updatedUsers = users.map(user =>
            user.id === requestingUserId ? { ...user, followRequested: false } : user
          );
          this.usersSubject.next(updatedUsers);
          this.removeFollowRequestFromList(requestingUserId);
        }),
        catchError(error => {
          console.error('Error ignoring follow request:', error);
          return throwError(() => new Error('Failed to ignore follow request'));
        })
      );
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
  private loadSentRequests() {
    const sentRequests = localStorage.getItem(this.SENT_REQUESTS_KEY);
    if (sentRequests) {
      const requestedUserIds = JSON.parse(sentRequests);
      const users = this.usersSubject.getValue();
      users.forEach(user => {
        user.followRequested = requestedUserIds.includes(user.id);
      });
      this.usersSubject.next(users);
    }
  }
 
 
 
  getUserById1(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrll}/${userId}`);
  }
 
  updateUserProfileImage(userId: number, formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    // headers.append('Content-Type', 'multipart/form-data'); // Not necessary with FormData
 
    return this.http.put<any>(`${this.apiUrl}/update/${userId}`, formData, { headers });
  }
  private saveSentRequests() {
    const users = this.usersSubject.getValue();
    const requestedUserIds = users
      .filter(user => user.followRequested)
      .map(user => user.id);
    localStorage.setItem(this.SENT_REQUESTS_KEY, JSON.stringify(requestedUserIds));
  }
  private loadAcceptedRequests() {
    const acceptedRequests = localStorage.getItem(this.ACCEPTED_REQUESTS_KEY);
    if (acceptedRequests) {
      const acceptedUserIds = JSON.parse(acceptedRequests);
      const users = this.usersSubject.getValue();
      users.forEach(user => {
        user.isFollowed = acceptedUserIds.includes(user.id);
      });
      this.usersSubject.next(users);
    }
  }
  private saveAcceptedRequests() {
    const users = this.usersSubject.getValue();
    const acceptedUserIds = users
      .filter(user => user.isFollowed)
      .map(user => user.id);
    localStorage.setItem(this.ACCEPTED_REQUESTS_KEY, JSON.stringify(acceptedUserIds));
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
    return this.http.get<number[]>(`${this.apiBaseUrl}/follow/followersWithCountEqualsToOne/${currentUserId}`).pipe(
      tap(followingUsers => this.followingUsersSubject.next(followingUsers)),
      catchError(error => {
        console.error('Error fetching following users', error);
        return of([]);
      })
    );
  }
  getRequestedUsers(): Observable<number[]> {
    const currentUserId = this.authService.getId();
    return this.http.get<number[]>(`${this.followRequestsUrl}/${currentUserId}`).pipe(
      tap(requestedUsers => this.requestedUsersSubject.next(requestedUsers)),
      catchError(error => {
        console.error('Error fetching requested users', error);
        return of([]);
      })
    );
  }
 
 
  acceptFollowRequest(userId: number) {
    const users = this.usersSubject.getValue();
    const user = users.find(u => u.id === userId);
 
    if (!user) {
      console.error(`User with ID ${userId} not found`);
      return;
    }
 
    user.isFollowed = true;
    console.log("is followed okay")
    user.followRequested = false;
    this.currentUser.followers += 1;
    this.currentUser.following += 1;
    console.log('Accepting request for user ID:', userId);
    this.removeFollowRequestFromList(userId);
    console.log('Follow request accepted');
    console.log(this.currentUser.followers, this.incrementUrl)
 
    this.incrementCounts(userId, this.currentUser.id)
      .subscribe({
        next: () => {
          console.log('Follow request accepted:', user);
          this.usersSubject.next([...users]);
          this.updateFollowerCount(Number(this.authService.getId()));
          this.updateFollowingCount(Number(this.authService.getId()));
        },
        error: (err) => {
          console.error('Failed to update counts:', err);
        }
      });
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
 
 
 
 
  getSuggestions(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`).pipe(
      catchError(error => {
        console.error('Error fetching suggestions', error);
        return of([]);
      })
    );
  }
  removeFollowRequestFromList(userId: number) {
    const currentRequests = this.followRequestsSubject.getValue();
    const updatedRequests = currentRequests.filter(request => request.id !== userId);
    this.followRequestsSubject.next(updatedRequests);
    console.log(`Follow request from user ${userId} removed from list`);
  }
 
  setFollowRequests(requests: User[]) {
    this.followRequestsSubject.next(requests);
  }
  getSentFollowRequests(): Observable<{id: number, name: string, profession: string, userImage: string, followingCount: number}[]> {
    const currentUserId = this.authService.getId();
    return this.http.get<number[]>(`${this.apiBaseUrl}/follow/zero-following-followers/followers/${currentUserId}`).pipe(
      switchMap(userIds => {
        if (userIds.length === 0) {
          return of([]);
        }
        const sentRequestsWithCounts$ = userIds.map(userId =>
          forkJoin({
            id: of(userId),
            sentRequest: this.getUserById(userId),
            followingCount: this.http.get<number>(`${this.apiBaseUrl}/follow/sumFollowingCounts/${userId}`)
          }).pipe(
            map(({ id, sentRequest, followingCount }) => ({
              id,
              name: sentRequest.name,
              profession: sentRequest.profession,
              userImage: sentRequest.userImage,
              followingCount
            }))
          )
        );
        return forkJoin(sentRequestsWithCounts$);
      }),
      catchError(error => {
        console.error('Error fetching sent follow requests', error);
        return of([]);
      })
    );
  }
 
  getFollowers(userId: number): Observable<User[]> {
    const currentUserId = this.authService.getId();
    return this.http.get<any[]>(`${this.apiBaseUrl}/follow/followingWithCountEqualsToOne/${currentUserId}`).pipe(
      switchMap(followers => forkJoin(
        followers.map(follower => forkJoin({
          user: of(follower.follower),
          followingCount: this.getFollowingCount(follower.follower.id)
        }))
      )),
      map(followers => followers.map(({ user, followingCount }) => ({
        id: user.id,
        name: user.name,
        profession: user.profession,
        userImage: user.userImage,
        isFollowed: true,
        followingCount: followingCount.count,
        followRequested: false
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
 
 
 
 
 
 
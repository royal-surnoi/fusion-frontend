import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserNotification } from './notification.model';
import { catchError, tap } from 'rxjs/operators';
import { Contact } from './chat/chat.models';
 
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://3.93.191.129:8080/api';
  private unreadCountSubject = new BehaviorSubject<number>(0);

 
  constructor(private http: HttpClient) {
   }
  getNotificationsByUser(userId: number): Observable<UserNotification[]> {
    return this.http.get<UserNotification[]>(`${this.apiUrl}/notifications/user/${userId}`);
  }
 
  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/notifications/read/${notificationId}`, {});
  }
  incrementUnreadCount() {
    const currentCount = this.unreadCountSubject.value;
    this.unreadCountSubject.next(currentCount + 1);
  }
 markMessageAsRead(messageId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/read/${messageId}`, {}).pipe(
      tap(() => {
        const currentCount = this.unreadCountSubject.value;
        if (currentCount > 0) {
          this.unreadCountSubject.next(currentCount - 1);
        }
      }),
      catchError(error => {
        console.error('Error marking message as read:', error);
        return of(null);
      })
    );
  }
  resetUnreadCount(userId: number | null) {
    if (userId === null) {
      this.unreadCountSubject.next(0);
      return;
    }
    this.unreadCountSubject.next(0);
  }
  
  getCurrentUnreadCount(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  markAllMessagesAsRead(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/read-all/${userId}`, {}).pipe(
      tap(() => {
        this.unreadCountSubject.next(0);
      }),
      catchError(error => {
        console.error('Error marking all messages as read:', error);
        return of(null);
      })
    );
  }

  refreshUnreadCount(userId: number | null) {
    if (userId !== null) {
      this.getUnreadCount(userId).subscribe();
    }
  }



  getUnreadSendersCount(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-senders-count/${userId}`).pipe(
        catchError(error => {
            console.error('Error fetching unread senders count:', error);
            return of(0);
        })
    );
}

getContactsWithUnreadCounts(userId: number): Observable<Contact[]> {
  return this.http.get<Contact[]>(`${this.apiUrl}/contacts/${userId}`).pipe(
      catchError(error => {
          console.error('Error fetching contacts with unread counts:', error);
          return of([]);
      })
  );
}
getUnreadCount(userId: number | null): Observable<number> {
  if (userId === null) {
    return of(0);
  }
  return this.http.get<number>(`${this.apiUrl}/unread-senders-count/${userId}`).pipe(
    tap(count => this.unreadCountSubject.next(count)),
    catchError(error => {
      console.error('Error fetching unread count:', error);
      return of(0);
    })
  );
}
}

 
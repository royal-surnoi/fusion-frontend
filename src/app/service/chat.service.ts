
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { Contact, Message, GroupMessages } from '../chat/chat.models';

interface FollowResponse {
  followers: FollowData[];
  following: FollowData[];
}

interface FollowData {
  id: number;
  follower: UserData;
  following: UserData;
  followerCount: number;
  followingCount: number;
  requestedTime: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  userImage: string | null;
  onlineStatus: boolean | null;
  lastSeen?: string | number;
  userDescription: string | null;
}
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://be.royalreddy.co.in:8080';
  contacts: Contact[] = [];



  constructor(private http: HttpClient) { }
  getMessages(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/api/messages/${userId}`).pipe(
      map(messages => messages.map(msg => ({
        ...msg,
        time: new Date(msg.time),
        isNew: true // Add this flag to identify new messages
      }))),
      catchError(this.handleError)
    );
  }





  getConversation(senderId: number, receiverId: number): Observable<Message[]> {
    const url = `${this.apiUrl}/api/conversation?senderId=${senderId}&receiverId=${receiverId}`;
    return this.http.get<Message[]>(url);
  }

  getUserGroups(userId: number): Observable<GroupMessages[]> {
    return this.http.get<GroupMessages[]>(`${this.apiUrl}/api/users/${userId}/groups`);
  }

  markMessageAsRead(messageId: number): Observable<any> {
    const url = `${this.apiUrl}/api/read/${messageId}`;
    return this.http.put(url, {});
  }

  sendMessage(formData: FormData): Observable<Message> {
    return this.http.post<any>(`${this.apiUrl}/api/messages`, formData).pipe(
      map((response: any) => {
        const message: Message = {
          id: response.id ?? 0,
          messageContent: response.messageContent ?? '',
          time: response.time ? new Date(response.time) : new Date(),
          senderId: response.senderId ?? 0,
          receiverId: response.receiverId ?? 0,
          fileUrl: response.fileUrl ?? '',
          sent: true,
          fileType: this.getFileType(response.fileUrl ?? ''),
          temporary: response.temporary,
          createdAt: new Date(), // Add this line
          sender: '',
          read: false,
          showToolbar: false,
          reactions: undefined,
          myreaction: ''
        };

        return message;
      }),
      catchError((error) => {
        console.error('Error in sendMessage:', error);
        return throwError(() => new Error('Failed to send message. Please try again.'));
      })
    );
  }

  uploadFile(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<string>(`${this.apiUrl}/api/chat/upload`, formData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error(`Server Error: ${error.message}`);
    return throwError(() => new Error('Something went wrong with the network request'));
  }



  private getFileType(fileUrl: string | null): 'image' | 'video' | 'pdf' | 'other' {
    if (!fileUrl) {
      return 'other';
    }

    if (fileUrl.startsWith('data:image')) {
      return 'image';
    } else if (fileUrl.startsWith('data:video')) {
      return 'video';
    } else if (fileUrl.startsWith('data:application/pdf')) {
      return 'pdf';
    } else {
      return 'other';
    }
  }



  getContacts(userId: number): Observable<Contact[]> {
    return this.http.get<FollowResponse>(`${this.apiUrl}/follow/details/${userId}`).pipe(
      map((response: FollowResponse): Contact[] => {
        const contactsMap = new Map<number, Contact>();

        // Process followers (add the users that the current user is following)
        response.followers.forEach(follow => {
          const contact = this.mapUserToContact(follow.following, follow);
          contact.isFollowing = true;
          contactsMap.set(contact.id, contact);
        });

        // Process following (if needed in the future)
        response.following.forEach(follow => {
          const existingContact = contactsMap.get(follow.follower.id);
          if (existingContact) {
            existingContact.isFollower = true;
          } else {
            const contact = this.mapUserToContact(follow.follower, follow);
            contact.isFollower = true;
            contactsMap.set(contact.id, contact);
          }
        });

        const contacts = Array.from(contactsMap.values());
        return contacts;
      }),
      catchError((error: any): Observable<Contact[]> => {
        console.error('Error in getContacts:', error);
        return of([]);
      })
    );
  }
  private mapUserToContact(user: UserData, follow: FollowData): Contact {
    return {
      id: user.id,
      name: user.name,
      lastMessage: '',
      messages: [],
      imageUrl: user.userImage || '',
      online: user.onlineStatus || 'OFFLINE', userImage: user.userImage || '',
      profileImage: user.userImage,
      selected: false,
      defaultImage: 'assets/default-avatar.png',
      lastMessageTime: undefined, // Initialize as undefined initially
      peerId: user.id,
      followerCount: follow.followerCount,
      followingCount: follow.followingCount,
      email: user.email,
      role: user.role,
      userDescription: user.userDescription || '',
      isFollower: false,
      isFollowing: false,
      newMemberName: user.name,
      hasNewMessage: false, // Add this line to include the hasNewMessage property
      isGroup: false,
      blocked: false,
      lastseen: user.lastSeen ? new Date(user.lastSeen) : new Date(),
      unreadMessageCount: 0

    };
  }



  private addGroupToContacts(group: GroupMessages) {
    const newGroupContact: Contact = {
      id: group.id,
      name: group.name,
      isGroup: true,
      newMemberName: '',
      messages: [],
      imageUrl: this.getDefaultAvatar(group.name),
      userImage: '',
      profileImage: '',
      selected: false,
      defaultImage: 'assets/default-group-avatar.png',
      lastMessageTime: undefined,
      peerId: group.id,
      online: false,
      followerCount: 0,
      followingCount: 0,
      email: '',
      role: 'group',
      userDescription: group.description || '',
      isFollower: false,
      isFollowing: false,
      hasNewMessage: false,
      blocked: false,
      lastMessage: '',
      lastseen: new Date(),
      unreadMessageCount: 0
    };

    // Add the group to the contacts list
    this.contacts.unshift(newGroupContact);

    // Update local storage
  }
  getDefaultAvatar(name: string): string {
    // Return a default avatar URL or path
    return 'assets/default-avatar.png';
  }
  addUserToGroup(groupId: number, userId: number): Observable<GroupMessages> {
    return this.http.post<GroupMessages>(`${this.apiUrl}/api/groups/${groupId}/addUser`, null, {
      params: { userId: userId.toString() }
    });
  }

  getGroupMembers(groupId: number): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/api/groups/${groupId}/members`);
  }
  removeUserFromGroup(groupId: number, userId: number): Observable<GroupMessages> {
    return this.http.post<GroupMessages>(`${this.apiUrl}/api/groups/${groupId}/removeUser`, null, {
      params: { userId: userId.toString() }
    });
  }

  sendGroupMessage(groupId: number, senderId: number, content: string, file?: File): Observable<Message> {
    const formData = new FormData();
    formData.append('groupId', groupId.toString());
    formData.append('senderId', senderId.toString());
    formData.append('messageContent', content);
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.http.post<Message>(`${this.apiUrl}/api/groups/${groupId}/messages`, formData).pipe(
      map(response => ({
        ...response,
        time: new Date(response.time), // Ensure time is a Date object
        createdAt: new Date(response.createdAt) // Ensure createdAt is a Date object
      }))
    );
  }

  getGroupMessages(groupId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/api/groups/${groupId}/messages`);
  }
  blockUser(blockerId: number, blockedId: number): Observable<string> {
    const url = `${this.apiUrl}/block/block`;
    const params = new HttpParams()
      .set('blockerId', blockerId.toString())
      .set('blockedId', blockedId.toString());

    return this.http.post(url, null, { params: params, responseType: 'text' }).pipe(
      tap(response => {}),
      catchError(error => {
        console.error('Error in blockUser service method:', error);
        if (error.status === 409) {
          return of('User already blocked');
        }
        return throwError(() => new Error(error.error || 'Failed to block user'));
      })
    );
  }



  unblockUser(blockerId: number, blockedId: number): Observable<string> {
    const url = `${this.apiUrl}/block/unblock`;
    const params = new HttpParams()
      .set('blockerId', blockerId.toString())
      .set('blockedId', blockedId.toString());

    return this.http.delete(url, { params, responseType: 'text' }).pipe(
      tap(() => {}),
      catchError(this.handleError)
    );
  }

  isblockUser(blockerId: number, blockedId: number): Observable<boolean> {
    const url = `${this.apiUrl}/block/isBlock`;
    const params = new HttpParams()
      .set('blockerId', blockerId.toString())
      .set('blockedId', blockedId.toString());
  
    return this.http.post<boolean>(url, null, { params: params }).pipe(
      tap(response => {}),
      catchError(error => {
        console.error('Error in blockUser service method:', error);
        // If any error occurs, return false or you can handle it differently if needed
        return of(false);
      })
    );
  }
  

  isUserAdmin(groupId: number, userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/api/group/getadmin/${groupId.toString()}`, {
      params: {
        userId: userId.toString()
      }
    });
  }
 createGroup(name: string, adminId: number, memberIds: number[]): Observable<GroupMessages> {
    const params = new HttpParams()
      .set('name', name)
      .set('adminId', adminId.toString())
      .set('memberIds', memberIds.join(','));

    return this.http.post<GroupMessages>(`${this.apiUrl}/api/groups`, null, { params }).pipe(
      map(group => {
        // Add the new group to the contacts list for all members
        this.addGroupToContacts(group);
        return group;
      }),
      catchError(error => {
        console.error('Error in createGroup:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to create group'));
      })
    );
  }
 getGroup(groupId: number): Observable<GroupMessages> {
    return this.http.get<GroupMessages>(`${this.apiUrl}/api/groups/${groupId}`).pipe(
      catchError(error => {
        console.error('Error in getGroup:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to get group'));
      })
    );
  }
getGroupsForUser(userId: string): Observable<Contact[]> {
    return this.http.get<GroupMessages[]>(`${this.apiUrl}/api/user/${userId}`).pipe(
      map(groups => groups.map(group => this.mapGroupToContact(group))),
      catchError(error => {
        console.error('Error in getGroupsForUser:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to get groups for user'));
      })
    );
  }

  private mapGroupToContact(group: GroupMessages): Contact {
    return {
      id: group.id,
      name: group.name,
      isGroup: true,
      lastMessage: '',
      lastMessageTime: new Date(),
      selected: false,
      messages: [],
      imageUrl: '',
      userImage: '',
      defaultImage: 'assets/default-group-avatar.png',
      hasNewMessage: false,
      blocked: false,
      newMemberName: '',
      email: '',
      role: '',
      userDescription: '',
      peerId: group.id,
      online: false,
      followerCount: 0,
      followingCount: 0,
      isFollower: false,
      isFollowing: false,
      profileImage: '',
      lastseen: new Date(),
      unreadMessageCount: 0,
    };
  }


  deleteGroup(id: number): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}/api/Group/delete/${id}`);


  }
  
  markAsRead(messageId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/api/read/${messageId}`, {});
  }

  deleteChat(userId: number, otherUserId: number): Observable<string> {
    const url = `${this.apiUrl}/api/chats/${userId}/${otherUserId}`;

    return this.http.delete(url, { responseType: 'text' }).pipe(
      tap(response => {}),
      catchError(error => {
        console.error('Error in deleteChat:', error);
        return throwError(() => error);
      })
    );
  }
  getUserStatus(userId: number): Observable<string> {
    return this.http.get<{ onlineStatus: string }>(`${this.apiUrl}/user/${userId}/status`)
      .pipe(
        map(response => {
          return response.onlineStatus;
        })
      );
  }

  deleteMessage(senderId: number, messageId: number): Observable<string> {
    const url = `${this.apiUrl}/api/messages/${senderId}/${messageId}`;
    return this.http.delete(url, { responseType: 'text' });
  }
  setUserOnline(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/online`, { userId }, { responseType: 'text' });
  }
  

  setUserOffline(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/offline`, { userId });
  }
  isGroupAccepted(groupId: number, userId: number): Observable<any> {
    return this.http.get<boolean>(`${this.apiUrl}/api/group/IsGroupAccepted/${userId}/${groupId}`);
  }
  acceptGroup(groupId: number, userId: number): Observable<HttpResponse<string>> {
    const url = `${this.apiUrl}/api/group/MemberAcceptance/${userId}/${groupId}`;
    return this.http.get<string>(url, { observe: 'response', responseType: 'text' as 'json' });
  }

  messagereaction(reaction:String, type:String, messageid: Number){
    console.log(reaction+"------->"+type+"----------->"+messageid+"---------->")
    const url = `${this.apiUrl}/message/SetReaction?type=Sender&MessageId=1&Reaction=k`;
    console.log(this.http.post<void>(url, { observe: 'response', responseType: 'text' as 'json' }));
  }

  setReaction(userId: number, messageId: number, reaction: string): Observable<string> {
    const url = `http://be.royalreddy.co.in:8080/Reactions/react?messageId=${messageId}&userId=${userId}&reaction=${reaction}`;
    return this.http.post(url, {}, { responseType: 'text' }); // Set responseType to 'text'
  }
  
  
  removeReaction(userId: string, messageId: number): Observable<string> {
    const url = `${this.apiUrl}/Reactions/dereact?messageId=${messageId}&userId=${userId}`;
    return this.http.post<string>(url, {}); // To handle reaction removal
  }
}















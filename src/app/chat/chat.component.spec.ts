import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from '../service/chat.service';
import { FusionService } from '../fusion.service';
import { AuthService } from '../auth.service';
import { NotificationService } from '../notification.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Contact, Message } from './chat.models';  // Adjust import for Message and User
 
describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let chatServiceSpy: jasmine.SpyObj<ChatService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
 
  beforeEach(async () => {
    const chatServiceSpyObj = jasmine.createSpyObj('ChatService', [
      'getContacts', 'getConversation', 'sendMessage', 'deleteMessage',
      'deleteChat', 'getUserStatus', 'blockUser', 'unblockUser',
      'createGroup', 'deleteGroup', 'getGroupsForUser', 'getGroupMessages',
      'getGroupMembers', 'isUserAdmin', 'isGroupAccepted', 'acceptGroup',
      'markAsRead', 'setUserOnline', 'setUserOffline'
    ]);
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', ['getId', 'getName']);
    const notificationServiceSpyObj = jasmine.createSpyObj('NotificationService', [
      'incrementUnreadCount', 'markMessageAsRead', 'getUnreadSendersCount'
    ]);
    const snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);
    const dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
 
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],  // Removed `ChatComponent` from imports
      declarations: [ChatComponent],   // Add `ChatComponent` to declarations
      providers: [
        FormBuilder,
        { provide: ChatService, useValue: chatServiceSpyObj },
        { provide: FusionService, useValue: {} },
        { provide: AuthService, useValue: authServiceSpyObj },
        { provide: NotificationService, useValue: notificationServiceSpyObj },
        { provide: MatDialog, useValue: dialogSpyObj },
        { provide: MatSnackBar, useValue: snackBarSpyObj },
        { provide: ActivatedRoute, useValue: { params: of({id: '1'}) } },
        { provide: Router, useValue: {} }
      ]
    }).compileComponents();
 
    chatServiceSpy = TestBed.inject(ChatService) as jasmine.SpyObj<ChatService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
 
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
  });
 
  it('should create', () => {
    expect(component).toBeTruthy();
  });
 
  it('should initialize component properties', () => {
    authServiceSpy.getId.and.returnValue('1');
    authServiceSpy.getName.and.returnValue('Test User');
    chatServiceSpy.getContacts.and.returnValue(of([]));
 
    fixture.detectChanges();
 
    expect(component.contacts).toEqual([]);
    expect(component.userId).toBe(Number(authServiceSpy.getId()));
    expect(component.currentUser.name).toBe('Test User');
  });
 
  it('should fetch contacts on init', () => {
    const mockContacts: Contact[] = [
      {
        id: 1,
        name: 'Contact 1',
        unreadMessageCount: 0,
        isGroup: false,
        newMemberName: '',
        messages: [],
        imageUrl: '',
        userImage: '',
        defaultImage: undefined,
        email: undefined,
        role: undefined,
        userDescription: '',
        hasNewMessage: false,
        blocked: false,
        lastseen: new Date()
      },
      {
        id: 2,
        name: 'Contact 2',
        unreadMessageCount: 0,
        isGroup: false,
        newMemberName: '',
        messages: [],
        imageUrl: '',
        userImage: '',
        defaultImage: undefined,
        email: undefined,
        role: undefined,
        userDescription: '',
        hasNewMessage: false,
        blocked: false,
        lastseen: new Date()
      }
    ];
    chatServiceSpy.getContacts.and.returnValue(of(mockContacts));
    authServiceSpy.getId.and.returnValue('1');
 
    fixture.detectChanges();
 
    expect(chatServiceSpy.getContacts).toHaveBeenCalledWith(1);
    expect(component.contacts).toEqual(mockContacts);
  });
 
  it('should select a contact', () => {
    const mockContact: Contact = {
      id: 1,
      name: 'Contact 1',
      isGroup: false,
      unreadMessageCount: 0,
      newMemberName: '',
      messages: [],
      imageUrl: '',
      userImage: '',
      defaultImage: undefined,
      email: undefined,
      role: undefined,
      userDescription: '',
      hasNewMessage: false,
      blocked: false,
      lastseen: new Date()
    };
    chatServiceSpy.getConversation.and.returnValue(of([]));
    component.userId = 1;
 
    component.selectContact(mockContact);
 
    expect(component.selectedContact).toEqual(mockContact);
    expect(component.senderId).toBe(1);
    expect(component.receiverId).toBe(1);
    expect(chatServiceSpy.getConversation).toHaveBeenCalledWith(1, 1);
  });
 
  it('should send a message', () => {
    const mockMessage = 'Test message';
    const mockContact: Contact = {
      id: 1,
      name: 'Contact 1',
      isGroup: false,
      unreadMessageCount: 0,
      newMemberName: '',
      messages: [],
      imageUrl: '',
      userImage: '',
      defaultImage: undefined,
      email: undefined,
      role: undefined,
      userDescription: '',
      hasNewMessage: false,
      blocked: false,
      lastseen: new Date()
    };
    const mockMessageResponse: Message = {
      id: 1,
      messageContent: mockMessage,
      time: new Date(),
      sent: true,
      senderId: 1,
      receiverId: 1,
      fileUrl: null,
      fileType: 'other' as 'image' | 'video' | 'pdf' | 'other',
      createdAt: new Date(),
      sender: { id: 1, name: 'User 1' } as Contact,
      read: false,
      showToolbar: false
    };
   
    component.selectedContact = mockContact;
    component.senderId = 1;
    component.receiverId = 1;
    component.messageInputs = { '1': mockMessage };
    chatServiceSpy.sendMessage.and.returnValue(of(mockMessageResponse));
 
    component.sendMessage();
 
    expect(chatServiceSpy.sendMessage).toHaveBeenCalled();
    expect(component.messages.length).toBe(1);
    expect(component.messages[0].messageContent).toBe(mockMessage);
    expect(component.messageInputs['1']).toBe('');  
  });
 
  // Add more tests here to cover various scenarios like error handling, UI interactions, etc.
});
 
 
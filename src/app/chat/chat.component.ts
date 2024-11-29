import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ChatService } from "../service/chat.service";
import { Contact, Message, GroupMessages, stringToColor } from "./chat.models";
import { CommonModule } from "@angular/common";
import { FusionService } from "../fusion.service";
import { AuthService } from "../auth.service";
import { forkJoin, interval, Observable, of, Subscription } from "rxjs";
import {
  catchError,
  map,
  mergeMap,
  startWith,
  switchMap,
} from "rxjs/operators";

import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { TimeAgoPipe } from "../time-ago.pipe";
import { Location } from "@angular/common";
import { NotificationService } from "../notification.service";
import { ChatDialogComponent } from "../chat-dialog/chat-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";

type Chat = {
  id: string;
  name: string;
  isGroup: boolean;
  members: Contact[];
  messages: Message[];
};

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatTooltipModule,
    MatSnackBarModule,
    TimeAgoPipe,
  ],
})
export class ChatComponent implements OnInit, OnDestroy {
  contacts: Contact[] = []; // Assume this is populated elsewhere

  defaultAvatars: { [key: string]: string } = {};
  groups: GroupMessages[] = [];
  newGroupName: string = "";
  selectedGroupMembers: Contact[] = [];
  AdminName : string = "";
  AdminId: number = 0;
  isGroupAdmin: boolean = false;

  title = "ChatUi";
  selectedChat: Chat | null = null;
  chats: Chat[] = [];
  unreadMessages: any;

  searchTerm = "";
  selectedContact: any;
  hideContactList = false;
  showEmojiPicker = false;
  showImage = true;
  emojiList: string[] = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "😒", "🙂‍↔️",];

  showScrollButton = false;
  emojiRows: string[][] = [];
  messageExpanded = false;
  newMessage = "";
  groupMembers: Contact[] = [];

  selectedFile: File | null = null;
  selectedFileUrl: string | null = null;
  callContactName = "";
  userId: any | null = null;
  private messagePollingSubscription: Subscription | null = null;
  private lastMessageId: any;
  currentUser: { name: string | null; id: string | null } = {
    name: null,
    id: null,
  };
  showInfo: boolean = false;
  showDropdown: boolean = false;
  showUserProfile: boolean = false;
  showFileGallery: boolean = false;
  showChat: boolean = true;
  newMemberName: string = "";
  showDetailsDialog = false;
  hoveredContact: any = null;
  dialogTop = 0;
  dialogLeft = 0;
  selectedGroup: GroupMessages | null = null;
  showNewGroupModal: boolean = false;
  searchTermforgroup = "";
  showAddMembersModal: boolean | undefined;
  messages: Message[] = [];
  senderId: number | null = null; // Initialize to null or appropriate default
  receiverId: number | null = null; //
  isLoading = true;
  chatForm!: FormGroup;
  showNewConversationModal: boolean = false;
  isGroupChat: boolean = false; // Example declaration
  isCreatingGroupChat: boolean = false;
  notificationSound!: HTMLAudioElement;
 fileRows: any[][] = [];
 isAccepted : boolean = true;
 showAlert: boolean = false;
 isLoaded:boolean = true;


 private statusSubscription!: Subscription;

  @ViewChild("fileInput")
  fileInput!: ElementRef;

  @ViewChild("messageContainer") private messageContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;
  Contacts: any;
  profileImage: any;
  private onlineStatusInterval: any;
  messageInputs: { [contactId: string]: string } = {};

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    private getservice: FusionService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer, // Inject DomSanitizer
    private location: Location,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute



  ) { this.chatForm = this.fb.group({
    message: ['']
  });}

  ngOnInit() {
    this.setUserOnline();
    this.onlineStatusInterval = setInterval(() => {
      this.setUserOnline();
    }, 600);
    this.route.params.subscribe(params => {
      this.userId = +params['id']; 
    });
  

    window.onbeforeunload = () => {
      this.setUserOffline();
    };
    setInterval(() => {
      this.updateContactStatus();
    }, 1000);
    this.fetchUnreadSendersCount();

    this.userId = this.authService.getId() ? parseInt(this.authService.getId()!, 10) : null;

    if (this.userId !== null) {
      this.notificationService.getUnreadSendersCount(this.receiverId!).subscribe(count => {
        this.unreadSendersCount = count;
      });

      this.notificationService.getContactsWithUnreadCounts(this.receiverId!).subscribe(contacts => {
        this.contacts = contacts;
      });
    }
    this.chatForm = this.fb.group({
      messageContent: [''],
      file: [null]
    });
    this.contacts.forEach(contact => contact.hasNewMessage = false);

    this.fileRows = this.chunkArray(
      this.messages.filter((message) => message.fileUrl),
      4
    );
    this.loadContactsFromLocalStorage();
    this.startMessagePolling();
    this.initializeNewMessageAlert();
    this.loadUserGroups();
    this.unreadMessages = {};
    this.startGroupCheck();

    this.loadGroupsForUser();

    this.initForm();
    this.loadUser();
    this.loadContacts();
    this.userId = this.authService.getId()
      ? parseInt(this.authService.getId()!, 10)
      : null;

    this.fetchContacts();
    this.notificationSound = new Audio(
      "assets/messagetone.mp3"
    ); // Adjust the path as needed
    this. markMessagesAsReadOnOpen()
    this.organizeEmojiRows();
    this.initializeBlockedStatuses();

    if (this.userId !== null) {
      // Reset the unread count when entering the chat
      this.notificationService.resetUnreadCount(this.userId);
    }

  }

  ngOnDestroy() {
    if (this.messagePollingSubscription) {
      this.messagePollingSubscription.unsubscribe();
    }
    if (this.groupCheckSubscription) {
      this.groupCheckSubscription.unsubscribe();
    }
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
    this.notificationService.getUnreadCount(this.userId).subscribe();
    if (this.userId !== null) {
      // Refresh the unread count when leaving the chat
      this.notificationService.refreshUnreadCount(this.userId);
    }
    this.setUserOffline();
    if (this.onlineStatusInterval) {
      clearInterval(this.onlineStatusInterval);
    }

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes["contacts"] && !changes["contacts"].firstChange) {
      this.contacts = this.contacts.map((contact) => ({
        ...contact,
        imageUrl:
          contact.userImage ||
          contact.imageUrl ||
          this.getDefaultAvatar(contact.name),
      }));
    }
  }

  getUserInfo() {
    this.getservice.getUserById(this.userId).subscribe((res) => { });
  }

  updateLastMessage(contact: Contact, message: Message) {
    contact.lastMessage = message.messageContent;
    contact.lastMessageTime = new Date(message.time);
  }

  getContactImageSrc(contact: Contact): string {
    if (contact.isGroup) {
      this.isGroupChat = true;
    }

    const imageDataPrefix = "data:image/jpeg;base64,";

    if (contact.profileImage && contact.profileImage.length > 100) {
      return contact.profileImage.startsWith("data:")
        ? contact.profileImage
        : imageDataPrefix + contact.profileImage;
    } else if (contact.userImage && contact.userImage.length > 100) {
      return contact.userImage.startsWith("data:")
        ? contact.userImage
        : imageDataPrefix + contact.userImage;
    } else if (contact.imageUrl && contact.imageUrl.length > 100) {
      return contact.imageUrl.startsWith("data:")
        ? contact.imageUrl
        : imageDataPrefix + contact.imageUrl;
    } else {
      return this.getDefaultAvatar(contact.name);
    }
  }

  getContactName(message: any): string {
    let contactId: number;

    if (message.sender && message.sender.id) {
      contactId = message.sender.id;
    } else if (message.senderId) {
      contactId = message.senderId;
    } else {
      return message.sender.id;
    }

    const contact = this.contacts.find((c) => c.id == contactId);


    return JSON.stringify(contactId);
  }

  initForm(): void {
    this.chatForm = this.fb.group({
      message: ["", Validators.required],
    });
  }

  getLastMessageTime(contact: any): string {
    const lastSentMessage = contact.lastSentMessage;
    const lastReceivedMessage = contact.lastReceivedMessage;

    if (lastSentMessage && lastSentMessage.time) {
      return `Sent ${this.formatMessageTime(lastSentMessage.time)}`;
    } else if (lastReceivedMessage && lastReceivedMessage.time) {
      return `Received ${this.formatMessageTime(lastReceivedMessage.time)}`;
    }

    return "";
  }
  formatMessageTime(time: Date): string {
    const now = new Date();
    const messageTime = new Date(time);
    const diffInMilliseconds = now.getTime() - messageTime.getTime();
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
  
    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24 && messageTime.getDate() == now.getDate()) {
      return messageTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInDays == 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays === 0 ? 1 : diffInDays} day${diffInDays === 0 || diffInDays > 1 ? "s" : ""} ago`;
    } else {
      return messageTime.toLocaleDateString();
    }
  }

  createNewConversation() {
    const selectedContacts = this.contacts.filter(
      (contact) => contact.selected
    );

    if (selectedContacts.length == 0) {
      alert("Please select at least one contact");
      return;
    }

    if (this.isCreatingGroupChat && !this.newGroupName.trim()) {
      alert("Please enter a group name");
      return;
    }

    const newChat: Chat = {
      id: Date.now().toString(),
      name: this.isCreatingGroupChat
        ? this.newGroupName
        : selectedContacts[0].name,
      isGroup: this.isCreatingGroupChat,
      members: selectedContacts,
      messages: [],
    };

    this.chats.unshift(newChat);
    this.selectedChat = newChat;
    this.closeNewConversationModal();
  }
  toggleGroupChatCreation() {
    this.isCreatingGroupChat = !this.isCreatingGroupChat;
  }
  closeNewConversationModal() {
    this.showNewConversationModal = false;
    this.newGroupName = "";
    this.contacts.forEach((contact) => (contact.selected = false));
  }

  loadUser(): void {
    this.currentUser.name = this.authService.getName();
    this.currentUser.id = this.authService.getId();
  }
  loadUserGroups() {
    if (this.userId) {
      this.chatService.getUserGroups(this.userId).subscribe(
        (groups) => {
          groups.forEach((group) => {
            const existingGroup = this.contacts.find(
              (c) => c.id == group.id && c.isGroup
            );
            if (!existingGroup) {
              const newGroupContact: Contact = {
                id: group.id,
                name: group.name,
                isGroup: true,
                newMemberName: "",
                messages: [],
                imageUrl: this.getDefaultAvatar(group.name), // You might want to create a method for group avatars
                userImage: "",
                profileImage: "",
                selected: false,
                defaultImage: "assets/default-group-avatar.png", // Create a default group avatar image
                lastMessageTime: undefined,
                peerId: group.id,
                online: false, // Groups are not "online"
                followerCount: 0, // Not applicable for groups
                followingCount: 0, // Not applicable for groups
                email: "", // Not applicable for groups
                role: "", // You might want to add a 'group' role
                userDescription: group.description || "", // Add description to your GroupMessages interface if not present
                isFollower: false, // Not applicable for groups
                isFollowing: false, // Not applicable for groups
                hasNewMessage: false,
                blocked: false,
                lastMessage: "",
                lastseen: new Date(0),
                unreadMessageCount: 0,
              };
              this.contacts.unshift(newGroupContact);
            }
          });
          this.cdr.detectChanges();
        },
        (error) => console.error("Error loading user groups:", error)
      );
    }
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;
  }

  processMessages(messages: any[]): Message[] {
    return messages.map((message) => ({
      ...message,
      sent: message.senderId === this.senderId,
      time: new Date(message.time || message.createdAt),
      temporary: false,
    }));
  }

  startMessagePolling(): void {
    if (this.messagePollingSubscription) {
      this.messagePollingSubscription.unsubscribe();
    }

    this.messagePollingSubscription = interval(500000)
      .pipe(
        switchMap(() => {
          return forkJoin(
            this.contacts.map((contact) => {
              if (!contact.isGroup) {
                return this.chatService.getConversation(
                  this.userId,
                  contact.id
                );
              } else {
                return this.chatService.getGroupMessages(contact.id);
              }
            })
          );
        })
      )
      .subscribe((conversationsArray) => {
        conversationsArray.forEach((messages, index) => {
          const contact = this.contacts[index];
          const processedMessages = this.processMessages(messages);
          if (contact.isGroup) {
            this.handleNewGroupMessages(processedMessages, contact.id);
          } else {
            this.handleNewMessages(processedMessages, contact.id);
          }
        });
      });
  }

  handleNewGroupMessages(newMessages: Message[], groupId: number): void {
    const group = this.contacts.find((c) => c.id === groupId && c.isGroup);
    if (!group) return;

    let shouldScroll = false;
    let newMessageReceived = false;

    newMessages.forEach((message) => {
      const isSent = message.senderId === this.userId;

      if (this.selectedContact && this.selectedContact.id === groupId) {
        if (!this.messages.some((m) => m.id === message.id)) {
          this.messages.push(message);
          if (isSent) {
            shouldScroll = true;
          }
        }
      } else {
        if (!isSent) {
          this.unreadMessages = {
            ...this.unreadMessages,
            [groupId]: (this.unreadMessages?.[groupId] ?? 0) + 1,
          };
        }
      }

      if (
        !group.lastMessageTime ||
        new Date(message.createdAt) > new Date(group.lastMessageTime)
      ) {
        this.updateContactLastMessage(
          groupId,
          message.messageContent,
          new Date(message.createdAt),
          isSent
        );
      }
    });

    if (shouldScroll) {
      this.scrollToBottom();
    }

    if (newMessageReceived&& !this.showAlert) {
      group.hasNewMessage = true;
      this.showNewMessageAlert(
        group.name,
        newMessages[newMessages.length - 1].messageContent,

      );
    }

    this.cdr.detectChanges();
  }

  handleNewMessages(newMessages: Message[], contactId: number): void {
    const contact = this.contacts.find((c) => c.id === contactId);
    if (!contact) return;

    let shouldScroll = false;
    let newMessageReceived = false;

    const readMessageIds = this.getReadMessageIds(contactId);

    newMessages.forEach((message) => {
      const isSent = message.senderId === this.senderId;
      const isNew = !readMessageIds.includes(message.id);

      if (this.selectedContact && this.selectedContact.id === contactId) {
        if (!this.messages.some((m) => m.id === message.id)) {
          this.messages.push(message);
          if (isSent) {
            shouldScroll = true;
          }
        }

        // Mark message as read if it's the current contact
        if (isNew) {
          this.storeReadMessageIds(contactId, [message.id]);
        }
      } else if (!isSent && isNew) {
        this.unreadMessages = {
          ...this.unreadMessages,
          [contactId]: (this.unreadMessages?.[contactId] ?? 0) + 1,
        };
        newMessageReceived = true;
      }

      if (!contact.lastMessageTime || new Date(message.createdAt) > new Date(contact.lastMessageTime)) {
        this.updateContactLastMessage(contactId, message.messageContent, new Date(message.createdAt), isSent);
      }
    });

    if (shouldScroll) {
      this.scrollToBottom();
    }

    if (newMessageReceived&& !this.showAlert) {
      contact.hasNewMessage = true;
      this.showNewMessageAlert(contact.name, newMessages[newMessages.length - 1].messageContent);
      this.updateNewMessageCount(); // Add this line

    }

    this.cdr.detectChanges();
  }
  initializeNewMessageAlert() {
    // Create an audio element for the notification sound
    this.notificationSound = new Audio(
      "assets/messagetone.mp3"
    );
  }

  updateContactLastMessage(
    contactId: number,
    lastMessage: string,
    lastMessageTime: Date | string,
    isSent: boolean
  ): void {
    const contactIndex = this.contacts.findIndex((c) => c.id === contactId);

    if (contactIndex !== -1) {
      const updatedContact = this.contacts[contactIndex];
      updatedContact.lastMessage = lastMessage;
      updatedContact.lastMessageTime = this.ensureValidDate(lastMessageTime);
      updatedContact.lastMessageSent = isSent;

      const readMessageIds = this.getReadMessageIds(contactId);
      const isNewMessage = updatedContact.messages && updatedContact.messages.length > 0 &&
        !readMessageIds.includes(updatedContact.messages[updatedContact.messages.length - 1].id);

      if (!isSent && isNewMessage) {
        updatedContact.hasNewMessage = true;
      }

      // Remove the contact from its current position
      this.contacts.splice(contactIndex, 1);
      // Add the contact to the top of the list
      this.contacts.unshift(updatedContact);

      // Persist changes to local storage
      localStorage.setItem("contacts", JSON.stringify(this.contacts));
      this.cdr.detectChanges();
    }
  }

  private ensureValidDate(date: Date | string | undefined): Date {
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date;
    }
    if (typeof date === "string") {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
    return new Date(); // Return current date if input is invalid
  }
  handleNewGroupMessage(groupId: number, message: Message): void {
    this.updateContactLastMessage(
      groupId,
      message.messageContent,
      new Date(message.createdAt),
      message.senderId === this.userId
    );
  }
  userImage: any;
  fetchContacts(): void {
    this.isLoading = true;
    const userId = this.authService.getId();
    if (userId) {
      this.chatService.getContacts(parseInt(userId)).subscribe(
        (fetchedContacts: Contact[]) => {
          // Merge fetched contacts with existing contacts
          this.contacts = this.mergeContacts(this.contacts, fetchedContacts);

          // Sort contacts by last message time
          this.contacts.sort((a, b) => {
            const timeA = a.lastMessageTime
              ? new Date(a.lastMessageTime).getTime()
              : 0;
            const timeB = b.lastMessageTime
              ? new Date(b.lastMessageTime).getTime()
              : 0;
            return timeB - timeA;
          });

          this.isLoading = false;
          this.saveContactsToLocalStorage();
          this.selectFirstContact();
          this.isLoaded=false
          console.log("I am here")

          // Trigger change detection
          this.cdr.detectChanges();
        },
        (error) => {
          console.error("Error fetching contacts:", error);
          this.isLoading = false;
        }
      );
    } else {
      console.error("Current user ID is null");
      this.isLoading = false;
    }
  }
  saveContactsToLocalStorage(): void {
    localStorage.setItem("contacts", JSON.stringify(this.contacts));
  }
  mergeContacts(
    storedContacts: Contact[],
    fetchedContacts: Contact[]
  ): Contact[] {
    const mergedContacts = [...fetchedContacts];
    storedContacts.forEach((storedContact) => {
      const index = mergedContacts.findIndex((c) => c.id === storedContact.id);
      if (index !== -1) {
        // Preserve last message and time from stored contact
        mergedContacts[index].lastMessage =
          storedContact.lastMessage || mergedContacts[index].lastMessage;
        mergedContacts[index].lastMessageTime =
          storedContact.lastMessageTime ||
          mergedContacts[index].lastMessageTime;
      } else {
        // Add stored contact if it's not in fetched contacts
        mergedContacts.push(storedContact);
      }
    });
    return mergedContacts;
  }
  loadContactsFromLocalStorage(): void {
    const storedContacts = localStorage.getItem("contacts");
    if (storedContacts) {
      this.contacts = JSON.parse(storedContacts);
      // Convert string dates back to Date objects
      this.contacts.forEach((contact) => {
        if (contact.lastMessageTime) {
          contact.lastMessageTime = new Date(contact.lastMessageTime);
        }
      });
      // this.selectedContact = storedContacts[0];
    }
  }

  sanitizeImage(imageData: string): SafeUrl {
    let sanitizedUrl: SafeUrl;
    if (imageData.startsWith("data:image")) {
      sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(imageData);
    } else {
      sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(
        `data:image/jpeg;base64,${imageData}`
      );
    }
    return sanitizedUrl;
  }
  onImageError(event: Event, contact: Contact): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.getDefaultAvatar(contact.name);
    imgElement.onerror = null; // Prevent infinite loop
  }

  getDefaultAvatar(name: string): string {
    if (this.defaultAvatars[name]) {
      return this.defaultAvatars[name];
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 200;
    canvas.height = 200;

    if (context) {
      context.fillStyle = this.stringToColor(name);
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = "bold 100px Arial";
      context.fillStyle = "#FFFFFF";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(
        name.charAt(0).toUpperCase(),
        canvas.width / 2,
        canvas.height / 2
      );
    }

    const dataUrl = canvas.toDataURL("image/png");
    this.defaultAvatars[name] = dataUrl;
    return dataUrl;
  }

  stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  }

  updateContactOnlineStatus(
    statuses: { userId: string; online: boolean; lastSeen: Date }[]
  ): void {
    for (const status of statuses) {
      const contact = this.contacts.find((c) => c.id === status.userId);
      if (contact) {
      }
    }
  }

  get filteredContacts(): Contact[] {
    if (!this.contacts) {
      return [];
    }

    return this.contacts
      .filter(
        (contact) =>
          contact.name &&
          contact.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        // Ensure both a and b have lastMessageTime defined before comparison
        if (a.lastMessageTime && b.lastMessageTime) {
          return (
            new Date(b.lastMessageTime).getTime() -
            new Date(a.lastMessageTime).getTime()
          );
        } else if (a.lastMessageTime) {
          return -1; // a has lastMessageTime but b doesn't, a should come first
        } else if (b.lastMessageTime) {
          return 1; // b has lastMessageTime but a doesn't, b should come first
        } else {
          return 0; // Both don't have lastMessageTime or are null/undefined, no preference
        }
      });
  }
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  showNewMessageAlert(contactName: string, messageContent: string): void {
    if (!this.showAlert) {
      this.showAlert = true;
      
      // Show snackbar notification
      const snackBarRef = this.snackBar.open(
        `New message from ${contactName}: ${messageContent}`,
        "Close",
        {
          duration: 5000,
          panelClass: ["custom-snackbar"],
          verticalPosition:'top',
          horizontalPosition:'center',}
      );
  
      // Update UI to show new message indicator
      this.updateNewMessageIndicator(contactName);
  
      // Set a timeout to hide the alert
      setTimeout(() => {
        this.showAlert = false;
        snackBarRef.dismiss();
      }, 5000);
    }
  }
  updateNewMessageIndicator(contactName: string): void {
    const contactIndex = this.contacts.findIndex((c) => c.name == contactName);
    if (contactIndex !== -1) {
      this.contacts[contactIndex].hasNewMessage = true;
      // Move this contact to the top of the list
      const [updatedContact] = this.contacts.splice(contactIndex, 1);
      this.contacts.unshift(updatedContact);
      this.cdr.detectChanges();
    }
  }

  selectContact(contact: Contact): void {
    this.selectedContact = contact;
    this.senderId = this.userId;
    this.receiverId = contact.id;
    this.messages = [];

    if (contact.isGroup) {
      this.loadGroupMessages(contact.id);
      this.loadGroupMembers(contact.id);
    } else {
      this.fetchMessages();
    }

    this.chatService.isblockUser(this.userId, contact.id).subscribe({
      next: (response) => {
        if (response == true) {
          this.updateBlockStatus(contact.id, true);
          this.cdr.detectChanges();
        } else {
          this.updateBlockStatus(contact.id, false);
        }
      },
      error: (error) => {
        console.error("Error is user Blocked:", error);
        if (error.status == 404) {
          this.snackBar.open(
            "Block relationship not found. The user might already be unblocked.",
            "Close",
            { duration: 3000,
              verticalPosition:'top',
              horizontalPosition:'center'}
                  );
          // Update the UI to reflect the unblocked state
          this.updateBlockStatus(contact.id, false);
        } else {
          this.snackBar.open(
            "Failed to unblock user. Please try again.",
            "Close",
            { duration: 3000,
              verticalPosition:'top',
              horizontalPosition:'center'
             }
          );
        }
      },
    });

    // Clear new message indicator
    contact.hasNewMessage = false;
    this.updateNewMessageCount(); // Add this line

    this. markMessagesAsReadOnOpen()
    this.startMessagePolling();
  }

  loadMessages() {
    this.startMessagePolling(); 

    if (this.senderId !== null && this.receiverId !== null) {
      // Load messages from the service with both senderId and receiverId
      this.chatService
        .getConversation(this.senderId, this.receiverId)
        .subscribe((messages) => {
          this.messages = messages;
       this. markMessagesAsReadOnOpen() 
        });
    } else {
      console.error("Sender ID or Receiver ID is null");
    }
  }
  

  markMessagesAsReadOnOpen() {
    const unreadMessages = this.messages.filter(m =>
      m.receiverId == this.userId &&
      !m.read
    );

    unreadMessages.forEach(message => {
      this.chatService.markAsRead(message.id).subscribe(() => {
        message.read = true;
      });
    });
  }
  openNewConversationModal() {
    this.showNewConversationModal = true;
    this.isCreatingGroupChat = false;
    this.newGroupName = "";
    this.contacts.forEach((contact) => (contact.selected = false));
  }

  selectGroup(group: GroupMessages) {
    this.selectedGroup = group;
    this.selectedContact = null;
    this.receiverId = group.id; // Set receiverId to group id
    this.isGroupChat = true;
    this.loadGroupMessages(group.id);
    this.startGroupMessagePolling(group.id);
  }
  startGroupMessagePolling(groupId: number): void {
    if (this.messagePollingSubscription) {
      this.messagePollingSubscription.unsubscribe();
    }

    this.messagePollingSubscription = interval(5000)
      .pipe(switchMap(() => this.chatService.getGroupMessages(groupId)))
      .subscribe(
        (messages) => {
          this.messages = messages;
          this.scrollToBottom();
          this.cdr.detectChanges();
        },
        (error) => console.error("Error polling group messages:", error)
      );
  }

  loadGroupMessages(groupId: number) {
    this.chatService.getGroupMessages(groupId).subscribe(
      (messages) => {
        this.messages = messages;
        this.scrollToBottom();
      },
      (error) => {
        console.error("Error loading group messages:", error);
      }
    );
  }

  openNewGroupModal() {
    this.showNewGroupModal = true;
    this.newGroupName = "";
    this.selectedGroupMembers = [];
  }
  createNewGroup() {
    if (this.newGroupName && this.selectedGroupMembers.length > 0) {
      const adminId = this.userId; // Assuming this.userId is the current user's ID
      const memberIds = this.selectedGroupMembers.map((member) => member.id);

      this.chatService
        .createGroup(this.newGroupName, adminId, memberIds)
        .subscribe(
          (group) => {
            this.groups.push(group);
            this.newGroupName = "";
            this.selectedGroupMembers = [];
            this.closeNewConversationModal();
          },
          (error) => console.error("Error creating group:", error)
        );
    }
  }

  addUserToGroup(memberName: string): void {
    if (this.selectedContact && this.selectedContact.isGroup) {
      // Convert `memberName` to `userId` if necessary
      const userId = parseInt(memberName, 10);

      // Check if the conversion was successful
      if (isNaN(userId)) {
        this.snackBar.open("Invalid user ID", "Close", { duration: 3000, verticalPosition:'top',horizontalPosition:'center' });
        return;
      }

      // Ensure `this.selectedContact.id` is a number
      const groupId = Number(this.selectedContact.id);

      this.chatService.addUserToGroup(groupId, userId).subscribe(
        (updatedGroup) => {
          this.snackBar.open("User added to group successfully", "Close", {
            duration: 3000, 
            verticalPosition:'top',
            horizontalPosition:'center'
          });
          this.loadGroupMembers(groupId);
        },
        (error) => {
          this.snackBar.open("Failed to add user to group", "Close", {
            duration: 3000,
            verticalPosition:'top',
            horizontalPosition:'center'
          });
          console.error("Error adding user to group:", error);
        }
      );
      this.showAddMembersModal = false;
    }
  }

  removeUserFromGroup(userId: number) {
    if (this.selectedContact && this.selectedContact.isGroup) {
      this.chatService
        .removeUserFromGroup(this.selectedContact.id, userId)
        .subscribe(
          (updatedGroup) => {
            this.snackBar.open(
              "User removed from group successfully",
              "Close",
              { duration: 3000,
                verticalPosition:'top',
                horizontalPosition:'center'
              }
            );
            this.loadGroupMembers(this.selectedContact.id);
          },
          (error) => {
            this.snackBar.open("Failed to remove user from group", "Close", {
              duration: 3000,
              verticalPosition:'top',
              horizontalPosition:'center'
            });
            console.error("Error removing user from group:", error);
          }
        );
        
    }

    // this.location.go(this.location.path());
    // window.location.reload();
  }

  leaveGroup(userid: number) {
    this.chatService
      .removeUserFromGroup(this.selectedContact.id, userid)
      .subscribe(
        () => {
          this.removeGroupFromContacts(this.selectedContact.id);
          this.snackBar.open("You have left the group", "Close", {
            duration: 3000,
            verticalPosition:'top',
            horizontalPosition:'center'
          });

          if (
            this.selectedContact &&
            this.selectedContact.id == this.selectedContact.id
          ) {
            this.selectedContact = null;
            this.messages = [];
          }
        },
        (error) => {
          console.error("Error leaving group:", error);
          this.snackBar.open(
            "Failed to leave the group. Please try again.",
            "Close",
            { duration: 3000,
              verticalPosition:'top',
              horizontalPosition:'center'
            }
          );
        }
      );
  }

  removeGroupFromContacts(groupId: number) {
    this.contacts = this.contacts.filter(
      (contact) => !(contact.isGroup && contact.id == groupId)
    );
    localStorage.setItem("contacts", JSON.stringify(this.contacts));
    this.cdr.detectChanges();
  }

  fetchMessages(): void {
    if (this.senderId !== null && this.receiverId !== null) {
      this.chatService.getConversation(this.senderId, this.receiverId).subscribe(
        (data) => {
          this.messages = data.sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          // Mark all fetched messages as read
          const messageIds = this.messages.map(m => m.id);
          this.storeReadMessageIds(this.receiverId!, messageIds);

          this.scrollToBottom();
          this.cdr.detectChanges();
          this.messages.forEach(message => {
            if (!message.read) {
              this.markMessageAsRead(message.id);
            }
          });
        },
        (error) => {
          console.error("Error fetching messages:", error);
        }
      );
    } else {
      console.error("Sender ID or Receiver ID is null");
    }
  }
  storeReadMessageIds(contactId: number, messageIds: number[]) {
    const key = `readMessages_${this.userId}_${contactId}`;
    const existingIds = this.getReadMessageIds(contactId);
    const newIds = [...new Set([...existingIds, ...messageIds])];
    localStorage.setItem(key, JSON.stringify(newIds));
  }

  getReadMessageIds(contactId: number): number[] {
    const key = `readMessages_${this.userId}_${contactId}`;
    const storedIds = localStorage.getItem(key);
    return storedIds ? JSON.parse(storedIds) : [];
  }
  removeDuplicates(messages: Message[]): Message[] {
    const seen = new Set<number>();
    return messages.filter((message) => {
      if (seen.has(message.id)) {
        return false;
      }
      seen.add(message.id);
      return true;
    });
  }

  trackByMessageId(index: number, message: Message): number {
    return message.id; // Ensure each message has a unique `id`
  }

  sendMessage(): void {
    if (!this.selectedContact) {
      console.error("No contact selected");
      return;
    }

    const contactId = this.selectedContact.id;
    const message = this.messageInputs[contactId];

    if (!message?.trim() && !this.selectedFile) {
      return;
    }

    const isGroupMessage = this.selectedContact.isGroup;
    const receiverId = isGroupMessage ? contactId : this.receiverId;

    if (!this.senderId || !receiverId) {
      console.error("Sender ID or Receiver ID is null");
      return;
    }

    const formData = new FormData();
    formData.append("senderId", this.senderId.toString());
    formData.append("receiverId", receiverId.toString());
    formData.append("content", message?.trim() || "");

    if (this.selectedFile) {
      formData.append("file", this.selectedFile, this.selectedFile.name);
    }

    const tempMessage: Message = {
      id: Date.now(),
      messageContent: message?.trim() ||
        (this.selectedFile
          ? `File sent: ${this.selectedFile.name}`
          : "Empty message"),
      time: new Date(),
      senderId: this.senderId,
      receiverId: receiverId,
      fileUrl: "",
      sent: true,
      fileType: this.selectedFile
        ? this.getFileType(this.selectedFile.name)
        : "other",
      temporary: true,
      createdAt: new Date(),
      sender: "",
      read: false,
      showToolbar: false,
      reactions: undefined,
      myreaction: ""
    };

    this.messages.push(tempMessage);
    this.scrollToBottom();

    let sendMessageObservable: Observable<Message>;

    if (isGroupMessage) {
      sendMessageObservable = this.chatService.sendGroupMessage(
        receiverId,
        this.senderId,
        message?.trim() || "",
        this.selectedFile!
      );
    } else {
      sendMessageObservable = this.chatService.sendMessage(formData);
    }

    sendMessageObservable.subscribe({
      next: (response: Message) => {
        this.snackBar.open("Message sent successfully", "Close", {
          duration: 3000,
          verticalPosition:'top',
          horizontalPosition:'center'
        });

        const index = this.messages.findIndex((m) => m.id == tempMessage.id);
        if (index !== -1) {
          this.messages[index] = { ...response, sent: true, temporary: false };
        } else {
          this.messages.push({ ...response, sent: true, temporary: false });
        }

        if (isGroupMessage) {
          this.updateGroupLastMessage(
            receiverId,
            response.messageContent,
            new Date(response.time)
          );
        } else {
          this.updateContactLastMessage(
            receiverId,
            response.messageContent,
            new Date(response.time),
            true
          );
        }
        this.messageInput.nativeElement.style.height = 'auto';
        const textarea = this.messageInput.nativeElement;
        textarea.value = '';
        this.messageInputs[this.selectedContact.id] = '';
        this.adjustTextareaHeight();
         
        this.clearForm(contactId);
        this.scrollToBottom();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error sending message:", error);
        this.snackBar.open("Error sending message", "Close", {
          duration: 3000,
          verticalPosition:'top',
          horizontalPosition:'center'
        });

        const index = this.messages.findIndex((m) => m.id == tempMessage.id);
        if (index !== -1) {
          this.messages[index].failed = true;
        }
        this.cdr.detectChanges();
      },
    });
  }

  private clearForm(contactId: string): void {
    this.messageInputs[contactId] = "";
    this.selectedFile = null;
    this.selectedFileUrl = null;
    this.chatForm.reset();

    // Clear the file input
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }


  handleSentMessage(message: Message) {
    this.messages.push(message);
    this.scrollToBottom();
    if (this.selectedContact.isGroup) {
      this.updateGroupLastMessage(
        this.selectedContact.id,
        message.messageContent,
        new Date(message.createdAt)
      );
    } else {
      this.updateContactLastMessage(
        this.selectedContact.id,
        message.messageContent,
        new Date(message.createdAt),
        true
      );
    }
  }

  updateGroupLastMessage(
    groupId: number,
    lastMessage: string,
    lastMessageTime: Date | string
  ): void {
    const groupIndex = this.contacts.findIndex(
      (c) => c.id == groupId && c.isGroup
    );
    if (groupIndex !== -1) {
      const updatedGroup = this.contacts[groupIndex];
      updatedGroup.lastMessage = lastMessage;
      updatedGroup.lastMessageTime = this.ensureValidDate(lastMessageTime);

      // Move the group to the top of the list
      this.contacts.splice(groupIndex, 1);
      this.contacts.unshift(updatedGroup);

      // Persist changes to local storage
      localStorage.setItem("contacts", JSON.stringify(this.contacts));
      this.cdr.detectChanges();
    }
  }
  getFileType(fileUrl: string): "image" | "video" | "pdf" | "other" {
    if (fileUrl.match(/\.(jpeg|jpg|gif|png)$/i)) return "image";
    if (fileUrl.match(/\.(mp4|webm|ogg)$/i)) return "video";
    if (fileUrl.match(/\.(pdf)$/i)) return "pdf";
    return "other";
  }
  downloadFile(fileUrl: string, fileName?: string) {
    if (!fileName) {
      fileName = fileUrl.split("/").pop() || "download";
    }
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  openFile(fileUrl: string): void {
    window.open(fileUrl, "_blank");
  }
  isImageType(type: string | undefined): boolean {
    return !!type && type.startsWith("image/");
  }

  isVideoType(type: string | undefined): boolean {
    return !!type && type.startsWith("video/");
  }

  isPdfType(type: string | undefined): boolean {
    return type == "application/pdf";
  }

  isOtherFileType(type: string | undefined): boolean {
    return (
      !this.isImageType(type) &&
      !this.isVideoType(type) &&
      !this.isPdfType(type)
    );
  }

  getFileName(fileUrl: string): string {
    return fileUrl.split("/").pop()!;
  }

  private loadContacts(): void {
    const storedContacts = localStorage.getItem("contacts");
    if (storedContacts) {
      this.contacts = JSON.parse(storedContacts);
      this.contacts.forEach((contact) => {
        if (contact.lastMessageTime) {
          contact.lastMessageTime = new Date(contact.lastMessageTime);
        }
      });
    }

    const userId = this.authService.getId();
    if (userId) {
      this.chatService.getContacts(parseInt(userId)).subscribe(
        (serverContacts: Contact[]) => {
          this.contacts = serverContacts.map((serverContact) => {
            const localContact = this.contacts.find(
              (c) => c.id == serverContact.id
            );

            // Find the last message for this contact
            let lastMessage: Message | undefined;
            if (
              localContact &&
              localContact.messages &&
              localContact.messages.length > 0
            ) {
              lastMessage = localContact.messages.reduce((latest, current) =>
                new Date(current.createdAt) > new Date(latest.createdAt)
                  ? current
                  : latest
              );
              
            }


            return {
              ...serverContact,
              lastMessage:
                lastMessage?.messageContent || localContact?.lastMessage || "",
              lastMessageTime: lastMessage
                ? new Date(lastMessage.createdAt)
                : localContact?.lastMessageTime
                  ? new Date(localContact.lastMessageTime)
                  : undefined,
              lastMessageSent: lastMessage
                ? lastMessage.senderId == parseInt(userId)
                : false,
              messages: localContact?.messages || [],
              imageUrl:
                serverContact.userImage ||
                serverContact.imageUrl ||
                serverContact.defaultImage,
              blocked: localContact?.blocked || false, // Preserve blocked status

            };
          });

          
          localStorage.setItem("contacts", JSON.stringify(this.contacts));
          this.cdr.detectChanges();
        },
        (error) => console.error("Error fetching contacts:", error)
      );
    } else {
      console.error("User ID not available");
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = this.messageContainer.nativeElement;
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth",
      });
    }, 0);
  }

  chunkArray(array: any[], size: number): any[] {
    return array.reduce((chunks, item, index) => {
      const chunkIndex = Math.floor(index / size);
      if (!chunks[chunkIndex]) {
        chunks[chunkIndex] = []; // start a new chunk
      }
      chunks[chunkIndex].push(item);
      return chunks;
    }, []);
  }
  clearMessageInput() {
    this.newMessage = "";
    this.selectedFile = null;
    this.selectedFileUrl = null;
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  getTruncatedMessage(message: string): string {
    const maxLength = 15;
    if (message.length > maxLength) {
      return message.slice(0, maxLength) + "...";
    }
    return message;
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(emoji: string) {
    if (this.selectedContact && this.selectedContact.id) {
      this.messageInputs[this.selectedContact.id] = (this.messageInputs[this.selectedContact.id] || '') + emoji;
    }
    this.showEmojiPicker = false;
  }
  

  organizeEmojiRows() {
    const emojisPerRow = 4;
    for (let i = 0; i < this.emojiList.length; i += emojisPerRow) {
      this.emojiRows.push(this.emojiList.slice(i, i + emojisPerRow));
    }
  }

  viewFullMessage(contact: Contact) {
    this.messageExpanded = !this.messageExpanded;
    if (this.messageExpanded) {
      contact.lastMessage =
        contact.messages?.map((msg) => msg.messageContent).join(" ") ?? "";
    } else {
      contact.lastMessage = this.getTruncatedMessage(
        contact.messages?.map((msg) => msg.messageContent).join(" ") ?? ""
      );
    }
  }

  formatDate(date: Date): string {
    return `${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }

  toggleTheme(): void { }

  scrollToTop(): void {
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop = 0;
      }
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  toggleChattoGallery() {
    this.showChat = true;
    this.showFileGallery = false;
  }

  toggleGallaryToChat() {
    this.showChat = false;
    this.showFileGallery = true;
  }

  toggleUserProfile() {
    this.showUserProfile = !this.showUserProfile;
  }

  cancelSelectedFile() {
    this.selectedFileUrl = null;
    // If you're storing the file object somewhere, clear that as well
    this.selectedFile = null;
  }
  isImageFile(): boolean {
    if (this.selectedFile) {
      return this.selectedFile?.type.startsWith("image/");
    }
    return false;
  }

  userIdToblock: any;

  userIdToUnblock: any;
  blockContact(userIdToBlock: number): void {
    if (this.userId !== null) {
      this.chatService.blockUser(this.userId, userIdToBlock).subscribe({
        next: (response) => {
          this.snackBar.open("User blocked successfully", "Close", {
            duration: 3000,
            verticalPosition:'top',
            horizontalPosition:'center'
          });
          this.updateBlockStatus(userIdToBlock, true);
          this.showDropdown = false; // Close the dropdown after action
          localStorage.setItem('contacts', JSON.stringify(this.contacts)); // Persist to local storage

          this.cdr.detectChanges(); // Force view update
        },
        error: (error) => {
          console.error("Error blocking user:", error);
          this.snackBar.open(
            "Failed to block user. Please try again.",
            "Close",
            { duration: 3000,
              verticalPosition:'top',
              horizontalPosition:'center'
            }
          );
        },
      });
    }
  }


  unblockContact(userIdToUnblock: number): void {
    if (this.userId !== null) {
      this.chatService.unblockUser(this.userId, userIdToUnblock).subscribe({
        next: (response) => {
          if (response == "User unblocked successfully") {
            this.snackBar.open("User unblocked successfully", "Close", {
              duration: 3000,
              verticalPosition:'top',
              horizontalPosition:'center'
            });

            this.updateBlockStatus(userIdToUnblock, false);
            this.showDropdown = false;
            this.cdr.detectChanges();
          } else {
            console.error("Unexpected response from server:", response);
            this.snackBar.open(
              "Failed to unblock user. Please try again.",
              "Close",
              { duration: 3000,
                verticalPosition:'top',
                horizontalPosition:'center'
              }
            );
          }
        },
        error: (error) => {
          console.error("Error unblocking user:", error);
          if (error.status == 404) {
            this.snackBar.open(
              "Block relationship not found. The user might already be unblocked.",
              "Close",
              { duration: 3000,
                verticalPosition:'top',
                horizontalPosition:'center'
              }
            );
            // Update the UI to reflect the unblocked state
            this.updateBlockStatus(userIdToUnblock, false);
          } else {
            this.snackBar.open(
              "Failed to unblock user. Please try again.",
              "Close",
              { duration: 3000,
                verticalPosition:'top',
                horizontalPosition:'center'
              }
            );
          }
        },
      });
    }
  }
  initializeBlockedStatuses() {
    const storedContacts = localStorage.getItem("contacts");
    if (storedContacts) {
      const localContacts: Contact[] = JSON.parse(storedContacts);
      this.contacts.forEach(contact => {
        const localContact = localContacts.find(c => c.id == contact.id);
        if (localContact) {
          contact.blocked = localContact.blocked || false;
        }
      });
      this.cdr.detectChanges();
    }
  }
  updateBlockStatus(contactId: number, blocked: boolean) {
    const contact = this.contacts.find((c) => c.id == contactId);
    if (contact) {
      contact.blocked = blocked;
      if (this.selectedContact && this.selectedContact.id == contactId) {
        this.selectedContact.blocked = blocked;
      }
      // Update in local storage
      localStorage.setItem('contacts', JSON.stringify(this.contacts));
      this.cdr.detectChanges();
    }
  }
  openAddMembersModal() {
    this.showAddMembersModal = true;
    this.searchTerm = "";
    this.resetContactSelection();
    this.filteredContacts3;
  }
  resetContactSelection() {
    throw new Error("Method not implemented.");
  }

  penAddMembersModal() {
    this.showAddMembersModal = true;
    this.searchTermforgroup = "";
    this.filteredContacts2;
  }

  closeAddMembersModal() {
    this.showAddMembersModal = false;
  }

  get filteredContacts2(): Contact[] {
    if (!this.contacts) {
      return [];
    }
    return this.contacts
      .filter(
        (contact) =>
          contact.name &&
          contact.name
            .toLowerCase()
            .includes(this.searchTermforgroup.toLowerCase()) &&
          !this.groupMembers.some((member) => member.id == contact.id) &&
          !contact.isGroup // Add this line to exclude groups
      )
      .sort((a, b) => {
        if (a.lastMessageTime && b.lastMessageTime) {
          return (
            new Date(b.lastMessageTime).getTime() -
            new Date(a.lastMessageTime).getTime()
          );
        } else if (a.lastMessageTime) {
          return -1;
        } else if (b.lastMessageTime) {
          return 1;
        } else {
          return 0;
        }
      });
  }
  createGroupChat() {
    this.selectedGroupMembers = this.contacts.filter(
      (contact) => contact.selected
    );

    if (!this.newGroupName.trim()) {
      this.snackBar.open("Group name is required", "Close", { duration: 3000,verticalPosition:'top',horizontalPosition:'center'});
      return;
    }

    if (this.selectedGroupMembers.length == 0) {
      this.snackBar.open(
        "Please select at least one member for the group",
        "Close",
        { duration: 3000,
          verticalPosition:'top',
          horizontalPosition:'center'}
      );
      return;
    }

    const adminId = this.userId;
    const memberIds = this.selectedGroupMembers.map((member) => member.id);

    this.chatService
      .createGroup(this.newGroupName.trim(), adminId, memberIds)
      .subscribe(
        (group) => {
          const newGroupContact: Partial<Contact> = {
            id: group.id,
            name: group.name,
            isGroup: true,
            lastMessage: "",
            lastMessageTime: new Date(),
            selected: false,
            messages: [],
            imageUrl: this.getDefaultAvatar(group.name),
            userImage: "",
            defaultImage: "",
          };

          this.contacts.unshift(newGroupContact as Contact);

          localStorage.setItem("contacts", JSON.stringify(this.contacts));

          this.snackBar.open("Group created successfully", "Close", {
            duration: 3000,
            verticalPosition:'top',
            horizontalPosition:'center'
          });
          this.newGroupName = "";
          this.selectedGroupMembers = [];
          this.closeNewConversationModal();
          this.cdr.detectChanges();
        },
        (error) => {
          console.error("Error creating group:", error);
          this.snackBar.open(
            "Failed to create group. Please try again.",
            "Close",
            { duration: 3000,
              verticalPosition:'top',
              horizontalPosition:'center'
            }
          );
        }
      );
  }

  deleteGroup(id: number): void {
    this.chatService.deleteGroup(id).subscribe(
      () => {
        this.location.go(this.location.path());
        // window.location.reload();
      },
      (error) => {
        console.error("Error deleting group", error);
      }
    );
  }


  loadGroupsForUser(): Observable<void> {
    const userId = localStorage.getItem("id");

    if (!userId) {
      console.error("User ID is not found in local storage");
      this.snackBar.open(
        "User ID is not found. Please log in again.",
        "Close",
        { duration: 3000,
          verticalPosition:'top',
          horizontalPosition:'center'
        }
      );
      return of(undefined);
    }

    return this.chatService.getGroupsForUser(userId).pipe(
      mergeMap((groups) => {
        const groupObservables = groups.map((group) =>
          this.chatService.getGroupMessages(group.id).pipe(
            map((messages) => ({
              group,
              lastMessage: messages[messages.length - 1],
            })),
            catchError(() => of({ group, lastMessage: null }))
          )
        );
        return forkJoin(groupObservables);
      }),
      map((groupsWithLastMessage) => {
        const groupContacts = groupsWithLastMessage.map(
          ({ group, lastMessage }) =>
            this.createGroupContact(group, lastMessage)
        );

        // Filter out existing groups
        const newGroups = groupContacts.filter(
          (groupContact) =>
            !this.contacts.some(
              (contact) => contact.id == groupContact.id && contact.isGroup
            )
        );

        if (newGroups.length > 0) {
          this.contacts = [...newGroups, ...this.contacts];
          localStorage.setItem("contacts", JSON.stringify(this.contacts));
          this.cdr.detectChanges();
        }
      }),
      catchError((error) => {
        console.error("Error fetching groups for user:", error);
        this.snackBar.open(
          "Failed to load groups. Please try again.",
          "Close",
          { duration: 3000,
            verticalPosition:'top',
            horizontalPosition:'center'
          }
        );
        return of(undefined);
      })
    );
  }


  createGroupContact(group: any, lastMessage: Message | null): Contact {
    return {
      id: group.id,
      name: group.name,
      isGroup: true,
      lastMessage: lastMessage ? lastMessage.messageContent : "",
      lastMessageTime: lastMessage
        ? new Date(lastMessage.createdAt)
        : new Date(),
      selected: false,
      messages: [],
      imageUrl: this.getDefaultAvatar(group.name),
      userImage: "",
      defaultImage: "",
      hasNewMessage: false,
      blocked: false,
      newMemberName: "",
      email: "",
      role: "",
      userDescription: "",
      lastseen: new Date(),
      unreadMessageCount: 0,
    };
  }

  private groupCheckSubscription!: Subscription;

  startGroupCheck() {
    this.groupCheckSubscription = interval(1000) 
      .pipe(
        startWith(0), // Start immediately
        switchMap(() => this.loadGroupsForUser())
      )
      .subscribe();
  }

  selectFirstContact(): void {
    if (this.contacts && this.contacts.length > 0) {
      const firstNonGroupContact = this.contacts.find(contact => !contact.isGroup);
      if (firstNonGroupContact) {
        this.selectContact(firstNonGroupContact);
      }
    }
  }


  deleteMessage(message: Message): void {
    if (this.userId == undefined) {
      console.error('SenderId is undefined for message:', message);
      return;
    }

    this.chatService.deleteMessage(this.userId, message.id).subscribe(
      (response: string) => {
        this.messages = this.messages.filter(m => m.id !== message.id);
      },
      error => {
        console.error('Error deleting message', error);
      }
    );
  }

  DeleteAll() {
    if (!this.userId || !this.receiverId) {
      console.error('Sender ID or Receiver ID is missing');
      this.snackBar.open('Unable to delete chat. Missing user information.', 'Close', { duration: 3000,
        verticalPosition:'top',
        horizontalPosition:'center'
      });
      return;
    }

    this.chatService.deleteChat(this.userId, this.receiverId).subscribe({
      next: (response) => {
        this.handleSuccessfulDeletion();
      },
      error: (error) => {
        console.error('Delete error:', error);
        if (error.status == 404) {
          // If chat not found, still clear messages on frontend
          this.handleSuccessfulDeletion();
          this.snackBar.open('Some messages may not have been deleted on the server.', 'Close', { duration: 3000,verticalPosition:'top',horizontalPosition:'center'});
        } else {
          this.snackBar.open('Failed to delete chat. Please try again.', 'Close', { duration: 3000,verticalPosition:'top',horizontalPosition:'center'});
        }
      }
    });
  }

  private handleSuccessfulDeletion() {
    // Clear the messages array
    this.messages = [];

    // Update the contact's last message
    const contact = this.contacts.find(c => c.id == this.receiverId);
    if (contact) {
      contact.lastMessage = '';
      contact.lastMessageTime = undefined;
    }

    // Persist changes to local storage
    localStorage.setItem('contacts', JSON.stringify(this.contacts));

    // Clear any unread message count for this contact
    if (this.unreadMessages && this.unreadMessages[this.receiverId!]) {
      delete this.unreadMessages[this.receiverId!];
    }

    this.snackBar.open('Chat cleared successfully', 'Close', { duration: 3000,verticalPosition:'top',horizontalPosition:'center'});
    this.cdr.detectChanges();
  }
  updateContactStatus() {
    if (this.selectedContact && this.selectedContact.id) {
      this.chatService.getUserStatus(this.selectedContact.id).subscribe(status => { this.selectedContact.online = status; }, error => {
        console.error(
          'Error fetching user status:'
          , error);
      }
      );
    }
  }
  // Call this method when a new message is received
  onNewMessage(message: any) {
    this.messages.push(message);
    if (message.sender.id !== this.userId) {
      this.notificationService.incrementUnreadCount();
      // If you're in the chat view, mark the message as read immediately
      this.markMessageAsRead(message.id);
    }
  }
  markMessageAsRead(messageId: number) {
    this.notificationService.markMessageAsRead(messageId).subscribe();
  }



  unreadSendersCount = 0
  fetchUnreadSendersCount() {
    this.notificationService.getUnreadSendersCount(this.userId).subscribe(
      count => {
        this.unreadSendersCount = count;
      },
      error => {
        console.error('Error fetching unread senders count:', error);
      }
    );
  }
  newMessageCount: number = 0;

  updateNewMessageCount() {
    this.newMessageCount = this.contacts.filter(contact => contact.hasNewMessage).length;
  }

  openMessage(contact: Contact) {
    contact.hasNewMessage = false;
    this.updateNewMessageCount();
  }

  deleteGroupdilog(groupId: number): void {
    const dialogRef = this.dialog.open(ChatDialogComponent, {
      width: '250px',
      data: { action: 'delete', confirmation: true },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.deleteGroup(groupId);
      }
    });
  }

  leaveGroupdilog(userId: number): void {
    const dialogRef = this.dialog.open(ChatDialogComponent, {
      width: '250px',
      data: { action: 'leave', confirmation: true }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.leaveGroup(userId);
      }
    });
  }

  deleteMessagedilog(message: Message): void {
    const dialogRef = this.dialog.open(ChatDialogComponent, {
      width: '250px',
      data: { action: 'deleteMessage' }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.deleteMessage(message);
      }
    });
  }

  blockUser(userId: number): void {
    const dialogRef = this.dialog.open(ChatDialogComponent, {
      width: '250px',
      data: { action: 'blockUser' }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.blockContact(userId);
      }
    });
  }

  unblockUser(userId: number): void {
    const dialogRef = this.dialog.open(ChatDialogComponent, {
      width: '250px',
      data: { action: 'unblockUser' }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.unblockContact(userId);
      }
    });
  }
  get filteredContacts3(): Contact[] {
    if (!this.contacts) {
      return [];
    }
    return this.contacts
      .filter((contact) => {
        const nameMatch = contact.name &&
          contact.name
            .toLowerCase()
            .includes(this.searchTermforgroup.toLowerCase());
        const notGroup = contact.hasOwnProperty('isGroup') ? !contact.isGroup : true;
 
        return nameMatch && notGroup;
      })
      .sort((a, b) => {
        if (a.lastMessageTime && b.lastMessageTime) {
          return (
            new Date(b.lastMessageTime).getTime() -
            new Date(a.lastMessageTime).getTime()
          );
        } else if (a.lastMessageTime) {
          return -1;
        } else if (b.lastMessageTime) {
          return 1;
        } else {
          return 0;
        }
      });
  }
  ClearChat(): void {
    const dialogRef = this.dialog.open(ChatDialogComponent, {
      width: '250px',
      data: { action: 'Clear Chat' }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.DeleteAll();
      }
    });
  }
  private setUserOffline() {
    if (this.userId) {
      this.chatService.setUserOffline(this.userId).subscribe(
        () => {},
        error => {}
      );
    }
  }
 private setUserOnline() {
    if (this.userId) {
      this.chatService.setUserOnline(this.userId).subscribe(
        () => {},
        error => {}
      );
    }
  }
  loadGroupMembers(groupId: number) {
    this.chatService.getGroupMembers(groupId).subscribe(
      (members) => {
        this.groupMembers = members;
        this.isAccepted = true;
       
        // Check if user is admin
        this.chatService.isUserAdmin(groupId, this.userId).subscribe(
          (isAdmin) => {
            if(isAdmin==this.userId){
            this.isGroupAdmin = true;
            this.AdminName = "You";
            this.AdminId = isAdmin;
           
              // If user is admin, set isAccepted to true
              this.isAccepted = true;
          }
          else{
            this.isGroupAdmin = false;
            this.AdminId = isAdmin;
            const contact = this.filteredContacts3.find(contact => contact.id === isAdmin);
            this.AdminName =  contact ? contact.name : "";
             this.chatService.isGroupAccepted(groupId, this.userId).subscribe(
                (isAccepted: boolean) => {
                  this.isAccepted = isAccepted;
                },
                (error) => {
                  console.error("Error checking acceptance status:", error);
                }
              );
          }
        },
          (error) => {
            console.error("Error checking admin status:", error);
          }
        );
      },
      (error) => {
        console.error("Error loading group members:", error);
      }
    );
  }
 
  onAcceptGroup(groupId: number) {
    this.chatService.acceptGroup(groupId, this.userId).subscribe(
      (response) => {
        if (response.status == 200 && response.body == "Success") {
          this.isAccepted = true;
          this.snackBar.open("You have joined the group", "Close", {
            duration: 3000,
            verticalPosition:'top',
            horizontalPosition:'center'
          });
        } else {
          this.snackBar.open(
            "Failed to join the group. Please try again.",
            "Close",
            { duration: 3000,
              verticalPosition:'top',
              horizontalPosition:'center'
            }
          );
        }
      },
      (error) => {
        console.error('Error accepting group:', error);
        this.snackBar.open(
          `An error occurred while joining the group: ${error.message || 'Unknown error'}`,
          "Close",
          { duration: 3000,verticalPosition:'top',horizontalPosition:'center'}
        );
      }
    );
  }
  
  onMessageRead(message: any) {
    if (!message.sent && !message.read) {
      this.chatService.markAsRead(message.id).subscribe(() => {
        message.read = true;  // Update the UI immediately after marking as read
        this.cdr.detectChanges();  // Trigger change detection

      });
    }
    
  }

  navigateToUserProfile(userId: number): void {
    if (userId) {
      this.router.navigate(['/usersprofile', userId]);
    } else {
      console.error('User ID is not available');
    }
  }

   
  reactToMessage(message: Message, reaction: string) {
    this.chatService.setReaction(this.userId, message.id, reaction).subscribe({
      next: (response: string) => {
        const existingReactionIndex = message.reactions.findIndex(
          (r: { user: { id: any } }) => r.user.id === this.userId
        );
 
        if (message.myreaction === reaction || response == "Reaction removed successfully.") {
          // Remove the reaction if the user is trying to remove the same reaction
          if (existingReactionIndex > -1) {
            message.reactions.splice(existingReactionIndex, 1); // Remove reaction from the array
          }
          message.myreaction = ''; // Clear the user's reaction
          // Show success message
          this.snackBar.open('Something Went Wrong!!', 'Close', {
            duration: 3000,
            verticalPosition:'top',
            horizontalPosition:'center'
          });
          return;
        } else {
          // Add or update the reaction
          if (existingReactionIndex > -1) {
            // Update existing reaction
            message.reactions[existingReactionIndex].reaction = reaction;
          } else {
            // Add new reaction
            message.reactions.push({
              id: new Date().getTime(), // Generate a unique id or use backend-provided id
              reaction: reaction,
              user: {
                id: this.userId,
                name: 'you', // Optional: adjust for UI display
              },
            });
          }
          message.myreaction = reaction; // Update user's reaction
        }
 
        // Show success message
        this.snackBar.open(response, 'Close', {
          duration: 3000,
          verticalPosition:'top',
          horizontalPosition:'center'
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to send reaction!', 'Close', {
          duration: 3000,
          verticalPosition:'top',
          horizontalPosition:'center'
        });
        console.error('Error sending reaction', err);
      }
    });
  }
 
  // removeReaction
 
  dereactToMessage(message: Message,reactionId : number){
    if(reactionId==this.userId){
    this.chatService.removeReaction(this.userId, message.id).subscribe({
      next: (response: string) => {
        const existingReactionIndex = message.reactions.findIndex(
          (r: { user: { id: any } }) => r.user.id === this.userId
        );
 
        if (existingReactionIndex > -1) {
            message.reactions.splice(existingReactionIndex, 1); // Remove reaction from the array
          }
          message.myreaction = ''; // Clear the user's reaction
 
        // Show success message
        this.snackBar.open(response, 'Close', {
          duration: 3000,
          verticalPosition:'top',
          horizontalPosition:'center'
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to send reaction!', 'Close', {
          duration: 3000,
          verticalPosition:'top',
          horizontalPosition:'center'
        });
        console.error('Error sending reaction', err);
      }
    });
  }

}

isMyReaction(message: any, reaction: string): boolean {
  return message.reactions && message.reactions.some((r: { reaction: string; user: { id: any; }; }) => r.reaction === reaction && r.user.id === this.userId);
}
handleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    this.sendMessage();
  } else if (event.key === 'Enter' && event.shiftKey) {
    event.preventDefault();
    this.insertNewLine();
  }
  // Adjust the height on any key press
  this.adjustTextareaHeight();
}
 
insertNewLine(): void {
  const textarea = this.messageInput.nativeElement;
  const { selectionStart, selectionEnd } = textarea;
  const currentValue = textarea.value;
  const newValue = currentValue.substring(0, selectionStart) + '\n' + currentValue.substring(selectionEnd);
 
  // Update the model
  this.messageInputs[this.selectedContact.id] = newValue;
 
  // Update the textarea
  textarea.value = newValue;
 
  // Set the cursor position after the new line
  textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
 
  // Adjust the height
  this.adjustTextareaHeight();
}
 
adjustTextareaHeight(): void {
  const textarea = this.messageInput.nativeElement;
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
}
 
}
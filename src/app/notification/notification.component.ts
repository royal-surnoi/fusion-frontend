import { Component, Input, OnInit, OnDestroy, Renderer2, HostListener, ElementRef } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { NotificationService } from "../notification.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../auth.service";
import { UserNotification } from "../notification.model";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { interval, Subscription, switchMap } from "rxjs";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
 
export interface AppNotification {
  id: number;
  message: string;
  timestamp: Date;
  isRead: boolean;
  contentType?: 'image' | 'shortVideo' | 'longVideo' | 'article';
  contentUrl?: string;
  url?: any;
  userImageBase64?: string;
}
 
@Component({
  selector: "app-notification",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'notification.component.html',
  styleUrls: ['./notification.component.css'],
})
 
export class NotificationComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false;
  notifications: UserNotification[] = [];
  unreadCount: number = 0;
  unreadNotifications: UserNotification[] = [];
  showPostDetails: boolean = false;
  authservice: AuthService[] = [];
 
  selectedPost: any = null;
  selectedPostType: string = '';
  private clickListener!: () => void;
  private apiBaseUrl = environment.apiBaseUrl;
  @Input() postData: any;
  @Input() contentType: string ='';
  post: any;


  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private renderer: Renderer2,
    private router: Router,
    private http:HttpClient,
    private elementRef: ElementRef
  ) { }
 
  ngOnInit(): void {
    this.loadNotifications();
    this.clickListener = this.renderer.listen('document', 'click', (event) => {
      this.onClickOutside(event);
    });
 
  }
 
  ngOnDestroy(): void {
  }
  closePostDetails(): void {
    this.showPostDetails = false;
    this.selectedPost = null;
    this.selectedPostType = '';
  }


  loadNotifications(): void {
    const userId = this.authService.getId();
    if (userId) {
      this.notificationService.getNotificationsByUser(Number(userId)).subscribe({
        next: (notifications) => {
          this.notifications = notifications.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          this.notifications.forEach(notification => {
            notification.safeContent = this.formatNotificationContent(notification.content);
          });
          this.unreadNotifications = notifications.filter(n => !n.read);
          this.unreadCount = this.unreadNotifications.length;
        },
        error: (error) => console.error('Error fetching notifications:', error)
      });
    }
  }
 
onNotificationClick(notification: UserNotification) {
  this.markAsRead(notification);

  if (notification.content.includes('requested to follow you')) {
    this.navigateToFollowRequests();
  } else if (notification.content.includes('accepted your follow request')) {
    this.navigateToFollowing();
  }
   else if (notification.content.includes('liked your post') || notification.content.includes('commented on your post')) {
      if (notification.url) {
          const fullUrl = notification.url;
          if (fullUrl) {
              this.router.navigate(['/feed'], { queryParams: { url: fullUrl } }).then(() => {

              setTimeout(() => {
                const element = document.getElementById('specific-post');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }, 500); 
            });
          } else {
              console.error('Invalid post URL:', notification.url);
          }
      } else {
          console.error('Notification URL is missing:', notification);
      }
  }
}


private navigateToFollowRequests() {
  const userId = this.authService.getId();
  this.router.navigate(['/profile', userId], {
    queryParams: { section: 'connections', tab: 'followrequests' }
  });
}

private navigateToFollowing() {
  const userId = this.authService.getId();
  this.router.navigate(['/profile', userId], {
    queryParams: { section: 'connections', tab: 'followers' }
  });
}



formatNotificationContent(content: string): string {
  const actionWords = ["liked", "commented", "accepted", "followed","requested", "has"];
  let formattedContent = content;

  let actionIndex = -1;
  for (let word of actionWords) {
      actionIndex = content.indexOf(word);
      if (actionIndex !== -1) {
          break;
      }
  }

  if (actionIndex !== -1) {
      const username = content.substring(0, actionIndex).trim();
      formattedContent = content.replace(username, '<strong>' + username + '</strong>');
  }

  formattedContent = formattedContent.replace(/: (.+)$/, ': <strong>$1</strong>');

  return formattedContent;
}

  markAsRead(notification: UserNotification) {
    this.notificationService.markAsRead(notification.id).subscribe(
      () => {
        notification.read = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      },
      error => console.error('Error marking notification as read:', error)
    );
  }

  
  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }
 

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }
 
  formatTimestamp(timestamp: Date): string {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

}
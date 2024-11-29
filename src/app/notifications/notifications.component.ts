// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { Subscription } from 'rxjs';
// // import { WebSocketService } from '../websocket.service';
// import { CommonModule } from '@angular/common';
// import { NotificationService } from '../notification.service';

// // custom-notification.model.ts
// export interface CustomNotification {
//   id: number;
//   userId: number;
//   content: string;
//   timestamp: Date;
//   // any other properties
// }

// @Component({
//   selector: 'app-notifications',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './notifications.component.html',
//   styleUrl: './notifications.component.css'
// })
// export class NotificationsComponent implements OnInit, OnDestroy {
//   notifications: CustomNotification[] = [];
//   userId: number;
//   private webSocketSubscription?: Subscription;

//   constructor(
//     private notificationService: NotificationService,
//     private webSocketService: WebSocketService
//   ) {
//     // Initialize userId from local storage
//     const storedUserId = localStorage.getItem('id');
//     this.userId = storedUserId ? parseInt(storedUserId, 10) : 0;
//   }

//   ngOnInit() {
//     if (this.userId) {
//       this.loadNotifications();
//       this.subscribeToWebSocket();
//     } else {
//       console.error('User ID not found in local storage');
//       // Handle the case when userId is not available
//       // You might want to redirect to login page or show an error message
//     }
//   }

//   ngOnDestroy() {
//     if (this.webSocketSubscription) {
//       this.webSocketSubscription.unsubscribe();
//     }
//   }

//   loadNotifications() {
//     this.notificationService.getNotificationsByUser(this.userId)
//       .subscribe(
//         (notifications: CustomNotification[]) => {
//           this.notifications = notifications;
//         },
//         (error) => {
//           console.error('Error fetching notifications', error);
//         }
//       );
//   }

//   subscribeToWebSocket() {
//     this.webSocketSubscription = this.webSocketService.getMessages().subscribe(
//       (message: CustomNotification) => {
//         // Assuming the message is a new notification and matches the CustomNotification interface
//         this.notifications.unshift(message);
//       },
//       (error) => {
//         console.error('WebSocket error:', error);
//       }
//     );
//   }
// }
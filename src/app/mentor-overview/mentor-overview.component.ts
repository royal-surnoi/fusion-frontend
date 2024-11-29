
import { Component, OnInit } from '@angular/core';
import { Mentor1Service } from '../mentor1.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { Assignment, CustomNotification, FusionService } from '../fusion.service';
 
@Component({
  selector: 'app-mentor-overview',
  standalone: true,
  imports: [  CommonModule,FormsModule, MatCardModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
   
    MatProgressSpinnerModule],
  templateUrl: './mentor-overview.component.html',
  styleUrl: './mentor-overview.component.css'
})
export class MentorOverviewComponent implements OnInit {
  overviewData: any = {};
  recentActivities: any[] = [];
  topPerformingStudents: any[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  userId: any; // Replace with actual user ID, perhaps from authentication service

 
  constructor(
    private mentorService: Mentor1Service,
    private fusionService: FusionService
  ) {}
 
  ngOnInit() {
    this.loadNotifications();
    this.loadUpcomingAssignments();


    const userIdString = localStorage.getItem('id');
    if (userIdString) {
      this.userId = Number(userIdString); // Parse userId from string to number
      this.getDashboardOverview(this.userId);
    } else {
      console.error('User ID not found in local storage');
    }

    this.loadOverviewData();
    this.loadRecentActivities();
    this.loadTopPerformingStudents();
  }
 
  loadOverviewData() {
    this.mentorService.getOverviewData().subscribe(
      (data) => {
        this.overviewData = data;
        this.isLoading = false;
      },
      (error) => {
        this.error = 'Failed to load overview data. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching overview data:', error);
      }
    );
  }
 
  loadRecentActivities() {
    this.mentorService.getRecentActivities().subscribe(
      (activities) => {
        this.recentActivities = activities;
      },
      (error) => {
        console.error('Error fetching recent activities:', error);
      }
    );
  }
 
  loadTopPerformingStudents() {
    this.mentorService.getTopPerformingStudents().subscribe(
      (students) => {
        this.topPerformingStudents = students;
      },
      (error) => {
        console.error('Error fetching top performing students:', error);
      }
    );
  }
///OVER VIEW 
  totalCourses: any;
  activeStudents:any;
  upcomingClasses: any;
  pendingAssignments: any;
  getDashboardOverview(userId: number): void {
   
    this.fusionService.getOverview(userId).subscribe(
      (data: any) => {
        console.log('Dashboard Overview:', data);
        this.activeStudents = data.activeStudents;
        this.pendingAssignments = data.pendingAssignments;
        this.totalCourses = data.totalCourses;
        this.upcomingClasses = data.upcomingClasses;
      
      },
      error => {
        console.error('Error fetching dashboard overview', error);
      }
    );
  }
  assignments:any;
  length:any;
  loadUpcomingAssignments(): void {
    const userId = localStorage.getItem('id');
    if (userId) {
      this.fusionService.getUpcomingAssignments(Number(userId)).subscribe(
        (data: Assignment[]) => {
          this.assignments = data;
          this.length = data.length;
          console.log(data);
        },
        (error) => {
          console.error('Error fetching assignments', error);
        }
      );
    } else {
      console.error('User ID not found in localStorage');
    }
  }
  
  notifications: CustomNotification[] = [];
  content: any[] = [];
  timestamp: any[] = [];
  name: any[] = [];

   loadNotifications(): void {
    const userId = localStorage.getItem('id');
    if (userId) {
      this.fusionService.getNotifications(+userId).subscribe(
        (notifications: CustomNotification[]) => {
          this.notifications = notifications;
          this.content = notifications.map(n => n.content);
          this.timestamp = notifications.map(n => n.timestamp);
          this.name = notifications.map(n => n.name);
          console.log(notifications);
        },
        (error) => {
          console.error('Error fetching notifications:', error);
        }
      );
    } else {
      console.error('User ID not found in localStorage');
    }
  }
}
 
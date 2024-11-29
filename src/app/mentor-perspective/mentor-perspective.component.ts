
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { StudentComponent } from '../student/student.component';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ZmentorsdashboardComponent } from '../zmentorsdashboard/zmentorsdashboard.component';
import { MentorOverviewComponent } from '../mentor-overview/mentor-overview.component';
import { AnalyticsComponent } from '../analytics/analytics.component';
import { MessagesComponent } from '../messages/messages.component';
import { AssementComponent } from '../assement/assement.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FusionService } from '../fusion.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MentormaindashboardComponent } from "../mentormaindashboard/mentormaindashboard.component";
import { MentoronlineComponent } from "../mentoronline/mentoronline.component";
import { MockComponent } from '../mock/mock.component';
 
@Component({
  selector: 'app-mentor-perspective',
  standalone: true,
  imports: [CommonModule, MentorOverviewComponent, AssementComponent, AnalyticsComponent, MessagesComponent, ZmentorsdashboardComponent, StudentComponent, MatSidenavModule, MatSidenavModule, CourseDialogComponent, MatIconModule, MatDialogModule, MatToolbarModule, MatListModule, MentormaindashboardComponent, MentoronlineComponent,MockComponent,MentoronlineComponent],
  templateUrl: './mentor-perspective.component.html',
  styleUrl: './mentor-perspective.component.css'
})
export class MentorPerspectiveComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
 
  activeSection: string = 'dashboard';
 
  constructor(
    private fusionService: FusionService,
    private router: Router,
    public authService: AuthService,
    private sanitizer: DomSanitizer
  ) { }
 
  toggleSidenav() {
    this.sidenav.toggle();
  }
 
  setActiveSection(section: string) {
    this.activeSection = section;
  }
 
  ngOnInit(): void {
    this.fetchUserDetails();
 
 
 
  }
 
  newImage: SafeUrl | null = null;
  userImage: SafeUrl | null = null;
  originalImage: SafeUrl | null = null;
  user:any;
  userId:any;
  role:any;
  name:any;
  profession:any;
  fetchUserDetails(): void {
    const userId = localStorage.getItem('id');
    if (userId) {
      this.fusionService.getUserById(userId).subscribe({
        next: (data) => {
          this.user = data;
          this.userId = data.id; // Set userId based on fetched user data
          this.profession = data.profession;
          this.name=data.name;
          // this.userDescription = data.userDescription;
 
          // Create SafeUrl for user image
          if (data.userImage) {
            const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${data.userImage}`);
            this.userImage = sanitizedUrl;
         
          }
        },
        error: (error) => {
          console.error('Error fetching user details:', error);
        }
      });
    } else {
      console.error('User ID not found in local storage');
    }
  }
}
 
 
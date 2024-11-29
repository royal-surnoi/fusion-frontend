import { Component, OnInit } from '@angular/core';
import { FusionService } from '../fusion.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
 
@Component({
  selector: 'app-mentormaindashboard',
  standalone: true,
  imports: [FormsModule, CommonModule,MatCardModule, MatIconModule, MatButtonModule,HttpClientModule, MatListModule],
  templateUrl: './mentormaindashboard.component.html',
  styleUrl: './mentormaindashboard.component.css'
})
export class MentormaindashboardComponent implements OnInit{
  usersId:any;
  private subscriptions: Subscription = new Subscription();
  name:any;
  imageUrl = ''; // Replace with actual image path
  showPopup = false;
  searchQuery: string = ''; // Variable for search input
 
 
  constructor(
    private fusionService: FusionService,
    private router: Router,
    public authService: AuthService,
    private sanitizer: DomSanitizer
  ) { }
  ngOnInit(): void {
    this.fetchUserDetails();
    this.usersId = localStorage.getItem('id');
    this.getCourseByUserId()
    this.subscriptions.add(
      this.authService.getNameObservable().subscribe(name => {
        this.name = name;
        this.userImage = this.imageUrl
      })
    );
  }
  // selectedCourseType: string = 'in-progress';
  selectedCourseType: null = null;
 
  filteredCoursesList: any[] = [];
  CoursesList: any[] = [];
 
 
   // Method to filter courses based on the selected radio button
  // Method to filter courses based on the selected course type and search query
  filterCourses(): void {
    let filtered = this.CoursesList;
 
    // Filter by course type (completed or in-progress)
    if (this.selectedCourseType === 'completed') {
      filtered = filtered.filter((course: { coursePercentage: number; }) => Math.abs(course.coursePercentage - 100) < 0.01);
    } else {
      filtered = filtered.filter((course: { coursePercentage: number; }) => course.coursePercentage < 100);
    }
 
    // Filter by search query
    if (this.searchQuery.trim()) {
      filtered = filtered.filter((course: { courseTitle: string; }) =>
        course.courseTitle.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
 
    this.filteredCoursesList = filtered;
    console.log('Filtered Courses:', this.filteredCoursesList); // Log filtered courses
  }
onCourseTypeChange(): void {
  this.filterCourses();
}

getCourseBackgroundImage(item: any): string {
  if (item && item.courseImage) {
    // Assuming courseImage is a base64 string without the data URL prefix
    return `url(data:image/jpeg;base64,${item.courseImage})`;
  }
  return 'none'; // Fallback in case no image is available
}

 
togglePopup() {
  this.showPopup = !this.showPopup;
}
  // Fetch course data from the backend
  getCourseByUserId() {
    this.fusionService.getCourseByUserId(this.usersId).subscribe((res) => {
      this.CoursesList = res;
      this.filterCourses(); // Filter the courses initially
    });
  }
 
  image(toolImage:any){
    return this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${toolImage}`);
   
  }
  navigateToProfile() {
    this.router.navigate(['/profile'])
  }
  navigateToUpdateCoursID(courseId: string) {
    this.router.navigate(['/createcourse', courseId]);
  }
  // deleteCoureseByCouseID(courseId:any){
  //   console.log(courseId)
  //       this.fusionService.deleteCourseById(courseId).subscribe((res)=>{
  //         console.log(res)
  //       })
  // }
 
  confirmDeleteCourse(courseId: any) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.deleteCourseByCourseID(courseId);
    }
  }
 
  deleteCourseByCourseID(courseId: any) {
    console.log(courseId);
    this.fusionService.deleteCourseById(courseId).subscribe((res) => {
      console.log(res);
    });
  }
  navCourse() {
    this.router.navigate(['/module']);
  }
  user:any;
  originalImage: SafeUrl | null = null; // Store the original image URL
  userImage: SafeUrl | null = null;
  userDescription:any;
  userId:any;
  role:any;
 
  fetchUserDetails(): void {
    const userId = localStorage.getItem('id');
    if (userId) {
      this.fusionService.getUserById(userId).subscribe({
        next: (data) => {
          this.user = data;
          this.userId = data.id; // Set userId based on fetched user data
          this.role = data.role;
          this.userDescription = data.userDescription;
 
          // Create SafeUrl for user image
          if (data.userImage) {
            const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${data.userImage}`);
            this.userImage = sanitizedUrl;
            this.originalImage = sanitizedUrl; // Set original image
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
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
courseTitle: string = '';
isPopupVisible = false;
isPrivacyPopupVisible = false;
isCoursePopupVisible = false;
isCheckboxChecked = false;  // Property to track checkbox status
 
 
 // Show privacy policy popup
 showPrivacyPopup() {
  this.isPrivacyPopupVisible = true;
}
  // Accept privacy policy and show course creation popup
  acceptPrivacyPolicy() {
    this.isPrivacyPopupVisible = false;  // Close privacy popup
    this.showCoursePopup();  // Show course creation popup
  }
 
 // Close privacy popup
  closePrivacyPopup() {
    this.isPrivacyPopupVisible = false;
  }
 
  // Show course creation popup
  showCoursePopup() {
    this.isCoursePopupVisible = true;
  }
 
  // Close course creation popup
  closeCoursePopup() {
    this.isCoursePopupVisible = false;
  }
 
  // Submit course creation form
  onSubmit2() {
    if (this.courseTitle) {
      this.fusionService.createCourse(this.userId, this.courseTitle).subscribe(
        (response) => {
          console.log('Course created successfully', response);
          alert('Course created successfully!');
          this.closeCoursePopup();
          const courseId = response.id;
          this.router.navigate([`/createcourse`, courseId]);
        },
        (error) => {
          console.error('Error creating course', error);
          alert('Error creating course. Please try again.');
        }
      );
    } else {
      alert('Please enter a course title.');
    }
  }
 
 
 
navigateToScheduleClass() {
  this.router.navigate(['/scheduleOnlineclass']);
}
 
navigateToMockInterview() {
  this.router.navigate(['/mock-interview']);  // Specify your route here
}  
}
 
 
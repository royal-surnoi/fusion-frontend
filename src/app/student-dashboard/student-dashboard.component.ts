 
// import { Component } from '@angular/core';
import { Component, OnInit, Sanitizer } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
// import { CourseEnrollmentComponent } from "../course-enrollment/course-enrollment.component";
// import { ProgressTrackingComponent } from "../progress-tracking/progress-tracking.component";
// import { UpcomingActivitiesComponent } from "../upcoming-activities/upcoming-activities.component";
// import { FeedbackGradesComponent } from "../feedback-grades/feedback-grades.component";
// import { NotificationsComponent } from "../notifications/notifications.component";
// import { ResourcesComponent } from "../resources/resources.component";
import { CommonModule } from '@angular/common';
// import { DashboardService } from '../dashboard.service';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { StudentdashboardService } from '../studentdashboard.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ContentObserver } from '@angular/cdk/observers';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, forkJoin, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';
import { MockTestService } from '../mocktest.service';
 
interface Notification {
  // -------------------------------
 
  // -------------------------------
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    preferences: any;
    language: any;
    otp: any;
    otpGeneratedTime: any;
    createdAt: string;
    updatedAt: string;
    userImage: any;
    onlineStatus: string;
    lastSeen: any;
    userDescription: any;
  };
  content: string;
  timestamp: string;
}
interface Course {
  id: number;
  courseTitle: string;
}
interface Assignment {
  assignmentTitle: string;
  submittedAt: number[];
  formattedDate?: string;
}
// export interface BookedSlot {
//   id: number;
//   slotName: string;
//   slotTime: string;
//   endTime: string;
//   booked: boolean;
// }
// Interface for the mock test interview details
// interface BookedSlot {
//   id: number;
//   mockTestTitle: string;
//   slotTime: number[];
//   endTime: number[];
//   testType: string;
//   mockId: number;
// }
interface BookedSlot {
  id: number;
  title: string;
  slotDate: number[];
  endDate: number[];
  type: string;
  mockId: number;
}
 
 
interface ProgressCache {
  [key: string]: {
    value: number | string;
    timestamp: number;
  };
}
// interface CourseReport {
//   courseTitle: string;
//   overallProgress: string;
//   quizProgress: string;
//   assignmentProgress: string;
//   projectProgress: string;
// }
 
interface CourseActivity {
  courseId: number;  // Add this line
  courseTitle: string;
  quizNames: string[];
  assignmentTitles: string[];
  projectTitles: string[];
}
 
// interface CourseReport {
//   courseTitle: string;
//   overallProgress: string;
//   quizProgress: string;
//   assignmentProgress: string;
//   projectProgress: string;
// }
 
 
// interface Progress {
//   type: 'quiz' | 'assignment' | 'project';
//   title: string;
//   progress: string;
// }
interface CourseActivity {
  courseTitle: string;
  quizNames: string[];
  assignmentTitles: string[];
  projectTitles: string[];
  projectProgress: number;
  quizProgress: number;
  assignmentProgress: number;
  courseId: number;
  courseDescription: string;
}
 
interface Progress {
  type: 'quiz' | 'assignment' | 'project';
  title: string;
  progress: number;
  desc:any;
}
 
interface CourseReport {
  courseTitle: string;
  courseDescription: string;
  quizProgress: number;
  assignmentProgress: number;
  projectProgress: number;
}
interface CourseDetail {
  courseTitle: string;
  projectProgress: number;
  quizNames: string[];
  projectTitles: string[];
  assignmentTitles: string[];
  quizProgress: number;
  assignmentProgress: number;
  courseId: number;
  courseDescription: string;
}
 
@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [MatSidenavModule,MatGridListModule,RouterModule,NgxChartsModule,MatTableModule, MatIconModule,MatProgressSpinnerModule,MatTabsModule,MatProgressBarModule, MatListModule, MatButtonModule,CommonModule,MatCardModule,MatToolbarModule,HttpClientModule,CommonModule,MatTableModule,FormsModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit {
  enrolledCourseActivities: CourseActivity[] = [];
  filteredCourseActivities: CourseActivity[] = [];
  selectedModuleOrLessonId: string = '';
  courseTitles: string[] = [];
  previousSelectedCourseId: string | null = null;
  selectedCourse: string = '';
  selectedProgress: Progress | null = null;
  lessonOptions: any[] = [];
  courseReport: CourseReport | null = null;
  // -------------------------------
  courseEnrolledIds: any;
  courseProgress: any;
  enrolledCourses: any;
  assignmentProgress: any;
  assignmentProgressPercentage: any;
  projectProgress: any;
  projectProgresspercentage: any;
  count: any;
  Achivmentcount: any;
  achievmentCard: any;
  quizDetails: any = null;
  assignmentDetails: any = null;
  projectDetails: any = null;
  // -------------------------------
  projectProgressMap: { [courseId: number]: Observable<string> } = {};
  projectProgresses: number[] = [];
  // projectProgress: { [courseId: number]: string } = {};
  private progressCache: ProgressCache = {};
  private cacheDuration = 60000;
  activeSection: string = 'overview';
  candidateData: any;
  loading: boolean = true;
  sidenavOpened: boolean = true;
  courses: any[] = [];
  feedback: any[] = [];
  displayedColumns: string[] = ['activity', 'grade', 'feedback','timestamp'];
  notifications: any[] = [];
  activities: any[] = [];
  resources: any[] = [];
  userId: any;
  courseCompletionFraction: any;
  candidateDetails: any;
  // enrolledCourses: any;
  notStartedCount: any = 0;
  inProgressCount: any = 0;
  completedCount: any = 0;
  overallProgress:any;
  enrolledCourseCards: any;
  isLongTerm: boolean = false;
  selectedLessonId: string = '';
  // completedAssignment: any;
  UpcomingAssignment: any;
  parsedData: any;
  feedBack: any;
  blob: any;
  upcomingActivites: any;
  // notifications: any:
  // For testing purposes, set the userId directly here
// Set this to the desired test user ID
completedAssignment: Assignment[] = [];
selectedCourseDetails: any;
isReportVisible: boolean = false;
  dueNotifications: Notification[] = [];
  submittedNotifications: Notification[] = [];
  moduleOrLessonOptions: any[] = [];
  showMoreDue: boolean = false;
  showMoreSubmitted: boolean = false;
  error: any;
  courseDetails: any;
  achievements: any;
  EnrolledCourses: any;
  enrolledIds: any;
  progressOfProject: any;
  courseProgressBool: any;
  quizProgress: any;
  quizProgressPercentage: any;
  enrolledDetails: any;
  enrolledCourseActivites: any;
  Assignements: any;
  quizzes: any;
  projects: any;
  enrolledCourseList: any;
  feedItems: any;
  bookedSlots: BookedSlot[] = [];
  bookedSlotColumns: string[] = ['id', 'title', 'slotDate', 'endDate', 'type', 'action'];
  feedbackData: any;
  enrolledCourseLists: any;
  dropdownOptions: any;
  courseIDforcd: any;
  
  isLoading = false;
  avgGrade: any;
  enrolledCourseCount: number = 0;
 
  // selectedCourseDetails: any;
 
 
 
  constructor(private dashboardService: StudentdashboardService,private sanitizer:DomSanitizer,private router: Router,private http: HttpClient, private route:ActivatedRoute,private mockTestService: MockTestService) {
   
  }
 
//  ---------------------------------------
getEnrolloCourses(UserID:any){
  this.http.get(`${environment.apiBaseUrl}/enrollment/user/${UserID}`).subscribe((res:any)=>{
    this.enrolledCourses = res;
    this.courseEnrolledIds = res.map((item:any) => item.course.id);
    console.log(res);
    console.log(this.courseEnrolledIds ,"enrolledID");
    this.loadCoursePercentage(this.courseEnrolledIds,UserID)
    // this.getAssignmentProgress(this.courseEnrolledIds,UserID)
    this.getProjectProgress(this.courseEnrolledIds,UserID)
    this.getQuizzProgress(this.courseEnrolledIds,this.userId)
  })
}
 
loadCoursePercentage(courseEnrolledIds:any,UserID:any){
  this.courseProgressBool= [];
  this.courseProgress = [];
this.Achivmentcount = 0 ;
this.achievmentCard = [];
  courseEnrolledIds.forEach((courseId: number) => {
    this.http.get(`${environment.apiBaseUrl}/video/progress/percentage/user/${UserID}/course/${courseId}`)
      .subscribe((res: any) => {
        this.courseProgress.push(res);
        if (res>80){
          this.Achivmentcount++;
          this.courseProgressBool.push(false);
        }else{
          this.courseProgressBool.push(true);
        }
        console.log(this.courseProgress, "this.courseProgress");
      });
  });
 
}
getQuizzProgress(courseenrolledId:any,userId:any){
  this.quizProgress = [];
 
  courseenrolledId.forEach((courseId: number) => {
    // /2//3
    this.http.get(`${environment.apiBaseUrl}/api/quizzes/progress/ratio/user/${userId}/lessonModule/${courseId}`, { responseType: 'text' })
      .subscribe((res: any) => {
        this.quizProgress.push(res);
        console.log(this.assignmentProgress, "Updated assignmentProgress");
      });
  });
 
  this.quizProgressPercentage = [];
 
  courseenrolledId.forEach((courseId: number) => {
    // /2//3/progress/percentage/user/{userId}/lesson/{lessonId}
    this.http.get(`${environment.apiBaseUrl}/api/quizzes/progress/percentage/user/${userId}/lessonModule/${courseId}`, { responseType: 'text' })
      .subscribe((res: any) => {
        this.quizProgressPercentage.push(res);
        console.log(this.assignmentProgress, "Updated assignmentProgress");
      });
  });
 
}
// getAssignmentProgress(courseEnrolledIds: number[],UserID:any) {
//   this.assignmentProgress = [];
 
//   courseEnrolledIds.forEach((courseId: number) => {
//     this.http.get(`${environment.apiBaseUrl}/submittedByTotalCourse/${courseId}?userId=${UserID}`, { responseType: 'text' })
//       .subscribe((res: any) => {
//         this.assignmentProgress.push(res);
//         console.log(this.assignmentProgress, "Updated assignmentProgress");
//       });
//   });
 
//   this.assignmentProgressPercentage = [];
 
//   courseEnrolledIds.forEach((courseId: number) => {
//     this.http.get(`${environment.apiBaseUrl}/submittedByTotalCourse/${courseId}?userId=${UserID}`, { responseType: 'text' })
//       .subscribe((res: string) => {
//         const [submitted, total] = res.split('/').map(Number);
//         const percentage = total > 0 ? (submitted / total) * 100 : 0;
       
//         this.assignmentProgressPercentage.push(percentage);
       
//         console.log(this.assignmentProgressPercentage, "Updated assignmentProgressPercentage");
//       });
//   });
// }
getProjectProgress(courseEnrolledIds:any,UserID:any){
  this.projectProgress  = [];
 
  courseEnrolledIds.forEach((courseId: number) => {
    this.http.get(`${environment.apiBaseUrl}/project/progress/${courseId}/user/${UserID}`, { responseType: 'text' })
      .subscribe((res: any) => {
        this.projectProgress.push(res);
        console.log(this.assignmentProgress, "Updated assignmentProgress");
      });
  });
 
  this.projectProgresspercentage = [] ;
  courseEnrolledIds.forEach((courseId: number) => {
    this.http.get(`${environment.apiBaseUrl}/project/projectProgress/${courseId}/user/${UserID}`, { responseType: 'text' })
      .subscribe((res: any) => {
        this.projectProgresspercentage.push(res);
        console.log(this.projectProgresspercentage, "Updated assignmentProgress");
      });
  });
 
}
// ---------------------------------------
  currentSection: string = '';
 
  changeSection(section: string) {
    this.currentSection = section;
  }
 
  ngOnInit() {
 
    // this.loadEnrolledCourses()
    this.userId =  localStorage.getItem('id')
    this.getEnrolledActivities()
    this.fetchBookedSlots();
    this.getFeedbackData(this.userId);
    this.getAvgGrade(this.userId)
    // this.getFeedBack(this.userId)
    this.getFeedItems(this.userId)
    this.getAllEnrolledDetails().subscribe(
      (result) => {
        this.enrolledDetails = result;
        console.log(this.enrolledDetails,"----enrolled Details-------------------");
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
    this.getEnrolledCourseActivities();
    this.getCourseDetails(this.userId).subscribe({
      next: courses => {
        console.log(courses,"--------------------coursee")
        this.enrolledCourses = courses;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading courses:', err);
        this.error = 'Failed to load courses';
        this.loading = false;
      }
    });
   
    this.loadEnrolledCourses(this.userId)
    this.loadCourseDetails()
    this.getEnrolloCourses(this.userId)
    this.getEnrolledCourseActivites(this.userId)
    this.courses.forEach(course => {
      // this.loadProjectProgress(course.id);
    });
    console.log(this.userId)
    this.getCandidateDetails(this.userId)
    this.getEnrolledCourses(this.userId)
   this. getSubmittedAssignment(this.userId)
   this.getUpcomingAssignment(this.userId)
   this.getFeedback(this.userId)
   this.getUpcomingActivites(this.userId)
    // this.getCoursePercentage()
    this.getEnrollmentStatusCourse(this.userId)
    this.loadNotifications()
    this.dashboardService.getCandidateData().subscribe(
      data => {
        this.candidateData = data;
        this.loading = false;
      },
      error => {
        console.error('Error fetching candidate data:', error);
        this.loading = false;
      }
    );
    this.fetchCoursesWithDetails(this.userId)
    this.route.queryParams.subscribe(params => {
      if (params['activeTab']) {
        this.setActiveSection(params['activeTab']);
        console.log(params['activeTab'])
      }
    });
  console.log(this.enrolledIds,"-------enroledIds-------------------------")
    this.dashboardService.getFeedbackAndGrades().subscribe(
      feedback => this.feedback = feedback
    );
   
    // this.dashboardService.getNotifications().subscribe(
    //   notifications => this.notifications = notifications
    // );
 
 
    this.dashboardService.getUpcomingActivities().subscribe(
      activities => this.activities = activities
    );
 
    this.dashboardService.getResources().subscribe(
      resources => this.resources = resources
    );
 
  }
  loadEnrolledCourses(userId:any) {
    console.log(this.achievements,"---------8-8-888-8-------")
    this.dashboardService.getEnrolledCourses(userId).subscribe((courses: any) => {
      this.EnrolledCourses = courses.map((course:any) => ({
        ...course,
        disabled: course.progress < 80
       
      }));
     this.enrolledIds = courses.map((course:any)=>{
      return course.id
     })
     this.enrolledIds.forEach((id:any) => {
      this.getCourseProgress(id);
    });
    console.log(this.projectProgress,"projectProgresssssssssssssssssss")
     console.log(this.enrolledIds,"enrolledIdssss...................")
      this.achievements = this.enrolledCourses.filter((course:any) => course.progress >= 80);
      console.log(this.achievements,"---------8-8-888-8-------")
    });
  }
  getCandidateDetails(id:any){
   
      this.dashboardService.getCandidateDetails(id).subscribe((res)=>{
          this.candidateDetails = res;
          console.log(this.candidateDetails,"canddatedetails")
         
 
      })
  }
  image(toolImage:any){
    return this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${toolImage}`);
 
  }
  // getAssignmentDetailsByusingCourseId(userId: string): Observable<any> {
  //   console.log(userId,"--------------------------")
 
  //   return this.http.get(`${environment.apiBaseUrl}/course/1`);
  // }
  // -------------------------------
  getCourseDetails(userId: any): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/enrollment/user/${userId}`);
  }
 
  getAssignmentByCourseId(courseId: any): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/course/${courseId}`);
  }
 
  getAllEnrolledDetails(): Observable<any> {
    return this.getCourseDetails(3).pipe(
      switchMap((courseResp: any) => {
        const courseId = courseResp.course.id;
        return this.getAssignmentByCourseId(courseId).pipe(
          map((assignResp: any) => {
            return {
              ...courseResp,
              ...assignResp
            };
          })
        );
      })
    );
  }
  setActiveSection(section: string) {
    this.activeSection = section;
  }
 
  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }
  markAsRead(notificationId: number) {
    this.dashboardService.markNotificationAsRead(notificationId).subscribe(
      () => {
        // Update the notification list
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
      }
    );
  }
 
  // getEnrolledCourses(id:any){
  //   this.dashboardService.getEnrolledCourses(id).subscribe((res)=>{
  //     this.enrolledCourseCards = res;
  //     console.log(res,"courseDetailsssssss")
  //   })
  // }
 
 
 
 
getEnrolledCourses(id: any): Observable<any[]> {
 
    return this.http.get<any[]>(`${environment.apiBaseUrl}/enrollment/user/${id}`).pipe(
 
      switchMap((courses: any[]) => {
 
        if (courses.length === 0) {
 
          // If no courses are enrolled, return an empty array
 
          return of([]);
 
        }
 
        // Fetch progress for each course
 
        const progressRequests = courses.map(course =>
 
          this.getCourseCompletionFraction(id, course.id).pipe(
 
            map((progress: any) => ({
 
              ...course,
 
              progress: progress // Assuming the response has a 'value' field with the progress percentage
 
            })),
 
            catchError(error => {
 
              console.error(`Error fetching progress for course ${course.id}:`, error);
 
              return of({ ...course, progress: 0 }); // Default progress to 0 in case of error
 
            })
 
          )
 
        );
 
        return forkJoin(progressRequests);
 
      }),
 
      catchError(error => {
 
        console.error('Error fetching enrolled courses:', error);
 
        return of([]); // Return an empty array in case of error
 
      })
 
    );
 
  }
 
  getCourseCompletionFraction(userId: any, courseId: any): Observable<any> {
 
    return this.http.get<any>(`${environment.apiBaseUrl}/video/progress/percentage/user/${userId}/course/${courseId}`).pipe(
 
      map((response: any) => response), // Adjust this mapping based on your actual response structure
 
      catchError(error => {
 
        console.error(`Error fetching course completion fraction for user ${userId}, course ${courseId}:`, error);
 
        return of({ value: 0 }); // Default progress to 0 in case of error
 
      })
 
    );
 
  }
 
 
 
  getEnrollmentStatusCourse(id:any){
    this.dashboardService.getEnrolledCourses(id).subscribe((res)=>{
      this.enrolledCourses = res;
      console.log("enrolledCourses", this.enrolledCourses)
      for (let candidate of this.enrolledCourses) {
        console.log(candidate.course.id,candidate.course.courseTerm,"caasasa=--"); // iterate over each object in the array
        this.getCoursePercentage(candidate.course.id,candidate.course.courseTerm)
      }
    })
  }
  getEnrolledCourseActivites(userID:any){
    this.dashboardService.getEnrolledCourseActivitesTitles(userID).subscribe((res)=>{
      this.enrolledCourseActivites= res ;
      console.log("enrolledCourseActivities---------",this.enrolledCourseActivites)
    })
  }
  getCoursePercentage(courseID: any, courseTerm: any) {
    this.dashboardService.getCourseCompletionFraction(courseID, this.userId, courseTerm).subscribe(
      (res: any) => {
        this.courseCompletionFraction = res;
        console.log(this.courseCompletionFraction, res);
        console.log(this.courseCompletionFraction, courseID, this.userId, "fractioncomplteation");
       
        if (res === 0) {
          this.notStartedCount++; // increment not started count
        } else if (res > 0 && res < 99) {
          this.inProgressCount++; // increment in progress count
        } else if (res === 100) {
          this.completedCount++; // increment completed count
        }
          this.enrolledCourseCount ++;
       
        this.overallProgress = [
          { name: 'Completed', value: this.completedCount },
          { name: 'In Progress', value: this.inProgressCount },
          { name: 'Not Started', value: this.notStartedCount }
        ];
       
        console.log(this.notStartedCount, this.inProgressCount, this.completedCount, "sattus for the counts enrolled");
      },
      (error) => {
        console.error('Error fetching course completion fraction:', error);
        // Handle the error appropriately
      }
    );
  }
  getSubmittedAssignment(id: string) {
    this.dashboardService.getCompletedAssignment(id).subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.completedAssignment = res.map(assignment => ({
            ...assignment,
            formattedDate: this.formatDateIndian(assignment.submittedAt)
          }));
        } else if (typeof res === 'object' && res !== null) {
          this.completedAssignment = [{
            ...res,
            formattedDate: this.formatDateIndian(res.submittedAt)
          }];
        } else {
          console.error('Unexpected response format:', res);
        }
       
        console.log("completedAssignment", this.completedAssignment);
      },
      error: (err) => {
        console.error('Error fetching completed assignments:', err);
      }
    });
  }
 
  formatDateIndian(dateArray: number[]): string {
    if (!Array.isArray(dateArray) || dateArray.length < 7) {
      console.error('Invalid date array:', dateArray);
      return 'Invalid Date';
    }
    const [year, month, day, hour, minute, second, nanosecond] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute, second, nanosecond / 1000000);
   
    const formatter = new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
 
    return formatter.format(date);
  }
  formatDateArray(dateArray: number[]): { startDate: number[] } | string {
    if (!Array.isArray(dateArray) || dateArray.length < 5) {
      console.error('Invalid date array:', dateArray);
      return '';
    }
 
    const [year, month, day, hour, minute, second = 0, nanosecond = 0] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute, second, nanosecond / 1000000);
 
    const startDateString = `${date.getFullYear()}-${this.padZero(date.getMonth() + 1)}-${this.padZero(date.getDate())} ${this.padZero(date.getHours())}:${this.padZero(date.getMinutes())}`;
 
    return startDateString;
  }
 
  padZero(value: number): string {
    return (value < 10 ? '0' : '') + value.toString();
  }
 
  getUpcomingAssignment(id: any) {
    this.dashboardService.getUpcomingAssignment(id).subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.UpcomingAssignment = res.map((assignment: any) => ({
            ...assignment,
            formattedStartDate: this.formatDateFromArray(assignment.startDate),
            formattedEndDate: this.formatDateFromArray(assignment.endDate),
            formattedReviewDate: this.formatDateFromArray(assignment.reviewMeetDate)
          }));
        } else if (typeof res === 'object' && res !== null) {
          this.UpcomingAssignment = [{
            ...res,
            formattedStartDate: this.formatDateFromArray(res.startDate),
            formattedEndDate: this.formatDateFromArray(res.endDate),
            formattedReviewDate: this.formatDateFromArray(res.reviewMeetDate)
          }];
        } else {
          console.error('Unexpected response format:', res);
        }
       
        console.log("upcomingAssignment", this.UpcomingAssignment);
      },
      error: (err) => {
        console.error('Error fetching upcoming assignments:', err);
      }
    });
  }
 
  formatDateFromArray(dateArray: number[]): string {
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      return 'Invalid Date';
    }
    const [year, month, day, hour = 0, minute = 0, second = 0, nanosecond = 0] = dateArray;
    return this.formatDateIndian([year, month, day, hour, minute, second, nanosecond]);
  }
 
  getFeedback(id:any){
    console.log("feedback---------------------")
    this.dashboardService.getFeedbackByUSerID(id).subscribe((res:any)=>{
        console.log(res,"feedback")
        this.feedBack = res;
       
    this.parsedData = this.feedBack.map((item:any) => {
      const obj:any = {};
      const parts = item.split(', ');
      parts.forEach((part:any) => {
        const [key, value] = part.split(': ');
        obj[key] = value;
      });
      return obj;
    });
   
    console.log(this.parsedData,"feedbak");
    })
   
   
   
  }
 
  getUpcomingActivites(id:any){
    this.dashboardService.getUpcomingActivies(id).subscribe((res:any)=>{
      this.upcomingActivites = res;
      this.Assignements = res.assessments.map((assements:any)=>({
        ...assements,
        formattedDueDate: this.formatDateArray(assements.endDate),
        formattedstartDate: this.formatDateArray(assements.startDate),
        formattedreviewMeetDate: this.formatDateArray(assements.reviewMeetDate)
        //
      }))
      this.Assignements = res.assessments.map((assements:any)=>({
        ...assements,
        formattedDueDate: this.formatDateArray(assements.endDate),
        formattedstartDate: this.formatDateArray(assements.startDate),
        formattedreviewMeetDate: this.formatDateArray(assements.reviewMeetDate)
        //
      }))
      this.quizzes = res.quizzes.map((quizzes:any)=>({
        ...quizzes,
        formattedDueDate: this.formatDateArray(quizzes.endDate),
        formattedstartDate: this.formatDateArray(quizzes.startDate),
        formattedreviewMeetDate: this.formatDateArray(quizzes.reviewMeetDate)
        //
      }))
      this.projects = res.projects.map((projects:any)=>({
        ...projects,
        formattedDueDate: this.formatDateArray(projects.projectDeadline),
        formattedstartDate: this.formatDateArray(projects.startDate),
        formattedreviewMeetDate: this.formatDateArray(projects.reviewMeetDate)
        //
      }))
      console.log(this.Assignements ,"-----assements----------");
    })
  }
  loadNotifications(): void {
    console.log("data----","data")
    if (this.userId) {
      this.dashboardService.getNotifications(Number(this.userId)).subscribe(
        (data: Notification[]) => {
          this.categorizeNotifications(data);
          console.log("data----",this.categorizeNotifications)
        },
        (error: any) => {
          console.error('Error fetching notifications', error);
        }
      );
    }
  }
 
  categorizeNotifications(notifications: Notification[]): void {
    this.dueNotifications = notifications.filter(notification =>
      notification.content.startsWith('Reminder')
     
    );
    this.submittedNotifications = notifications.filter(notification =>
      notification.content.includes('submitted')
    );
    console.log("0---------------------------")
  }
 
  toggleShowMoreDue(): void {
    this.showMoreDue = !this.showMoreDue;
  }
 
  toggleShowMoreSubmitted(): void {
    this.showMoreSubmitted = !this.showMoreSubmitted;
  }
  navigateToActivtes(courseId:any){
    this.router.navigate(['candiatedashboardactivites'], {
      queryParams: {
        param1: courseId,
       
      }
    });
  }
 
 
  downloadFile(id: any) {
     this.dashboardService.getFile(id).subscribe(
       (res: any) => {
         console.log('Received response:', res);
       
         if (!res || !res.courseDocument) {
           console.error('No course document in response');
           // Handle error (e.g., show an error message to the user)
           return;
         }
 
         let blob: Blob;
         if (typeof res.courseDocument === 'string') {
           blob = this.base64ToBlob(res.courseDocument, 'application/pdf');
         } else {
           console.error('Invalid courseDocument type:', typeof res.courseDocument);
           return;
         }
 
         console.log('Blob:', blob);
         console.log('Blob type:', blob.type);
         console.log('Blob size:', blob.size);
 
         try {
           const url = window.URL.createObjectURL(blob);
           const a = document.createElement('a');
           a.href = url;
           a.download = `${res.courseTitle || 'course'}_document.pdf`; // Use course title in filename
           document.body.appendChild(a);
           a.click();
           document.body.removeChild(a);
           window.URL.revokeObjectURL(url);
         } catch (error) {
           console.error('Error creating object URL:', error);
           // Handle error (e.g., show an error message to the user)
         }
       },
       (error) => {
         console.error('Error fetching file:', error);
         // Handle error (e.g., show an error message to the user)
       }
     );
   }
   private base64ToBlob(base64: string, type: string = 'application/pdf'): Blob {
     // Remove data URL prefix if present
     const base64Data = base64.replace(/^data:application\/pdf;base64,/, "");
 
     const byteCharacters = atob(base64Data);
     const byteArrays = [];
 
     for (let offset = 0; offset < byteCharacters.length; offset += 512) {
       const slice = byteCharacters.slice(offset, offset + 512);
       const byteNumbers = new Array(slice.length);
       for (let i = 0; i < slice.length; i++) {
         byteNumbers[i] = slice.charCodeAt(i);
       }
       const byteArray = new Uint8Array(byteNumbers);
       byteArrays.push(byteArray);
     }
 
     return new Blob(byteArrays, { type: type });
   }
 
   previewFile(id: any) {
     this.dashboardService.getFile(id).subscribe(
       (res: any) => {
         console.log('Received response:', res);
       
         if (!res || !res.courseDocument) {
           console.error('No course document in response');
           // Handle error (e.g., show an error message to the user)
           return;
         }
 
         let blob: Blob;
         if (typeof res.courseDocument === 'string') {
           blob = this.base64ToBlob(res.courseDocument, 'application/pdf');
         } else {
           console.error('Invalid courseDocument type:', typeof res.courseDocument);
           return;
         }
 
         console.log('Blob:', blob);
         console.log('Blob type:', blob.type);
         console.log('Blob size:', blob.size);
 
         try {
           const url = window.URL.createObjectURL(blob);
           window.open(url, '_blank');
         } catch (error) {
           console.error('Error creating object URL:', error);
           // Handle error (e.g., show an error message to the user)
         }
       },
       (error) => {
         console.error('Error fetching file:', error);
         // Handle error (e.g., show an error message to the user)
       }
     );
   }
  // downloadFile(id: any) {
  //   this.dashboardService.getFile(id).subscribe(
  //     (res: any) => {
  //       console.log('Received response:', res);
       
  //       if (!res || !res.courseDocument) {
  //         console.error('No course document in response');
  //         // Handle error (e.g., show an error message to the user)
  //         return;
  //       }
 
  //       let blob: Blob;
  //       if (typeof res.courseDocument === 'string') {
  //         blob = this.base64ToBlob(res.courseDocument, 'application/pdf');
  //       } else {
  //         console.error('Invalid courseDocument type:', typeof res.courseDocument);
  //         return;
  //       }
 
  //       console.log('Blob:', blob);
  //       console.log('Blob type:', blob.type);
  //       console.log('Blob size:', blob.size);
 
  //       try {
  //         const url = window.URL.createObjectURL(blob);
  //         const a = document.createElement('a');
  //         a.href = url;
  //         a.download = `${res.courseTitle || 'course'}_document.pdf`; // Use course title in filename
  //         document.body.appendChild(a);
  //         a.click();
  //         document.body.removeChild(a);
  //         window.URL.revokeObjectURL(url);
  //       } catch (error) {
  //         console.error('Error creating object URL:', error);
  //         // Handle error (e.g., show an error message to the user)
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching file:', error);
  //       // Handle error (e.g., show an error message to the user)
  //     }
  //   );
  // }
  // private base64ToBlob(base64: string, type: string = 'application/pdf'): Blob {
  //   // Remove data URL prefix if present
  //   const base64Data = base64.replace(/^data:application\/pdf;base64,/, "");
 
  //   const byteCharacters = atob(base64Data);
  //   const byteArrays = [];
 
  //   for (let offset = 0; offset < byteCharacters.length; offset += 512) {
  //     const slice = byteCharacters.slice(offset, offset + 512);
  //     const byteNumbers = new Array(slice.length);
  //     for (let i = 0; i < slice.length; i++) {
  //       byteNumbers[i] = slice.charCodeAt(i);
  //     }
  //     const byteArray = new Uint8Array(byteNumbers);
  //     byteArrays.push(byteArray);
  //   }
 
  //   return new Blob(byteArrays, { type: type });
  // }
 
  // previewFile(id: any) {
  //   this.dashboardService.getFile(id).subscribe(
  //     (res: any) => {
  //       console.log('Received response:', res);
       
  //       if (!res || !res.courseDocument) {
  //         console.error('No course document in response');
  //         // Handle error (e.g., show an error message to the user)
  //         return;
  //       }
 
  //       let blob: Blob;
  //       if (typeof res.courseDocument === 'string') {
  //         blob = this.base64ToBlob(res.courseDocument, 'application/pdf');
  //       } else {
  //         console.error('Invalid courseDocument type:', typeof res.courseDocument);
  //         return;
  //       }
 
  //       console.log('Blob:', blob);
  //       console.log('Blob type:', blob.type);
  //       console.log('Blob size:', blob.size);
 
  //       try {
  //         const url = window.URL.createObjectURL(blob);
  //         window.open(url, '_blank');
  //       } catch (error) {
  //         console.error('Error creating object URL:', error);
  //         // Handle error (e.g., show an error message to the user)
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching file:', error);
  //       // Handle error (e.g., show an error message to the user)
  //     }
  //   );
  // }
  loadCourseDetails(): void {
    this.http.get<Course[]>(`${environment.apiBaseUrl}/enrollment/user/${this.userId}`).subscribe(
      (res) => {
        this.courseDetails = res;
        console.log()
      },
      (error) => {
        console.error('Error fetching course details:', error);
        // You might want to set a default value or show an error message to the user
      }
    );
  }
  // ------------------------------------------------------------------
  getCourseProgress(courseId: number): number {
    const cacheKey = `courseProgress_${courseId}`;
    const cachedValue = this.getCachedValue(cacheKey);
    if (cachedValue !== null) return cachedValue as number;
 
    // If not in cache, fetch from API
    this.http.get<number>(`${environment.apiBaseUrl}/video/progress/percentage/user/${this.userId}/course/${courseId}`).subscribe(
      (progress: any) => {
        this.projectProgresses.push(progress); // Store the progress result in projectProgress array
        console.log(this.projectProgress, "projectProgress--------------");
      },
      (error) => {
        console.error('Error fetching course progress:', error);
        return 0;
      }
    );
 
    return 0; // Return 0 while waiting for the API response
  }
 getProgressColor(progress: number): string {
    if (progress < 30) return '#FF6B6B';
    if (progress < 70) return '#FFD93D';
    return '#6BCB77';
  }
  getAssessmentProgress(courseId: number,userId:any): string {
    const cacheKey = `assessmentProgress_${courseId}`;
    const cachedValue = this.getCachedValue(cacheKey);
    if (cachedValue !== null) return cachedValue as string;
 
    this.http.get(`${environment.apiBaseUrl}/submittedByTotal/${courseId}?userId=${userId}`, { responseType: 'text' }).subscribe(
      (progress) => {
        this.setCachedValue(cacheKey, progress);
        return progress;
      },
      (error) => {
        console.error('Error fetching assessment progress:', error);
        return '0/0';
      }
    );
 
    return '0/0'; // Return '0/0' while waiting for the API response
  }
// getQuizProgress(courseId: number): string {
//     const cacheKey = `quizProgress_${courseId}`;
//     const cachedValue = this.getCachedValue(cacheKey);
//     if (cachedValue !== null) return cachedValue as string;
 
//     this.http.get(`${environment.apiBaseUrl}/api/quizzes/progress/ratio/user/${this.userId}/lessonModule/${courseId}`, { responseType: 'text' }).subscribe(
//       (progress) => {
//         this.setCachedValue(cacheKey, progress);
//         return progress;
//       },
//       (error) => {
//         console.error('Error fetching quiz progress:', error);
//         return '0/0';
//       }
//     );
 
//     return '0/0'; // Return '0/0' while waiting for the API response
//   }
  // getProjectProgress(courseId: number): Observable<string> {
  //   if (!this.projectProgressMap[courseId]) {
  //     this.projectProgressMap[courseId] = this.getProjectProgress(courseId).pipe(
  //       map(progress => progress || '0/0'),
  //       catchError(error => {
  //         console.error('Error fetching project progress:', error);
  //         return of('0/0');
  //       })
  //     );
  //   }
  //   return this.projectProgressMap[courseId];
  // }
 
  // loadProjectProgress(courseId: number) {
  //   this.getProjectProgress(courseId).subscribe(
  //     (progress) => {
  //       this.projectProgress[courseId] = progress;
  //     },
  //     (error) => {
  //       console.error('Error loading project progress:', error);
  //       this.projectProgress[courseId] = '0/0';
  //     }
  //   );
  // }
//  navigateToStudentCourseDetailsPage(courseId: number): void {
//     this.router.navigate(['/studentdetails', courseId]);
//   }
  private getCachedValue(key: string): number | string | null {
    const cached = this.progressCache[key];
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.value;
    }
    return null;
  }
 
  private setCachedValue(key: string, value: number | string): void {
    this.progressCache[key] = {
      value: value,
      timestamp: Date.now()
    };
  }
  course:any = [
    {
      title: 'Introduction to Angular',
      quizzes: ['Quiz 1', 'Quiz 2', 'Quiz 3'],
      assignments: ['Assignment 1', 'Assignment 2'],
      projects: ['Final Project']
    },
    // Add more courses as needed
    {
      title: 'Introduction to react',
      quizzes: ['Quiz 1', 'Quiz 2', 'Quiz 3','Quiz 3','Quiz 3','Quiz 3'],
      assignments: ['Assignment 1', 'Assignment 2'],
      projects: ['Final Project']
    },
    // Add more courses as needed
    {
      title: 'Introduction to Fue',
      quizzes: ['Quiz 1', 'Quiz 2', 'Quiz 3'],
      assignments: ['Assignment 1', 'Assignment 2'],
      projects: ['Final Project']
    },
    // Add more courses as needed
  ];
  viewReport(course: any) {
    // Implement the logic to view the report for the selected course
    console.log('Viewing report for:', course.title);
  }
  fetchCoursesWithDetails(userId: any) {
    this.http.get<any[]>(`${environment.apiBaseUrl}/enrollment/user/${userId}`).pipe(
      mergeMap(courses => {
        const courseDetailsRequests = courses.map((course: any) =>
          forkJoin({
            projectProgress: this.http.get<number>(`${environment.apiBaseUrl}/project/projectProgress/${course.course.id}/user/${userId}`).pipe(catchError(() => of(0))),
            overAllCourseProgress: course.course.courseTerm === 'long'
              ? this.http.get<number>(`${environment.apiBaseUrl}/video/progressOfCourse/user/${userId}/course/${course.course.id}`).pipe(catchError(() => of(0)))
                                                      // /progressOfCourseOfUser/user/${userId}/course/${course.course.id}
              : this.http.get<number>(`${environment.apiBaseUrl}/video/progressOfCourseOfUser/user/${userId}/course/${course.course.id}`).pipe(catchError(() => of(0))),
            quizProgressFraction: this.http.get(`${environment.apiBaseUrl}/api/quizzes/progress/ratio/course/${course.course.id}?userId=${userId}`, { responseType: 'text' }).pipe(catchError(() => of('0/0'))),
            AssignmentProgressFraction: this.http.get(`${environment.apiBaseUrl}/submittedByTotalCourse/${course.course.id}?userId=${userId}`, { responseType: 'text' }).pipe(catchError(() => of('0/0'))),
            ProjectProgressFraction: this.http.get(`${environment.apiBaseUrl}/project/progress/${course.course.id}/user/${userId}`, { responseType: 'text' }).pipe(catchError(() => of('0/0')))
          }).pipe(
            map(({ projectProgress, overAllCourseProgress, quizProgressFraction, AssignmentProgressFraction, ProjectProgressFraction }) =>
              ({ ...course, projectProgress, overAllCourseProgress, quizProgressFraction, AssignmentProgressFraction, ProjectProgressFraction })
            )
          )
        );
        return forkJoin(courseDetailsRequests);
      }),
      catchError(error => {
        console.error('Error fetching courses:', error);
        return of([]);
      })
    ).subscribe(
      coursesWithDetails => {
        this.enrolledCourseList = coursesWithDetails;
        console.log('Courses with details:', this.enrolledCourseList);
      }
    );
  }
getEnrolledCourseActivities() {
  const userId = localStorage.getItem('id');
  if (userId) {
    this.dashboardService.getEnrolledCourseActivitesTitles(userId).subscribe(
      (res: any) => {
        this.enrolledCourseActivities = res.map((item: any) => ({
          courseTitle: item.courseTitle,
          quizNames: item.quizNames || [],
          assignmentTitles: item.assignmentTitles || [],
          projectTitles: item.projectTitles || [],
          projectProgress: item.projectProgress || 0.0,
          quizProgress: item.quizProgress || 0.0,
          assignmentProgress: item.assignmentProgress || 0.0,
          courseId: item.courseId,
          courseDescription: item.courseDescription
        }));
        this.courseTitles = this.enrolledCourseActivities.map(course => course.courseTitle);
       
        if (this.courseTitles.length > 0) {
          this.selectedCourse = this.courseTitles[0];
        }
       
        this.filterCourses();
      },
      error => {
        console.error('Error fetching enrolled course activities:', error);
      }
    );
  }
}
 
filterCourses() {
  this.filteredCourseActivities = this.enrolledCourseActivities.filter(
    course => course.courseTitle === this.selectedCourse
  );
}
// course acitvites------------------
getEnrolledActivities() {
  const userId = localStorage.getItem('id');
  if (userId) {
    this.dashboardService.getEnrolledCourses(userId).subscribe((res) => {
      this.enrolledCourseLists = res;
      this.dropdownOptions = this.enrolledCourseLists.map((course: any) => ({
        value: course.course.courseTitle,
        text: course.course.courseTitle,
        courseId: course.course.id,
        courseTerm: course.course.courseTerm
      }));
    });
  }
}

onCourseSelect(event: Event) {
  // console.log(event.target)
  const selectedValue = (event.target as HTMLSelectElement).value;
  console.log(selectedValue,"course IDcourseDetails")
  if (selectedValue) {
    const [courseId, courseTerm] = selectedValue.split('|');
    this.courseIDforcd = courseId
    
    if (courseId !== this.previousSelectedCourseId) {
      this.previousSelectedCourseId = courseId;
      this.isLongTerm = courseTerm.toLowerCase() === 'long';
      
      // Reset selections
      this.selectedModuleOrLessonId = '';
      this.selectedLessonId = '';
      this.lessonOptions = [];
      this.quizDetails = null;
      this.assignmentDetails = null;
      
      console.log(`Course changed. Fetching ${this.isLongTerm ? 'modules' : 'lessons'} for course ID: ${courseId}`);
      
      if (this.isLongTerm) {
        this.getModulesListByCourseId(courseId);
      } else {
        this.getLessonbyCourseID(courseId);
      }

      // Fetch project details
      this.getProjectDetails(courseId);
    } else {
      console.log('Course selection has not changed.');
    }
  } else {
    // Reset when no course is selected
    this.moduleOrLessonOptions = [];
    this.lessonOptions = [];
    this.selectedModuleOrLessonId = '';
    this.selectedLessonId = '';
    this.previousSelectedCourseId = null;
    this.courseDetails = null;
    this.quizDetails = null;
    this.assignmentDetails = null;
    this.projectDetails = null;
  }
}

getModulesListByCourseId(courseId: string) {
  console.log(`Fetching modules for course ID: ${courseId}`);
  this.http.get(`${environment.apiBaseUrl}/getModuleByCourse/${courseId}`).subscribe(
    (res: any) => {
      this.moduleOrLessonOptions = res.map((module: any) => ({
        id: module.id,
        name: module.moduleName
      }));
      console.log('Modules fetched:', this.moduleOrLessonOptions);
    },
    (error) => {
      console.error('Error fetching modules:', error);
      this.moduleOrLessonOptions = [];
    }
  );
}

getLessonbyCourseID(courseId: string) {
  console.log(`Fetching lessons for course ID: ${courseId}`);
  this.http.get(`${environment.apiBaseUrl}/lesson/course/${courseId}`).subscribe(
    (res: any) => {
      this.moduleOrLessonOptions = res.map((lesson: any) => ({
        id: lesson.id,
        name: lesson.lessonTitle
      }));
      console.log('Lessons fetched:', this.moduleOrLessonOptions);
    },
    (error) => {
      console.error('Error fetching lessons:', error);
      this.moduleOrLessonOptions = [];
    }
  );
}

onModuleOrLessonSelect(event: Event) {
  const selectedId = (event.target as HTMLSelectElement).value;
  console.log(`Selected ${this.isLongTerm ? 'module' : 'lesson'} ID:`, selectedId);
  
  if (this.isLongTerm && selectedId) {
    this.getLessonsByModuleId(selectedId);
  } else if (!this.isLongTerm && selectedId) {
    this.fetchLessonDetails(selectedId);
  }
}

getLessonsByModuleId(moduleId: string) {
  console.log(`Fetching lessons for module ID: ${moduleId}`);
  this.http.get(`${environment.apiBaseUrl}/lesson/module/${moduleId}`).subscribe(
    (res: any) => {
      this.lessonOptions = res.map((lesson: any) => ({
        id: lesson.id,
        lessonTitle: lesson.lessonTitle
      }));
      console.log('Lessons fetched:', this.lessonOptions);
      this.selectedLessonId = '';
      this.quizDetails = null;
      this.assignmentDetails = null;
    },
    (error) => {
      console.error('Error fetching lessons:', error);
      this.lessonOptions = [];
      this.selectedLessonId = '';
    }
  );
}

onLessonSelect(event: Event) {
  const selectedId = (event.target as HTMLSelectElement).value;
  console.log(`Selected lesson ID:`, selectedId);
  this.fetchLessonDetails(selectedId);
}

fetchLessonDetails(lessonId: string) {
  const userId = localStorage.getItem('id');
  if (userId) {
    this.getQuizProgress(lessonId, userId);
    this.getAssignmentDetails(lessonId, userId);
  }
}

getQuizProgress(lessonId: string, userId: string) {
  this.http.get(`${environment.apiBaseUrl}/api/quizzes/progress/details/${lessonId}?userId=${userId}`).subscribe(
    (res: any) => {
      console.log('Quiz progress:', res);
      this.quizDetails = res;
      this.updateCourseDetails(res);
    },
    (error) => {
      console.error('Error fetching quiz progress:', error);
    }
  );
}
getAssignmentDetails(lessonId: string, userId: string) {
  this.http.get(`${environment.apiBaseUrl}/assignmentsDetails/${lessonId}?userId=${userId}`).subscribe(
    (res: any) => {
      console.log('Assignment details:', res);
      this.assignmentDetails = res;
      this.updateCourseDetails(res);
    },
    (error) => {
      console.error('Error fetching assignment details:', error);
    }
  );
}

getProjectDetails(courseId: string) {
  const userId = localStorage.getItem('id');
  if (userId) {
    this.http.get(`${environment.apiBaseUrl}/project/details/byCourse/${courseId}?userId=${userId}`).subscribe(
      (res: any) => {
        console.log('Project details:', res);
        this.projectDetails = res;
        this.updateCourseDetails(res);
      },
      (error) => {
        console.error('Error fetching project details:', error);
      }
    );
  }
}

updateCourseDetails(data: any) {
  if (!this.courseDetails) {
    this.courseDetails = {
      courseTitle: '',
      totalQuizzesCount: 0,
      submittedQuizzesCount: 0,
      totalAssignmentsCount: 0,
      submittedAssignmentsCount: 0,
      totalProjectsCount: 0,
      completedProjectsCount: 0
    };
  }
  console.log(data,"data courseDetails")

  if (data.courseTitle) {
    this.courseDetails.courseTitle = data.courseTitle;
    this.courseDetails.courseId = data.courseId;
  }

  if (data.quizzes) {
    this.courseDetails.totalQuizzesCount = data.quizzes.length;
    this.courseDetails.submittedQuizzesCount = data.quizzes.filter((q: any) => q.status === 'Completed').length;
  }

  if (data.assignments) {
    this.courseDetails.totalAssignmentsCount = data.assignments.length;
    this.courseDetails.submittedAssignmentsCount = data.submittedAssignmentsCount || 0;
  }

  if (data.projects) {
    this.courseDetails.totalProjectsCount = data.projects.length;
    this.courseDetails.completedProjectsCount = data.projects.filter((p: any) => p.status.toLowerCase() === 'completed').length;
  }
}
// getCourseDetailss(userId: number): Observable<CourseDetail[]> {
//   console.log(`Fetching course details for userId: ${userId}`);
//   return this.http.get<CourseDetail[]>(`/course/course/detail-by-user?userId=${userId}`).pipe(
//     tap(courses => console.log('Received courses:', courses))
//   );
// }

viewReports(courseId: number) {
  console.log(`Viewing report for courseId: ${courseId}`);
  this.isReportVisible = true;
  this.isLoading = true;
  document.body.classList.add('modal-open');

  this.userId = localStorage.getItem('id');
  this.http.get(`${environment.apiBaseUrl}/course/course/detail-by-user?userId=${this.userId}`)
    .subscribe(
      (res: any) => {
        setTimeout(() => {  // Simulating a delay for demo purposes
          this.selectedCourseDetails = res.find((course: any) => course.courseId == courseId);
          this.isLoading = false;

          if (this.selectedCourseDetails) {
            console.log("Selected course details:", this.selectedCourseDetails);
          } else {
            console.log("No matching course found for courseId:", courseId);
          }
        }, 1000);  // 1 second delay
      },
      (error) => {
        console.error("Error fetching course details:", error);
        this.isLoading = false;
      }
    );
}

closeReport() {
  this.isReportVisible = false;
  document.body.classList.remove('modal-open');
}


// ----------------------------------------------------
getAvgGrade(userId:any){
  this.http.get(`${environment.apiBaseUrl}`).subscribe((res)=>{
    console.log(res);
    this.avgGrade = res;
  })
}
getActivityProgress(type: 'quiz' | 'assignment' | 'project', title: string, course: CourseActivity) {
  let progress: number;
  let desc:any;
  switch (type) {
    case 'quiz':
      progress = course.quizProgress;
       desc = course.courseDescription;
      break;
    case 'assignment':
      progress = course.assignmentProgress;
       desc = course.courseDescription;
      break;
    case 'project':
      progress = course.projectProgress;
      desc = course.courseDescription;
      break;
  }
  this.selectedProgress = { type, title, progress,desc };
}
 
viewCourseReport(course: CourseActivity) {
  this.courseReport = {
    courseTitle: course.courseTitle,
    courseDescription: course.courseDescription,
    quizProgress: course.quizProgress,
    assignmentProgress: course.assignmentProgress,
    projectProgress: course.projectProgress
  };
}
 
closeProgressModal() {
  this.selectedProgress = null;
}
 
closeCourseReport() {
  this.courseReport = null;
}
  // ----------------------------- feedback--------------------
  getFeedItems(userId:any){
    this.http.get(`${environment.apiBaseUrl}/teacherFeedback/student/${userId}`).subscribe((res)=>{
      this.feedItems = res;
      console.log("feedback-----",res)
    })
    // this.feedItems = "hi"
  }
  // Inside your Angular component
  bookedSlots1: BookedSlot[] = [];
  fetchBookedSlots(): void {
    const userId = localStorage.getItem('id');
    if (userId) {
      this.mockTestService.getBookedSlotsByStudentId(+userId).subscribe(
        (data: any[]) => {
          console.log('Raw data received:', JSON.stringify(data, null, 2));
          this.bookedSlots1 = data.map((item) => ({
            id: item.slot_id,
            title: item.title || 'N/A',
            slotDate: item.slotDate,
            endDate: item.endDate,
            type: item.type || 'N/A',
            mockId: item.mock_id || null
          }));
          console.log('Processed bookedSlots:', JSON.stringify(this.bookedSlots1, null, 2));
        },
        (error) => {
          console.error('Error fetching booked slots:', error);
          this.bookedSlots1 = [];
        }
      );
    } else {
      console.error('No user ID found in localStorage');
      this.bookedSlots1 = [];
    }
  }
   
  formatSlotTime(slotTime: number[]): string {
    if (!slotTime || slotTime.length < 5) {
      return 'Invalid time';
    }
    const [year, month, day, hour, minute] = slotTime;
    const date = new Date(year, month - 1, day, hour, minute);
    return date.toLocaleString();
  }
   
   
  onGoButtonClick(mockId: number | null): void {
    if (mockId) {
      this.router.navigate(['/mock-test', mockId]);
    }
  }
   
  isButtonEnabled(slotDate: number[], endDate: number[]): boolean {
    if (!slotDate || !endDate) {
      return false;
    }
   
    const startTime = new Date(slotDate[0], slotDate[1] - 1, slotDate[2], slotDate[3], slotDate[4]).getTime();
    const endTime = new Date(endDate[0], endDate[1] - 1, endDate[2], endDate[3], endDate[4]).getTime();
    const currentTime = new Date().getTime();
   
    return currentTime >= startTime && currentTime <= endTime;
  }
     
   
 
 
// onGoButtonClick(mockId: number | null): void {
//   if (mockId) {
//     this.router.navigate(['/mock-test', mockId]);
//   }
// }
getFeedbackData(studentID:any) {
   // You can make this dynamic if needed
   console.log(studentID,"studentID feed and grade")
  this.http.get(`${environment.apiBaseUrl}/teacherFeedback/feedback?studentId=${studentID}`).subscribe(
    (data) => {
      this.feedbackData = data;
    },
    (error) => {
      console.error('Error fetching feedback data:', error);
    }
  );
}
     
  }
 
 
 
 
 
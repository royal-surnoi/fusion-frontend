
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CoursecontentComponent } from './coursecontent/coursecontent.component';
import { QuizComponent } from "./quiz/quiz.component";
import { MentordashboardComponent } from './mentordashboard/mentordashboard.component';
import { MenotperspectveComponent } from './menotperspectve/menotperspectve.component';
import { MetricsviewComponent } from './metricsview/metricsview.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { AssignmentComponent } from './assignment/assignment.component';
import { ChatComponent } from './chat/chat.component';


import { FollowcountComponent } from "./followcount/followcount.component";
import { LearningPageComponent } from './learning-page/learning-page.component';
import { LoginComponent } from "./login/login.component";
import { MentorquizComponent } from './mentorquiz/mentorquiz.component';
import { MentornaddcourseComponent } from './mentornaddcourse/mentornaddcourse.component';

import { UserlistComponent } from './userlist/userlist.component';
import { FollowComponent } from './follow/follow.component';
import { EnrollmentPaymentFormComponent } from './enrollment-payment-form/enrollment-payment-form.component';
import { ModuleComponent } from "./module/module.component";
import { ProfileComponent } from './profile/profile.component';
import { StudentdashboardComponent } from './studentdashboard/studentdashboard.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { CourselandpageComponent } from './courselandpage/courselandpage.component';
import { StudentComponent } from './student/student.component';
import { MentorPerspectiveComponent } from './mentor-perspective/mentor-perspective.component';
import { CoursedashboardComponent } from './coursedashboard/coursedashboard.component';
import { CandidateDashboardComponent } from './candidate-dashboard/candidate-dashboard.component';

import { SubregisterComponent } from './subregister/subregister.component';

import { MentormaindashboardComponent } from "./mentormaindashboard/mentormaindashboard.component";
import { ProjectComponent } from "./project/project.component";
import { AssignmentmentorComponent } from './assignmentmentor/assignmentmentor.component';
import { MentorcourseassignmentupdateComponent } from './mentorcourseassignmentupdate/mentorcourseassignmentupdate.component';
import { AuthService } from './auth.service';

import { TestingComponentComponent } from './testing-component/testing-component.component';
import { FeedComponent } from './feed/feed.component';
import { SubloginComponent } from './sublogin/sublogin.component';
import { NotificationComponent } from './notification/notification.component';

import { CertificateComponent } from './certificate/certificate.component';
import { UsersprofileComponent } from './usersprofile/usersprofile.component';
import { MentoronlineComponent } from './mentoronline/mentoronline.component';
import { CourseCreateMentorComponent } from "./course-create-mentor/course-create-mentor.component";
// import { MockComponent } from "./mock/mock.component";
import { SlotdetailsComponent } from "./slotdetails/slotdetails.component";
import { StudentmockComponent } from "./studentmock/studentmock.component";
import { MockComponent } from "./mock/mock.component";
import { AiquizComponent } from './aiquiz/aiquiz.component';
import { MockActivityComponent } from "./mock-activity/mock-activity.component";
import { PersonalDetailsComponent } from "./personal-details/personal-details.component";
import { MockFeedbackComponent } from "./mock-feedback/mock-feedback.component";
import { MockMentorActivityComponent } from "./mock-mentor-activity/mock-mentor-activity.component";
// import { TestComponent } from "./test/test.component";



 
 
@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, FeedComponent, CandidateDashboardComponent, ProfileComponent, StudentComponent, MentorPerspectiveComponent, CoursedashboardComponent,
    CoursecontentComponent, QuizComponent, MentordashboardComponent, StudentdashboardComponent, StudentDashboardComponent,
    MenotperspectveComponent, MetricsviewComponent, HeaderComponent, FooterComponent, CourselandpageComponent,
    AssignmentComponent, ChatComponent, LearningPageComponent, EnrollmentPaymentFormComponent, ModuleComponent, MentorquizComponent, MentormaindashboardComponent, ProjectComponent,
    AssignmentmentorComponent, MentorcourseassignmentupdateComponent, SubloginComponent, SubregisterComponent, NotificationComponent,
    AssignmentmentorComponent, MentorcourseassignmentupdateComponent, SubloginComponent, SubregisterComponent, UsersprofileComponent, TestingComponentComponent,
    AssignmentmentorComponent, MentorcourseassignmentupdateComponent, SubloginComponent, SubregisterComponent, CertificateComponent, UsersprofileComponent, MentoronlineComponent, CourseCreateMentorComponent, SlotdetailsComponent, StudentmockComponent, MockComponent, AiquizComponent, MockActivityComponent, PersonalDetailsComponent, MockFeedbackComponent, MockMentorActivityComponent]
})
 
 
 
 
 
 

export class AppComponent implements OnInit {
  title = 'FusionProject';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Check login state on app initialization and every route change
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkLoginStatus();
      }
    });
  }
  checkLoginStatus(): void {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const token = localStorage.getItem('token');
    const allowedRoutes = ['/login', '/register']; // Allow login and register pages

    // Redirect logic based on login state
    if (isLoggedIn && token) {
      // User is logged in, prevent them from going to login or register page
      if (allowedRoutes.includes(this.router.url)) {
        this.router.navigate(['/feed']);
      }
    } else {
      // If not logged in, allow navigation only to login or register page
      if (!allowedRoutes.includes(this.router.url)) {
        this.router.navigate(['/login']);
      }
    }
  }

 

}
 
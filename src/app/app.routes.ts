
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MentornaddcourseComponent } from './mentornaddcourse/mentornaddcourse.component';
import { MenotperspectveComponent } from './menotperspectve/menotperspectve.component';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';

import { EnrollmentPaymentFormComponent } from './enrollment-payment-form/enrollment-payment-form.component';
import { LearningPageComponent } from './learning-page/learning-page.component';
import { ProfileComponent } from './profile/profile.component';
import { MentorquizComponent } from './mentorquiz/mentorquiz.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { FollowcountComponent } from './followcount/followcount.component';
import { CoursecontentComponent } from './coursecontent/coursecontent.component';
import { UpdateaddcourseComponent } from './updateaddcourse/updateaddcourse.component';
import { ModuleComponent } from './module/module.component';
import { FeedComponent } from './feed/feed.component';
import { RegisterComponent } from './register/register.component';
import { CourselandpageComponent } from './courselandpage/courselandpage.component';
import { CandidateDashboardComponentComponent } from './candidate-dashboard-component/candidate-dashboard-component.component';
import { CandidateDashboardComponent } from './candidate-dashboard/candidate-dashboard.component';
import { StudentdashboardComponent } from './studentdashboard/studentdashboard.component';
import { SudentcoursedetailComponent } from './sudentcoursedetail/sudentcoursedetail.component';
import { CandidateActivtiesComponent } from './candidate-activties/candidate-activties.component';
import { CoursedashboardComponent } from './coursedashboard/coursedashboard.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { MentorPerspectiveComponent } from './mentor-perspective/mentor-perspective.component';
import { SubregisterComponent } from './subregister/subregister.component';
import { SubloginComponent } from './sublogin/sublogin.component';
import { MentorupdatecourseComponent } from './mentorupdatecourse/mentorupdatecourse.component';
import { ProjectComponent } from './project/project.component';
import { AssignmentmentorComponent } from './assignmentmentor/assignmentmentor.component';
import { ReportquizComponent } from './reportquiz/reportquiz.component';
import { MentorcourseprojectComponent } from './mentorcourseproject/mentorcourseproject.component';
import { MentorcourseassignmentComponent } from './mentorcourseassignment/mentorcourseassignment.component';
import { MentorcourseassignmentupdateComponent } from './mentorcourseassignmentupdate/mentorcourseassignmentupdate.component';
import { MentorcourseprojectupdateComponent } from './mentorcourseprojectupdate/mentorcourseprojectupdate.component';
import { NotificationComponent } from './notification/notification.component';
import { CertificateComponent } from './certificate/certificate.component';
import { UsersprofileComponent } from './usersprofile/usersprofile.component';
import { OnlineclassComponent } from './onlineclass/onlineclass.component';
import { authGuard } from './auth.guard';
import { RecomondcourseComponent } from './recomondcourse/recomondcourse.component';
import { CourseCreateMentorComponent } from './course-create-mentor/course-create-mentor.component';
import { SlotdetailsComponent } from './slotdetails/slotdetails.component';
import { StudentmockComponent } from './studentmock/studentmock.component';
import { MockActivityComponent } from './mock-activity/mock-activity.component';
import { AiquizComponent } from './aiquiz/aiquiz.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { MockFeedbackComponent } from './mock-feedback/mock-feedback.component';
import { MockMentorActivityComponent } from './mock-mentor-activity/mock-mentor-activity.component';
import { MockComponent } from './mock/mock.component';
// import { UsersProfileComponent } from './users-profile/users-profile.component';
 
export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full'  },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', canActivate: [authGuard], children: [
        // { path: 'mentordashboard', component: MenotperspectveComponent },
        { path: 'addcourse', component: MentornaddcourseComponent },
        { path: 'updatecourse/:courseId', component: MentorupdatecourseComponent },
        { path: 'chat', component: ChatComponent },
       
        { path: 'courseland', component: CourselandpageComponent },
        { path: 'enrollpaymentform', component: EnrollmentPaymentFormComponent },
        { path: 'learningPage', component: LearningPageComponent },
        { path: 'profile/:id', component: ProfileComponent },
        { path: 'usersprofile/:id', component: UsersprofileComponent },
        { path: 'followcount', component: FollowcountComponent },
        { path: 'coursecontent', component: CoursecontentComponent },
        { path: 'studentdashboard', component: StudentDashboardComponent },
        { path: 'coursedashboard', component: CoursedashboardComponent },
        { path: 'coursedashboard/:id', component: CoursedashboardComponent },
        { path: 'mentorperspective', component: MentorPerspectiveComponent },
        { path: 'candiatedashboardactivites', component: CandidateDashboardComponent },
        { path: 'mentorquiz/:courseId', component: MentorquizComponent },
        { path: 'mentorassignments/:lessonId', component: AssignmentComponent },
        { path: 'module', component: MentornaddcourseComponent },
        { path: 'profile', component: ProfileComponent },
        { path: 'feed', component: FeedComponent },
        { path: 'subregister', component: SubregisterComponent },
        { path: 'sublogin', component: SubloginComponent },
        { path: 'candidateview', component: StudentdashboardComponent, children: [
            { path: 'activities', component: CandidateDashboardComponent },
            { path: 'courses', component: CandidateDashboardComponentComponent },
            { path: 'learningPage', component: LearningPageComponent },
           { path: 'recomondcourse', component: RecomondcourseComponent },
            { path: '', redirectTo: 'learningPage', pathMatch: 'full' },
            // { path: 'studentmock', component: StudentmockComponent },
        ]},
        { path: 'activities/:id', component: CandidateDashboardComponent },
        { path: 'studentdetails/:id', component: SudentcoursedetailComponent },
        { path: 'activitybyid/:id', component: SudentcoursedetailComponent },
        { path: 'activity/:courseId', component: CandidateActivtiesComponent },
        { path: 'candidate-activties', component: CandidateActivtiesComponent },
        { path: 'activity/:id', component: CandidateActivtiesComponent },
        { path: 'activity/:courseId/:activityType', component: CandidateActivtiesComponent },
       
        { path: 'project/:studentId', component: ProjectComponent },
        { path: 'assignment/:studentId', component: AssignmentmentorComponent },
        { path: 'quiz/:studentId', component: MentorquizComponent },
        
        { path: 'notification', component: NotificationComponent },
        { path: 'quizreport', component: ReportquizComponent },
        { path: 'courseproject/:courseId', component: MentorcourseprojectComponent },
        { path: 'courseassignment/:courseId', component: MentorcourseassignmentComponent },
        { path: 'courseprojectupdate/:projectId', component: MentorcourseprojectupdateComponent },
        { path: 'mentorcourseassignmentupdate/:assignmentId', component: MentorcourseassignmentupdateComponent },
        { path: 'Certificate/:id', component: CertificateComponent },
        { path: 'onlineclass/:courseId', component: OnlineclassComponent },
        {path:"slotdetails",component: SlotdetailsComponent},
        {path:"createcourse/:id",component:CourseCreateMentorComponent},
        // {path:"mock-activity/:mockId",component:MockActivityComponent},
        // {path:"mock-activity/:mockId",component:MockActivityComponent},
        {path:"mock-test/:mockId",component:MockActivityComponent},
        {path:"profile-sett",component:PersonalDetailsComponent},
        {path:"mock-interview",component:MockMentorActivityComponent},
        { path: 'mock-feedback/:projectId/:userId/:type', component:MockFeedbackComponent},
        { path: 'mockcomp', component:MockComponent},
        
        ///////notification//////////////////
 
{ path: 'short-video/short-videos/:id', component: FeedComponent },
{ path: 'api/articleposts/:id', component: FeedComponent },
{ path: 'api/imagePosts/get/:id', component: FeedComponent },
{ path: 'long-video/long-videos/:id', component: FeedComponent },
{ path: 'userprofile/:id', component: ProfileComponent },
{ path: 'profile/:userId', component: ProfileComponent },
{ path: 'profile/:id', component: ProfileComponent },
{ path: 'aiquiz', component: AiquizComponent },
{ path: "activity/:courseId/:courseType/:activityType/:activityId", component: CandidateActivtiesComponent },
 
    ]
 
},


 
];
 
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
export class AppRoutingModule { }
 
 
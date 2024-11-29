 
 
 
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { MentorService } from '../mentor.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Mentor1Service } from '../mentor1.service';
import { CommonModule } from '@angular/common';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { Assignment, Fusion2Service,  } from '../fusion2.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
 
// import { MatButtonModule } from '@angular/material/button';
export interface Project {
  courseType: any;
    projectId:any;
    courseTitle: string;  // Make sure these match your actual model
    course:any;
    id: number;
    projectTitle: string; // Ensure this matches the backend API
    name: string;
    description: string;
    projectDescription:any;
    gitUrl:any;
    maxTeam:number;
    projectDeadline:Date;
    startDate:Date;
    reviewMeetDate:Date;
    projectDocument:any;
    status: string; // Add this line
    sno?: number;
   
    // Add other fields as necessary
  }
 
 
@Component({
  selector: 'app-zmentorsdashboard',
  standalone: true,
  imports: [CourseDialogComponent,CommonModule, MatProgressBarModule,MatInputModule,MatDialogModule,MatTableModule,MatCardModule,MatButtonModule,MatIconModule,MatListModule,MatSidenavModule,MatToolbarModule,MatSnackBarModule],
  templateUrl: './zmentorsdashboard.component.html',
  styleUrl: './zmentorsdashboard.component.css'
})
export class ZmentorsdashboardComponent implements OnInit {
  overviewData: any;
  courses: any[] = [];
  enrollmentData: { [key: number]: any[] } = {};
  displayedColumns: string[] = ['courseTitle', 'enrolledStudents', 'averageProgress', 'actions'];
 
 
  constructor(private router: Router,
    private mentor1Service: Mentor1Service,
    private dialog: MatDialog,
    private fusion2service : Fusion2Service) {}
 
  ngOnInit() {
    this.loadProjects();
     this.loadAssignments();
    this.loadOverviewData();
    this.loadCourses();
    this.loadQuizzes();
  }
 
  loadOverviewData() {
    this.mentor1Service.getOverviewData().subscribe(data => {
      this.overviewData = data;
    });
  }
 
  loadCourses() {
    const userId = localStorage.getItem('id'); // Retrieve userId from localStorage
    if (userId) {
      this.mentor1Service.getCoursesByUserId(Number(userId)).subscribe(
        (courses) => {
          this.courses = courses;
          this.fetchEnrollmentsForCourses();
        },
        (error) => {
          console.error('Error fetching courses:', error);
        }
      );
    } else {
      console.error('No userId found in localStorage');
    }
  }
 
  fetchEnrollmentsForCourses(): void {
    this.courses.forEach(course => {
      this.mentor1Service.getCourseEnrollments(course.id).subscribe(
        (enrollments) => {
          this.enrollmentData[course.id] = enrollments;
          course.enrolledStudents = enrollments.length;
          console.log(`Enrollments for course ${course.courseTitle}:`, enrollments);
        },
        (error) => {
          console.error(`Error fetching enrollments for course ${course.id}:`, error);
        }
      );
    });
  }
 
  openCourseDialog(course?: any) {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      width: '400px',
      data: course || {}
    });
 
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (course) {
          this.updateCourse(result);
        } else {
          this.createCourse(result);
        }
      }
    });
  }
 
  createCourse(course: any) {
    this.mentor1Service.createCourse(course).subscribe(() => {
      this.loadCourses();
    });
  }
 
  updateCourse(course: any) {
    this.mentor1Service.updateCourse(course).subscribe(() => {
      this.loadCourses();
    });
  }
 
  deleteCourse(courseId: number) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.mentor1Service.deleteCourse(courseId).subscribe(() => {
        this.loadCourses();
      });
    }
  }
 
  navigateTo(route: string) {
    this.router.navigate(['/mentor', route]);
  }
 
  setActiveSection(section: string) {
    this.activeSection = section;
  }
 
  navCourse() {
    this.router.navigate(['/module']);
  }
 
  activeSection: string = 'overview';
 
 
  navigateToAssessment(courseId: number): void {
    this.router.navigate(['/courseassignment', courseId]);
  }
 
 
 
 navigateToProject(courseId: number): void {
  this.router.navigate(['/courseproject', courseId]);
}
 
navigateToQuiz(courseId: number): void {
  this.router.navigate(['/mentorquiz', courseId]);
}
/////////// assignment
assignments: Assignment[] = [];
 
loadAssignments(): void {
  const userIdString = localStorage.getItem('id');
  if (userIdString) {
    const userId = +userIdString;
   
    if (isNaN(userId)) {
      console.error('Invalid user ID in local storage.');
      return;
    }
 
    this.fusion2service.getAssignmentsByUserId(userId).subscribe(
      (data: Assignment[]) => {
        if (data && data.length > 0) {
          this.assignments = data;
          console.log('Assignments loaded:', this.assignments);
        } else {
          console.warn('No assignments found for this user.');
        }
      },
      (error) => {
        console.error('Error fetching assignments:', error);
      }
    );
  } else {
    console.error('User ID not found in local storage.');
  }
}
 
 
deleteAssignment(assignmentId: number): void {
  if (confirm('Are you sure you want to delete this assignment?')) {
    this.fusion2service.deleteAssignment(assignmentId).subscribe(
      () => {
        this.assignments = this.assignments.filter(assignment => assignment.id !== assignmentId);
        console.log(`Assignment with ID ${assignmentId} deleted.`);
      },
      (error) => {
        console.error('Error deleting assignment:', error);
      }
    );
  }
}
 
editAssignment(assignmentId: number): void {
  this.router.navigate(['/mentorassignmentupdate', assignmentId]);
}
 
 
///////////// Project
projects: Project[] = [];
loadProjects(): void {
  const teacherIdString = localStorage.getItem('id');
  if (teacherIdString) {
    const teacherId = +teacherIdString;
    this.fusion2service.getProjectsByTeacherId(teacherId).subscribe(
      (data: Project[]) => {
        this.projects = data;
        // Log each project's courseTitle
        data.forEach(project => {
          if (project.course && project.course.courseTitle) {
            console.log('Course Title:', project.course.courseTitle);
          } else {
            console.log('Course Title not found for project with ID:', project.id);
          }
        });
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
  } else {
    console.error('Teacher ID not found in local storage.');
  }
}
 
 
editProject(projectId: number): void {
  this.router.navigate(['/courseprojectupdate', projectId]);
}
 
 
 
deleteProject(projectId: number): void {
  if (confirm('Are you sure you want to delete this project?')) {
    this.fusion2service.deleteProject(projectId).subscribe(
      () => {
        this.projects = this.projects.filter(project => project.id !== projectId);
        console.log(`Project with ID ${projectId} deleted.`);
      },
      (error) => {
        console.error('Error deleting project:', error);
      }
    );
  }
}
quizzes: any[] = [];
loadQuizzes(): void {
  const teacherIdString = localStorage.getItem('id');
  if (teacherIdString) {
    const teacherId = +teacherIdString;
    this.fusion2service.getQuizzsByTeacherId(teacherId).subscribe(
      (data: any[]) => {
        this.quizzes = data;
        data.forEach(quiz => {
          if (quiz.course && quiz.course.courseTitle) {
            console.log('Course Title:', quiz.course.courseTitle);
          } else {
            console.log('Course Title not found for quiz with ID:', quiz.id);
          }
        });
      },
      (error) => {
        console.error('Error fetching quizzes:', error);
      }
    );
  } else {
    console.error('Teacher ID not found in local storage.');
  }
}
 
editQuiz(quizId: number): void {
  // Logic to edit quiz
  console.log('Edit quiz with ID:', quizId);
}
 
deleteQuiz(quizId: number): void {
  // Logic to delete quiz
  console.log('Delete quiz with ID:', quizId);
}
}
 
 
import { Component } from '@angular/core';
import { Fusion2Service, UserEnrollmentResponse } from '../fusion2.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MentorService } from '../metor.service';
import { MatDialog } from '@angular/material/dialog';
import { FusionService, Student } from '../fusion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Course, Enrollment, MentoronlineService } from '../mentoronline.service';
import { CommonModule } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-projectupdatementor',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './projectupdatementor.component.html',
  styleUrl: './projectupdatementor.component.css'
})
export class ProjectupdatementorComponent {



  constructor(
    private fusion2servcie: Fusion2Service,
    private fb: FormBuilder,
    private mentorService: MentorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fusionService: FusionService,
    private router: Router,
    private mentorOnlineService : MentoronlineService
   
  ) {}
 
  ngOnInit() {
 
    this.loadCourses();
    // this.loadTeacherPostedItems(this.teacherId);
    this.fetchCourses();
 
    // this.loadEnrollments();
    this.userId = localStorage.getItem('id');
 
    if (this.userId) {
      this.fetchCourses(); // Fetch courses based on the userId
    }
 
    // this.fetchEnrolledStudents(1); // Replace with the actual instructorId
 

 
    this.projectForm = this.fb.group({
      projectTitle: [''],
      projectDescription: [''],
      courseType: [''],
      gitUrl: [''],
      projectDeadline: [''],
      startDate: [''],
      reviewMeetDate: [''],
      projectDocument: [null]
    });
 
    this.loadEnrolledStudents();
  }

  selectedFileName: string = 'No file chosen';
  projectForm!: FormGroup;
  projectTitle: any;
  projectDescription: any;
  projectDeadline!: string;
  startDate!: string;
  reviewMeetDate!: string;
  maxTeam: any;
  gitUrl: any;
  //  selectedCourseId: number;
  projectDocument: File | null = null;
  // Handle file input change event
  userId: string | null = null;
  selectedFile: File | null = null;


 onFileChange(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedFileName = file.name;
  } else {
    this.selectedFileName = 'No file chosen';
  }
  this.selectedFile = file;
}

  onSubmitProject(): void {
    if (this.selectedFile) {
      // Format the dates to the correct format expected by the backend
      const formattedProjectDeadline = moment(this.projectForm.get('projectDeadline')?.value).format('YYYY-MM-DDTHH:mm:ss');
      const formattedStartDate = moment(this.projectForm.get('startDate')?.value).format('YYYY-MM-DDTHH:mm:ss');
      const formattedReviewMeetDate = moment(this.projectForm.get('reviewMeetDate')?.value).format('YYYY-MM-DDTHH:mm:ss');
  
      this.mentorOnlineService.createMultipleProjects(
        this.selectedCourseId,
        this.selectedUserIds,
        this.projectForm.get('projectTitle')?.value,
        this.projectForm.get('projectDescription')?.value,
        Number(localStorage.getItem('id')),
        this.selectedFile,
        formattedProjectDeadline,
        formattedStartDate,
        formattedReviewMeetDate,
        this.projectForm.get('gitUrl')?.value
      ).subscribe(
        (response) => {
          console.log('Project created successfully:', response);
          this.router.navigate(['/mentorperspective']);
        },
        (error) => {
          console.error('Error creating project:', error);
        }
      );
    } else {
      console.error('Please select a file');
    }
  }
// Variables in your component
courses: Course[] = [];
enrollments: Enrollment[] = [];
filteredEnrollments: Enrollment[] = [];
selectedCourseId: any;
selectedUserIds: number[] = [];
roomName: string = '';
scheduledTime: string = '';
searchText: string = '';
 
 
 
 
// Load courses by userId
// Load courses by userId
loadCourses(): void {
  this.mentorOnlineService.getCoursesByUserId().subscribe((data: Course[]) => {
    this.courses = data;
    console.log('Courses:', this.courses);
  });
}

// Load enrollments when a course is selected
onCourseChange(event: any): void {
  this.selectedCourseId = +event.target.value;

  const selectedCourse = this.courses.find(course => course.id === this.selectedCourseId);

  if (selectedCourse) {
    // Update the courseType form control based on the selected course
    // this.assessmentForm.get('courseType')?.setValue(selectedCourse.courseType);
    this.projectForm.get('courseType')?.setValue(selectedCourse.courseType);

    // Load enrollments for the selected course
    this.loadEnrollmentsForCourse(this.selectedCourseId);
  }
}
// Loads enrollments based on the selected course ID
loadEnrollmentsForCourse(courseId: number): void {
  this.mentorOnlineService.getEnrollmentsByCourseId(courseId).subscribe((data: Enrollment[]) => {
    this.enrollments = data;
    this.filterEnrollments(); // Apply initial filtering
    console.log('Enrollments:', this.enrollments);
  });
}
 
// Handles checkbox changes for user selection
onUserSelectionChange(event: any): void {
  const userId = parseInt(event.target.value, 10);
  if (event.target.checked) {
    this.selectedUserIds.push(userId);
  } else {
    const index = this.selectedUserIds.indexOf(userId);
    if (index > -1) {
      this.selectedUserIds.splice(index, 1);
    }
  }
  console.log('Selected User IDs:', this.selectedUserIds);
}
 
// Filters enrollments based on the search text
filterEnrollments(): void {
  const search = this.searchText.toLowerCase().trim();
  if (search === '') {
    this.filteredEnrollments = [...this.enrollments];
  } else {
    this.filteredEnrollments = this.enrollments.filter(enrollment =>
      enrollment.user.name.toLowerCase().includes(search)
    );
  }
  console.log('Filtered Enrollments:', this.filteredEnrollments);
}

fetchCourses() {
  if (this.userId) {
    this.mentorService.fetchCourseByUserId(this.userId).subscribe(courses => {
      this.courses = courses;
      console.log('Fetched courses:', this.courses);
    }, error => {
      console.error('Error fetching courses:', error);
    });
  }
}

enrolledStudentss: UserEnrollmentResponse[] = [];
 
enrolledStudents: Student[] = [];
name: string[] = [];
email: string[] = [];
course: string[] = [];
loadEnrolledStudents(): void {
  // Retrieve instructorId from local storage
  const instructorId = localStorage.getItem('id');
 
  // Ensure the instructorId is not null or undefined
  if (instructorId) {
    this.fusionService.getEnrolledStudents(Number(instructorId)).subscribe(
      (data: Student[]) => {
        this.enrolledStudents = data;
        this.name = data.map(student => student.name);
        this.email = data.map(student => student.email);
        this.course = data.map(student => student.course);

        // console.log('Enrolled Students:', this.enrolledStudents);
        // console.log('Names:', this.name);
        // console.log('Emails:', this.email);
        // console.log('Courses:', this.course);
      },
      (error) => {
        console.error('Error fetching enrolled students:', error);
      }
    );
  } else {
    console.error('Instructor ID not found in local storage');
  }
}

}

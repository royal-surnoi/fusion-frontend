 
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MentorService } from '../metor.service';
// import { StudentDialogComponent } from '../stuent-dialog/stuent-dialog.component';
import { CourseSelectionDialogComponent } from '../course-selection-dialog/course-selection-dialog.component';
import { ProgressDialogComponent } from '../progress-dialog/progress-dialog.component';
 
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StuentDialogComponent } from '../stuent-dialog/stuent-dialog.component';
import { FusionService, Student } from '../fusion.service';
import { Router } from '@angular/router';
import { Fusion2Service, UserEnrollmentResponse } from '../fusion2.service';
import { Course, Enrollment, MentoronlineService } from '../mentoronline.service';
import moment from 'moment';
 
// // assignment.model.ts
// export interface TeacherPostedItem {
//   courseTitle: string;
//   studentName: string;
//   courseType: string;
//   type: string;
// }
// export interface TeacherPostedItem {
//   courseTitle: string;
//   studentName: string;
//   courseType: string;
//   type: string;
// }
interface PostedItem {
  courseTitle: string;
  enrolledStudentsCount: number;
  courseType: string;
  assignmentCount: number;
  projectCount: number;
  quizCount: number;
  assignmentDetails: AssignmentDetail[];
  projectDetails: ProjectDetail[];
  quizDetails: QuizDetail[];
}
 
interface AssignmentDetail {
  assignmentTitle: string;
  studentNames: StudentName[];
  studentIds: string | null;
  assignmentId: number;
}
 
interface ProjectDetail {
  projectTitle: string;
  studentNames: StudentName[];
  studentIds: string | null;
  projectId: number;
}
interface QuizDetail {
  quizName: string;
  studentNames: StudentName[];
  studentIds: string | null;
  quizId: number;
}
 
interface StudentName {
  studentId: number;
  studentName: string;
}
 
 
 
interface PostedTypeEntry {
  courseType: string;
  type: string;
  students: string[];
  ids?: number[];
}
 interface Question {
  // text: string;
  type: string;
  options: Option[];
  // /////////////////////////////////////
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  text: string;
  correctAnswer: string;
}
interface Option {
  label: string;
  text: string;
}
 interface QuizDetail {
  quizName: string;
  startDate: Date;
  endDate: Date;
  questions: Question[];
  courseName: string;
  courseId: number;
  // quizId: number;
  // quizName: string;
  studentNames: StudentName[];
  studentIds: string | null;
  quizId: number;
  courseType: string;
 
}
 
 
@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    // BrowserModule,
    // BrowserAnimationsModule,
    StuentDialogComponent,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatTooltipModule,
    CommonModule,
    ReactiveFormsModule
 
   
   
    ],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit, AfterViewInit {
addOption(_t703: number) {
throw new Error('Method not implemented.');
}
addQuestion() {
throw new Error('Method not implemented.');
}
removeQuestion(_t688: number) {
throw new Error('Method not implemented.');
}
cancelEdit() {
throw new Error('Method not implemented.');
}
addNewQuestion() {
throw new Error('Method not implemented.');
}
cancelQuizEdit() {
throw new Error('Method not implemented.');
}
 
 
 
 
  assignmentForm!: FormGroup<any>;
 
 
 
 
 
 
  ////////////// online ///////
  // roomName: string = '';
  // scheduledTime: string = '';
 
  displayedColumns: string[] = ['name', 'email', 'enrolledCourses', 'overallProgress', 'actions'];
  dataSource!: MatTableDataSource<any>;
 
  isOverlayOpen = false;
  // isOverlayOpen = false;
  showOverlay: boolean = false;
  showQuizOverlay: boolean = false;
  showonlineOverlay: boolean = false;
  showAssessmentOverlay: boolean = false;
  quizForm!: FormGroup;
 
 
  // assssment
  assessmentForm!: FormGroup;
  selectedFile: File | null = null;
  // Track selected student IDs
  userId: string | null = null;
 
 
 
  selectedStudent: Student | null = null;
// project
  projectForm!: FormGroup;
  expandedCourseIndex: number | null = null;
  selectedAssignmentOrProject: any = null;  // To store the selected item for editing
  isEditModalOpen: boolean = false;
  postedItems: any[] = [];
 //////quizzes
 quizName: string = '';
 createdQuizId: number | null = null;
 questions: any[] = [];
 isQuizCreated = false;
 searchText = '';
 
 
 
  // expandedCourseIndex: number | null = null;
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;
  selectedActionType: any;
  // assignmentForm: FormGroup;
 
  constructor(
    private fusion2servcie: Fusion2Service,
    private fb: FormBuilder,
    private mentorService: MentorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fusionService: FusionService,
    private router: Router,
    private mentorOnlineService : MentoronlineService,
    private formBuilder: FormBuilder
   
  ) {
   
 
  }
 
 
  ngOnInit() {
    this.userId = localStorage.getItem('id');
    this.loadCourses();
   
    // this.loadTeacherPostedItems();
    this.fetchCourses();
    this.loadEnrolledStudents();
    // this.loadEnrollments();
 
    if (this.userId) {
      this.loadTeacherPostedItems();
     // Call with userId
    } else {
      console.error('User ID not found in local storage');
    }
 
    if (this.userId) {
      this.fetchCourses(); // Fetch courses based on the userId
    }
   
    // this.fetchEnrolledStudents(1); // Replace with the actual instructorId
 
   
    this.assignmentForm = this.fb.group({
      course: [''],
      courseType: [''],
      assignmentTitle: [''],
      assignmentTopicName: [''],
      assignmentDescription: [''],
      startDate: [''],
      endDate: [''],
      reviewMeetDate: [''],
      maxScore: [null]
    });
   
 
    this.assessmentForm = this.fb.group({
      course: [''],
      courseType: [''],
      assignmentTitle: [''],
      assignmentTopicName: [''],
      assignmentDescription: [''],
      startDate: [''],
      endDate: [''],
      reviewMeetDate: [''],
      maxScore: [null],
      assignmentDocument: [null]
    });
 
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
    // this.quizForm = this.fb.group({
    //   courseId: [null, Validators.required],
    //   courseType: [{ value: '', disabled: true }],
    //   quizName: ['', Validators.required],
    //   startDate: ['', Validators.required],
    //   endDate: ['', Validators.required]
    // });
    this.quizForm = this.formBuilder.group({
      courseId: [''],
      courseType: [''],
      quizName: [''],
      startDate: [''],
      endDate: ['']
    });
   
    this.loadEnrolledStudents();
  }
  openOverlay() {
    this.isOverlayOpen = true;
   
  }
  saveQuiz(){}
 
 
 
  ngAfterViewInit() {
    this.loadStudents();
  }
  // loadTeacherPostedItems(teacherId: number): void {
  //   this.mentorService.getTeacherPostedItems(teacherId).subscribe(data => {
  //     this.postedItems = this.processAssignments(data);
  //   });
  // }
 
  // processAssignments(data: string[]): any[] {
  //   const courseMap = new Map<string, { courseTitle: string, types: Map<string, { students: string[], courseType: string }> }>();
 
  //   data.forEach(item => {
  //     // Convert each string into an object
  //     const fields = item.split(',').reduce((acc, field) => {
  //       const [key, value] = field.split(':').map(part => part.trim());
  //       acc[key] = value;
  //       return acc;
  //     }, {} as Record<string, string>);
 
  //     const courseTitle = fields['CourseTitle'] || 'N/A';
  //     const studentName = fields['StudentName'] || 'Unknown';
  //     const courseType = fields['CourseType'] || 'Unknown';
  //     const type = fields['Type'] || 'Unknown';
 
  //     // Check if the course title exists
  //     if (!courseMap.has(courseTitle)) {
  //       courseMap.set(courseTitle, {
  //         courseTitle,
  //         types: new Map<string, { students: string[], courseType: string }>()
  //       });
  //     }
 
  //     const courseEntry = courseMap.get(courseTitle)!;
 
  //     // Check if the type exists for the course title
  //     if (!courseEntry.types.has(type)) {
  //       courseEntry.types.set(type, {
  //         students: [studentName],
  //         courseType
  //       });
  //     } else {
  //       // Append the student to the existing type entry
  //       const typeEntry = courseEntry.types.get(type)!;
  //       typeEntry.students.push(studentName);
  //     }
  //   });
 
  //   // Convert the map to an array for use in the template
  //   return Array.from(courseMap.values()).map(course => ({
  //     courseTitle: course.courseTitle,
  //     types: Array.from(course.types.entries()).map(([type, typeEntry]) => ({
  //       type,
  //       students: typeEntry.students,
  //       courseType: typeEntry.courseType
  //     }))
  //   }));
  // }
 
  // getIconForType(type: string): string {
  //   switch (type) {
  //     case 'Assignment':
  //       return 'assignment';
  //     case 'Project':
  //       return 'project';
  //     default:
  //       return 'help';
  //   }
  // }
 
 
 
  loadStudents() {
    this.mentorService.getStudents().subscribe(
      (students) => {
        this.dataSource = new MatTableDataSource(students);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: any, filter: string) => {
          const dataStr = JSON.stringify(data).toLowerCase();
          return dataStr.indexOf(filter) != -1;
        };
      },
      (error) => {
        this.showError('Failed to load students');
        console.error('Error loading students:', error);
      }
    );
  }
 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
 
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  addAssessment(){
  }
 
  addQuiz(){
  }
 
  addProject(){
  }
 
  onStudentSelectionChange(event: any, student: any): void {
    const studentId = student.user.id;
    if (event.target.checked) {
      this.selectedStudents.push(studentId);
    } else {
      const index = this.selectedStudents.indexOf(studentId);
      if (index !== -1) {
        this.selectedStudents.splice(index, 1);
      }
    }
  }
 
 
  // onFileSelected(event: any): void {
  //   if (event.target.files.length > 0) {
  //     this.selectedFile = event.target.files[0];
  //   }
  // }
 
  onSubmitAssignment(): void {
    if (this.selectedFile) {
      // Ensure the form data is correctly formatted
      const formattedStartDate = moment(this.assessmentForm.get('startDate')?.value).format('YYYY-MM-DDTHH:mm:ss');
      const formattedEndDate = moment(this.assessmentForm.get('endDate')?.value).format('YYYY-MM-DDTHH:mm:ss');
      const formattedReviewMeetDate = moment(this.assessmentForm.get('reviewMeetDate')?.value).format('YYYY-MM-DDTHH:mm:ss');
 
      // Ensure selectedStudents is not empty
      if (this.selectedStudents.length === 0) {
        console.error('No students selected');
        alert('Please select at least one student');
        return;
      }
 
      // Call the service method with the necessary parameters
      this.mentorOnlineService.createMultipleAssignments(
        this.selectedCourseId,
        this.selectedStudents,  // Pass the array of selected students
        this.assessmentForm.get('assignmentTitle')?.value,
        this.assessmentForm.get('assignmentTopicName')?.value,
        this.assessmentForm.get('assignmentDescription')?.value,
        Number(localStorage.getItem('id')),
        this.selectedFile,
        formattedStartDate,
        formattedEndDate,
        formattedReviewMeetDate,
        this.assessmentForm.get('maxScore')?.value
      ).subscribe(
        (response) => {
          console.log('Assignment created successfully:', response);
          alert('Assignment created successfully');
 
          // Close the overlay only after successful submission
          this.closeAssessmentOverlay();
          this.router.navigate(['/mentorperspective']);
        },
        (error) => {
          console.error('Error creating assignment:', error);
          alert('Error creating assignment');
        }
      );
    } else {
      console.error('Please select a file');
      alert('Please select a file');
    }
  }
 
 
 
 
 
 
 
  closeAssessmentOverlay(): void {
    this.showAssessmentOverlay = false;
    this.assessmentForm.reset();
    this.selectedStudents = [];
    this.selectedFile = null;
  }
 
 
 
 
 
   
    onFileChange1(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length) {
        this.selectedFile = input.files[0];
      }
    }
   
 onStudentSelectionChange1(event: any, student: any) {
    const studentId = student.user.id;
    if (event.target.checked) {
      this.selectedStudents.push(studentId);
    } else {
      const index = this.selectedStudents.indexOf(studentId);
      if (index !== -1) {
        this.selectedStudents.splice(index, 1);
      }
    }
  }
 
 
  // onFileSelected1(event: any): void {
  //   if (event.target.files.length > 0) {
  //     this.selectedFile = event.target.files[0];
  //   }
  // }
 
   
  isEditingAssignment = false;
  isEditingProject = false;
  projectTitle: any;
  projectDescription: any;
  projectDeadline!: string;
  startDate!: string;
  endDate!: string;
  reviewMeetDate!: string;
  maxTeam: any;
  gitUrl: any;
  //  selectedCourseId: number;
  projectDocument: File | null = null;
  // Handle file input change event
 
  selectedFileName: string = 'No file chosen';
 
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
 
    // Ensure selectedStudents is not empty
    if (this.selectedStudents.length === 0) {
      console.error('No students selected');
      alert('Please select at least one student');
      return;
    }
 
    // Call the service method with the necessary parameters
    this.mentorOnlineService.createMultipleProjects(
      this.selectedCourseId,
      this.selectedStudents,  // Pass the array of selected students
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
        alert('Project created successfully');
 
        // Close the overlay only after successful submission
        this.closeOverlay();
        this.router.navigate(['/mentorperspective']);
      },
      (error) => {
        console.error('Error creating project:', error);
        alert('Error creating project');
      }
    );
  } else {
    console.error('Please select a file');
    alert('Please select a file');
  }
}
closeOverlay(): void {
  this.showOverlay = false;
  this.projectForm.reset();
  this.selectedStudents = [];
  this.selectedFile = null;
 
}
onSaveQuiz(): void {
  if (this.quizForm.valid && this.selectedStudents.length > 0) {
    const formattedStartDate = moment(this.quizForm.get('startDate')?.value).format('YYYY-MM-DDTHH:mm:ss');
    const formattedEndDate = moment(this.quizForm.get('endDate')?.value).format('YYYY-MM-DDTHH:mm:ss');
   
    const courseId = this.quizForm.get('courseId')?.value;
    const quizName = this.quizForm.get('quizName')?.value;
    const teacherId = Number(localStorage.getItem('id'));
 
    if (!courseId || !quizName || !teacherId || !formattedStartDate || !formattedEndDate) {
      alert('Please fill all required fields');
      return;
    }
 
    const quizData = {
      courseId: courseId,
      quizName: quizName,
      studentIds: this.selectedStudents,
      teacherId: teacherId,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
 
    this.fusionService.createQuiz1(quizData).subscribe(
      (response) => {
        console.log('Quiz created successfully:', response);
        this.createdQuizId = response.id; // Store the created quiz ID
        this.isQuizCreated = true; // Enable the MCQ section
        this.showQuizOverlay = false; // Close the form overlay
        this.questions = []; // Initialize questions array
        alert('Quiz created successfully. Now you can add questions.');
      },
      (error) => {
        console.error('Error creating quiz:', error);
        alert('Error creating quiz');
      }
    );
  } else {
    alert('Please fill all required fields and select at least one student');
  }
}
 
 
 
onSubmitQuiz(): void {
  if (this.createdQuizId && this.questions.length > 0) {
    const quizData = this.questions;
 
    this.fusionService.addQuestionsToQuiz1(this.createdQuizId, quizData).subscribe(
      (response) => {
        console.log('Questions before submission:', this.questions);
        this.handleSuccess(response); // Handle the success response
      },
      (error) => {
        console.error('Error adding questions:', error);
        alert('Error adding questions');
      }
    );
  } else {
    alert('No questions to submit or quiz ID is missing.');
  }
}
 
handleSuccess(response: any): void {
  console.log('Success response:', response);
  this.closeQuizOverlay();
  this.questions = []; // Clear questions array
  this.quizForm.reset(); // Optionally reset form controls
}
 
addMCQ(): void {
  this.questions.push({
    text: '',
    options: [
      { label: 'A', text: '' },
      { label: 'B', text: '' },
      { label: 'C', text: '' },
      { label: 'D', text: '' }
    ],
    correctAnswer: ''
  });
}
 
 
addTrueFalse(): void {
  this.questions.push({
    text: '',
    type: 'truefalse',
    correctAnswer: ''
  });
}
 
closeQuizOverlay(): void {
  this.showQuizOverlay = false; // Hide the overlay
  this.quizForm.reset(); // Reset the form fields
  this.selectedUserIds = []; // Clear selected users
  this.isQuizCreated = false; // Reset quiz creation state
}
 
 
 
  editStudent(student: any) {
    const dialogRef = this.dialog.open(StuentDialogComponent, { data: student });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mentorService.updateStudent(student.id, result).subscribe(
          updatedStudent => {
            const index = this.dataSource.data.findIndex(s => s.id === updatedStudent.id);
            this.dataSource.data[index] = updatedStudent;
            this.dataSource.data = [...this.dataSource.data];
            this.showSuccess('Student updated successfully');
          },
          error => {
            this.showError('Failed to update student');
            console.error('Error updating student:', error);
          }
        );
      }
    });
  }
 
  deleteStudent(student: any) {
    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
      this.mentorService.deleteStudent(student.id).subscribe(
        () => {
          this.dataSource.data = this.dataSource.data.filter(s => s.id !== student.id);
          this.showSuccess('Student deleted successfully');
        },
        error => {
          this.showError('Failed to delete student');
          console.error('Error deleting student:', error);
        }
      );
    }
  }
 
  enrollStudent(student: any) {
    const dialogRef = this.dialog.open(CourseSelectionDialogComponent);
    dialogRef.afterClosed().subscribe(courseName => {
      if (courseName) {
        this.mentorService.enrollStudentInCourse(student.id, courseName).subscribe(
          updatedStudent => {
            const index = this.dataSource.data.findIndex(s => s.id === updatedStudent.id);
            this.dataSource.data[index] = updatedStudent;
            this.dataSource.data = [...this.dataSource.data];
            this.showSuccess('Student enrolled successfully');
          },
          error => {
            this.showError('Failed to enroll student');
            console.error('Error enrolling student:', error);
          }
        );
      }
    });
  }
 
  updateProgress(student: any) {
    const dialogRef = this.dialog.open(ProgressDialogComponent, { data: student.overallProgress });
    dialogRef.afterClosed().subscribe((newProgress:any) => {
      if (newProgress !== undefined) {
        this.mentorService.updateStudentProgress(student.id, newProgress).subscribe(
          (updatedStudent:any) => {
            const index = this.dataSource.data.findIndex(s => s.id === updatedStudent.id);
            this.dataSource.data[index] = updatedStudent;
            this.dataSource.data = [...this.dataSource.data];
            this.showSuccess('Student progress updated successfully');
          },
         
        );
      }
    });
  }
 
  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
 
  private showError(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
  }
 
 
  enrolledStudentss: UserEnrollmentResponse[] = [];
 
  enrolledStudents: Student[] = [];
  name: string[] = [];
  email: string[] = [];
  course: string[] = [];
 
  fetchEnrolledStudents(instructorId: number): void {
    this.fusion2servcie.getEnrolledStudents(instructorId).subscribe(
      (data) => {
        this.enrolledStudentss = data;
        this.logEnrolledStudents();
      },
      (error) => {
        console.error('Error fetching enrolled students', error);
      }
    );
  }
 
  logEnrolledStudents(): void {
    this.enrolledStudentss.forEach(student => {
      console.log(`ID: ${student.user.id}, Name: ${student.user.name}, Email: ${student.user.email}, Course Titles: ${student.courseTitles.join(', ')}`);
    });
  }
 
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
 
          },
        (error) => {
          console.error('Error fetching enrolled students:', error);
        }
      );
    } else {
      console.error('Instructor ID not found in local storage');
    }
  }
 
 
  navigateToQuiz(studentId: number): void {
    this.router.navigate(['/quiz', studentId]);
  }
  navigateToAssessment(studentId: number): void {
    this.router.navigate(['/assignment', studentId]);
  }
 
 
 
 navigateToProject(studentId: number): void {
  this.router.navigate(['/project', studentId]);
}
 
 
  openAssessmentOverlay() {
    this.showAssessmentOverlay = true;
  }
 
  // Method to open the quiz overlay
  openQuizOverlay() {
    this.showQuizOverlay = true;
  }
 
  // Method to open the project overlay
  openProjectOverlay() {
    this.showOverlay = true;
  }
 
  // Method to close the assessment overlay
 
 
  // Method to close the quiz overlay
 
  openOnlineOverlay() {
    this.showonlineOverlay = true;
  }
  closeOnlineOverlay() {
    this.showonlineOverlay = false;
  }
 
 /////////////////////////// online classes for multiple persons /////////
// Variables in your component
courses: any[] = [];
enrollments: any[] = [];
filteredEnrollments: any[] = [];
selectedCourseId: any;
selectedUserIds: number[] = [];
roomName: string = '';
scheduledTime: string = '';
 
selectedStudents: any[] = [];
 
isAssignmentEditModalOpen = false;
isProjectEditModalOpen = false;
 
 
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
    this.assessmentForm.get('courseType')?.setValue(selectedCourse.courseType);
    this.projectForm.get('courseType')?.setValue(selectedCourse.courseType);
    this.quizForm.get('courseType')?.setValue(selectedCourse.courseType);
 
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
    if (!this.selectedStudents.includes(userId)) {
      this.selectedStudents.push(userId);
    }
  } else {
    const index = this.selectedStudents.indexOf(userId);
    if (index > -1) {
      this.selectedStudents.splice(index, 1);
    }
  }
  console.log('Selected Students:', this.selectedStudents);
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
 
 
// Submit the form data
onSubmitliveclass(): void {
  // Ensure all required fields are filled
  console.log('Room Name:', this.roomName);
console.log('Selected Course ID:', this.selectedCourseId);
console.log('Scheduled Time:', this.scheduledTime);
console.log('Selected User IDs:', this.selectedStudents);
  if (this.roomName && this.selectedCourseId && this.scheduledTime && this.selectedStudents.length > 0) {
    // Prepare form data as an object
    const formData = {
      name: this.roomName,
      userId: localStorage.getItem('id'),
      courseId: this.selectedCourseId,
      scheduledTime: this.scheduledTime,
      userIds: this.selectedStudents, // This should be an array
    };
 
    // Call the service method to create the training room
    this.mentorOnlineService.createRoomToUsers(formData).subscribe(
      (response) => {
        console.log('Training room created:', response);
        alert('Training room created successfully.');
        this.showonlineOverlay = false; // Close the overlay on success
      },
      (error) => {
        console.error('Error creating training room:', error);
        alert('Error creating training room');
      }
    );
  } else {
    console.error('Form is incomplete.');
    alert('Form is incomplete. Please fill all fields.');
  }
}
 
 
 
 
 
/////////////////////////////////////////////////////////new changes 13/08////////////////////////
 
fetchCourses() {
  if (this.userId) {
    this.mentorService.fetchCourseByUserId(this.userId).subscribe(
      (courses) => {
        this.courses = courses;
        console.log('Fetched courses:', this.courses);
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }
}
loadTeacherPostedItems(): void {
  const userId = Number(this.userId);
 
  if (!isNaN(userId)) {
    // Fetch assignments and projects
    this.fusionService.getTeacherPostedItems(userId).subscribe({
      next: (assignmentProjectData) => {
        // Fetch quizzes separately
        this.fusionService.getQuizzesByTeacher(userId).subscribe({
          next: (quizData) => {
            const combinedData = this.combineData(assignmentProjectData, quizData);
            this.postedItems = this.transformData(combinedData);
            this.postedItems.forEach((item) => {
              if (item.types && item.types.length > 0) {
                item.types.forEach((typeEntry: PostedTypeEntry) => {
                  if (typeEntry.type === 'Assignment' && typeEntry.ids && typeEntry.ids.length > 0) {
                    this.loadAssignmentData(typeEntry.ids[0]);
                  } else if (typeEntry.type === 'Project' && typeEntry.ids && typeEntry.ids.length > 0) {
                    this.loadProjectData(typeEntry.ids[0]);
                  } else if (typeEntry.type === 'Quiz' && typeEntry.ids && typeEntry.ids.length > 0) {
                   
                  }
                });
              }
            });
          },
          error: (err) => {
            console.error('Error fetching quizzes', err);
          }
        });
      },
      error: (err) => {
        console.error('Error fetching teacher items', err);
      }
    });
  } else {
    console.error('Invalid user ID');
  }
}
combineData(assignmentProjectData: any[], quizData: any[]): any[] {
  const combined = [...assignmentProjectData];
 
  quizData.forEach((quizItem: any) => {
    const existingCourse = combined.find(course => course.courseTitle === quizItem.courseTitle);
 
    if (existingCourse) {
      existingCourse.quizDetails = quizItem.quizDetails || [];
      existingCourse.quizCount = quizItem.quizDetails ? quizItem.quizDetails.length : 0;
    } else {
      combined.push({
        courseTitle: quizItem.courseTitle,
        enrolledStudentsCount: quizItem.enrolledStudentsCount || 0,
        courseType: quizItem.courseType,
        assignmentDetails: [],
        projectDetails: [],
        quizDetails: quizItem.quizDetails || [],
        quizCount: quizItem.quizDetails ? quizItem.quizDetails.length : 0
      });
    }
  });
 
  return combined;
}
 
 
// Transform API Response to PostedItem Format
transformData(data: any[]): PostedItem[] {
  const grouped: PostedItem[] = [];
 
  data.forEach((item: any) => {
    const { courseTitle, assignmentDetails, projectDetails, quizDetails, courseType, enrolledStudentsCount } = item;
 
    let course = grouped.find(c => c.courseTitle === courseTitle);
 
    if (!course) {
      course = {
        courseTitle,
        enrolledStudentsCount: enrolledStudentsCount || 0,
        courseType,
        assignmentCount: 0,
        projectCount: 0,
        quizCount: 0,
        assignmentDetails: [],
        projectDetails: [],
        quizDetails: []
      };
      grouped.push(course);
    }
 
    if (assignmentDetails && Array.isArray(assignmentDetails)) {
      assignmentDetails.forEach((assignment: any) => {
        const { assignmentTitle, studentNames, studentIds, assignmentId } = assignment;
 
        course.assignmentDetails.push({
          assignmentTitle,
          studentNames,
          studentIds,
          assignmentId
        });
      });
      course.assignmentCount = course.assignmentDetails.length;
    }
 
    if (projectDetails && Array.isArray(projectDetails)) {
      projectDetails.forEach((project: any) => {
        const { projectTitle, studentNames, studentIds, projectId } = project;
 
        course.projectDetails.push({
          projectTitle,
          studentNames,
          studentIds,
          projectId
        });
      });
      course.projectCount = course.projectDetails.length;
    }
 
    if (quizDetails && Array.isArray(quizDetails)) {
      quizDetails.forEach((quiz: any) => {
        const { quizName, studentNames, studentIds, quizId, startDate, endDate, questions, courseName, courseId } = quiz;
 
        // Ensure that the quiz detail matches the QuizDetail interface
        course.quizDetails.push({
          quizName,
          studentNames,
          studentIds,
          quizId,
          startDate, // Add startDate
          endDate,   // Add endDate
          questions: questions || [], // Provide default value if needed
          courseName, // Add courseName
          courseId,     // Add courseId
          courseType
        });
      });
      course.quizCount = course.quizDetails.length;
    }
  });
 
  return grouped;
}
 
 
getAssignmentCount(item: PostedItem): number {
  return item.assignmentDetails.length;
}
 
getProjectCount(item: PostedItem): number {
  return item.projectDetails.length;
}
getQuizCount(item: PostedItem): number {
  return item.projectDetails.length;
}
 
toggleExpansion(index: number): void {
  this.expandedCourseIndex = this.expandedCourseIndex === index ? null : index;
}
 
 
selectedAssignmentId: number | null = null;
selectedProjectId: number | null = null;
 
 
 
// Method to get concatenated student names
getStudentNames(students: any[]): string {
  if (!students || students.length === 0) {
    return 'No students';
  }
  // Join all student names into a single string
  return students.map(student => student.studentName).join(', ');
}
 
editAssignmentOrProject(entry: any, type: string): void {
  console.log('Entry object:', entry);
  if (type === 'Assignment') {
    this.isAssignmentEditModalOpen = true;
    // this.selectedAssignmentId = entry.ids ? entry.ids[0] : null;
 
    // const title = entry.assignmentTitle ? entry.assignmentTitle : 'Untitled Assignment';
    this.selectedAssignmentId = this.getEntryId(entry);
   
    const title = entry.assignmentTitle || 'Untitled Assignment';
    if (this.selectedAssignmentId !== null) {
      console.log('Editing Assignment:', title);
      this.loadAssignmentData(this.selectedAssignmentId);
    } else {
      console.error('Assignment ID is null');
    }
  } else if (type === 'Project') {
    this.isProjectEditModalOpen = true;
    // this.selectedProjectId = entry.ids ? entry.ids[0] : null;
 
    // const title = entry.projectTitle ? entry.projectTitle : 'Untitled Project';
        this.selectedProjectId = this.getEntryId(entry);
   
    const title = entry.projectTitle || 'Untitled Project';
 
    if (this.selectedProjectId !== null) {
      console.log('Editing Project:', title);
      this.loadProjectData(this.selectedProjectId);
    } else {
      console.error('Project ID is null');
    }
  }
}
 
 
private getEntryId(entry: any): number | null {
  console.log('Entry:', entry);
  let id: number | null = null;
 
  if (typeof entry.assignmentId === 'number') {
    id = entry.assignmentId;
  } else if (typeof entry.projectId === 'number') {
    id = entry.projectId;
  } else if (typeof entry.assignmentId === 'string') {
    id = this.parseId(entry.assignmentId);
  } else if (typeof entry.projectId === 'string') {
    id = this.parseId(entry.projectId);
  }
 
  console.log('Parsed ID:', id);
  return id;
}
 
private parseId(id: string): number | null {
  const parsed = parseInt(id, 10);
  return isNaN(parsed) ? null : parsed;
}
 
 
loadAssignmentData(assignmentId: number): void {
  if (!assignmentId) {
    console.error('Invalid assignmentId:', assignmentId);
    return;
  }
 
  this.fusionService.getAssignmentById(assignmentId).subscribe({
    next: (assignment) => {
      if (assignment) {
        const startDate = this.convertArrayToDateTimeLocal(assignment.startDate);
        const endDate = this.convertArrayToDateTimeLocal(assignment.endDate);
        const reviewMeetDate = this.convertArrayToDateTimeLocal(assignment.reviewMeetDate);
 
        this.assignmentForm.patchValue({
          course: assignment.course?.id || '',
          courseType: assignment.course?.type || '',
          assignmentTitle: assignment.assignmentTitle || '',
          assignmentTopicName: assignment.assignmentTopicName || '',
          assignmentDescription: assignment.assignmentDescription || '',
          startDate: startDate,
          endDate: endDate,
          reviewMeetDate: reviewMeetDate,
          maxScore: assignment.maxScore || ''
        });
      } else {
        console.error('No assignment data received');
      }
    },
    error: (err) => {
      console.error('Error fetching assignment details:', err);
    }
  });
}
 
 
convertArrayToDateTimeLocal(dateArray: number[]): string {
  if (!dateArray || dateArray.length < 5) return ''; // Guard clause for invalid arrays
  const [year, month, day, hour, minute] = dateArray;
  const date = new Date(year, month - 1, day, hour, minute); // Adjust month (0-based)
  return date.toISOString().slice(0, 16); // Return format: YYYY-MM-DDTHH:MM
}
 
loadProjectData(id: number): void {
  this.fusionService.getProjectById(id).subscribe(
    (project) => {
      if (project) {
        this.projectForm.patchValue({
          course: project.courseId || '',
          courseType: project.courseType || '',
          projectTitle: project.projectTitle || '',
          projectDescription: project.projectDescription || '',
          gitUrl: project.gitUrl || '',
          startDate: this.formatDate(project.startDate),
          projectDeadline: this.formatDate(project.projectDeadline),
          reviewMeetDate: this.formatDate(project.reviewMeetDate)
        });
      } else {
        console.error('No project data received');
      }
    },
    (error) => {
      console.error('Error loading project data:', error);
    }
  );
}
openAssignmentEditModal(assignmentId: number): void {
  this.assignmentForm.reset(); // Clear previous form data
  this.isAssignmentEditModalOpen = true;
  this.loadAssignmentData(assignmentId);
}
 
openProjectEditModal(projectId: number): void {
  this.projectForm.reset(); // Clear previous form data
  this.isProjectEditModalOpen = true;
  this.loadProjectData(projectId);
}
 
 
 
formatDate(dateArray: number[]): string {
  // Check if the array has the full date and time (year, month, day, hour, minute)
  if (dateArray && dateArray.length >= 5) {
    const [year, month, day, hour, minute] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute);
    return date.toISOString().slice(0, 16); // Format as 'YYYY-MM-DDTHH:MM'
  }
  return '';
}
 
 
 
 
onSubmitAssignmentOrProject(type: 'assignment' | 'project'): void {
  const formData = new FormData();
  let apiCall;
 
  if (type === 'assignment' && this.isAssignmentEditModalOpen && this.selectedAssignmentId !== null) {
    // Append assignment form data
    formData.append('course', this.assignmentForm.get('course')?.value);
    formData.append('assignmentTitle', this.assignmentForm.get('assignmentTitle')?.value);
    formData.append('assignmentTopicName', this.assignmentForm.get('assignmentTopicName')?.value);
    formData.append('assignmentDescription', this.assignmentForm.get('assignmentDescription')?.value);
    formData.append('startDate', this.assignmentForm.get('startDate')?.value);
    formData.append('endDate', this.assignmentForm.get('endDate')?.value);
    formData.append('reviewMeetDate', this.assignmentForm.get('reviewMeetDate')?.value);
    formData.append('maxScore', this.assignmentForm.get('maxScore')?.value);
   
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
 
    apiCall = this.fusionService.updateAssignment(this.selectedAssignmentId, formData);
  } else if (type === 'project' && this.isProjectEditModalOpen && this.selectedProjectId !== null) {
    // Append project form data
    formData.append('projectTitle', this.projectForm.get('projectTitle')?.value);
    formData.append('projectDescription', this.projectForm.get('projectDescription')?.value);
    formData.append('gitUrl', this.projectForm.get('gitUrl')?.value);
    formData.append('startDate', this.projectForm.get('startDate')?.value);
    formData.append('projectDeadline', this.projectForm.get('projectDeadline')?.value);
    formData.append('reviewMeetDate', this.projectForm.get('reviewMeetDate')?.value);
   
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
 
    apiCall = this.fusionService.updateProject1(this.selectedProjectId, formData);
  }
 
  if (apiCall) {
    apiCall.subscribe(
      () => {
        if (type === 'assignment') {
          this.isAssignmentEditModalOpen = false;
        } else {
          this.isProjectEditModalOpen = false;
        }
        this.loadTeacherPostedItems(); // Reload after update
      },
      (error) => {
        console.error('Error submitting form:', error);
      }
    );
  }
}
 
onFileSelected(event: Event, type: 'assignment' | 'project'): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
    this.selectedFileName = this.selectedFile.name;
  }
}
deleteAssignmentOrProject(entry: any): void {
  const entryId = this.getEntryId1(entry); // Extract ID from the entry object
 
  if (entryId !== null) {
    // Determine if it's an Assignment or Project by checking the type or specific properties
    if (entry.assignmentId) {
      // It's an assignment
      this.fusionService.deleteAssignment(entryId).subscribe({
        next: () => {
          console.log('Assignment deleted successfully');
          this.removeFromUI(entry); // Remove from the UI if necessary
          alert('Assignment deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting assignment:', err);
        }
      });
    } else if (entry.projectId) {
      // It's a project
      this.fusionService.deleteProject(entryId).subscribe({
        next: () => {
          console.log('Project deleted successfully');
          this.removeFromUI(entry); // Remove from the UI if necessary
          alert('Project deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting project:', err);
        }
      });
    }
  } else {
    console.error('Entry ID is null, unable to delete.');
  }
}
 
private getEntryId1(entry: any): number | null {
  console.log('Entry:', entry); // Ensure the object structure is correct
  let id: number | null = null;
 
  if (typeof entry.assignmentId === 'number') {
    id = entry.assignmentId;
  } else if (typeof entry.projectId === 'number') {
    id = entry.projectId;
  } else if (typeof entry.assignmentId === 'string') {
    id = this.parseId(entry.assignmentId);
  } else if (typeof entry.projectId === 'string') {
    id = this.parseId(entry.projectId);
  }
 
  console.log('Parsed ID:', id);
  return id;
}
 
 
removeFromUI(entry: any): void {
  // Assuming 'course' is an array of strings or similar, and 'entry' is the value to be removed.
  const index = this.course.indexOf(entry);
  if (index !== -1) {
    this.course.splice(index, 1); // Remove the entry from the array
  }
}
toggleDropdown(item: any, show: boolean): void {
  item.showDropdown = show;
}
 
 
 
editingQuiz: boolean = false;
selectedQuizId: number | null = null;
isQuizEditModalOpen = false;
isQuizEditFormVisible = false;
// Method to handle the edit button click event
 
 
 
// onSubmitQuiz(): void {
//   if (this.quizForm.valid) {
//     this.fusionService.updateQuiz(this.quizForm.value).subscribe(() => {
//       this.editingQuiz = false;
//       // Handle success (e.g., show a success message or refresh the quiz list)
//     });
//   }
 
 
 
// Save quiz changes
 
 
quizDetailForm!: FormGroup;
 loading: boolean = false;
  errorMessage: string = '';
  quizId:number=0
 
deleteQuestion(index: number): void {
  this.questions.splice(index, 1);
}
quizDetail: QuizDetail | null = null;
 
onEdit(quizId: number): void {
  this.quizId = quizId; // Store the quizId for updating later
  this.loadQuizDetails(quizId);
}
startDateString: string = '';
endDateString: string = '';
loadQuizDetails(quizId: number): void {
  this.fusionService.getQuizDetails(quizId).subscribe(
    (data: any) => {
      this.quizDetail = {
        quizName: data.quizName || '',
        startDate: this.formatDate1(data.startDate),
        endDate: this.formatDate1(data.endDate),
        questions: data.questions || [],
        courseName: data.courseName || '',
        courseId: data.courseId || 0,
        studentNames: data.studentNames || [],
        studentIds: data.studentIds || null,
        quizId: data.quizId || 0,
        courseType: data.courseType || ''
      };
 
      // Set the date strings for binding to the datetime-local input
      this.startDateString = this.convertDateToISOString(this.quizDetail.startDate);
      this.endDateString = this.convertDateToISOString(this.quizDetail.endDate);
 
      console.log(this.quizDetail);
    },
    (error) => {
      console.error('Error fetching quiz details', error);
    }
  );
}
 
formatDate1(date: string | number | Date): Date {
  if (typeof date === 'string') {
    return new Date(date);
  }
  if (typeof date === 'number') {
    return new Date(date * 1000);
  }
  return date instanceof Date ? date : new Date();
}
 
// Convert Date to ISO string for input type datetime-local
convertDateToISOString(date: Date): string {
  return date.toISOString().slice(0, 16); // Slice to remove seconds and milliseconds
}
 
 
updateQuiz(): void {
  if (!this.quizDetail) return;
 
  const updatePayload = {
    quizName: this.quizDetail.quizName,
    startDate: new Date(this.quizDetail.startDate).toISOString(),
    endDate: new Date(this.quizDetail.endDate).toISOString(),
     courseName: this.quizDetail.courseName,
    courseId: this.quizDetail.courseId,
    questions: this.quizDetail.questions.map(q => ({
      text: q.text,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer
    })),
    studentNames: this.quizDetail.studentNames,
    studentIds: this.quizDetail.studentIds
  };
 
  this.fusionService.updateQuizAndQuestions(this.quizId, updatePayload).subscribe(
    () => {
      console.log('Quiz updated successfully');
      // Optional: Display a success message or navigate away
    },
    (error) => {
      console.error('Error updating quiz', error);
      // Optional: Handle error, e.g., display an error message
    }
  );
}
 
closeForm(): void {
  this.quizDetail = null; // Or you can reset the form to its initial state
}
deleteQuiz(quizId :number): void {
  if (!this.quizId) return;
 
  if (confirm('Are you sure you want to delete this quiz?')) {
    this.fusionService.deleteQuiz(this.quizId).subscribe(
      () => {
        console.log('Quiz deleted successfully');
        // Handle success, maybe navigate away or refresh the list of quizzes
        this.closeForm(); // Close the form after deletion
      },
      (error) => {
        console.error('Error deleting quiz', error);
      }
    );
  }
}
 
 
 
 
 
 
resetForm(): void {
  this.projectForm.reset();
  this.selectedUserIds = [];
  this.selectedFile = null;
  this.selectedFileName = '';
   this.assignmentForm.reset();
  this.selectedStudents = []; // Reset selectedStudents instead of selectedStudentIds
  this.selectedFile = null;
  this.selectedFileName = '';
  this.quizForm.reset();
  this.selectedCourseId = null;
  this.selectedUserIds = [];
  this.isQuizCreated = false;
  this.questions = [];
  this.createdQuizId = null;
}
}
 
 
 
 
 
 
 
 
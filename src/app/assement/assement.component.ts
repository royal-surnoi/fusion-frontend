import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MentorService } from '../metor.service';
import { MatDialog } from '@angular/material/dialog';
import { GradeAssesmentComponent } from '../grade-assesment/grade-assesment.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule } from '@angular/material/core';
import { CreatAssesmentComponent } from '../creat-assesment/creat-assesment.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
 
interface ActivityModule {
  id: number;
  moduleName: string; // Use moduleName here to match API response
}
interface Quiz {
  id: number;
  title: any; // You might want to change this to string if possible
  quizName: string;
}
 
export interface FeedbackResponse {
  // Define properties based on your API response structure
  id: number;
  comments: string;
  // Add other properties as needed
}
export interface FeedbackPayload {
  teacherId: number;
  studentId: number;
  courseId?: number;
  quizId?: number;
  assignmentId?: number;
  projectId?: number;
  lessonId?: number;
  lessonModuleId?: number;
  feedback: string;
  grade?: string;
}
@Component({
  selector: 'app-assement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatNativeDateModule,
    CreatAssesmentComponent,
  ],
  templateUrl: './assement.component.html',
  styleUrls: ['./assement.component.css'],
})
 
export class AssementComponent implements OnInit {
  assessmentId: number | undefined;
  selectedContentType: any;
  grade: string | undefined;
  previewUrl: SafeResourceUrl | undefined = undefined;
  safeUrl: string | undefined = undefined;
 
onQuizOrAssessmentChange($event: Event) {
throw new Error('Method not implemented.');
}
 
displayedColumns: string[] = ['title', 'course', 'dueDate', 'submittedCount', 'status', 'actions'];
dataSource!: MatTableDataSource<any>;
 
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
 
activityCourses: { id: number; courseTitle: string; courseTerm: string }[] = [];
activityModules: { moduleName: any; id: number; moduleTitle: string }[] = [];
activityLessons: { id: number; lessonTitle: string }[] = [];
selectedModuleId: number | null = null;
selectedActivityCourse: { id: number; courseTitle: string; courseTerm: string } | null = null;
selectedActivityLesson: { id: number; lessonTitle: string } | null = null;
quizzes: { id: number; quizName: string; title: string }[] = [];
enrollers: any[] = [];
  selectedQuizTitle: string | null = null;
  selectedEnroller: any = null;
  questions: any[] = [];
  lessons: any[] = [];
  assessments: any[] = [];
  selectedLesson: number | null = null;
  selectedTaskType: string | null = null;
  selectedEnrollerResponses: any[] = [];
  isModalOpen: boolean = false;
  assignmentBlob: Blob | null = null;
  teacherId: number | null = null;
  userId: string | null = null;
  selectedAssignmentId: number | undefined;
  showAssignments: boolean = false;
  assignments: any[] = [];
  comments: string = '';
  score: string = 'N/A';
  isAssignment: boolean = false;
  assignmentContent: string = '';
  // selectedAssessmentId: number | undefined = undefined;
//  grade: string = 'N/A';  
//  teacherId: number;
  // studentId: number ;
  courseId?: number;
  quizId?: number;
  assignmentId?: number;
  projectId?: number;
  lessonId?: number;
  lessonModuleId?: number;
  selectedStudentId: number | null = null;
  selectedCourseId?: number;
  selectedLessonId?: number;
  selectedQuizId?: number;
  selectedAssessmentId: number | undefined;
  selectedEnrollerId: number | null = null;
  showDocumentViewer = false;
  viewerUrl: SafeResourceUrl | null = null;
 
 
 
  constructor(
    private mentorService: MentorService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}
 
   ngOnInit(): void {
    this.userId = localStorage.getItem('id');
    const mentorId = localStorage.getItem('mentorId');
    this.teacherId = mentorId ? +mentorId : null;
 
    if (this.teacherId === null || isNaN(this.teacherId)) {
      console.error('Teacher ID is missing or invalid in local storage.');
    }
    this.selectedStudentId = this.userId ? +this.userId : null;
 
    this.loadAssessments();
    this.fetchActivityCourses();
 
    this.route.paramMap.subscribe((params) => {
      const assessmentIdParam = params.get('assessmentId');
      this.assessmentId = assessmentIdParam ? +assessmentIdParam : undefined;
      this.userId = params.get('userId') || this.userId;
    });
  }
 
 
  loadAssessments() {
    this.mentorService.getAssessments().subscribe(
      (assessments) => {
        this.dataSource = new MatTableDataSource(assessments);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: any, filter: string) => {
          const dataStr = JSON.stringify(data).toLowerCase();
          return dataStr.indexOf(filter) != -1;
        };
      },
      (error) => {
        console.error('Error loading assessments:', error);
        // Implement error handling (e.g., show an error message to the user)
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
 
  openCreateAssessmentDialog() {
    const dialogRef = this.dialog.open(CreatAssesmentComponent, {
      width: '500px'
    });
 
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mentorService.createAssessment(result).subscribe(
          () => {
            this.loadAssessments();
       
          },
          error => {
            console.error('Error creating assessment:', error);
       
          }
        );
      }
    });
  }
 
  openGradeAssessmentDialog(assessment: any) {
    const dialogRef = this.dialog.open(GradeAssesmentComponent, {
      width: '500px',
      data: { assessment: assessment }
    });
 
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mentorService.gradeAssessment(assessment.id, result.grade).subscribe(
          () => {
            this.loadAssessments(); // Refresh the assessments list
            // Show success message
          },
          error => {
            console.error('Error grading assessment:', error);
            // Show error message
          }
        );
      }
    });
  }
 
  deleteAssessment(assessmentId: number) {
    if (confirm('Are you sure you want to delete this assessment?')) {
      this.mentorService.deleteAssessment(assessmentId).subscribe(
        () => {
          this.loadAssessments();
          // Show success message
        },
        error => {
          console.error('Error deleting assessment:', error);
          // Show error message
        }
      );
    }
  }
 
 
 
  fetchActivityCourses(): void {
    if (!this.userId) {
      console.error('No user ID found.');
      return;
    }
 
    this.mentorService.fetchCourseByUserId(this.userId).subscribe(
      (response: any) => {
        this.activityCourses = response.map((course: any) => ({
          id: course.id,
          courseTitle: course.courseTitle,
          courseTerm: course.courseTerm
        }));
      },
      (error: any) => {
        console.error('Error fetching courses:', error);
      }
    );
  }
 
  onActivityCourseChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const courseId = +selectElement.value;
    this.selectedActivityCourse = this.activityCourses.find(course => course.id === courseId) || null;
    this.resetSelections();
 
    if (this.selectedActivityCourse) {
      if (this.selectedActivityCourse.courseTerm === 'short') {
        this.fetchActivityLessons(this.selectedActivityCourse.id);
      } else if (this.selectedActivityCourse.courseTerm === 'long') {
        this.fetchActivityModules(this.selectedActivityCourse.id);
      }
    }
  }
 
  onActivityModuleChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedModuleId = +selectElement.value;
    if (this.selectedModuleId) {
      this.fetchLessons(this.selectedModuleId);
    }
  }
 
  fetchActivityModules(courseId: number): void {
    this.mentorService.fetchActivityModules(courseId).subscribe(
      (response: any) => {
        this.activityModules = response.map((module: any) => ({
          id: module.id,
          moduleName: module.moduleName
        }));
      },
      (error: any) => {
        console.error('Error fetching modules data:', error);
      }
    );
  }
 
  fetchLessons(moduleId: number | null): void {
    if (moduleId) {
      this.mentorService.fetchLessons(moduleId).subscribe(
        (response: any) => {
          this.lessons = response.map((lesson: any) => ({
            lessonId: lesson.id,
            lessonTitle: lesson.lessonTitle
          }));
        },
        (error: any) => {
          console.error('Error fetching lessons:', error);
        }
      );
    } else {
      // Handle cases where moduleId is null, if needed
      this.lessons = [];
    }
  }
 
  fetchActivityLessons(courseId: number): void {
    this.mentorService.fetchActivityLessons(courseId).subscribe(
      (response: any) => {
        this.activityLessons = response.map((lesson: any) => ({
          id: lesson.id,
          lessonTitle: lesson.lessonTitle
        }));
      },
      (error: any) => {
        console.error('Error fetching lessons data:', error);
      }
    );
  }
 
  onLessonChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedLessonId = +selectElement.value;
 
    if (this.selectedLessonId) {
      this.fetchQuizzes();
      this.fetchAssessments();
    } else {
      // Handle cases where lessonId is null, if needed
      this.quizzes = [];
      this.assessments = [];
    }
  }
  onActivityLessonChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedLessonId = +selectElement.value;
 
    if (this.selectedLessonId) {
      // Call methods or perform actions based on the selected lesson
      console.log('Selected lesson ID:', this.selectedLessonId);
      // Example: fetch data or update UI elements
    }
  }
 
 
  onTaskChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedTaskType = selectElement.value;
    if (this.selectedLessonId) {
      this.fetchTasksBasedOnContext();
    }
  }
 
  fetchTasksBasedOnContext(): void {
    if (this.selectedTaskType === 'quiz') {
      this.fetchQuizzes();
    } else if (this.selectedTaskType === 'assessment') {
      this.fetchAssessments();
    }
  }
 
  fetchQuizzes(): void {
    if (this.selectedLessonId) {
      if (this.selectedModuleId) {
        this.mentorService.fetchQuizzesByModuleAndLesson(this.selectedModuleId, this.selectedLessonId).subscribe(
          (response: any) => {
            this.quizzes = response.map((quiz: any) => ({
              id: quiz.id,
              quizName: quiz.quizName
            }));
          },
          (error: any) => {
            console.error('Error fetching quizzes:', error);
          }
        );
      } else {
        this.mentorService.fetchQuizzesByLessonId(this.selectedLessonId).subscribe(
          (response: any) => {
            this.quizzes = response.map((quiz: any) => ({
              id: quiz.id,
              quizName: quiz.quizName
            }));
          },
          (error: any) => {
            console.error('Error fetching quizzes by lesson ID:', error);
          }
        );
      }
    }
  }
 
  fetchAssessments(): void {
    if (this.selectedLessonId) {
      if (this.selectedModuleId) {
        this.mentorService.fetchAssessmentsByModuleAndLesson(this.selectedModuleId, this.selectedLessonId).subscribe(
          (response: any) => {
            this.assessments = response.map((assessment: any) => ({
              id: assessment.id,
              assignmentTitle: assessment.assignmentTitle
            }));
          },
          (error: any) => {
            console.error('Error fetching assessments:', error);
          }
        );
      } else {
        this.mentorService.fetchAssessmentsByLessonId(this.selectedLessonId).subscribe(
          (response: any) => {
            this.assessments = response.map((assessment: any) => ({
              id: assessment.id,
              assignmentTitle: assessment.assignmentTitle
            }));
          },
          (error: any) => {
            console.error('Error fetching assessments by lesson ID:', error);
          }
        );
      }
    }
  }
 
  onActivityQuizChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedQuizId = +selectElement.value;
    if (this.selectedQuizId) {
      this.fetchEnrollersForQuiz(this.selectedQuizId);
      this.selectedQuizTitle = this.quizzes.find(quiz => quiz.id === this.selectedQuizId)?.quizName || null;
    } else {
      this.enrollers = [];
      this.selectedQuizTitle = null;
    }
  }
 
  onActivityAssessmentChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedAssessmentId = +selectElement.value;
    if (this.selectedAssessmentId) {
      this.fetchEnrollersForAssessment(this.selectedAssessmentId);
    }
  }
 
 
 
 
 
  fetchEnrollersForQuiz(quizId: number): void {
    this.mentorService.fetchEnrollersByQuizId(quizId).subscribe(
      (response: any) => {
        this.enrollers = response.map((enroller: any) => ({
          id: enroller.id,
          name: enroller.name,
          email: enroller.email,
          score: null, // Initialize score as null
          progress: null // Initialize progress as null
        }));
 
        // Fetch progress for each enroller
        this.enrollers.forEach((enroller, index) => {
          this.fetchEnrollerProgress(quizId, enroller.id, index);
        });
 
        // Optionally, you can select a studentId from this list
        this.selectedStudentId = this.enrollers[0]?.id ?? null; // Example: select the first enroller
      },
      (error: any) => {
        console.error('Error fetching enrollers:', error);
      }
    );
  }
 
  // Method to fetch progress for a specific enroller
  fetchEnrollerProgress(courseId: number, userId: number, index: number): void {
    this.mentorService.fetchEnrollerProgress(courseId, userId).subscribe(
      (response: { overallProgress: number }) => {
        if (index >= 0 && index < this.enrollers.length) {
          this.enrollers[index].progress = response.overallProgress; // Update progress for the enroller
        }
      },
      (error: any) => {
        console.error('Error fetching enroller progress:', error);
      }
    );
  }
 
 
 
  // fetchEnrollerProgress(courseId: number, userId: number, index: number): void {
  //   this.mentorService.fetchEnrollerProgress(courseId, userId).subscribe(
  //     (response: { overallProgress: number }) => {
  //       if (response && response.overallProgress !== undefined) {
  //         this.enrollers[index].progress = response.overallProgress;
  //       } else {
  //         console.warn('Progress response is invalid:', response);
  //         this.enrollers[index].progress = NaN; // Handle unexpected cases
  //       }
  //     },
  //     (error: any) => {
  //       console.error('Error fetching enroller progress:', error);
  //     }
  //   );
  // }
 
 
 
  // formatProgress(progress: any): string {
  //   let numericProgress: number;
 
  //   if (typeof progress === 'number') {
  //     numericProgress = progress;
  //   } else if (typeof progress === 'string') {
  //     numericProgress = parseFloat(progress);
  //   } else {
  //     numericProgress = NaN; // Handle unexpected types
  //   }
 
  //   if (!isNaN(numericProgress)) {
  //     return numericProgress.toFixed(2); // Format to 2 decimal places
  //   } else {
  //     console.warn('Progress is not a valid number:', progress);
  //     return 'N/A'; // Return a default value or message
  //   }
  // }
 
 
// fetchEnrollerProgress(courseId: number, userId: number, index: number): void {
 
//   this.mentorService.fetchEnrollerProgress(courseId, userId).subscribe(
 
//     (response: { overallProgress: number }) => {
 
//       this.enrollers[index].progress = response.overallProgress; // Extract progress from the response
 
//     },
 
//     (error: any) => {
 
//       console.error('Error fetching enroller progress:', error);
 
//     }
 
//   );
 
// }
 
 
 
formatProgress(progress: any): string {
 
  // Check if progress is a number or can be converted to a number
 
  let numericProgress: number;
 
 
 
  if (typeof progress === 'number') {
 
    numericProgress = progress;
 
  } else if (typeof progress === 'string') {
 
    numericProgress = parseFloat(progress);
 
  } else {
 
    numericProgress = NaN; // Handle unexpected types
 
  }
 
 
 
  // Return formatted progress or a default message
 
  if (!isNaN(numericProgress)) {
 
    return numericProgress.toFixed(2); // Adjust decimal places as needed
 
  } else {
 
    console.warn('Progress is not a valid number:', progress);
 
    return 'N/A'; // Return a default value or message
 
  }
 
}
 
 
fetchEnrollerScore(quizId: number, enrollerId: number): void {
  this.mentorService.fetchEnrollerScore(quizId, enrollerId).subscribe(
    (score: number) => {
      // Handle cases where score might be NaN
      if (isNaN(score)) {
        this.score = 'N/A';
      } else {
        this.score = this.formatScore(score);
      }
    },
    (error: any) => {
      console.error('Error fetching enroller score:', error);
    }
  );
}
 
 
formatScore(score: number | null): string {
  if (score === null || isNaN(score)) {
    return 'N/A';
  }
  return score.toFixed(1);
}
 
 
 
fetchEnrollersForAssessment(assessmentId: number): void {
  this.mentorService.fetchEnrollersByAssessmentId(assessmentId).subscribe(
    (response: any) => {
      // Map the API response to your enrollers array
      this.enrollers = response.map((enroller: any) => ({
        id: enroller.studentId,
        name: enroller.studentName,
        email: enroller.studentEmail,
        progress: null // Initialize progress as null
      }));
     
      // Fetch progress for each enroller (if needed)
      this.enrollers.forEach((enroller, index) => {
        this.fetchEnrollerProgress(assessmentId, enroller.id, index);
      });
    },
    (error: any) => {
      console.error('Error fetching enrollers:', error);
    }
  );
}
 
// fetchEnrollerProgress1(courseId: number, userId: number, index: number): void {
//   this.mentorService.fetchEnrollerProgress(courseId, userId).subscribe(
//     (response: { overallProgress: number }) => {
//       // Update progress in the enrollers array
//       this.enrollers[index].progress = response.overallProgress;
//     },
//     (error: any) => {
//       console.error('Error fetching enroller progress:', error);
//     }
//   );
// }
 
  // fetchQuestionsForQuiz(quizId: number): void {
  //   this.mentorService.fetchQuestionsForQuiz(quizId).subscribe(
  //     (response: any) => {
  //       this.questions = response; // Assuming response is an array of questions
  //     },
  //     (error: any) => {
  //       console.error('Error fetching questions:', error);
  //     }
  //   );
  // }
  // fetchEnrollers(): void {
  //   if (this.selectedQuizId) {
  //     this.mentorService.fetchEnrollersByQuizId(this.selectedQuizId).subscribe(
  //       (response: any) => {
  //         this.enrollers = response; // Assume response is an array of enrollers
  //       },
  //       (error: any) => {
  //         console.error('Error fetching enrollers:', error);
  //       }
  //     );
  //   }
  // }
  // fetchAssessments() {
  //   this.mentorService.getAssessments().subscribe(
  //     (data: any[]) => {
  //       this.assessments = data;
  //     },
  //     error => {
  //       console.error('Error fetching assessments:', error);
  //     }
  //   );
  // }
 
  onEnrollerChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedEnrollerId = +selectElement.value;
 
    if (selectedEnrollerId) {
      this.selectedEnroller = this.enrollers.find(enroller => enroller.id === selectedEnrollerId) || null;
    } else {
      this.selectedEnroller = null;
    }
  }
 
 
  viewEnrollerDetails(): void {
    // Add functionality to handle the 'View' button click
    console.log('View details for:', this.selectedEnroller);
 
 
  }
  fetchQuestionsAndResponses(quizId: number, enrollerId: number): void {
    this.mentorService.getQuizResponses(quizId, enrollerId).subscribe(
      (response: any[]) => {
        console.log('API Response:', response);
        if (Array.isArray(response) && response.length > 0) {
          this.selectedEnrollerResponses = response;
          this.questions = response.map(item => ({
            ...item.question,
            selectedAnswer: item.selectedAnswer,
            correct: item.correct
          }));
          this.isAssignment = false;
        } else {
          console.error('Unexpected response structure or empty array:', response);
          this.selectedEnrollerResponses = [];
          this.questions = [];
        }
      },
      (error: any) => {
        console.error('Error fetching questions and responses:', error);
        this.selectedEnrollerResponses = [];
        this.questions = [];
      }
    );
  }
 
  // Ensure you are using assessmentId and not assessments
// Fetch assignment file based on assessmentId and userId
// Fetch assignment file based on assessmentId and userId
 
// Close modal and reset state
 
 
 
// Convert base64 string to Blob
 
 
// Open modal and fetch data based on assessmentId or selectedQuizId
 
// Fetch assignment file based on assessmentId and userId
// Fetch assignment file based on assessmentId and userId
 
 
// Convert base64 string to Blob
 
 
// Trigger download of the Blob
 
 
// Open modal and fetch data based on assessmentId or selectedQuizId
// openModal(enrollerId: number, assessmentId: number | undefined): void {
//   this.selectedEnrollerId = enrollerId; // Store selected enroller ID
//   if (assessmentId != null) {
//     this.isAssignment = true;
//     this.fetchAssignmentFile(assessmentId, enrollerId);
//     // this.fetchGradeForAssignment(assessmentId, enrollerId); // Fetch the grade for the assignment
//   } else if (this.selectedQuizId != null) {
//     this.isAssignment = false;
//     this.fetchQuestionsAndResponses(this.selectedQuizId, enrollerId);
//     this.fetchEnrollerScore(this.selectedQuizId, enrollerId); // Fetch the score for the quiz
//   } else {
//     console.error('No valid ID provided');
//   }
//   this.isModalOpen = true;
// }
 
openModal(enrollerId: number): void {
  this.selectedEnrollerId = enrollerId; // Store selected enroller ID
 
  // Check the selected task type
  if (this.selectedTaskType === 'quiz' && this.selectedQuizId != null) {
    this.isAssignment = false; // Set to false to indicate quiz content
    this.fetchQuestionsAndResponses(this.selectedQuizId, enrollerId);
    this.fetchEnrollerScore(this.selectedQuizId, enrollerId); // Fetch the score for the quiz
  } else if (this.selectedTaskType === 'assessment' && this.selectedAssessmentId != null) {
    this.isAssignment = true; // Set to true to indicate assignment content
    this.fetchAssignmentFile(this.selectedAssessmentId, enrollerId);
  } else {
    console.error('No valid task selected or ID is missing');
  }
 
  this.isModalOpen = true;
}
 
 
// fetchGradeForAssignment(assessmentId: number, enrollerId: number): void {
//   this.mentorService.getAssignmentGrade(assessmentId, enrollerId).subscribe(
//     (response: any) => {
//       // Assuming response is just the grade value
//       this.grade = response || 'N/A';
//     },
//     (error: any) => {
//       console.error('Error fetching grade:', error);
//       this.grade = 'N/A'; // Fallback value in case of error
//     }
//   );
// }
 
// fetchAssignmentFile(assessmentId: number, userId: number): void {
//   this.mentorService.getSubmitAssignmentBy(assessmentId, userId).subscribe(
//     (response: any) => {
//       this.assignmentContent = response.content; // Adjust based on your API response structure
//       this.isAssignment = true;
//       this.score = response.score; // Fetch score or other details if available
//     },
//     (error: any) => {
//       console.error('Error fetching assignment file:', error);
//     }
//   );
// }
 
 
// Close modal and reset state
closeModal(): void {
  this.isModalOpen = false;
  this.assignmentBlob = null;
  this.selectedEnrollerResponses = [];
  this.questions = [];
  this.isAssignment = false;
}
isEnrollerValid(enrollerId: number): boolean {
  return this.enrollers.some(enroller => enroller.id === enrollerId);
}
submitFeedback(): void {
  if (this.teacherId != null && this.selectedStudentId != null) {
    const feedbackData: FeedbackPayload = {
      teacherId: this.teacherId,
      studentId: this.selectedStudentId,
      feedback: this.comments,
      grade: this.isAssignment ? this.grade || '' : '',
      courseId: this.selectedCourseId ?? undefined,
      lessonId: this.selectedLessonId ?? undefined,
      quizId: this.isAssignment ? undefined : this.selectedQuizId,
      assignmentId: this.isAssignment ? this.selectedAssessmentId : undefined
    };
 
    this.mentorService.createFeedback(feedbackData).subscribe(
      response => {
        console.log('Feedback submitted successfully:', response);
        this.handleFeedbackSubmissionSuccess();
      },
      error => {
        console.error('Error submitting feedback:', error);
      }
    );
  } else {
    console.error('Teacher ID or Student ID is missing.');
  }
}
 
handleFeedbackSubmissionSuccess(): void {
  // Remove or disable the enroller from the list
  this.enrollers = this.enrollers.filter(enroller => enroller.id !== this.selectedStudentId);
 
  // Clear modal state and other relevant fields
  this.selectedStudentId = null;
  this.comments = '';
  this.isModalOpen = false; // Close the modal
}
 
fetchEnrollerProgress1(courseId: number, userId: number, index: number): void {
 
  this.mentorService.fetchEnrollerProgress(courseId, userId).subscribe(
 
    (response: { overallProgress: number }) => {
 
      // Update progress in the enrollers array
 
      this.enrollers[index].progress = response.overallProgress;
 
    },
 
    (error: any) => {
 
      console.error('Error fetching enroller progress:', error);
 
    }
 
  );
 
}
 
 
viewDetails(enrollerId: number): void {
  if (this.isEnrollerValid(enrollerId)) {
    this.selectedEnrollerId = enrollerId;
 
    if (this.quizId != null) {
      this.fetchEnrollerScore(this.quizId, enrollerId);
      const index = -1; // Placeholder for index
      this.fetchEnrollerProgress(this.quizId, enrollerId, index);
    } else {
      console.error('quizId is not defined');
    }
  } else {
    console.error('Invalid enroller ID');
    // Handle the case when the enroller is no longer valid
    this.selectedEnrollerId = null;
  }
}
 
 
 
 
 
 
 
 
 
 
 
 
  // viewDetails(enrollerId: number): void {
  //   this.selectedEnrollerId = enrollerId;
  //   if (this.quizId !== null) {
  //     this.fetchEnrollerScore(this.quizId, enrollerId, ); // -1 for no index
  //     this.fetchEnrollerProgress(this.quizId, enrollerId, -1);
  //   }
  // }
  // fetchEnrollerProgress(courseId: number, userId: number, index: number): void {
  //   this.mentorService.fetchEnrollerProgress(courseId, userId).subscribe(
  //     (progress: number) => {
  //       this.enrollers[index].progress = progress;
  //     },
  //     (error: any) => {
  //       console.error('Error fetching enroller progress:', error);
  //     }
  //   );
  // }
  //  formatProgress(progress: number | null): string {
  //   return progress !== null ? progress.toFixed(1) : 'N/A';
  // }
 
 
  downloadAssignment(): void {
    if (this.selectedAssessmentId != null && this.selectedEnrollerId != null) {
      this.mentorService.getSubmitAssignmentBy(this.selectedAssessmentId, this.selectedEnrollerId).subscribe(
        (response: any) => {
          if (response && response.assignmentDocument) {
            this.downloadDocument(response.assignmentDocument, `assignment_${this.selectedAssessmentId}.pdf`);
          } else {
            console.error('Invalid response data for assignment download');
          }
        },
        (error: any) => {
          console.error('Error downloading assignment:', error);
        }
      );
    } else {
      console.error('No assessment or enroller ID available for download');
    }
  }
    // Method to preview the assignment in a new tab
    previewAssignment(): void {
      if (this.selectedAssessmentId != null && this.selectedEnrollerId != null) {
        this.mentorService.getSubmitAssignmentBy(this.selectedAssessmentId, this.selectedEnrollerId).subscribe(
          (response: any) => {
            if (response && response.assignmentDocument) {
              const blobUrl = this.createBlobUrl(response.assignmentDocument);
              if (blobUrl) {
                window.open(blobUrl, '_blank'); // Open in a new tab
              } else {
                console.error('Unable to create a Blob URL for preview');
              }
            } else {
              console.error('Invalid response data for assignment preview');
            }
          },
          (error: any) => {
            console.error('Error fetching assignment file for preview:', error);
          }
        );
      } else {
        console.error('No assessment or enroller ID available for preview');
      }
    }
 
    createBlobUrl(base64: string): string | null {
      try {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
   
        const byteArray = new Uint8Array(byteNumbers);
        let mimeType = 'application/octet-stream'; // Default for unknown types
   
        if (base64.startsWith('JVBERi0') || base64.startsWith('%PDF')) {
          mimeType = 'application/pdf';
        } else if (base64.startsWith('/9j/')) {
          mimeType = 'image/jpeg';
        } else if (base64.startsWith('iVBORw')) {
          mimeType = 'image/png';
        } else if (base64.startsWith('UEsDB')) {
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; // DOCX
        } else if (base64.startsWith('0M8R4')) {
          mimeType = 'application/msword'; // Older DOC format
        } else if (base64.startsWith('UklGR')) {
          mimeType = 'audio/wav';
        } else if (base64.startsWith('AAABAAEAEBAQ')) {
          mimeType = 'image/x-icon';
        }
        // Add more checks for other types as needed
   
        const blob = new Blob([byteArray], { type: mimeType });
        return URL.createObjectURL(blob); // Create a Blob URL
      } catch (error) {
        console.error('Error creating Blob URL:', error);
        return null;
      }
    }
   
   
   
   
   
    // Helper method to download a document
    // downloadDocument(documentData: string, fileName: string): void {
    //   const binaryData = atob(documentData);
    //   const bytes = new Uint8Array(binaryData.length);
    //   for (let i = 0; i < binaryData.length; i++) {
    //     bytes[i] = binaryData.charCodeAt(i);
    //   }
    //   const blob = new Blob([bytes], { type: 'application/pdf' });
    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = fileName;
    //   a.click();
    //   window.URL.revokeObjectURL(url);
    // }
   
    // Helper method to get document URL for preview
    // getDocumentUrl(documentData: string): string {
    //   try {
    //     const binaryData = atob(documentData);
    //     const bytes = new Uint8Array(binaryData.length);
    //     for (let i = 0; i < binaryData.length; i++) {
    //       bytes[i] = binaryData.charCodeAt(i);
    //     }
    //     const blob = new Blob([bytes], { type: 'application/pdf' });
    //     return window.URL.createObjectURL(blob);
    //   } catch (error) {
    //     console.error('Error generating document URL:', error);
    //     return '';
    //   }
    // }
 
  showAssignmentSection(): void {
    this.showAssignments = true;
    this.fetchSubmittedAssignments();
  }
 
  // Fetch submitted assignments
  fetchSubmittedAssignments(): void {
    if (this.teacherId && this.selectedStudentId) {
      this.mentorService.getSubmittedAssignmentsByTeacherId(this.teacherId, this.selectedStudentId).subscribe(
        (response: any) => {
          this.assignments = response.map((assignment: any) => ({
            id: assignment.id,
            studentName: assignment.studentName,
            // Assuming other properties as needed
          }));
        },
        (error: any) => {
          console.error('Error fetching submitted assignments:', error);
        }
      );
    } else {
      console.error('Teacher ID or Student ID is missing.');
    }
  }
 
  // View an assignment
  viewAssignment(assignmentId: number): void {
    if (this.userId) { // Ensure userId is available
      this.selectedAssignmentId = assignmentId;
      this.fetchAssignmentFile(assignmentId, +this.userId); // Pass both assessmentId and userId
      this.isModalOpen = true;
    } else {
      console.error('User ID is not available');
    }
  }
 
  // Fetch assignment file details
  fetchAssignmentFile(assessmentId: number, userId: number): void {
    this.mentorService.getSubmitAssignmentBy(assessmentId, userId).pipe(
      tap((response) => console.log('Assignment file response:', response)),
      catchError((error) => {
        this.handleError(error);
        return of(null); // Return an observable
      })
    ).subscribe(
      (response: any) => {
        if (response && response.content) {
          this.assignmentContent = response.content;
          this.isAssignment = true;
          this.score = response.score || 'N/A';
        } else {
          console.error('Invalid response structure:', response);
        }
      },
      (error: any) => {
        console.error('Error in subscription:', error);
      }
    );
  }
 
  handleError(error: any): Observable<null> {
    console.error('An error occurred:', error);
    return of(null); // Return an observable of null
  }
 
  showProjectSection() {
    this.isAssignment = false;
  }
 
 
  resetSelections() {
    this.selectedModuleId = null;
    // this.selectedLessonId = null;
   
    this.selectedQuizTitle = null;
    this.activityModules = [];
    this.activityLessons = [];
    this.quizzes = [];
    this.enrollers = [];
   
  }
 
  downloadDocument(documentData: string | null, fileName: string = 'document.pdf'): void {
    if (!documentData) {
      console.error('No document data provided');
      return;
    }
 
    let base64Data = documentData;
    if (documentData.startsWith('data:application/pdf;base64,')) {
      base64Data = documentData.split(',')[1];
    }
 
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteNumbers], { type: 'application/pdf' });
 
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  }
 
  getDocumentUrl(base64: string): SafeResourceUrl | undefined {
    if (!base64) {
      console.error('No document data provided');
      return undefined;
    }
 
    try {
      // Detect the MIME type from the base64 string
      let mimeType = 'application/octet-stream'; // Default MIME type for unknown binary data
      if (base64.startsWith('JVBERi0') || base64.startsWith('%PDF')) {
        mimeType = 'application/pdf';
      } else if (base64.startsWith('/9j/')) {
        mimeType = 'image/jpeg';
      } else if (base64.startsWith('iVBORw')) {
        mimeType = 'image/png';
      } else if (base64.startsWith('UEsDB')) {
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; // DOCX
      } else if (base64.startsWith('0M8R4')) {
        mimeType = 'application/msword'; // Older DOC format
      } else if (base64.startsWith('UklGR')) {
        mimeType = 'audio/wav';
      } else if (base64.startsWith('AAABAAEAEBAQ')) {
        mimeType = 'image/x-icon';
      }
      // Add more checks for other types as needed
 
      const sanitizedUrl = `data:${mimeType};base64,${base64}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(sanitizedUrl);
    } catch (error) {
      console.error('Error processing document data:', error);
      return undefined;
    }
  }
 
 
 
  viewDocument(documentUrl: SafeResourceUrl | string | null): void {
    if (documentUrl) {
      this.viewerUrl = this.getSafeDocumentUrl(documentUrl);
      this.showDocumentViewer = true;
    } else {
      console.error('No document URL available');
    }
  }
 
  getSafeDocumentUrl(documentUrl: any | null): SafeResourceUrl {
    if (!documentUrl) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
    if (typeof documentUrl === 'string') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(documentUrl);
    }
    return documentUrl;
  }
 
  getSafeUrl(url: SafeResourceUrl | string): string | undefined {
    if (typeof url === 'string') {
      return url;
    } else {
      return this.sanitizer.sanitize(4, url) || undefined; // 4 corresponds to SecurityContext.URL
    }
  }
 
  closeViewer(): void {
    this.showDocumentViewer = false;
    this.viewerUrl = null;
  }
 
}
 
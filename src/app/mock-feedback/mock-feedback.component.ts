import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MockService } from '../mock.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-mock-feedback',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './mock-feedback.component.html',
  styleUrl: './mock-feedback.component.css'
})
export class MockFeedbackComponent {
  feedbackForm: FormGroup;
  studentId: string | null = null;
  mockId: string | null = null;
  teacherId: string | null = null;
  assignmentId: string | null = null;
  projectId: string | null = null;
  submissions: any[] = [];
  documentSubmissions: any[] = []; // To hold only document submissions
  previewUrl: SafeResourceUrl | null = null; // Holds the URL for previewing a document
  selectedDocument: any = null; //

  constructor(private mockService: MockService, private fb: FormBuilder,private router:Router,private route: ActivatedRoute,private sanitizer: DomSanitizer) {
    this.feedbackForm = this.fb.group({
      feedback: ['', Validators.required],
      grade: ['', Validators.required]
    });
    this.testType = 'assignment'; 
  }
  ngOnInit(): void {
    // Get route parameters
    this.route.paramMap.subscribe(params => {
        const id = params.get('projectId'); // This will capture either assignmentId or projectId
        const type = params.get('type'); // Parameter to indicate type: 'assignment' or 'project'
        this.studentId = params.get('userId'); // Capture student ID

        // Determine whether it's an assignment or a project based on the type
        if (type === 'assignment') {
            this.assignmentId = id;
            this.projectId = null;
            this.testType = 'assignment';
        } else if (type === 'project') {
            this.projectId = id;
            this.assignmentId = null;
            this.testType = 'project';
        } else {
            console.warn('Invalid type parameter. Expected "assignment" or "project".');
        }

        // Fetch teacher ID from local storage
        this.teacherId = localStorage.getItem('id');
        console.log('Teacher ID fetched from local storage:', this.teacherId);

        // Call method to fetch submissions
        this.getSubmissions();
    });
}


// submitFeedback(): void {
//   if (this.feedbackForm.valid) {
//       const { feedback, grade } = this.feedbackForm.value;

//       // Check if required parameters are available
//       if (this.teacherId && this.studentId) {
//           const feedbackData: any = {
//               teacherId: this.teacherId,
//               studentId: this.studentId,
//               feedback,
//               grade
//           };

//           // Dynamically set assignmentId or projectId based on your logic
//           if (this.assignmentId) {
//               feedbackData.assignmentId = this.assignmentId;
//           } else if (this.projectId) {
//               feedbackData.projectId = this.projectId;
//           }

//           console.log('Submitting feedback with parameters:', feedbackData);

//           this.mockService.createFeedback(feedbackData,this.teacherId,this.studentId).subscribe(
//               (response) => {
//                   console.log('Feedback submitted successfully:', response);
//                   // Optionally navigate or show a success message
//               },
//               (error) => {
//                   console.error('Error submitting feedback:', error);
//               }
//           );
//       } else {
//           console.warn('Missing required parameters. Please check if teacherId, studentId, and either assignmentId or projectId are present.');
//       }
//   }
// }
submitFeedback(): void {
  if (this.feedbackForm.valid) {
    const { feedback, grade } = this.feedbackForm.value;

    if (this.teacherId && this.studentId) {
      const feedbackData: any = {
        teacherId: this.teacherId,
        studentId: this.studentId,
        feedback,
        grade,
      };

      if (this.testType === 'project' && this.projectId) {
        feedbackData.projectId = this.projectId;
      } else if (this.testType === 'assignment' && this.assignmentId) {
        feedbackData.assignmentId = this.assignmentId;
      }

      console.log('Submitting feedback with parameters:', feedbackData);

      this.mockService.createFeedback(feedbackData, this.testType).subscribe(
        (response) => {
          if (response.error) {
            console.warn('Invalid JSON response received:', response.rawResponse);
            // Handle invalid response
            // You might want to show a user-friendly message
          } else {
            console.log('Feedback submitted successfully:', response);
            // Handle success case, show a success message or navigate
          }
        },
        (error) => {
          console.error('Error submitting feedback:', error);
          // Handle HTTP error
        }
      );
    } else {
      console.warn('Missing required parameters. Please check if teacherId, studentId, and either assignmentId or projectId are present.');
    }
  }
}





testType: string; // Define the testType property
goback(): void {
  // Navigate to '/feed/mentordashboard'
  this.router.navigate(['/mockcomp']);
}
////////////////////////////////////////get/////////////////////////
getSubmissions(): void {
  const teacherId = localStorage.getItem('id');
  if (teacherId) {
    this.mockService.getSubmissionsByTeacher(teacherId).subscribe(
      (response: any) => {
        const assignments = response.submittedAssignments || [];
        const projects = response.submittedProjects || [];
       
        // Combine both arrays
        this.submissions = [...assignments, ...projects];
       
        // Filter out non-document submissions
        this.documentSubmissions = this.submissions.filter(submission => submission.submitAssignment);

        // Format submittedAt to a readable date string
        this.documentSubmissions.forEach(submission => {
          submission.formattedDate = this.formatDate(submission.submittedAt);
        });

        console.log('Document submissions fetched successfully:', this.documentSubmissions);
      },
      (error) => {
        console.error('Error fetching submissions:', error);
      }
    );
  } else {
    console.warn('No teacher ID found in local storage');
  }
}

formatDate(dateArray: number[]): string {
  const [year, month, day, hour, minute, second] = dateArray;
  return new Date(year, month - 1, day, hour, minute, second).toLocaleString();
}

getDocumentUrl(base64: string): SafeResourceUrl {
  const sanitizedUrl = `data:application/pdf;base64,${base64}`;
  return this.sanitizer.bypassSecurityTrustResourceUrl(sanitizedUrl);
}

previewDocument(submission: any): void {
  this.selectedDocument = submission;
  this.previewUrl = this.getDocumentUrl(submission.submitAssignment);
}

clearPreview(): void {
  this.selectedDocument = null;
  this.previewUrl = null;
}

}

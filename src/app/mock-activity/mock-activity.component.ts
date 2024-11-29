import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MockTestService } from '../mocktest.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
 
export interface Project {
  id: any;
  title: string;
  description: string;
  document?: string;
}
 
export interface MockTestInterview {
  id: any;
  testType: string;
  title: string;
  description: string;
  projects?: Project[];
  assignments?: any[];
}
 
@Pipe({
  name: 'safe',
  standalone: true
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
 
  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
 
@Component({
  selector: 'app-mock-activity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SafePipe],
  templateUrl: './mock-activity.component.html',
  styleUrls: ['./mock-activity.component.css']
})
export class MockActivityComponent implements OnInit, OnDestroy {
  selectedTestType: string = '';
  assignmentForm: FormGroup;
  projectForm: FormGroup;
  interviewForm: FormGroup;
  mockTests: MockTestInterview[] = [];
  fetchedDocument: string | null = null;
  documentUrl: SafeResourceUrl | null = null;
  private documentUrls: Map<string, string> = new Map();
  submitForm: FormGroup;
  selectedFile: File | null = null;
 
  projectId: number = 0;
  mockId: number = 0;
  studentId: number = 1;
  userId: any;
 
  showDocumentViewer = false;
  viewerUrl: SafeResourceUrl | null = null;
 
  constructor(
    private fb: FormBuilder,
    private mockTestService: MockTestService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    this.assignmentForm = this.fb.group({
      assignmentTitle: ['', Validators.required],
      assignmentTopicName: ['', Validators.required],
      assignmentDescription: ['', Validators.required],
      assignmentDocument: [null],
      userAssignmentAnswer: ['']
    });
 
    this.projectForm = this.fb.group({
      projectTitle: ['', Validators.required],
      projectDescription: ['', Validators.required],
      projectDocument: [null]
    });
 
    this.interviewForm = this.fb.group({
      conferenceUrl: [''],
      trainingRoomName: ['']
    });
 
    this.submitForm = this.fb.group({
      userAnswer: [''],
      file: [null, Validators.required]
    });
  }
 
  ngOnDestroy() {
    this.documentUrls.forEach(url => URL.revokeObjectURL(url));
    this.documentUrls.clear();
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
 
  ngOnInit() {
    this.userId = localStorage.getItem("id");
    this.route.params.subscribe(params => {
      this.mockId = +params['mockId'];
      this.projectId = +params['projectId'] || 0;
      this.studentId = +params['studentId'] || 1;
      if (this.mockId) {
        this.getMockTest(this.mockId);
      } else {
        console.error('No mockId provided in the route');
      }
    });
  }
 
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.submitForm.patchValue({
        file: file
      });
      this.submitForm.get('file')?.updateValueAndValidity();
    }
  }
 
  onSubmit(): void {
    if (this.submitForm.invalid || !this.selectedFile) {
      console.error('Form is invalid or no file selected');
      return;
    }
 
    const userAnswer = this.submitForm.get('userAnswer')?.value;
 
    if (isNaN(this.userId) || isNaN(this.projectId) || isNaN(this.mockId)) {
      console.error('Invalid IDs provided.');
      alert('Invalid IDs provided.');
      return;
    }
 
    this.mockTestService.submitProjectByMock(
      this.userId,
      this.projectId,
      this.mockId,
      this.selectedFile,
      userAnswer
    ).subscribe({
      next: (response) => {
        console.log('Submission successful:', response);
        alert('Project submitted successfully!');
        this.submitForm.reset();
        this.selectedFile = null;
      },
      error: (error: Error) => {
        console.error('Submission failed:', error);
        alert(`Submission failed: ${error.message}`);
      }
    });
  }
 
  getMockTest(mockId: number) {
    this.mockTestService.getMockTestById(mockId).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        if (response) {
          this.mockTests = [response];
          this.selectedTestType = response.testType?.trim().toUpperCase() || '';
         
          switch (this.selectedTestType) {
            case 'ASSIGNMENT':
              if (response.assignments && response.assignments.length > 0) {
                this.populateForm(response.assignments[0]);
                if (response.assignments[0].document) {
                  this.fetchedDocument = response.assignments[0].document;
                  this.documentUrl = this.getDocumentUrl(response.assignments[0].document);
                }
              }
              break;
            case 'PROJECT':
              if (response.projects && response.projects.length > 0) {
                this.populateForm(response.projects[0]);
                this.projectId = response.projects[0].id;
              }
              break;
              case 'INTERVIEW':
                if (response.interviews && response.interviews.length > 0) {
                  // Assuming interviews is an array, you want the first interview's details
                  this.populateForm(response.interviews[0]);
                } else {
                  console.warn('No interview data available');
                }
                break;
             
            default:
              console.warn('Unknown test type:', this.selectedTestType);
          }
         
          console.log('Mock test details fetched successfully:', response);
        } else {
          console.error('No data received from the server');
        }
      },
      error: (error) => console.error('Error fetching mock test details:', error)
    });
  }
  populateForm(data: any): void {
    if (['ASSIGNMENT', 'PROJECT', 'INTERVIEW'].includes(this.selectedTestType)) {
      switch (this.selectedTestType) {
        case 'ASSIGNMENT':
          this.assignmentForm.patchValue({
            assignmentTitle: data.title || '',
            assignmentTopicName: data.topicName || '',
            assignmentDescription: data.description || '',
            assignmentDocument: data.document || null
          });
          if (data.document) {
            this.documentUrl = this.getDocumentUrl(data.document);
          }
          break;
        case 'PROJECT':
          this.projectForm.patchValue({
            projectTitle: data.title || '',
            projectDescription: data.description || '',
            projectDocument: data.document || null
          });
          break;
          case 'INTERVIEW':
            console.log('Populating interview form with:', data);
            this.interviewForm.patchValue({
              conferenceUrl: data.conferenceUrl || '',
              trainingRoomName: data.trainingRoomName || ''
            });
            break;
         
      }
    } else {
      console.warn('Unknown or unsupported test type:', this.selectedTestType);
    }
  }
 
 
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.assignmentForm.patchValue({
        assignmentDocument: file
      });
    }
  }
 
  submitAssignmentForm() {
    if (this.assignmentForm.valid && this.mockTests.length > 0) {
      const assignmentId = this.mockTests[0].id;
      const submitAssignment = this.assignmentForm.get('assignmentDocument')?.value;
      const userAssignmentAnswer = this.assignmentForm.get('userAssignmentAnswer')?.value;
 
      this.mockTestService.submitAssignmentByMock(
        this.studentId,
        assignmentId,
        this.mockId,
        submitAssignment,
        userAssignmentAnswer
      ).subscribe({
        next: (response) => {
          console.log('Assignment submitted successfully:', response);
          alert('Assignment submitted successfully:');
          // Handle success (e.g., show a success message, reset form, navigate)
        },
        error: (error) => {
          console.error('Error submitting assignment:', error);
          alert('Error submitting assignment:');
          // Handle error (e.g., show error message)
        }
      });
    }
  }
 
  submitProjectForm() {
    if (this.projectForm.valid) {
      console.log('Project form submitted:', this.projectForm.value);
      // Add your submission logic here
    }
  }
 
  submitInterviewForm() {
    if (this.interviewForm.valid) {
      console.log('Interview form submitted:', this.interviewForm.value);
      // Add your submission logic here
    }
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
 
  getDocumentUrl(base64: string): SafeResourceUrl | null {
    if (!base64) {
      console.error('No document data provided');
      return null;
    }
    try {
      const sanitizedUrl = `data:application/pdf;base64,${base64}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(sanitizedUrl);
    } catch (error) {
      console.error('Error processing document data:', error);
      return null;
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
 
  getSafeUrl(url: SafeResourceUrl | string): string | null {
    if (typeof url === 'string') {
      return url;
    } else {
      return this.sanitizer.sanitize(4, url); // 4 corresponds to SecurityContext.URL
    }
  }
 
  closeViewer(): void {
    this.showDocumentViewer = false;
    this.viewerUrl = null;
  }
}
 
 
 
 
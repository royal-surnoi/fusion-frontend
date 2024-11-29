import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FusionService } from '../fusion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Fusion2Service } from '../fusion2.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-mentorcourseassignmentupdate',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './mentorcourseassignmentupdate.component.html',
  styleUrl: './mentorcourseassignmentupdate.component.css'
})
export class MentorcourseassignmentupdateComponent  implements OnInit {
  assignmentForm!: FormGroup;
 
  teacherId: number | null = null;
  assignmentId: number | null = null;


  constructor(
    private fb: FormBuilder,
    private fusion2Service: Fusion2Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.assignmentForm = this.fb.group({
      assignmentTitle: ['', Validators.required],
      assignmentTopicName: ['', Validators.required],
      assignmentDescription: ['', Validators.required],
      maxScore: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reviewMeetDate: ['', Validators.required],
      assignmentAnswer: ['', Validators.required],
      assignmentDocument: [null]
    });
  }


  ngOnInit(): void {
 // Initialize data fetching and teacherId setup
 this.initializeAssignmentData();
    

  }

  private initializeAssignmentData(): void {
    // Retrieve teacherId from local storage
    this.teacherId = +localStorage.getItem('id')!;
    
    // Retrieve assignmentId from route parameters
    this.assignmentId = +this.route.snapshot.paramMap.get('assignmentId')!;

    if (this.assignmentId) {
      this.fetchAssignmentData(this.assignmentId);
    }
  }

  fetchAssignmentData(assignmentId: number): void {
    this.fusion2Service.getcourseAssignmentById(assignmentId).subscribe(
      (data) => {
        console.log('Assignment Data:', data);
  
        // Convert reviewMeetDate to a proper datetime-local format
        let formattedReviewMeetDate: string | null = null;
        if (data.reviewMeetDate && Array.isArray(data.reviewMeetDate)) {
          const [year, month, day, hour, minute] = data.reviewMeetDate;
          const formattedDate = new Date(year, month - 1, day, hour, minute);
          formattedReviewMeetDate = formattedDate.toISOString().substring(0, 16);
        }
  
        // Convert startDate to a proper datetime-local format
        let formattedStartDate: string | null = null;
        if (data.startDate && Array.isArray(data.startDate)) {
          const [year, month, day, hour, minute] = data.startDate;
          const formattedDate = new Date(year, month - 1, day, hour, minute);
          formattedStartDate = formattedDate.toISOString().substring(0, 16);
        }
  
        // Convert endDate to a proper datetime-local format
        let formattedEndDate: string | null = null;
        if (data.endDate && Array.isArray(data.endDate)) {
          const [year, month, day, hour, minute] = data.endDate;
          const formattedDate = new Date(year, month - 1, day, hour, minute);
          formattedEndDate = formattedDate.toISOString().substring(0, 16);
        }
  
        // Populate form with retrieved data
        this.assignmentForm.patchValue({
          assignmentTitle: data.assignmentTitle,
          assignmentDescription: data.assignmentDescription,
          assignmentTopicName:data.assignmentTopicName,
          assignmentAnswer:data.assignmentAnswer,
          maxScore:data.maxScore,
          endDate: formattedEndDate,
          startDate: formattedStartDate,
          reviewMeetDate: formattedReviewMeetDate
        });
      },
      (error) => {
        console.error('Error fetching assignment data:', error);
      }
    );
  }
  
  

  navigateToDashboard(): void {
    this.router.navigate(['/mentorperspective']);
  }

  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0];
      }
  }
  
  onSubmit(): void {
      if (this.assignmentForm.invalid) {
        return;
      }
  
      const formData = new FormData();
      formData.append('assignmentTitle', this.assignmentForm.get('assignmentTitle')?.value);
      formData.append('assignmentTopicName', this.assignmentForm.get('assignmentTopicName')?.value);
      formData.append('assignmentDescription', this.assignmentForm.get('assignmentDescription')?.value);
      formData.append('maxScore', this.assignmentForm.get('maxScore')?.value);
      formData.append('startDate', this.assignmentForm.get('startDate')?.value);
      formData.append('endDate', this.assignmentForm.get('endDate')?.value);
      formData.append('reviewMeetDate', this.assignmentForm.get('reviewMeetDate')?.value);
      formData.append('assignmentAnswer', this.assignmentForm.get('assignmentAnswer')?.value);
  
      if (this.selectedFile) {
        formData.append('assignmentDocument', this.selectedFile, this.selectedFile.name);
      }
  
      if (this.teacherId && this.assignmentId) {
        this.fusion2Service.updateAssignment(this.teacherId, this.assignmentId, formData).subscribe(
          (response) => {
            console.log('Assignment updated successfully', response);
            alert('Assignment updated successfully');
            // Handle success (e.g., navigate to another page, show a success message)
                            // Navigate to the MentorPerspectiveComponent after success
        this.router.navigate(['/mentorperspective']);
          },
          (error) => {
            console.error('Error updating assignment', error);
            // Handle error (e.g., show an error message)
          }
        );
      }
  }
  
}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FusionService } from '../fusion.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mentorcourseassignment',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './mentorcourseassignment.component.html',
  styleUrl: './mentorcourseassignment.component.css'
})
export class MentorcourseassignmentComponent  implements OnInit {

  assignmentForm!: FormGroup;
  selectedFile: File | null = null;
  teacherId: any;
  courseId: any;
  constructor(
    private fb: FormBuilder,
    private fusionService: FusionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }
  ngOnInit(): void {
    this.assignmentForm = this.fb.group({
      assignmentTitle: ['', Validators.required],
      assignmentTopicName: ['', Validators.required],
      assignmentDescription: ['', Validators.required],
      maxScore: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reviewMeetDate: ['', Validators.required],
      // assignmentAnswer: ['', Validators.required],
    });
       // Get teacherId from local storage
       const storedTeacherId = localStorage.getItem('id');
       if (storedTeacherId) {
         this.teacherId = +storedTeacherId;
       }

      // Get studentId from route parameters
    this.courseId = +this.route.snapshot.paramMap.get('courseId')!;
  }

  navigateToDashboard(): void {
    this.router.navigate(['/mentorperspective']);
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.assignmentForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('assignmentTitle', this.assignmentForm.get('assignmentTitle')!.value);
      formData.append('assignmentTopicName', this.assignmentForm.get('assignmentTopicName')!.value);
      formData.append('assignmentDescription', this.assignmentForm.get('assignmentDescription')!.value);
      formData.append('maxScore', this.assignmentForm.get('maxScore')!.value);
      formData.append('startDate', this.assignmentForm.get('startDate')!.value);
      formData.append('endDate', this.assignmentForm.get('endDate')!.value);
      formData.append('reviewMeetDate', this.assignmentForm.get('reviewMeetDate')!.value);
      // formData.append('assignmentAnswer', this.assignmentForm.get('assignmentAnswer')!.value);
      formData.append('assignmentDocument', this.selectedFile);

      this.fusionService.createAssignmentCourse(this.teacherId, this.courseId, formData)
        .subscribe(response => {
          console.log('Assignment created successfully', response);
          alert('Assignment created successfully');
                 // Navigate to the MentorPerspectiveComponent after success
        this.router.navigate(['/mentorperspective']);
        }, error => {
          console.error('Error creating assignment', error);
          alert('Error creating assignment');
        });
    }
  }
}

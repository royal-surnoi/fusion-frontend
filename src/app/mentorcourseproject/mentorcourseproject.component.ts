import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FusionService } from '../fusion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mentorcourseproject',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './mentorcourseproject.component.html',
  styleUrl: './mentorcourseproject.component.css'
})
export class MentorcourseprojectComponent implements OnInit{

  selectedFile: File | null = null;
  projectForm!: FormGroup;
  teacherId: any;
  courseId: any;


  constructor(
    private fusionService: FusionService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.projectForm = this.fb.group({
      projectTitle: ['', Validators.required],
      projectDescription: ['', Validators.required],
      gitUrl: ['', Validators.required],
      projectDeadline: ['', Validators.required],
      startDate: ['', Validators.required],
      reviewMeetDate: ['', Validators.required]
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
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }
  onSubmit(): void {
    if (this.projectForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('projectTitle', this.projectForm.get('projectTitle')?.value);
      formData.append('projectDescription', this.projectForm.get('projectDescription')?.value);
      formData.append('gitUrl', this.projectForm.get('gitUrl')?.value);
      formData.append('projectDeadline', this.projectForm.get('projectDeadline')?.value);
      formData.append('startDate', this.projectForm.get('startDate')?.value);
      formData.append('reviewMeetDate', this.projectForm.get('reviewMeetDate')?.value);
      formData.append('projectDocument', this.selectedFile);

      this.fusionService.createProjectcourse(this.teacherId, this.courseId, formData).subscribe(
        response => {
          console.log('Project created successfully', response);
          alert('Project created successfully');
      // Navigate to the MentorPerspectiveComponent after success
        this.router.navigate(['/mentorperspective']);
        },
        error => {
          console.error('Error creating project', error);
          alert('Error creating project');
        }
      );
    }
  }

}

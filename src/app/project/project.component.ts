import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FusionService } from '../fusion.service';
import { ActivatedRoute, Router } from '@angular/router';




@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit{

  selectedFile: File | null = null;
  projectForm!: FormGroup;
  teacherId: any;
  studentId: any;


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
    this.studentId = +this.route.snapshot.paramMap.get('studentId')!;
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

      this.fusionService.createProjectIndividual(this.teacherId, this.studentId, formData).subscribe(
        response => {
          console.log('Project created successfully', response);
          alert('Project created successfully');
          // Navigate to the MentorPerspectiveComponent after success
          this.router.navigate(['/mentorperspective']);
        },
        error => {
          console.error('Error creating project', error);
        }
      );
    }
  }

}

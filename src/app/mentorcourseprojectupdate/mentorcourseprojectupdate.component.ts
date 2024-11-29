import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FusionService } from '../fusion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Fusion2Service } from '../fusion2.service';

@Component({
  selector: 'app-mentorcourseprojectupdate',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './mentorcourseprojectupdate.component.html',
  styleUrl: './mentorcourseprojectupdate.component.css'
})
export class MentorcourseprojectupdateComponent implements OnInit{

  selectedFile: File | null = null;

  projectForm: FormGroup;


  teacherId: any;
  projectId: any;


  constructor(
    private fusionService: FusionService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private fusion2service :Fusion2Service
  ) {
    this.projectForm = this.fb.group({
      projectTitle: [''],
      projectDescription: [''],
      gitUrl: [''],
      maxTeam: [''],
      projectDeadline: [''],
      startDate: [''],
      reviewMeetDate: ['']
    });
  }
  ngOnInit(): void {
    this.projectForm = this.fb.group({
      projectTitle: ['', Validators.required],
      projectDescription: ['', Validators.required],
      gitUrl: ['', Validators.required],
      projectDeadline: ['', Validators.required],
      startDate: ['', Validators.required],
      maxTeam:[''],
      reviewMeetDate: ['', Validators.required]
    });
       // Get teacherId from local storage
       const storedTeacherId = localStorage.getItem('id');
       if (storedTeacherId) {
         this.teacherId = +storedTeacherId;
       }

      // Get studentId from route parameters
      this.projectId = this.route.snapshot.paramMap.get('projectId') || null;

      if (this.projectId) {
        this.getProjectDetails(+this.projectId);
      }
  }

  getProjectDetails(id: number): void {
    this.fusion2service.getProjectById(id).subscribe(
      (data) => {
        console.log('Project data:', data);
  
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
  
        // Convert projectDeadline to a proper datetime-local format
        let formattedProjectDeadline: string | null = null;
        if (data.projectDeadline && Array.isArray(data.projectDeadline)) {
          const [year, month, day, hour, minute] = data.projectDeadline;
          const formattedDate = new Date(year, month - 1, day, hour, minute);
          formattedProjectDeadline = formattedDate.toISOString().substring(0, 16);
        }
  
        this.projectForm.patchValue({
          projectTitle: data.projectTitle,
          projectDescription: data.projectDescription,
          gitUrl: data.gitUrl,
          maxTeam: data.maxTeam,
          projectDeadline: formattedProjectDeadline,
          startDate: formattedStartDate,
          reviewMeetDate: formattedReviewMeetDate
        });
      },
      (error) => {
        console.error('Error fetching project data:', error);
      }
    );
  }
  
  
  navigateToDashboard(): void {
    this.router.navigate(['/mentorperspective']);
  }
  // onFileChange(event: any) {
  //   this.projectDocument = event.target.files[0] || null;
  // }

  projectDocument: File | null = null;

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.projectDocument = file;
    }
  }
  

  onUpdate() {
    const formData = new FormData();
    formData.append('projectTitle', this.projectForm.get('projectTitle')?.value || '');
    formData.append('projectDescription', this.projectForm.get('projectDescription')?.value || '');
    formData.append('gitUrl', this.projectForm.get('gitUrl')?.value || '');
    formData.append('maxTeam', this.projectForm.get('maxTeam')?.value || '');
    formData.append('projectDeadline', this.projectForm.get('projectDeadline')?.value || '');
    formData.append('reviewMeetDate', this.projectForm.get('reviewMeetDate')?.value || '');
  
    if (this.projectDocument) {
      formData.append('projectDocument', this.projectDocument);
    }
  
    const teacherId = localStorage.getItem('id') || '';
    const projectId = this.route.snapshot.paramMap.get('projectId') || '';
  
    this.fusion2service.updateProject(teacherId, projectId, formData).subscribe(
      (response) => {
        console.log('Project updated successfully:', response);
        alert('Project updated successfully');
        // Navigate to the MentorPerspectiveComponent after success
        this.router.navigate(['/mentorperspective']);
      
      },
      (error) => {
        console.error('Error updating project:', error);
        alert('An error occurred while updating the project. Please try again.');
      }
    );
  }    
  

}

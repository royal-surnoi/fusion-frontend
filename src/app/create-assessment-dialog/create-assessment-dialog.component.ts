// import { Component } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MentorService } from '../metor.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-create-assessment-dialog',
  standalone: true,
  imports: [    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatNativeDateModule // Add this line
    ],
  templateUrl: './create-assessment-dialog.component.html',
  styleUrl: './create-assessment-dialog.component.css'
})
export class CreateAssessmentDialogComponent {
  assessmentForm: FormGroup;
  courses: any[] = [];
 
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateAssessmentDialogComponent>,
    private mentorService: MentorService
  ) {
    this.assessmentForm = this.fb.group({
      title: ['', Validators.required],
      course: ['', Validators.required],
      dueDate: ['', Validators.required],
      description: ['']
    });
 
    this.mentorService.getCourses().subscribe(courses => {
      this.courses = courses;
    });
  }
 
  onCancel(): void {
    this.dialogRef.close();
  }
 
  onSubmit(): void {
    if (this.assessmentForm.valid) {
      this.dialogRef.close(this.assessmentForm.value);
    }
  }
}

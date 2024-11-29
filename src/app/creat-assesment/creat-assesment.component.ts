import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MentorService } from '../metor.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-creat-assesment',
  standalone: true,
  imports: [  CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatNativeDateModule],
  templateUrl: './creat-assesment.component.html',
  styleUrl: './creat-assesment.component.css'
})
export class CreatAssesmentComponent {
  assessmentForm: FormGroup;
  courses: any[] = [];
 
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreatAssesmentComponent>,
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

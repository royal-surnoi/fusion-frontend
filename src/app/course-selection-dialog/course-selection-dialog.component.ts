
import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MentorService } from '../metor.service'
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-course-selection-dialog',
  standalone: true,
  imports: [ CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule],
  templateUrl: './course-selection-dialog.component.html',
  styleUrl: './course-selection-dialog.component.css'
})
export class CourseSelectionDialogComponent implements OnInit {
  courses: any[] = [];
  selectedCourse: string='';
 
  constructor(
    public dialogRef: MatDialogRef<CourseSelectionDialogComponent>,
    private mentorService: MentorService
  ) {}
 
  ngOnInit() {
    this.mentorService.getCourses().subscribe(
      (courses:any) => this.courses = courses,
      (error:any) => console.error('Error loading courses:', error)
    );
  }
 
  onCancel(): void {
    this.dialogRef.close();
  }
 
  onSubmit(): void {
    this.dialogRef.close(this.selectedCourse);
  }
}
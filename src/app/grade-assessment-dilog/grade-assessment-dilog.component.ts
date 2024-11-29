import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-grade-assessment-dilog',
  standalone: true,
  imports: [CommonModule,
    FormsModule,  
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule],
  templateUrl: './grade-assessment-dilog.component.html',
  styleUrl: './grade-assessment-dilog.component.css'
})
export class GradeAssessmentDilogComponent {
  gradeForm: FormGroup;
 
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GradeAssessmentDilogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { assessment: any }
  ) {
    this.gradeForm = this.fb.group({
      grade: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      feedback: ['']
    });
  }
 
  onCancel(): void {
    this.dialogRef.close();
  }
 
  onSubmit(): void {
    if (this.gradeForm.valid) {
      this.dialogRef.close(this.gradeForm.value);
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-grade-assesment',
  standalone: true,
  imports: [CommonModule,
    FormsModule,  
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule],
  templateUrl: './grade-assesment.component.html',
  styleUrl: './grade-assesment.component.css'
})
export class GradeAssesmentComponent {
  gradeForm: FormGroup;
 
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GradeAssesmentComponent>,
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

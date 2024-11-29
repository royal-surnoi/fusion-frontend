import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-progress-dialog',
  standalone: true,
  imports: [ MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    NgIf],
  templateUrl: './progress-dialog.component.html',
  styleUrl: './progress-dialog.component.css'
})
export class ProgressDialogComponent {
  progress: number;
 
  constructor(
    public dialogRef: MatDialogRef<ProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {
    this.progress = data;
  }
 
  onCancel(): void {
    this.dialogRef.close();
  }
 
  onSubmit(): void {
    if (this.progress >= 0 && this.progress <= 100) {
      this.dialogRef.close(this.progress);
    }
  }
}

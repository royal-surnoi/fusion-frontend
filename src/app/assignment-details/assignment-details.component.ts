import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-assignment-details',
  standalone: true,
  imports: [ MatDialogModule,CommonModule],
  templateUrl: './assignment-details.component.html',
  styleUrl: './assignment-details.component.css'
})
export class AssignmentDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
 
  submitAssignment() {
    console.log('Submitting assignment');
    this.data.status = 'Submitted';
  }
}

import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message-details',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, CommonModule],
  templateUrl: './message-details.component.html',
  styleUrl: './message-details.component.css'
})
export class MessageDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<MessageDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
 
  onReply() {
    this.dialogRef.close('reply');
  }
 
  onClose() {
    this.dialogRef.close();
  }
}

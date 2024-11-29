import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-submissionpopreview',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './submissionpopreview.component.html',
  styleUrl: './submissionpopreview.component.css'
})
export class SubmissionpopreviewComponent {
  @Input() submission: any;
  @Output() reviewed = new EventEmitter<{ action: string, feedback: string }>();
  feedback: string = '';

  approveSubmission() {
    this.reviewed.emit({ action: 'approve', feedback: this.feedback });
  }

  rejectSubmission() {
    this.reviewed.emit({ action: 'reject', feedback: this.feedback });
  }

  closePopup() {
    this.reviewed.emit({ action: 'close', feedback: '' });
  }
}

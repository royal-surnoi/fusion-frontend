import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SubmissionpopreviewComponent } from '../submissionpopreview/submissionpopreview.component';

interface Submission {
  id: number;
  candidateId: number;
  title: string;
  content: string;
  submittedDate: Date;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  type: 'assignment' | 'project';
  itemId: number;
}

interface CandidateStatus {
  candidateId: number;
  assignments: { id: number; title: string; status: string }[];
  projects: { id: number; title: string; status: string }[];
}

@Component({
  selector: 'app-submissionreview',
  standalone: true,
  imports: [CommonModule, FormsModule, SubmissionpopreviewComponent],
  templateUrl: './submissionreview.component.html',
  styleUrl: './submissionreview.component.css'
})
export class SubmissionreviewComponent {
  @Input() submissions: any;
  @Input() candidateId: any;

  selectedSubmission: Submission | null = null;
  candidateStatus: CandidateStatus | null = null;
  feedback: string = '';

  ngOnInit() {
    this.loadCandidateStatus();
  }

  loadCandidateStatus() {
    // In a real application, you'd fetch this data from a service
    this.candidateStatus = {
      candidateId: this.candidateId,
      assignments: [
        { id: 1, title: 'Assignment 1', status: 'Completed' },
        { id: 2, title: 'Assignment 2', status: 'In Progress' },
      ],
      projects: [
        { id: 1, title: 'Project A', status: 'Ongoing' },
        { id: 2, title: 'Project B', status: 'Not Started' },
      ]
    };
  }

  getItemTitle(submission: Submission): string {
    if (submission.type === 'assignment') {
      return this.candidateStatus?.assignments.find(a => a.id === submission.itemId)?.title || 'Unknown Assignment';
    } else {
      return this.candidateStatus?.projects.find(p => p.id === submission.itemId)?.title || 'Unknown Project';
    }
  }

  openPopup(submission: Submission): void {
    this.selectedSubmission = submission;
  }

  closePopup(): void {
    this.selectedSubmission = null;
    this.feedback = '';
  }

  approveSubmission(): void {
    if (this.selectedSubmission) {
      this.selectedSubmission.status = 'approved';
      console.log('Submission approved:', this.selectedSubmission, 'Feedback:', this.feedback);
      this.closePopup();
    }
  }

  rejectSubmission(): void {
    if (this.selectedSubmission) {
      this.selectedSubmission.status = 'rejected';
      console.log('Submission rejected:', this.selectedSubmission, 'Feedback:', this.feedback);
      this.closePopup();
    }
  }

  isPending(submission: Submission): boolean {
    return submission.status === 'pending';
  }
  
}
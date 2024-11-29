import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MentorService } from '../mentor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubmissionreviewComponent } from '../submissionreview/submissionreview.component';
import { CandidatelistComponent } from '../candidatelist/candidatelist.component';

interface Candidate {
  id: number;
  name: string;
  email: string;
  progress: number;
}

interface Submission {
  id: number;
  candidateId: number;
  title: string;
  content: string;
  submittedDate: Date;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
}

@Component({
  selector: 'app-mentorperspective',
  standalone: true,
  imports: [CommonModule, FormsModule, SubmissionreviewComponent, CandidatelistComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './mentorperspective.component.html',
  styleUrl: './mentorperspective.component.css'
})
export class MentorperspectiveComponent {
  candidates: Candidate[] = [];
  submissions: Submission[] = [];
  selectedCandidateId: number | null = null;

  constructor(private mentorService: MentorService) { }

  ngOnInit(): void {
    this.loadCandidates();
    this.loadSubmissions();
  }

  loadCandidates() {
    this.candidates = this.mentorService.getCandidates();
  }

  loadSubmissions(): void {
    this.submissions = this.mentorService.getSubmissions();
  }

  onCandidateSelected(candidateId: number) {
    this.selectedCandidateId = candidateId;
  }

  getFilteredSubmissions(): Submission[] {
    return this.submissions.filter(s => s.candidateId === this.selectedCandidateId);
  }
}
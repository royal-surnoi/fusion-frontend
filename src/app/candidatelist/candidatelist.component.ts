import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MentorService } from '../mentor.service';

export interface Candidate {
  id: number;
  name: string;
  email: string;
  progress: number;
}

@Component({
  selector: 'app-candidatelist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidatelist.component.html',
  styleUrl: './candidatelist.component.css'
})
export class CandidatelistComponent {
  @Input() candidates: Candidate[] = [];
  @Output() candidateSelected = new EventEmitter<number>();

  constructor(private mentorService: MentorService) {}

  ngOnInit(): void {
    // if (this.candidates.length === 0) {
    //   this.candidates = this.mentorService.getCandidates();
    // }
  }

  onCandidateClick(candidateId: number) {
    this.candidateSelected.emit(candidateId);
  }
  
}
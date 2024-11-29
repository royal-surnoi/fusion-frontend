import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface AssignmentData {
  id: number;
  name: string;
  description: string;
  dueDate: Date;
  maxScore: number;
}

@Component({
  selector: 'app-assignmentnew',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './assignmentnew.component.html',
  styleUrl: './assignmentnew.component.css'
})
export class AssignmentnewComponent implements OnInit {
  @Input() assignmentData: AssignmentData = {} as AssignmentData;
  @Input() isMentorView: boolean = false;
  @Output() dataUpdate = new EventEmitter();

  assignmentForm: FormGroup = new FormGroup({});
  submitted = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.assignmentForm = this.formBuilder.group({
      answer: ['', [Validators.required, Validators.minLength(50)]],
      attachments: ['']
    });

    if (this.isMentorView) {
      this.assignmentForm.disable();
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.assignmentForm.patchValue({ attachments: file });
  }

  onSubmit() {
    this.submitted = true;
    if (this.assignmentForm.invalid) {
      return;
    }
    const submissionData = {
      assignmentId: this.assignmentData.id,
      answer: this.assignmentForm.get('answer')!.value,
      attachments: this.assignmentForm.get('attachments')!.value
    };
    this.dataUpdate.emit(submissionData);
  }

  get remainingTime(): string {
    const now = new Date();
    const dueDate = new Date(this.assignmentData.dueDate);
    const timeDiff = dueDate.getTime() - now.getTime();
    if (timeDiff <= 0) {
      return 'Assignment is past due';
    }
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days} days and ${hours} hours remaining`;
  }
}
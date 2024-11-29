import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FusionService } from '../fusion.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-assignment',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './assignment.component.html',
  styleUrl: './assignment.component.css'
})
export class AssignmentComponent  implements OnInit {

  // titleName: string = '';
  // topicName: string = '';

  // fileName: string = 'No file chosen';
  // selectedFile: File | null = null;

  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files[0]) {
  //     const file = input.files[0];
  //     if (file.type === 'application/pdf') {
  //       this.selectedFile = file;
  //       this.fileName = file.name;
  //     } else {
  //       alert('Please select a PDF file.');
  //       input.value = '';  
  //     }
  //   }
  // }

  // onUpload(): void {
  //   if (!this.titleName.trim() || !this.topicName.trim()) {
  //     alert('Please fill in both the title and topic fields.');
  //     return;
  //   }
    
  //   if (!this.selectedFile) {
  //     alert('Please choose a file first.');
  //     return;
  //   }

  //   console.log('Uploading:', this.selectedFile);
  //   console.log('Title:', this.titleName);
  //   console.log('Topic:', this.topicName);

  //   setTimeout(() => {
  //     alert(`File "${this.selectedFile?.name}" uploaded successfully!`);
  //     this.resetForm();
  //   }, 1000);
  // }

  // removeFile(): void {
  //   this.selectedFile = null;
  //   this.fileName = 'No file chosen';
  //   const fileInput = document.getElementById('file-upload') as HTMLInputElement;
  //   if (fileInput) {
  //     fileInput.value = '';
  //   }
  // }

  // resetForm(): void {
  //   this.titleName = '';
  //   this.topicName = '';
  //   this.removeFile();
  // }



  assignementTitle: string = '';
  assignmentTopicName: string = '';

  fileName: string = 'No file chosen';
  selectedFile: File | null = null;

  userId: any; // Example userId, replace with actual value
  lessonId: any; // Example lessonId, replace with actual value

  constructor(private route: ActivatedRoute,private fusionService: FusionService) {}


  ngOnInit(): void {
       this.route.paramMap.subscribe(params => {
      this.lessonId = params.get('lessonId') || '';
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
        this.fileName = file.name;
      } else {
        alert('Please select a PDF file.');
        input.value = '';  // Clear the input
      }
    }
  }

  onUpload(): void {
    if (!this.assignementTitle.trim() || !this.assignmentTopicName.trim()) {
      alert('Please fill in both the title and topic fields.');
      return;
    }

    if (!this.selectedFile) {
      alert('Please choose a file first.');
      return;
    }

    this.fusionService.uploadAssignment(this.lessonId, this.assignementTitle, this.assignmentTopicName, this.selectedFile)
      .subscribe({
        next: (response) => {
          alert(`File "${this.selectedFile?.name}" uploaded successfully!`);
          this.resetForm();
        },
        error: (error) => {
          console.error('Error uploading file:', error);
          alert('There was an error uploading the file. Please try again.');
        }
      });
  }

  removeFile(): void {
    this.selectedFile = null;
    this.fileName = 'No file chosen';
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  resetForm(): void {
    this.assignementTitle = '';
    this.assignmentTopicName = '';
    this.removeFile();
  }
}

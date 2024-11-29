import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MentoronlineService } from '../mentoronline.service';
 
@Component({
  selector: 'app-onlineclass',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,MatIconModule],
  templateUrl: './onlineclass.component.html',
  styleUrl: './onlineclass.component.css'
})
export class OnlineclassComponent implements OnInit {
  courseId: number | null = null;
  courseForm!: FormGroup;
  course:any;
 
  roomName: string = '';
  scheduledTime: string = '';
 
  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private mentoronlineService: MentoronlineService
  ) { }
 
  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.courseForm = this.fb.group({
      courses: this.fb.array([this.createCourseGroup()])
    });
 
    this.courseId = +this.route.snapshot.paramMap.get('courseId')!;
    if (this.courseId) {
      this.loadCourse(this.courseId);
    }
 
    // this.courseId = +this.route.snapshot.paramMap.get('courseId');
 
  }
   
  navigateToDashboard(): void {
    this.router.navigate(['/mentorperspective']);
  }
  loadCourse(id: number): void {
    this.mentoronlineService.getCourseById(id).subscribe(
      data => this.course = data,
      error => console.error(error)
    );
  }
get courses() {
  return this.courseForm.get('courses') as FormArray;
}
createCourseGroup(): FormGroup {
  return this.fb.group({
   
    courseTopic: ['', Validators.required],
    meetingStarting: ['', Validators.required]  // Add meetingStarting field
 
  });
}
addCourse() {
  this.courses.push(this.createCourseGroup());
}
removeCourse(index: number) {
  this.courses.removeAt(index);
}
 
onSubmitOnline() {
  console.log(this.courseForm.value);
}
onSubmit() {
  if (this.roomName && this.scheduledTime && this.courseId !== null) {
    const scheduledDate = new Date(this.scheduledTime);
    this.mentoronlineService.createRoom(this.roomName, this.courseId, scheduledDate)
      .subscribe(
        response => {
          console.log('Training room created successfully', response);
          alert('Class created successfully');
          this.router.navigate(['/mentorperspective']);
        },
        error => {
          console.error('Error creating training room', error);
        }
      );
  } else {
    console.error('Missing required information');
  }
}
 
 
// onSubmit() {
//   if (this.roomName && this.scheduledTime && this.courseId !== null) {
//     const scheduledDate = new Date(this.scheduledTime);
//     this.mentoronlineService.createRoom(this.roomName, this.courseId, scheduledDate)
//       .subscribe(
//         response => {
//           console.log('Training room created successfully', response);
//           // Handle success (e.g., show a success message, navigate to a different page)
//           alert('class created successfully');
//           // Navigate to the MentorPerspectiveComponent after success
//           this.router.navigate(['/mentorperspective']);
//         },
//         error => {
//           console.error('Error creating training room', error);
//           // Handle error (e.g., show an error message)
//         }
//       );
//   } else {
//     console.error('Missing required information');
//     // Handle the case where required information is missing
//   }
// }
}
 
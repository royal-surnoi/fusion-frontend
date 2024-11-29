import { Component, OnInit } from '@angular/core';
import { Course, MentoronlineService, TrainingRoom } from '../mentoronline.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
 
interface CourseWithRooms extends Course {
  showRooms?: boolean;
  trainingRooms?: TrainingRoom[];
}
 
@Component({
  selector: 'app-mentoronline',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  providers: [DatePipe],
  templateUrl: './mentoronline.component.html',
  styleUrls: ['./mentoronline.component.css']
})
export class MentoronlineComponent implements OnInit {
  courses: CourseWithRooms[] = [];
  userId: number | null = null;
 
  constructor(
    private mentoronlineService: MentoronlineService,
    private router: Router,
    private datePipe: DatePipe
  ) { }
 
  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('id'));
    if (this.userId) {
      this.getCourses();
    } else {
      console.error('User ID not found in local storage');
    }
  }
 
  getCourses(): void {
    if (this.userId) {
      this.mentoronlineService.getOnlineCoursesByMentor(this.userId).subscribe(
        (data: Course[]) => {
          this.courses = data.map(course => ({...course, showRooms: false}));
        },
        (error) => {
          console.error('Error fetching courses', error);
        }
      );
    }
  }
 
  navigateToOnlineClass(courseId: number) {
    this.router.navigate(['/onlineclass', courseId]);
  }
 
  toggleRooms(course: CourseWithRooms): void {
    course.showRooms = !course.showRooms;
    if (course.showRooms && !course.trainingRooms) {
      this.getTrainingRooms(course);
    }
  }
 
  getTrainingRooms(course: CourseWithRooms): void {
    if (this.userId) {
      this.mentoronlineService.getRoomsByCourse(course.id, this.userId).subscribe(
        (rooms: TrainingRoom[]) => {
          course.trainingRooms = rooms.map(room => ({
            ...room,
            scheduledTime: new Date(room.scheduledTime)
          }));
        },
        (error: any) => console.error('Error fetching training rooms', error)
      );
    }
  }
 
  formatDate(date: Date | string): string {
    return this.datePipe.transform(date, 'short') || '';
  }
 
  isScheduledTimeCompleted(scheduledTime: Date | string): boolean {
    const scheduledDate = new Date(scheduledTime);
    return new Date() > scheduledDate;
  }
}
 
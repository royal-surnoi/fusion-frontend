import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-metricsview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metricsview.component.html',
  styleUrl: './metricsview.component.css'
})
export class MetricsviewComponent implements OnInit {
  courses: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses(): void {
    // Mock data
    this.courses = [
      {name: 'Advaith', courseId: 'C001', level: 'Beginner', inProgress: 48, completed: 10 },
      { name: 'satwik',courseId: 'C002', level: 'Intermediate', inProgress: 57, completed: 8 },
      { name: 'chinna',courseId: 'C003', level: 'Advanced', inProgress: 95, completed: 12 }
    ];
    this.courses.forEach(course => {
      course.balance = 100 - course.inProgress;
    });
  }

  sendMessage(course: any): void {
    // Implement the message sending functionality here
    console.log('Send message to:', course);
  }

}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course, StudentService, User } from '../student.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {

  user!: User;

  constructor(private studentService : StudentService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;
      if (id) {
        this.fetchCourseById(id);
      } else {
        console.error('No course ID found in the navigation URL');
      }
    });

    const id = +localStorage.getItem('id')!;
    if (id) {
      this.fetchUserById(id);
    } else {
      console.error('No user ID found in local storage');
    }
  }

  studentName: string = '[shivakumar]';
  courseName: string = '[java full stack]';
  awardDate: Date = new Date();
  instructorName: string = '[Ashok kumar]';
name:any;
  fetchUserById(id: number): void {
    this.studentService.getUserById(id).subscribe(
      (data) => {
        this.user = data;
        this.printUserToConsole();
      },
      (error) => {
        console.error('Error fetching user data', error);
      }
    );
  }

  printUserToConsole(): void {
    console.log(this.user);
  }


  course!: Course;

  fetchCourseById(id: number): void {
    this.studentService.getCourseById(id).subscribe(
      (data) => {
        this.course = data;
        this.printCourseToConsole();
      },
      (error) => {
        console.error('Error fetching course data', error);
      }
    );
  }

  printCourseToConsole(): void {
    if (this.course && this.course.user1) {
      console.log(`Name: ${this.course.user1.name}`);
      console.log(`Course Title: ${this.course.courseTitle}`);
      console.log(`Course Duration: ${this.course.courseDuration}`);
    }
  }

  downloadCertificate(): void {
    const data = document.querySelector('.certificate') as HTMLElement;
    html2canvas(data).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // Width in mm
      const pageHeight = 295; // Height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('certificate.pdf');
    });
  }
}
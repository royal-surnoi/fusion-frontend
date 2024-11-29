
 
 
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset, ChartConfiguration, ChartData, Chart, ChartEvent } from 'chart.js';
import { Mentor1Service } from '../mentor1.service';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { FusionService } from '../fusion.service';  
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseChartDirective } from 'ng2-charts';
import { firstValueFrom } from 'rxjs';
// import { MonthlyStatsService } from '../monthly-stats.service';
 
 
@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
 
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
   currentUserId: number;
 
  // Student Progress Chart
  studentProgressChartType: ChartType = 'bar';
  studentProgressChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };
  studentProgressChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [{ data: [], label: 'Student Progress' }]
  };
 
   
/////////////
courseEnrollmentChartType: ChartType = 'pie';
courseEnrollmentChartOptions: ChartConfiguration['options'] = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Course Enrollment'
    }
  },
  onClick: this.handlePieChartClick.bind(this)
};
courseEnrollmentChartData: ChartData<'pie', number[], string | string[]> = {
  labels: [],
  datasets: [{ data: [] }]
};
 
   assessmentCompletionChartType: ChartType = 'line';
   assessmentCompletionChartData: ChartData<'line'> = {
      datasets: [
    {
      data: [],
        label: 'Total Enrollers',
        borderColor: 'blue',
        backgroundColor: 'rgba(0,0,255,0.1)',
      },
    {
      data: [],
        label: 'Submitted Users',
        borderColor: 'red',
        backgroundColor: 'rgba(255,0,0,0.1)',
    }
  ],
  labels: []
};
assessmentCompletionChartOptions: ChartConfiguration['options'] = {
  responsive: true,
  scales: {
    x: {},
    y: {
      beginAtZero: true
    }
  },
  plugins: {
    legend: { display: true },
    title: {
      display: true,
     // text: 'Assessment Completion Over Time'
    }
  }
};
 
   
      constructor(
    private mentorService: Mentor1Service,
    private fusionService: FusionService,
    private router: Router,
    public authService: AuthService,
    private sanitizer: DomSanitizer,
    private mentor1Service: Mentor1Service,
    private cdr: ChangeDetectorRef,
    // private monthlyStatsService: MonthlyStatsService
  ) {
    this.currentUserId  = Number(localStorage.getItem('id')) || 0;
   }
 
  ngOnInit() {
 
   // this.loadOverviewData();
    this.loadCourses();
   
   // this.loadStudentProgressData(1);
     //this.loadCourseEnrollmentData();
   // this.loadAssessmentCompletionData(1);
   // this.getUserIdAndLoadData();
   // this.initializeEmptyStudentProgressChart();
}
 
updateChartsForCourse(courseId: number) {
  console.log(`Updating charts for course ID: ${courseId}`);
  this.loadStudentProgressData(courseId);
  this.loadAssessmentCompletionData(courseId);
}
 
getUserIdAndLoadData() {
  const userId = localStorage.getItem('id');
  if (userId) {
    console.log('User ID from localStorage:', userId);
    this.loadCoursesAndAssessmentData(Number(userId));
  } else {
    console.error('No user ID found in localStorage');
  }
}
 
loadCoursesAndAssessmentData(userId: number) {
  this.mentor1Service.getCoursesByUserId(userId).subscribe(
    (courses) => {
      console.log('Received courses:', courses);
      this.courses = courses;
      this.fetchEnrollmentsForCourses();
     
      if (this.courses.length > 0) {
        const firstCourseId = this.courses[0].id;
        console.log('Loading assessment data for first course ID:', firstCourseId);
        this.loadAssessmentCompletionData(firstCourseId);
      } else {
        console.log('No courses available to load assessment data');
      }
    },
    (error) => {
      console.error('Error fetching courses:', error);
    }
  );
}
 
// initializeEmptyStudentProgressChart(): void {
//     this.studentProgressChartLabels = [];
//     this.studentProgressChartData = [{
//       data: [],
//       label: 'Student Progress'
//     }];
//     if (this.chart) {
//       this.chart.update();
//     }
//   }
//////////////////////////////////////////////////////////
// showEnrollers(courseId: number): void {
//   console.log(`Showing enrollers for course ID: ${courseId}`);
 
//   this.mentor1Service.getCourseProgressForAllUsers(courseId).subscribe(
//     (progressData) => {
//       console.log('Progress data:', progressData);
//       // ... existing code for updating student progress chart ...
 
//       const studentNames: string[] = [];
//       const studentProgress: number[] = [];
 
//       Object.values(progressData).forEach(data => {
//         studentNames.push(data.name);
//         studentProgress.push(data.progress);
//       });
//       console.log('Student names:', studentNames);
//       console.log('Student progress:', studentProgress);
//       this.updateStudentProgressChart(studentNames, studentProgress);
//     //   if (this.chart) {
//     //     this.chart.update();
//     //   }
     
//     //   this.cdr.detectChanges();
//     // },
//       // Update Assessment Completion Over Time chart
//       console.log(`Calling loadAssessmentCompletionData with courseId: ${courseId}`);
//       this.loadAssessmentCompletionData(courseId);
//     },
//     (error) => {
//       console.error(`Error fetching progress data for course ID: ${courseId}`, error);
//       this.initializeEmptyStudentProgressChart();
//     }
//   );
// }
loadStudentProgressData(courseId: number): void {
  console.log(`Fetching progress for course ${courseId}`);
 
  this.fusionService.getEnrolledUsersProgress(courseId).subscribe({
    next: (progressData: { [key: string]: number }) => {
      console.log('Received progress data:', progressData);
     
      const studentNames = Object.keys(progressData);
      const studentProgress = Object.values(progressData);
 
      console.log('Processed student names:', studentNames);
      console.log('Processed student progress:', studentProgress);
 
      if (studentNames.length === 0 || studentProgress.length === 0) {
        console.warn('No student data processed. Check the structure of progressData.');
        this.showErrorMessage('No student progress data available.');
      } else {
        this.updateStudentProgressChart(studentNames, studentProgress);
      }
    },
    error: (error: Error) => {
      console.error('Error fetching progress data:', error);
      this.showErrorMessage(`Failed to fetch student progress data: ${error.message}`);
      this.initializeEmptyStudentProgressChart();
    }
  });
}
 
private showErrorMessage(message: string): void {
  console.error('Error:', message);
  // Implement your error display logic here
}
   
private initializeEmptyStudentProgressChart(): void {
  this.studentProgressChartData = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Student Progress'
    }]
  };
  if (this.chart) {
    this.chart.chart?.update();
  }
  console.log('Empty chart initialized');
}
 
  loadCourseEnrollmentData(labels: string[], data: number[]) {
    this.courseEnrollmentChartData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: this.generateColors(data.length)
      }]
    };
   
    // Update the chart
    if (this.chart) {
      this.chart.update();
    }
  }
 
  generateColors(count: number): string[] {
    return Array.from({ length: count }, () => `#${Math.floor(Math.random()*16777215).toString(16)}`);
  }
  loadAssessmentCompletionData(courseId: number): void {
    console.log(`Fetching assessment completion data for course ${courseId}`);
    this.fusionService.getMonthlyStats(courseId).subscribe({
      next: (response: any) => {
        console.log('Received assessment completion data:', response);
        const monthlyData = response.monthlyData;
 
        const labels = monthlyData.map((item: any) => `${item.year}-${item.month.toString().padStart(2, '0')}`);
        const totalEnrollers = monthlyData.map((item: any) => item.totalEnrollers);
        const submittedUsers = monthlyData.map((item: any) => item.submittedUsers);
 
        this.updateAssessmentCompletionChart(labels, totalEnrollers, submittedUsers);
      },
      error: (error: any) => {
        console.error(`Error fetching assessment completion data for course ID ${courseId}:`, error);
        this.initializeEmptyAssessmentCompletionChart();
      }
    });
  }
 
  private updateAssessmentCompletionChart(labels: string[], totalEnrollers: number[], submittedUsers: number[]) {
    this.assessmentCompletionChartData = {
      labels: labels,
      datasets: [
        {
          data: totalEnrollers,
          label: 'Total Enrollers',
          borderColor: 'blue',
          backgroundColor: 'rgba(0,0,255,0.1)',
        },
        {
          data: submittedUsers,
          label: 'Submitted Users',
          borderColor: 'red',
          backgroundColor: 'rgba(255,0,0,0.1)',
        }
      ]
    };
    this.chart?.update();
    this.cdr.detectChanges();
    console.log('Updating assessment completion chart with:', { labels, totalEnrollers, submittedUsers });
  }
  private initializeEmptyAssessmentCompletionChart(): void {
    this.assessmentCompletionChartData = {
      labels: [],
      datasets: [
        {
          data: [],
          label: 'Total Enrollers',
          borderColor: 'blue',
          backgroundColor: 'rgba(0,0,255,0.1)',
        },
        {
          data: [],
          label: 'Submitted Users',
          borderColor: 'red',
          backgroundColor: 'rgba(255,0,0,0.1)',
        }
      ]
    };
    this.chart?.update();
  }
 
 
  // loadCourseProgress(courseId: number): void {
  //   this.fusionService.getCourseProgress(courseId).subscribe(
  //     data => {
  //       console.log('Course Progress Data:', data);
  //     },
  //     error => {
  //       console.error('Error fetching course progress data', error);
  //     }
  //   );
  // }
 
  // loadOverviewData() {
  //   this.mentor1Service.getOverviewData().subscribe(data => {
  //     this.overviewData = data;
  //   });
  // }
 
  loadCourses(): void {
    this.fusionService.getCoursesByUserId(this.currentUserId).subscribe({
      next: (courses: any[]) => {
        this.courses = courses;
        this.fetchEnrollmentsForCourses();
      },
      error: (error: any) => {
        console.error('Error fetching courses:', error);
      }
    });
  }
  courses: any[] = [];
  // enrollmentData: { [key: number]: any[] } = {};
  // overviewData: any;
 
 
  fetchEnrollmentsForCourses(): void {
    const labels: string[] = [];
    const data: number[] = [];
 
    const enrollmentsPromises = this.courses.map(course =>
      this.fusionService.getCourseEnrollments(course.id).toPromise()
    );
 
    Promise.all(enrollmentsPromises).then(enrollments => {
      this.courses.forEach((course, index) => {
        labels.push(course.courseTitle);
        data.push(enrollments[index]?.length || 0);
      });
 
      this.updateCourseEnrollmentChart(labels, data);
    }).catch(error => {
      console.error('Error fetching enrollments:', error);
    });
  }
 
  updateCourseEnrollmentChart(labels: string[], data: number[]) {
    this.courseEnrollmentChartData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: this.generateColors(data.length)
      }]
    };
    this.chart?.update();
  }
 
  handlePieChartClick(event: ChartEvent, elements: any[], chart: any) {
    if (elements.length > 0) {
      const index = elements[0].index;
      const courseId = this.courses[index].id;
      console.log(`Pie slice clicked: courseId = ${courseId}, index = ${index}`);
     
      // Update both charts
      this.updateChartsForCourse(courseId);
    }
  }
 
  private updateStudentProgressChart(studentNames: string[], studentProgress: number[]): void {
    console.log('Updating student progress chart with:', { studentNames, studentProgress });
    this.studentProgressChartData = {
      labels: studentNames,
      datasets: [{
        data: studentProgress,
        label: 'Student Progress'
      }]
    };
    console.log('Updated studentProgressChartData:', this.studentProgressChartData);
   
    if (this.chart) {
      this.chart.chart?.update();
      console.log('Chart updated');
    } else {
      console.warn('Chart instance not available');
    }
   
    this.cdr.detectChanges();
    console.log('Change detection triggered');
  }
  
}
 
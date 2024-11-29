import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { catchError, debounceTime, distinctUntilChanged, forkJoin, map, mergeMap, of, Subject } from 'rxjs';

interface Course {
  id: number;
  courseTitle: string;
}

interface ProgressCache {
  [key: string]: {
    value: number | string;
    timestamp: number;
  };
}

@Component({
  selector: 'app-candidate-dashboard-component',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './candidate-dashboard-component.component.html',
  styleUrls: ['./candidate-dashboard-component.component.css']
})
export class CandidateDashboardComponentComponent implements OnInit {
  isLoading: boolean = true;
  userId: string | null;
  enrolledCourseDetails: any[] = [];
  filteredEnrolledCourseDetails: any[] = [];
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  private progressCache: ProgressCache = {};
  private cacheDuration = 60000; // 1 minute in milliseconds

  constructor(private router: Router, private http: HttpClient) {
    this.userId = localStorage.getItem("id");
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.filterCourses(searchTerm);
    });
  }

  ngOnInit(): void {
    if (this.userId) {
      this.fetchCoursesWithDetails(this.userId);
    } else {
      console.error('User ID not found in localStorage');
      this.isLoading = false;
    }
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  filterCourses(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredEnrolledCourseDetails = [...this.enrolledCourseDetails];
    } else {
      this.filteredEnrolledCourseDetails = this.enrolledCourseDetails.filter(course => 
        course.course.course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  fetchCoursesWithDetails(userID: string) {
    this.isLoading = true;
    this.http.get<any[]>(`${environment.apiBaseUrl}/enrollment/user/${userID}`).pipe(
      mergeMap((courses: any[]) => {
        const courseDetailsRequests = courses.map((course: any) =>
          forkJoin({
            course: of(course),
            projectProgress: this.http.get(`${environment.apiBaseUrl}/project/projectProgress/${course.course.id}/user/${userID}`).pipe(catchError(() => of(0))),
            overAllCourseProgress: course.course.courseTerm === 'long' 
              ? this.http.get(`${environment.apiBaseUrl}/video/progressOfCourse/user/${userID}/course/${course.course.id}`).pipe(catchError(() => of(0)))
              // /progressOfCourseOfUser/user/${userID}/course/${course.course.id}
              : this.http.get(`${environment.apiBaseUrl}/video/progressOfCourseOfUser/user/${userID}/course/${course.course.id}`).pipe(catchError(() => of(0))),
            quizProgressFraction: this.http.get(`${environment.apiBaseUrl}/api/quizzes/progress/ratio/course/${course.course.id}?userId=${userID}`, { responseType: 'text' as 'json' }).pipe(catchError(() => of('0/0'))),
            AssignmentProgressFraction: this.http.get(`${environment.apiBaseUrl}/submittedByTotalCourse/${course.course.id}?userId=${userID}`, { responseType: 'text' }).pipe(catchError(() => of('0/0'))),
            ProjectProgressFraction: this.http.get(`${environment.apiBaseUrl}/project/progress/${course.course.id}/user/${userID}`, { responseType: 'text' }).pipe(catchError(() => of('0/0')))
          })
        );
        return forkJoin(courseDetailsRequests);
      }),
      catchError(error => {
        console.error('Error fetching courses:', error);
        return of([]);
      })
    ).subscribe(
      (coursesWithDetails: any[]) => {
        this.enrolledCourseDetails = coursesWithDetails;
        this.filteredEnrolledCourseDetails = [...this.enrolledCourseDetails];
        console.log('Courses with details:', this.enrolledCourseDetails);
        this.isLoading = false;
      }
    );
  }
  
  getProgressColor(progress: number): string {
    if (progress < 30) return '#FF6B6B';
    if (progress < 70) return '#FFD93D';
    return '#6BCB77';
  }

  navigateToStudentCourseDetailsPage(courseId: number): void {
    this.router.navigate(['/studentdetails', courseId]);
  }

  private getCachedValue(key: string): number | string | null {
    const cached = this.progressCache[key];
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.value;
    }
    return null;
  }

  private setCachedValue(key: string, value: number | string): void {
    this.progressCache[key] = {
      value: value,
      timestamp: Date.now()
    };
  }
}
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

interface Course {
  course_id: number;
  courseTitle: string;
  courseDescription: string;
  courseFee: number;
  courseImage: string;
  courseType: string;
  level: number;
  courseRating: number;
  creatorName: string;
  enrollments?: any[]; // This is the array of enrollments
  // course_id: number;
  enrollmentCount?: number;
}
@Component({
  selector: 'app-recomondcourse',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    FormsModule,
    CommonModule,
    HttpClientModule,
    RouterLink,
    ProgressBarModule,
    ProgressSpinnerModule
  ],
  templateUrl: './recomondcourse.component.html',
  styleUrls: ['./recomondcourse.component.css']
})
export class RecomondcourseComponent implements OnInit {
  
 
  @ViewChild('recommendationSlider') recommendationSlider!: ElementRef;
  @ViewChild('languageRecommendationSlider') languageRecommendationSlider!: ElementRef;
 
  courses: Course[] = [];
  isLoading: boolean = true;
  userId: number;
  relcourses: any[] = [];
  paginatedRelCourses: any[] = [];
  currentPage: number = 1;
  pageSize: number = 9; // Show 9 courses per page (3 rows of 3)
  totalPages: number = 1;
  langCourses: Course[] = []; // Add this line
  Naviagtors:Boolean = false;
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.userId = Number(localStorage.getItem('id')) || 0;
  }

  ngOnInit() {
    if (this.userId) {
      this.getRecommendations();
      this.getRecommendationsRelated();
      this.getRecommendationsLanguage(); 

    } else {
      console.error('User ID not found in local storage');
      this.snackBar.open('User ID not found. Please log in again.', 'Close', {
        duration: 3000
      });
    }
  }
  NavigatorChange(){
    this.Naviagtors= true
  }
 
  NavigatorChangeout(){
    this.Naviagtors= false
  }
 
  Naviagtors2:Boolean = false;
 
  NavigatorChange2(){
    this.Naviagtors2=true
  }
 
  NavigatorChangeout2(){
    this.Naviagtors2=false
  }
  getRecommendations(): void {
    this.isLoading = true;
    this.http.post<{recommendations: Course[]}>(`${environment.apiBaseUrl}/skillRecommendations`, { user_id: this.userId })
      .pipe(
        map(data => data.recommendations || []),
        mergeMap(courses => this.addEnrollmentCount(courses))
      )
      .subscribe(
        (coursesWithEnrollment: Course[]) => {
          this.courses = coursesWithEnrollment;
          this.isLoading = false;
        },
        error => {
          console.error('Error fetching recommendations:', error);
          this.isLoading = false;
          this.snackBar.open('Failed to load courses. Please try again later.', 'Close', {
            duration: 3000
          });
        }
      );
  }

  getRecommendationsLanguage(): void {
    this.isLoading = true;
    this.http.post<{recommendations: Course[]}>(`${environment.apiBaseUrl}/languageRecommendations`, { user_id: this.userId })
      .pipe(
        map(data => data.recommendations || []),
        mergeMap(courses => this.addEnrollmentCount(courses))
      )
      .subscribe(
        (coursesWithEnrollment: Course[]) => {
          this.langCourses = coursesWithEnrollment;
          this.isLoading = false;
        },
        error => {
          console.error('Error fetching language recommendations:', error);
          this.isLoading = false;
          this.snackBar.open('Failed to load language courses. Please try again later.', 'Close', {
            duration: 3000
          });
        }
      );
  }
  
  getRecommendationsRelated(): void {
    this.isLoading = true;
    this.http.post<Course[] | {recommendations: Course[]}>(`${environment.apiBaseUrl}/relatedCoursesRecommendations`, { user_id: this.userId })
      .pipe(
        map(data => Array.isArray(data) ? data : (data.recommendations || [])),
        mergeMap(courses => this.addEnrollmentCount(courses))
      )
      .subscribe(
        (coursesWithEnrollment: Course[]) => {
          this.relcourses = coursesWithEnrollment;
          this.totalPages = Math.ceil(this.relcourses.length / this.pageSize);
          this.updatePaginatedCourses();
          this.isLoading = false;
        },
        error => {
          console.error('Error fetching related recommendations:', error);
          this.isLoading = false;
          this.snackBar.open('Failed to load related courses. Please try again later.', 'Close', {
            duration: 3000
          });
        }
      );
  }
  
  // getRecommendationsRelated(): void {
  //   this.isLoading = true;
  //   this.http.post<Course[] | {recommendations: Course[]}>(`${environment.apiBaseUrl}/relatedCoursesRecommendations`, { user_id: this.userId })
  //     .pipe(
  //       map(data => Array.isArray(data) ? data : (data.recommendations || [])),
  //       map(courses => this.addEnrollmentCount(courses))
  //     )
  //     .subscribe(
  //       (coursesWithEnrollment: Course[]) => {
  //         this.relcourses = coursesWithEnrollment;
  //         this.totalPages = Math.ceil(this.relcourses.length / this.pageSize);
  //         this.updatePaginatedCourses();
  //         this.isLoading = false;
  //       },
  //       error => {
  //         console.error('Error fetching related recommendations:', error);
  //         this.isLoading = false;
  //         this.snackBar.open('Failed to load related courses. Please try again later.', 'Close', {
  //           duration: 3000
  //         });
  //       }
  //     );
  // }

  // getRecommendationsRelated(): void {
  //   this.isLoading = true;
  //   this.http.post<Course[] | {recommendations: Course[]}>(`${environment.apiBaseUrl}/relatedCoursesRecommendations`, { user_id: this.userId })
  //     .pipe(
  //       map(data => Array.isArray(data) ? data : (data.recommendations || [])),
  //       mergeMap(courses => this.addEnrollmentCount(courses))
  //     )
  //     .subscribe(
  //       (coursesWithEnrollment: Course[]) => {
  //         this.relcourses = coursesWithEnrollment;
  //         this.totalPages = Math.ceil(this.relcourses.length / this.pageSize);
  //         this.updatePaginatedCourses();
  //         this.isLoading = false;
  //       },
  //       error => {
  //         console.error('Error fetching related recommendations:', error);
  //         this.isLoading = false;
  //         this.snackBar.open('Failed to load related courses. Please try again later.', 'Close', {
  //           duration: 3000
  //         });
  //       }
  //     );
  // }

  private addEnrollmentCount(courses: Course[]): Observable<Course[]> {
    const courseObservables = courses.map(course =>
      this.getEnrollmentCount(course.course_id).pipe(
        map(count => ({
          ...course,
          enrollmentCount: count
        }))
      )
    );
    return forkJoin(courseObservables);
  }
  private getEnrollmentCount(courseId: number): Observable<number> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/enrollment/course/${courseId}`).pipe(
      map(enrollments => enrollments.length),
      catchError(() => of(0))
    );
  }


  // private addEnrollmentCount(courses: Course[]): Observable<Course[]> {
  //   const courseRequests = courses.map(course =>
  //     this.http.get<number>(`${environment.apiBaseUrl}/enrollment/count/course/${course.course_id}`).pipe(
  //       map(count => ({
  //         ...course,
  //         enrollmentCount: count
  //       })),
  //       catchError(() => of({
  //         ...course,
  //         enrollmentCount: 0
  //       }))
  //     )
  //   );
  //   return forkJoin(courseRequests);
  // }


  updatePaginatedCourses(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedRelCourses = this.relcourses.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedCourses();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedCourses();
    }
  }

  slideLeft(): void {
    this.recommendationSlider.nativeElement.scrollBy({ left: -320, behavior: 'smooth' });
  }

  slideRight(): void {
    this.recommendationSlider.nativeElement.scrollBy({ left: 320, behavior: 'smooth' });
  }

  slideLeftLanguage(): void {
    this.languageRecommendationSlider.nativeElement.scrollBy({ left: -320, behavior: 'smooth' });
  }

  slideRightLanguage(): void {
    this.languageRecommendationSlider.nativeElement.scrollBy({ left: 320, behavior: 'smooth' });
  }

  image(toolImage: string): SafeUrl {
    return toolImage ? this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${toolImage}`) : 'assets/default-course-image.png';
  }

  getLevelString(level: number): string {
    switch(level) {
      case 0: return 'Beginner';
      case 1: return 'Intermediate';
      case 2: return 'Advanced';
      default: return 'All Levels';
    }
  }

  onInstructorSelect(creatorName: string): void {
    console.log('Selected instructor:', creatorName);
  }

  generateStarsArray(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  generateEmptyStarsArray(rating: number): number[] {
    return Array(5 - Math.round(rating)).fill(0);
  }
}
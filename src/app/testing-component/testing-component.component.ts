import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { catchError, forkJoin, map, mergeMap, Observable, of } from 'rxjs';

interface Course {
  id: number;
  name: string;
  // other properties...
}

interface CourseDetails {
  courseId: number;
  // other properties from the second API...
}

interface CourseStats {
  courseId: number;
  // other properties from the third API...
}
interface CourseWithDetailsAndStats extends Course {
  projectProgress: CourseDetails;
  stats: CourseStats;

}

@Component({
  selector: 'app-testing-component',
  standalone: true,
  imports: [HttpClientModule,CommonModule],
  templateUrl: './testing-component.component.html',
  styleUrl: './testing-component.component.css'
})
export class TestingComponentComponent implements OnInit{
  courses: any;
  CourseStats: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCoursesWithDetails();
    this.fetchAllCoursesWithDetails()
  }

  fetchCoursesWithDetails() {
    this.http.get<any>(`${environment.apiBaseUrl}/enrollment/user/3`).pipe(
      mergeMap(courses => {
        const courseDetailsRequests = courses.map((course: any) =>
          forkJoin({
            projectProgress: this.http.get<any>(`${environment.apiBaseUrl}/project/projectProgress/${course.course.id}/user/${3}`).pipe(catchError(error => of(null))),
            overAllCourseProgress: this.http.get<any>(`${environment.apiBaseUrl}/video/progress/user/${3}/course/${course.course.id}`).pipe(catchError(error => of(null))),
            quizProgressFraction: this.http.get<any>(`${environment.apiBaseUrl}/video/progress/user/${3}/course/${course.course.id}`).pipe(catchError(error => of(null))),
            AssignmentProgressFraction: this.http.get(`${environment.apiBaseUrl}/submittedByTotalCourse/${course.course.id}?userId=${3}`, { responseType: 'text' }).pipe(catchError(error => of(null))),
            ProjectProgressFraction: this.http.get(`${environment.apiBaseUrl}/project/progress/${course.course.id}/user/${3}`, { responseType: 'text' }).pipe(catchError(error => of(null)))
          }).pipe(
            map(({ projectProgress, overAllCourseProgress, quizProgressFraction, AssignmentProgressFraction, ProjectProgressFraction }) => 
              ({ ...course, projectProgress, overAllCourseProgress, quizProgressFraction, AssignmentProgressFraction, ProjectProgressFraction })
            )
          )
        );
        return forkJoin(courseDetailsRequests);
      }),
      catchError(error => {
        console.error('Error fetching courses:', error);
        return of([]);
      })
    ).subscribe(
      coursesWithDetails => {
        this.courses = coursesWithDetails;
        console.log('Courses with details:', this.courses);
      }
    );
  }
  public handleError(error: HttpErrorResponse): Observable<null> {
    console.error('API call failed:', error);
    return of(null);
  }
  fetchAllCoursesWithDetails() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/course/allCourses`).pipe(
      mergeMap(courses => {
        const courseRequests = courses.map(course =>
          forkJoin({
            course: of(course),
            projectProgress: this.http.get<any>(`${environment.apiBaseUrl}/video/progress/user/${3}/course/${course.id}`).pipe(
              map(progress => progress ?? 0), // Set default to 0 if null or undefined
              catchError(error => {
                console.error('Error fetching project progress:', error);
                return of(0); // Return 0 on error
              })
            ),
            enroled: this.http.get<any>(`${environment.apiBaseUrl}/enrollment/user/3/course/${course.id}`).pipe(
              catchError(error => this.handleError(error))
            )
          }).pipe(
            map(({ course, projectProgress, enroled }) => ({
              ...course,
              projectProgress: projectProgress, // This will now be 0 if the API call failed
              enroled: enroled || null
            })),
            catchError(error => {
              console.error('Error processing course:', course.id, error);
              return of({
                ...course,
                projectProgress: 0, // Set to 0 if there's an error processing the course
                enroled: null
              });
            })
          )
        );
        return forkJoin(courseRequests);
      }),
      catchError(error => {
        console.error('Error fetching all courses:', error);
        return of([]);
      })
    ).subscribe(
      coursesWithDetailsAndStats => {
        this.courses = coursesWithDetailsAndStats;
        console.log('Courses with details and stats:', this.courses);
      },
      error => console.error('Unexpected error in subscription:', error)
    );
  }
  }
  
  


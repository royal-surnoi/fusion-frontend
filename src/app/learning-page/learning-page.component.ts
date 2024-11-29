import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Observable, catchError, forkJoin, map, mergeMap, of, BehaviorSubject,shareReplay } from 'rxjs';
import { ProgressBarModule } from 'primeng/progressbar';
import { environment } from '../../environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { AimlservicecourserecService } from '../aimlservicecourserec.service';
import { CacheService } from '../cache.service';
 
@Pipe({
  name: 'customCurrency',
  standalone: true
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number, currency: string): string {
    const currencySymbols: { [key: string]: string } = {
      'INR': '₹',
      'USD': '$',
      'EURO': '€'
    };
    return `${currencySymbols[currency.toUpperCase()] || ''}${value}`;
  }
}
 
interface Course {
  id: number;
  courseTitle: string;
  courseDescription: string;
  courseFee: number;
  courseImage: string;
  courseType: string;
  courseLanguage: string;
  level: string;
  user: {
    name: string;
    id: number;
  };
  coursePercentage:any;
  courseDuration: number;
  currency: string;
  projectProgress: number;
  enroled: boolean;
  rating$: Observable<number>;
  enrollmentCount$: Observable<number>;
  courseTerm: string;
  showData:boolean;
}
 
@Component({
  selector: 'app-learning-page',
  standalone: true,
  imports: [
    FormsModule,
    AsyncPipe,
    CommonModule,
    HttpClientModule,
    RouterLink,
    ProgressBarModule,
    CustomCurrencyPipe,
    NgxPaginationModule
  ],
  templateUrl: './learning-page.component.html',
  styleUrls: ['./learning-page.component.css']
})
export class LearningPageComponent implements OnInit {
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  courses$ = this.coursesSubject.asObservable();
  filteredCourses$ = new BehaviorSubject<Course[]>([]);
  searchTerm = '';
  isLoading = true;
  userId: number;
  page = 1;
 
  isLoadingrec = true;
  coursekey: string | undefined;
 
  constructor(
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private aimlservicecourserec: AimlservicecourserecService,
   
    private cacheService: CacheService
  ) {
    this.userId = Number(localStorage.getItem('id'));
  }
 
  ngOnInit() {
 
    this.userId = Number(localStorage.getItem('id'));
    this.fetchRecommendations();
    // if (this.userId) {
    //   this.getRecommendations();
    // } else {
    //   console.error('User ID not found in local storage');
    // }
    if (this.userId) {
      this.fetchAllCoursesWithDetails();
      this.fetchSpecialRecommendations();
     
    } else {
      console.error('User ID not found in local storage');
    }
  }
 
  searchCourses() {
    const filteredCourses = this.coursesSubject.value.filter(course =>
      course.courseTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      course.coursePercentage > 90
    );
    this.filteredCourses$.next(filteredCourses);
  }
 
  private getEnrollmentCount(courseId: number): Observable<number> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/course/enrollments/${courseId}`).pipe(
      map(res => res.length),
      catchError(() => of(0))
    );
  }
 
  private getRating(courseId: number): Observable<number> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/course/reviews/${courseId}`).pipe(
      map(res => {
        if (Array.isArray(res) && res.length > 0) {
          const ratings = res.map(review => review.rating).filter(rating => typeof rating === 'number');
          return ratings.length > 0 ? ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length : 0;
        }
        return 0;
      }),
      catchError(() => of(0))
    );
  }
 
  image(toolImage: string) {
    return this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${toolImage}`);
  }
 
  generateStarsArray(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }
 
  generateEmptyStarsArray(rating: number): number[] {
    return Array(5 - Math.round(rating)).fill(0);
  }
 
  generateEmptyStarsArrayonly(): number[] {
    return Array(5).fill(0);
  }
 
  onInstructorSelect(user: any): void {
    if (user?.id) {
      this.router.navigate(['/usersprofile', user.id]);
    } else {
      console.error('User object or user ID is undefined');
    }
  }
 
  formatDuration(durationInMinutes: number): string {
    if (!durationInMinutes || isNaN(durationInMinutes)) {
      return 'Duration not available';
    }
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    if (hours === 0) {
      return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    } else if (minutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
  }
 
  private handleError(error: HttpErrorResponse): Observable<null> {
    console.error('API call failed:', error);
    return of(null);
  }
 
  private fetchAllCoursesWithDetails() {
    this.isLoading = true;
    const url = `${environment.apiBaseUrl}/course/allCourses`;
    const req = new HttpRequest('GET', url);
 
    // Check cache first
    const cachedResponse = this.cacheService.get(req);
    if (cachedResponse) {
      this.processCoursesResponse(cachedResponse.body);
      return;
    }
 
    // If not in cache, make the HTTP request
    this.http.get<Course[]>(url).pipe(
      mergeMap(courses => {
        const courseRequests = courses.map(course =>
          forkJoin({
            course: of(course),
            projectProgress: this.http.get<number>(
              `${environment.apiBaseUrl}/video/${course.courseTerm === 'long' ? 'progressOfCourse' : 'progressOfCourseOfUser'}/user/${this.userId}/course/${course.id}`
            ).pipe(
              catchError(() => of(0))
            ),
            enroled: this.http.get<boolean>(`${environment.apiBaseUrl}/enrollment/user/${this.userId}/course/${course.id}`).pipe(
              catchError(() => of(false))
            ),
          }).pipe(
            map(({ course, projectProgress, enroled }) => ({
              ...course,
              projectProgress,
              enroled,
              rating$: this.getRating(course.id),
              enrollmentCount$: this.getEnrollmentCount(course.id),
              showdata: false,
            }))
          )
        );
        return forkJoin(courseRequests);
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
      catchError(() => of([]))
    ).subscribe(
      coursesWithDetailsAndStats => {
        // Cache the response
        const response = new HttpResponse({
          body: coursesWithDetailsAndStats,
          status: 200,
          statusText: 'OK',
          url: url
        });
        this.cacheService.put(req, response);
 
        this.processCoursesResponse(coursesWithDetailsAndStats);
      },
      () => {
        this.isLoading = false;
      }
    );
  }
 
 
  private processCoursesResponse(coursesWithDetailsAndStats: Course[]) {
    const filteredCourses = coursesWithDetailsAndStats.filter(course =>
      course.coursePercentage > 90
    );
    this.coursesSubject.next(filteredCourses);
    this.filteredCourses$.next(filteredCourses);
    this.isLoading = false;
  }
  private cachedResponses: { [key: string]: Observable<any> } = {};
 
  // private cachedResponses: { [key: string]: Observable<any> } = {};
 
 
  //////////////// course recommendations ////////////////////
  recommendations: any[] = [];
 
 
  // getRecommendations(): void {
  //   this.aimlservicecourserec.getHomeRecommendations(this.userId).subscribe(
  //     (data: any[]) => {
  //       this.recommendations = data;
  //       console.log('Recommendations:', this.recommendations);
  //     },
  //     error => {
  //       console.error('Error fetching recommendations:', error);
  //     }
  //   );
  // }
 
  fetchRecommendations(): void {
    const url = `${environment.apiBaseUrl}/recommendations/${this.userId}`; // Adjust this URL as needed
    const req = new HttpRequest('GET', url);
 
    // Check cache first
    const cachedResponse = this.cacheService.get(req);
    if (cachedResponse) {
      this.processRecommendationsResponse(cachedResponse.body);
      return;
    }
 
    // If not in cache, make the HTTP request
    this.aimlservicecourserec.getHomeRecommendations(this.userId).pipe(
      map((data: any[]) => data.map((recommendation: any) => ({
        ...recommendation,
        safeImageUrl: this.getImageUrl(recommendation.course_image)
      }))),
      catchError((error) => {
        console.error('Error fetching recommendations:', error);
        return of([]);
      })
    ).subscribe(
      (recommendations) => {
        // Cache the response
        const response = new HttpResponse({
          body: recommendations,
          status: 200,
          statusText: 'OK',
          url: url
        });
        this.cacheService.put(req, response);
 
        this.processRecommendationsResponse(recommendations);
      }
    );
  }
 
  private processRecommendationsResponse(recommendations: any[]): void {
    this.recommendations = recommendations;
    console.log(this.recommendations);
  }
 
  getImageUrl(course_image: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${course_image}`);
  }
  course_rating:any;
 
  generateStarsArray11(course_rating: number): number[] {
    return Array(Math.round(course_rating)).fill(0);
  }
 
  generateEmptyStarsArray11(course_rating: number): number[] {
    return Array(5 - Math.round(course_rating)).fill(0);
  }
  generateEmptyStarsArrayonly11(): number[] {
    return Array(5).fill(0);
  }
 
 
  fetchSpecialRecommendations(): void {
    this.getSpecialRecommendations(this.userId).subscribe(
      (response: any) => {
        if (response) {
          // Handle the JSON response (assuming it's an object or array)
          this.processSpecialRecommendationsResponse(response);
        } else {
          console.error('No special recommendations found');
        }
      },
      (error) => {
        console.error('Error fetching special recommendations:', error);
      }
    );
  }
 
  specialRecommendations: { [key: string]: any[] } = {}; // Store recommendations here
 
  private processSpecialRecommendationsResponse(specialRecommendations: any): void {
    this.specialRecommendations = specialRecommendations; // Store the response here
    console.log('Special Recommendations:', this.specialRecommendations);
 
    // Iterate over each key in specialRecommendations
    Object.keys(this.specialRecommendations).forEach((key: string) => {
      const courses = this.specialRecommendations[key];
 
      if (Array.isArray(courses)) {
        courses.forEach((course: any, index: number) => {
          console.log(`Element ${index} in ${key}:`, course);
        });
 
        // Using mergeMap to process the courses
        of(courses).pipe(
          mergeMap(coursesArray => {
            const courseRequests = coursesArray.map(course =>
              forkJoin({
                course: of(course),
                projectProgress: this.http.get<number>(
                  `${environment.apiBaseUrl}/video/${course.courseTerm === 'long' ? 'progressOfCourse' : 'progressOfCourseOfUser'}/user/${this.userId}/course/${course.id}`
                ).pipe(
                  catchError(() => of(0)) // Handle errors and return 0 as default progress
                ),
                enroled: this.http.get<boolean>(
                  `${environment.apiBaseUrl}/enrollment/user/${this.userId}/course/${course.id}`
                ).pipe(
                  catchError(() => of(false)) // Handle errors and return false as default enrollment
                )
              }).pipe(
                map(({ course, projectProgress, enroled }) => ({
                  ...course,
                  projectProgress,
                  enroled,
                  rating$: this.getRating(course.id), // Add rating$
                  enrollmentCount$: this.getEnrollmentCount(course.id) // Add enrollmentCount$
                }))
              )
            );
 
            return forkJoin(courseRequests);
          })
        ).subscribe((processedCourses: any[]) => {
          console.log('Processed Courses:', processedCourses);
          this.specialRecommendations[key] = processedCourses; // Store the processed courses
        });
      }
    });
    console.log('Processed Courses:', this.specialRecommendations);
    this.isLoadingrec = false
  }
   
 
 
  getSpecialRecommendations(userId: number): Observable<String> {
    const url = `${environment.apiBaseUrl}/home_edu_recommendations`;
    return this.http.post<string>(url, {user_id: this.userId}); // To handle reaction removal Number(this.userId)
  }
 
  showAllCoursesOverlay = false;
  allCourses: any[] = [];
 
  showAllCourses(courses: any[], key : string) {
    this.allCourses = courses;
    this.coursekey = key;
    this.showAllCoursesOverlay = true;
 
  }
 
  closeOverlay() {
    this.showAllCoursesOverlay = false;
  }
 
 
}
 
 
 
 
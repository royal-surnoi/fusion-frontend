
import { CommonModule } from '@angular/common';
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Fusion2Service } from '../fusion2.service';
import { catchError, forkJoin, of } from 'rxjs';
 
 
@Component({
  selector: 'app-sudentcoursedetail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sudentcoursedetail.component.html',
  styleUrl: './sudentcoursedetail.component.css'
})
export class SudentcoursedetailComponent implements OnInit {
  userId: any;
  courseId: any;
  userDetails: any;
  courseDetails: any;
  overallProgress: number = 0;
  isShortTerm: boolean = false;
  lessons: any[] = [];
  modules: any[] = [];
 
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private fusion2service: Fusion2Service
   
  ) {}
 
  ngOnInit(): void {
    this.userId = localStorage.getItem('id');
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('id');
      this.loadData();
    });
  }
 
  loadData(): void {
    if (this.userId && this.courseId) {
      this.getUserDetails(this.userId);
      this.getCourseDetails(this.courseId);
     
      this.getOverallProgress(Number(this.userId), Number(this.courseId));
    }
  }
 
  getUserDetails(userId: string): void {
    this.http.get(`${environment.apiBaseUrl}/user/find/${userId}`).subscribe((res: any) => {
      this.userDetails = res;
    });
  }
 
  getCourseDetails(courseId: string): void {
    this.http.get(`${environment.apiBaseUrl}/course/getBy/${courseId}`).subscribe((res: any) => {
      this.courseDetails = res;
      this.isShortTerm = this.courseDetails.courseTerm === 'short';
      if (this.isShortTerm) {
        this.getLessons(courseId);
      } else {
        this.getModules(courseId);
      }
      this.getOverallProgress(Number(this.userId), Number(this.courseId));
    });
  }
  getOverallProgress(userId: number, courseId: number): void {
    if (this.isShortTerm) {
      this.getUsersCourseProgressByLesson(userId, courseId);
    } else {
      this.getUsersCourseProgress(userId, courseId);
    }
  }
  // getOverallProgress(userId: string, courseId: string): void {
  //   this.http.get(`${environment.apiBaseUrl}/video/progressOfCourse/user/${userId}/course/${courseId}`).subscribe((res: any) => {
  //     this.overallProgress = res * 100;
  //   });
  // }
  getUsersLessonModuleProgress(userId: number, lessonModuleId: number): void {
    this.fusion2service.getUsersLessonModuleProgress(userId, lessonModuleId).subscribe({
      next: (progress) => {
        console.log(`Lesson module progress: ${progress}%`);
        const module = this.modules.find(m => m.id === lessonModuleId);
        if (module) {
          module.progress = progress * 1;
        }
      },
      error: (error) => {
        console.error('Error fetching lesson module progress:', error);
      }
    });
  }
 
  getUsersCourseProgress(userId: number, courseId: number): void {
    this.fusion2service.getUsersCourseProgress(userId, courseId).subscribe({
      next: (progress) => {
        console.log(`Course progress: ${progress}%`);
        this.overallProgress = progress * 1;
      },
      error: (error) => {
        console.error('Error fetching course progress:', error);
        this.overallProgress = 0;
      }
    });
  }
  getUsersCourseProgressByLesson(userId: number, courseId: number): void {
    this.fusion2service.getUsersCourseProgressByLesson(userId, courseId).subscribe({
      next: (progress) => {
        console.log(`Course progress by lesson: ${progress}%`);
        this.overallProgress = progress * 1;
      },
      error: (error) => {
        console.error('Error fetching course progress by lesson:', error);
        this.overallProgress = 0;
      }
    });
  }
  getLessons(courseId: string): void {
    this.http.get(`${environment.apiBaseUrl}/lesson/course/${courseId}`).subscribe((res: any) => {
      this.lessons = res;
      this.getLessonProgress();
    });
  }
 
  getLessonProgress(): void {
    if (this.userId) {
      this.lessons.forEach(lesson => {
        this.http.get(`${environment.apiBaseUrl}/video/progressOfLesson/user/${this.userId}/lesson/${lesson.id}`).subscribe((progress: any) => {
          lesson.progress = progress * 1;
        });
      });
    }
  }
 
 
  getModules(courseId: string): void {
    this.http.get(`${environment.apiBaseUrl}/getModuleByCourse/${courseId}`).subscribe((res: any) => {
      this.modules = res;
      this.modules.forEach(module => {
        this.getUsersLessonModuleProgress(Number(this.userId), module.id);
      });
    });
  }
 
  getModuleVideos(module: any): void {
    // Assuming there's an API to get videos for a module
    this.http.get(`${environment.apiBaseUrl}/getVideosByModule/${module.id}`).subscribe((res) => {
      module.videos = res;
      this.calculateModuleProgress(module);
    });
  }
 
  calculateModuleProgress(module: any): void {
    if (this.userId && module.videos && module.videos.length > 0) {
      let completedVideos = 0;
      module.videos.forEach((video: any) => {
        this.http.get(`${environment.apiBaseUrl}/video/progress/user/${this.userId}/video/${video.id}`).subscribe((progress: any) => {
          if (progress === 1) { // Assuming 1 means completed
            completedVideos++;
          }
          module.progress = (completedVideos / module.videos.length) * 100;
        });
      });
    }
  }
 
 
  getProgressColor(progress: number): string {
    if (progress < 30) return '#FF6B6B';
    if (progress < 70) return '#FFD93D';
    return '#6BCB77';
  }
 
  backTostudentDashboard(): void {
    this.router.navigate(['/candidateview']);
  }
 
  getButtonText(progress: number): string {
    if (progress === 0) return 'Start';
    if (progress === 100) return 'Completed';
    return 'Continue';
  }
 
  isButtonDisabled(progress: number): boolean {
    return progress === 100;
  }
 
  onButtonClick(item: any,courseId:any): void {
    // Implement the logic for starting/continuing the lesson or module
    console.log(`Button clicked for ${this.isShortTerm ? 'lesson' : 'module'}: ${item.title || item.moduleName}`,courseId);
    // this.router.navigate(['/coursedashboard'],courseId)
    // this.router.navigate(['/coursedashboard', courseId]);
    this.router.navigate(['/coursedashboard'], {
      queryParams: { courseId: courseId }
    });
    // You can add navigation or other actions here
  }
}
 
 
 
 
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, NgModel } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Assignment, CourseService,  } from '../course.service';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { FusionService } from '../fusion.service';
import { AuthService } from '../auth.service';
export interface lessonModule {
  id: number;
  lessons?: Lesson[];
  lessonTitle:string;
 
  title: string;
  description: string;
  // Add other properties as needed
}
interface LessonModule {
 
  id: number;
  lessonModuleId: number;
  moduleName: string;
  title: string;
  description: string;
  lessons?: Lesson[];
}
 
interface Lesson {
  id: number;
  lessonTitle: string;
 
}
interface Module {
  id: number;
  // Add other properties of the module here
  lessons?: Lesson[]; // The lessons property is optional as it's added later
}
// export interface VideoProgress {
//   userId: number;
//   videoId: number;
//   progress: number;
// }
interface VideoProgress {
  id: number;
  userId: number;
  videoId: number;
  progress: number;
}

 
export interface Video {
  id: number;
  videoTitle: string;
  s3Key: string;
  s3Url: string;
  videoDescription: string | null;
  createdAt: string;
  language: string | null;
}
 
interface lesson {
  lessons?: Lesson[];
 
  id: number;
  moduleName: string;
  title: string;
  duration: string;
  completed: boolean;
  videoUrl: string;
  transcript: string;
  currentLesson: lesson;
  lessonModule: any;
  lessonTitle: string;
  lessonDescription: string;
  lessonAssignment:string;
  lessonContent: string;
  lessonDuration: number;
  createdAt: string;
  updatedAt: string;
  resources: { name: string; url: string }[];
  quiz: { question: string; options: string[]; correctAnswer: number }[];
}
 
@Component({
  selector: 'app-coursedashboard',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatTooltipModule,
    MatTabsModule,
    MatRadioModule,
    MatSlideToggleModule,
    FormsModule,
    MatListModule,
    MatFormFieldModule,
    HttpClientModule,
    MatSelectModule,
    CommonModule,
    MatSelectModule,
    MatListModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,MatListModule,
  ],
  templateUrl: './coursedashboard.component.html',
  styleUrl: './coursedashboard.component.css'
})
export class CoursedashboardComponent implements OnInit,AfterViewInit, OnDestroy  {
 
  // @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  showVideoPlayer: boolean = false;
  course = {
    title: 'Advanced Web Development',
    progress: 35,
    modules: [] as any[],
    currentLesson: null as lesson | null
  };
  
  selectedModule: any;
  selectedLesson: any;
  selectedVideo: any;
  lessonModuleId: number=1; // Replace with the actual ID or get it from route params
  lessons: lesson[] = [];
  lessonId: number=1;
  currentLesson: any; // You might want to create a proper interface for this

  courseId: number = 0; // This could be set dynamically, e.g., from route params
  userDetails: any;
  courseModules: any;
  lessonList: any;
  videoUrl: string = "";
  sanitizedUrl: SafeResourceUrl | null = null;
  darkMode = false;
  searchTerm = '';
  comments: { user: string; text: string; timestamp: Date }[] = [];
  newComment = '';
  videoProgress = 0;
  bookmarks: { time: number; note: string }[] = [];
  filteredLessons: lesson[] = [];
  // currentVideo: Video | undefined;
  // currentVideo: Video | null = null;
  currentVideo: any; 

  currentVideoIndex: number = -1;
  videoTitle: string = '';
  s3Url: string = '';
  videos: Video[] = [];
  lessonModules: LessonModule[] = [];
  lessonsByModule: { [key: number]: Lesson[] } = {}; // Store lessons by module ID
  videosByLesson: { [key: number]: Video[] } = {}; // Store videos by lesson ID
  openedModules: Set<number> = new Set();
  lessonsByCourseId: Lesson[] = [];  // Declare lessonsByCourseId as an array of Lesson objects

// ==================================video progress===========================
userId:any;
videoId: number = 0;
currentAssignments: any[] = [];

assignments: Assignment[] = [];
courseProgress: number = 0;
completedVideos: Set<number> = new Set();
completedLessons: Set<number> = new Set();
completedModules: Set<number> = new Set();
firstModuleId: number | null = null;
firstLessonId: number | null = null;
firstVideoId: number | null = null;
 
currentModuleIndex: number = 0;
currentLessonIndex: number = 0;
// currentVideoIndex: number = 0;
  videoDescription: string = '';
  CourseDetails = {
    courseTerm:'',
    courseDocument: '',
    courseTitle: 'Course Title',
    progress: 0
  };
  videoUrll: any;
  openModules: { [key: number]: boolean } = {};
  myNotes: string='';
  user: any;


  // ======================================================================
  quizzes: any;

  questions: any;
  quizStarted: boolean = false;
  quizStart: boolean = true;
  selectedQuizId: any;
  selectedQuizName: any;
  // userId: number;
  // userId: any;
  quizId: any;
  correctAnswerPercentage: number | null = null;
  correctAnswerRatio:string|null =null;
  isPopupVisible: boolean = false;
  selectedFile: any;





 
  constructor(private courseService: CourseService, private fusionService:FusionService ,  public sanitizer: DomSanitizer,private router:Router
    , private http: HttpClient, private route: ActivatedRoute, private authService:AuthService) {
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(''); // Provide a default value
    this.userId = Number(localStorage.getItem('id'));
 
  }
 
  ngOnInit() {


    this.getQuizIdFromContext();
   
this.getUserIdFromLocalStorage();
 

  
    this.loadAssignments();

    this.updateCurrentAssignments();

    this.route.queryParams.subscribe(params => {
      this.courseId = params['courseId'];
      this.loadInitialData();
    });
    this.getLessonsByLessonModuleId(this.lessonModuleId)
    this.getLessonModulesAndLessons(this.courseId)
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
    this.loadInitialData();
    this.loadVideos();
    this.loadVideosByLessonId(this.lessonId);
 
    this.lessonModules.forEach((module: LessonModule) => {
      this.getLessonsByLessonModuleId(module.id);
    });
 
    if (this.selectedLesson) {
      this.loadVideosByLessonId(this.selectedLesson.id);
    }
    this.courseService.currentLesson$.subscribe(lesson => {
      this.currentLesson = lesson;
      this.updateCurrentAssignments();
      this.loadQuizzes(this.currentLesson.id);
      this.lessonId = this.currentLesson.id;


    });
 
    this.initializeProgress();
    this.initializeUnlockStatus();
    this.initializeData();
    this.loadInitialData();
    this.updateCourseProgress();

 
    
  }

  
  // videoProgress: number = 0;
  lastSavedProgress: number = 0;
  isVideoSaved: boolean = false;
  
  // updateVideoProgress(event: Event,videoId:any): void {
  //   const video = event.target as HTMLVideoElement;
  //   const currentProgress = (video.currentTime / video.duration) * 100;

    
  //   this.courseService.saveOrUpdateProgress(this.userId, this.videoId, currentProgress).subscribe(
  //     response => {
  //       console.log('Progress saved or updated successfully');
  //     },
  //     error => {
  //       console.error('Error saving or updating progress:', error);
  //     }
  //   );
  // }
  
  ngAfterViewInit(): void {
    if (this.videoPlayer) {
      const videoElement = this.videoPlayer.nativeElement;
      videoElement.addEventListener('pause', this.handleVideoProgress.bind(this));
      videoElement.addEventListener('ended', this.handleVideoProgress.bind(this));
    }
  }
  ngOnDestroy(): void {
    if (this.videoPlayer) {
      const videoElement = this.videoPlayer.nativeElement;
      videoElement.removeEventListener('pause', this.handleVideoProgress.bind(this));
      videoElement.removeEventListener('ended', this.handleVideoProgress.bind(this));
    }
    if (this.progressUpdateTimeout) {
      clearTimeout(this.progressUpdateTimeout);
    }
  }
  updateVideoProgress(event: Event): void {
    const video = event.target as HTMLVideoElement;
    const currentProgress = (video.currentTime / video.duration) * 100;
    this.saveOrUpdateProgress(currentProgress);
  }
  handleVideoProgress(event: Event): void {
    const video = event.target as HTMLVideoElement;
    const currentProgress = (video.currentTime / video.duration) * 100;
    this.saveOrUpdateProgress(currentProgress);
  }
  handleTimeUpdate(event: Event): void {
    const video = event.target as HTMLVideoElement;
    const currentProgress = (video.currentTime / video.duration) * 100;
    this.saveOrUpdateProgress(currentProgress);
  }
 // Update or Save Progress Method
 progressUpdateTimeout: any;
 
 saveOrUpdateProgress(currentProgress: number): void {
  const videoId = this.currentVideo?.id;
  const userId = localStorage.getItem('id');

  if (userId && videoId) {
    if (this.progressUpdateTimeout) {
      clearTimeout(this.progressUpdateTimeout);
    }

    this.progressUpdateTimeout = setTimeout(() => {
      const userIdNumber = Number(userId);
      
      this.courseService.getVideoProgress(userIdNumber, videoId).subscribe(
        storedProgress => {
          if (currentProgress > storedProgress) {
            console.log('Sending progress update with:', { userId: userIdNumber, videoId, currentProgress });

            this.courseService.saveOrUpdateProgress(userIdNumber, videoId, currentProgress).subscribe(
              response => {
                console.log('Progress saved or updated successfully', response);
              },
              error => {
                console.error('Error saving or updating progress:', error);
              }
            );
          } else {
            console.log('Current progress is not greater than stored progress. No update needed.');
          }
        },
        error => {
          console.error('Error fetching current progress:', error);
        }
      );
    }, 5000);
  } else {
    console.error('User ID or Video ID is not set.');
  }
}

// Method to check if progress has already been sent
isProgressAlreadySent(userId: string, videoId: number): boolean {
  return localStorage.getItem(`progress_${userId}_${videoId}`) === 'true';
}

// Method to mark progress as sent
markProgressAsSent(userId: string, videoId: number): void {
  localStorage.setItem(`progress_${userId}_${videoId}`, 'true');
}

  /////////////////////////////////////
  
  
  
  private initializeData(): void {
    // Assuming you fetch or set `currentVideo` somewhere in this method
    this.getQuizIdFromContext();
    this.getUserIdFromLocalStorage();
    this.loadAssignments();
    this.updateCurrentAssignments();

    this.route.queryParams.subscribe(params => {
      this.courseId = params['courseId'];
      this.loadInitialData();
    });

    // Additional initialization if needed
  }

  


  handleVideoPause(event: Event) {
    const video = event.target as HTMLVideoElement;
    const currentProgress = (video.currentTime / video.duration) * 100;
    this.saveOrUpdateProgress(currentProgress);
  }

  handleVideoEnd(event: Event) {
    const video = event.target as HTMLVideoElement;
    const currentProgress = (video.currentTime / video.duration) * 100;
    this.saveOrUpdateProgress(currentProgress);
  }

// saveVideoProgress() {
//   if (this.currentVideo) {
//     this.courseService.updateProgress(this.userId, this.currentVideo.id, this.videoProgress).subscribe(
//       () => {
//         console.log('Progress updated successfully');
//         this.lastSavedProgress = this.videoProgress;
//       },
//       error => {
//         console.error('Error updating progress:', error);
//       }
//     );
//   }
// }

  initializeUnlockStatus() {
    console.log('Initializing unlock status');
    if (this.lessonModules.length > 0) {
      const firstModule = this.lessonModules[0];
      this.completedModules.add(firstModule.id);
      console.log('Unlocked first module:', firstModule.id);
     
      if (this.lessonsByModule[firstModule.id] && this.lessonsByModule[firstModule.id].length > 0) {
        const firstLesson = this.lessonsByModule[firstModule.id][0];
        this.completedLessons.add(firstLesson.id);
        console.log('Unlocked first lesson:', firstLesson.id);
       
        if (this.videosByLesson[firstLesson.id] && this.videosByLesson[firstLesson.id].length > 0) {
          // Don't mark the first video as completed, just ensure it's unlocked
          console.log('First video is available:', this.videosByLesson[firstLesson.id][0].id);
        }
      }
    }
    this.calculateCourseProgress();
  }
  initializeProgress() {
    // Load progress from local storage or backend
    const savedProgress = localStorage.getItem('courseProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      this.completedVideos = new Set(progress.videos);
      this.completedLessons = new Set(progress.lessons);
      this.completedModules = new Set(progress.modules);
    }
    this.calculateCourseProgress();
  }
  onVideoEnded(videoId: number | undefined) {
    if (videoId !== undefined) {
      this.completedVideos.add(videoId);
      this.updateLessonProgress();
      this.saveProgress();
    }
  }
 
 
  updateLessonProgress() {
    this.lessonModules.forEach(module => {
      const moduleLessons = this.lessonsByModule[module.id] || [];
      moduleLessons.forEach((lesson, lessonIndex) => {
        const lessonVideos = this.videosByLesson[lesson.id] || [];
        if (lessonVideos.length === 0 || lessonVideos.every(video => this.completedVideos.has(video.id))) {
          this.completedLessons.add(lesson.id);
         
          // Unlock the next lesson if it exists
          if (lessonIndex < moduleLessons.length - 1) {
            this.completedLessons.add(moduleLessons[lessonIndex + 1].id);
          } else if (lessonIndex === moduleLessons.length - 1) {
            // If it's the last lesson of the module, unlock the next module
            this.updateModuleProgress(module);
          }
        }
      });
    });
    this.calculateCourseProgress();
  }
  updateModuleProgress(completedModule: LessonModule) {
    const moduleIndex = this.lessonModules.indexOf(completedModule);
    if (moduleIndex !== -1 && moduleIndex < this.lessonModules.length - 1) {
      const nextModule = this.lessonModules[moduleIndex + 1];
      this.completedModules.add(nextModule.id);
     
      // Unlock the first lesson of the next module
      const nextModuleLessons = this.lessonsByModule[nextModule.id] || [];
      if (nextModuleLessons.length > 0) {
        this.completedLessons.add(nextModuleLessons[0].id);
      }
    }
    this.calculateCourseProgress();
  }
 
 
  calculateCourseProgress() {
    const totalVideos = this.videos.length;
    const completedVideos = this.completedVideos.size;
    this.courseProgress = (completedVideos / totalVideos) * 100;
    this.CourseDetails.progress = Math.round(this.courseProgress);
  }
 
  saveProgress() {
    const progress = {
      videos: Array.from(this.completedVideos),
      lessons: Array.from(this.completedLessons),
      modules: Array.from(this.completedModules)
    };
    localStorage.setItem('courseProgress', JSON.stringify(progress));
  }
 
  isModuleUnlocked(module: LessonModule): boolean {
    const isUnlocked = this.completedModules.has(module.id) || this.lessonModules.indexOf(module) === 0;
    // console.log(`Module ${module.id} unlocked:`, isUnlocked);
    return isUnlocked;
  }
 
  isLessonUnlocked(lesson: Lesson): boolean {
    if (this.CourseDetails.courseTerm === 'short') {
      // Logic for short-term courses (no modules)
      const lessonIndex = this.lessonsByCourseId.indexOf(lesson);
  
      // For short-term course: first lesson unlocked, or lesson is completed, or previous lesson is completed
      const isUnlocked = this.completedLessons.has(lesson.id) ||
                         (lessonIndex === 0) ||
                         (lessonIndex > 0 && this.completedLessons.has(this.lessonsByCourseId[lessonIndex - 1].id));
                         
      return isUnlocked;
    } else {
      // Logic for long-term courses (with modules)
      const module = this.lessonModules.find(m => this.lessonsByModule[m.id]?.includes(lesson));
      if (!module) return false;
  
      const moduleIndex = this.lessonModules.indexOf(module);
      const lessonIndex = this.lessonsByModule[module.id].indexOf(lesson);
  
      const isUnlocked = this.completedLessons.has(lesson.id) ||
                         (moduleIndex === 0 && lessonIndex === 0) ||
                         (lessonIndex === 0 && this.isModuleUnlocked(module));
  
      return isUnlocked;
    }
  }
  
 
  isVideoUnlocked(video: Video, lesson: Lesson): boolean {
    if (!this.isLessonUnlocked(lesson)) return false;
 
    const lessonVideos = this.videosByLesson[lesson.id] || [];
    const videoIndex = lessonVideos.indexOf(video);
   
    const isUnlocked = this.completedVideos.has(video.id) ||
                       (this.lessonModules[0]?.id === lesson.id && videoIndex === 0) ||
                       videoIndex === 0 ||
                       (videoIndex > 0 && this.completedVideos.has(lessonVideos[videoIndex - 1].id));
    // console.log(`Video ${video.id} unlocked:`, isUnlocked);
    return isUnlocked;
  }
 
 
  // Update existing methods
 
  onVideoSelect(video: any) {
    if (this.isVideoUnlocked(video, this.selectedLesson)) {
      this.selectedVideo = video;
      this.onVideoChange();
    } else {
      // Show a message that the video is locked
      console.log('This video is locked. Complete the previous video to unlock.');
    }
  }
 
  onLessonClick(lesson: Lesson): void {
  if (this.isLessonUnlocked(lesson)) {
    this.selectedLesson = lesson;
    this.loadVideosByLessonId(lesson.id);
  } else {
    console.log('This lesson is locked. Complete the previous lesson to unlock.');
    // You might want to show a user-friendly message here
  }

  this.currentLesson = lesson;
  this.courseService.setCurrentLesson(this.currentLesson);
  this.loadAssignments();
  this.loadQuizzes(this.currentLesson.id);

}
updateCurrentLesson() {
  this.courseService.setCurrentLesson(this.currentLesson);

  const currentModule = this.lessonModules[this.currentModuleIndex];
  const currentLessons = this.lessonsByModule[currentModule.id];
  this.currentLesson = currentLessons[this.currentLessonIndex];
  this.updateCurrentVideo();
  this.updateCurrentAssignments();
  this.loadAssignments();
  this.loadQuizzes(this.currentLesson.id);


  
  // If you're using a service to manage the course state, update it here
  // this.courseService.setCurrentLesson(this.currentLesson);
}
 
  onVideoClick(video: any): void {
    this.selectedVideo = video;
    // You might want to set sanitizedUrl here
  }
  onModuleChange() {
    this.selectedLesson = null;
    this.selectedVideo = null;
    this.showVideoPlayer = false;
  }
  // onVideoSelect(video: any) {
  //   this.selectedVideo = video;
  //   this.onVideoChange();
  // }
 
  onLessonChange() {
    this.selectedVideo = null;
    this.showVideoPlayer = false;
  }
  toggleModule(moduleId: number) {
    this.openModules[moduleId] = !this.openModules[moduleId];
  }
 
  isModuleOpen(moduleId: number): boolean {
    return this.openModules[moduleId] || false;
    // const isOpen = this.openModules[moduleId] || false;

    // if (isOpen) {
    //   // If the module is open, generate the transcript
    //   this.generateTranscript(moduleId);
    // }

    // return isOpen;
  }
   generateTranscript(): void {
    this.http.post('http://54.162.84.143:8080/transcribeRecommendations',{}).subscribe(
      (response) => {
        console.log('Transcript generated:', response);
        // Handle the response here if needed
      },
      (error) => {
        console.error('Error generating transcript:', error);
        // Handle the error here if needed
      }
    );
  }
 
  selectVideo1(video: any) {
    this.selectedVideo = video;
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(video.s3Url);
  }
  private fetchVideoDetails(videoId: string) {
    console.log('Fetching details for video:', videoId);
  }
 
  loadVideos() {
    this.courseService.getVideosByCourse(this.courseId).subscribe({
      next: (data) => {
        this.videos = data;
        if (this.videos && this.videos.length > 0) {
          this.selectVideo(0); // Auto-select the first video
        }
      },
      error: (error) => {
        console.error('Error fetching videos:', error);
      }
    });
  }
 
  selectVideo(index: number) {
    if (this.videos && index >= 0 && index < this.videos.length) {
      this.currentVideoIndex = index;
      this.currentVideo = this.videos[index];
      this.videoProgress = 0; // Reset progress for new video
      if (this.videoPlayer) {
        this.videoPlayer.nativeElement.load(); // Reload the video element
      }
    }
  }
 
  getLessonModulesAndLessons(courseId: number): void {
    this.courseService.getLessonModulesByCourseId(courseId).subscribe(
      (modules: LessonModule[]) => {
        this.lessonModules = modules;
        this.lessonModules.forEach((module: LessonModule) => {
          this.getLessonsByLessonModuleId(module.id); // Fetch lessons for each module
        });
      },
      (error) => {
        console.error('Error fetching lesson modules:', error);
      }
    );
  }
 
  getLessonsByLessonModuleId(lessonModuleId: number): void {
    this.courseService.getLessonsByLessonModuleId(lessonModuleId).subscribe(
      (lessons: Lesson[]) => {
        this.lessonsByModule[lessonModuleId] = lessons; // Store lessons by module ID
      },
      (error) => {
        console.error(`Error fetching lessons for module ${lessonModuleId}:`, error);
      }
    );
  }
 
  getLessonsForSelectedModule(): Lesson[] {
    return this.selectedModule ? this.lessonsByModule[this.selectedModule.id] || [] : [];
  }
 
  getVideosForSelectedLesson(): Video[] {
    return this.selectedLesson ? this.videosByLesson[this.selectedLesson.id] || [] : [];
  }
 
  onLessonSelect(event: MatSelectChange, moduleId: number): void {
    this.selectedLesson[moduleId] = event.value;
    // Additional logic can be added here to handle lesson selection, if needed
  }
  // onLessonClick(lesson: Lesson): void {
  //   this.selectedLesson = lesson;
  //   this.loadVideosByLessonId(lesson.id);
  // }
 
  displayVideo(videoUrl: number): void {
    console.log("uservideoUrl", videoUrl);
    console.log(this.videoUrl, "OLL", videoUrl);
 
    this.http.get(`${environment.apiBaseUrl}/video/videos/lesson/${videoUrl}`).subscribe((res: any) => {
      console.log(res, "res-------------");
      this.videoUrll = res;
 
      if (Array.isArray(res) && res.length > 0) {
        this.videoUrl = res[0].s3Url;
      } else if (res && res.s3Url) {
        this.videoUrl = res.s3Url;
      } else {
        console.error('Unable to find s3Url in the response');
      }
      console.log(this.videoUrl);
      this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
 
      if (this.videoPlayer) {
        this.videoPlayer.nativeElement.load();
        this.videoPlayer.nativeElement.play();
      }
    });
  }
 
  loadVideosByLessonId(lessonId: number): void {
    this.courseService.getVideosByLessonId(lessonId).subscribe({
      next: (videos) => {
        this.videosByLesson[lessonId] = videos;
        console.log('Videos loaded:', this.videosByLesson[lessonId]);
        if (this.videosByLesson[lessonId].length > 0) {
          this.selectedVideo = this.videosByLesson[lessonId][0];
          this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedVideo.s3Url);
          this.showVideoPlayer = true;
        } else {
          this.selectedVideo = null;
          this.sanitizedUrl = null;
          this.showVideoPlayer = false;
        }
      },
      error: (error) => {
        console.error('Error loading videos:', error);
      }
    });
  }
 
  updateCurrentAssignments() {
    if (this.currentLesson && this.currentLesson.assignments) {
      this.currentAssignments = this.currentLesson.assignments;
    } else {
      this.currentAssignments = [];
    }
  }
 
 
 
 
 
  displayVideo1(videoUrl: number): void {
  console.log("uservideoUrl", videoUrl);
  console.log(this.videoUrl, "OLL", videoUrl);
 
  this.http.get(`${environment.apiBaseUrl}/video/videos/lesson/${videoUrl}`).subscribe((res: any) => {
    console.log(res, "res-------------");
    this.videoUrll = res;
   
    // Check if res is an array and has at least one item
    if (Array.isArray(res) && res.length > 0) {
      // Access the s3Url from the first item in the array
      this.videoUrl = res[0].s3Url;
    } else if (res && res.s3Url) {
      // If res is not an array but an object with s3Url
      this.videoUrl = res.s3Url;
    } else {
      console.error('Unable to find s3Url in the response');
    }
    console.log(this.videoUrl)
    // this.videoUrl = videoUrl;
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
   
   
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.load();
      this.videoPlayer.nativeElement.play();
    }
  });
}
 
loadVideosByLessonId1(lessonId: number) {
  this.courseService.getVideosByLessonId(lessonId).subscribe({
    next: (videos) => {
      this.videos = videos;
      console.log('Videos loaded:', this.videos);
      if (this.videos.length > 0) {
        this.selectedVideo = this.videos[0];
        this.currentVideo = this.selectedVideo;
        console.log('First video selected:', this.selectedVideo);
      }
    },
    error: (error) => {
      console.error('Error loading videos:', error);
      // Handle error (e.g., show error message to user)
    }
  });
}
 
onVideoChange() {
  if (this.selectedVideo) {
    console.log('Selected video:', this.selectedVideo);
    this.showVideoPlayer = true;
    this.currentVideo = this.selectedVideo;
 
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.pause();
      this.videoPlayer.nativeElement.currentTime = 0;
    }
   
    // Trigger a change in the video source
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.load();
      this.videoPlayer.nativeElement.play();
    }
 
    this.logVideoSelection(this.selectedVideo.id);
    this.fetchVideoDetails(this.selectedVideo.id);
  } else {
    this.showVideoPlayer = false;
  }
}
logVideoSelection(videoId: number) {
  // Implement your logic to log video selection
  console.log(`Logging video selection for video ID: ${videoId}`);
}
 
 
 
  // updateVideoProgress(event: Event) {
  //   const video = event.target as HTMLVideoElement;
  //   this.videoProgress = (video.currentTime / video.duration) * 100;
  // }
//   updateVideoProgress(event: Event) {
//     const video = event.target as HTMLVideoElement;
//     this.videoProgress = (video.currentTime / video.duration) * 100;

//     if (video.paused || video.ended) {
//         if (this.currentVideo) {
//             this.courseService.saveProgress(this.userId, this.currentVideo.id, this.videoProgress).subscribe(
//                 response => {
//                     console.log('Progress saved successfully');
//                 },
//                 error => {
//                     console.error('Error saving progress:', error);
//                 }
//             );
//         }
//     }
// }
    // lastSavedProgress: number = 0;
    

    // updateVideoProgress(event: Event) {
    //   const video = event.target as HTMLVideoElement;
    //   const currentProgress = (video.currentTime / video.duration) * 100;
    

    //   this.videoProgress = Math.max(currentProgress, this.lastSavedProgress);
    

    //   if (this.videoProgress > this.lastSavedProgress && this.currentVideo) {
    //     this.courseService.updateProgress(this.userId, this.currentVideo.id, this.videoProgress).subscribe(
    //       () => {
    //         console.log('Progress updated successfully');
    //         this.lastSavedProgress = this.videoProgress; 
    //       },
    //       error => {
    //         console.error('Error updating progress:', error);
    //       }
    //     );
    //   }
    // }
    
    
    
    getLessonsByCourseId(courseId: number): void {
      this.courseService.getLessonsByCourseId(courseId).subscribe(
        (lessons: Lesson[]) => {
          this.lessonsByCourseId = lessons; // Store lessons directly for short-term courses
        },
        (error) => {
          console.error('Error fetching lessons:', error);
        }
      );
    }




    private loadInitialData() {
      this.courseService.getUserDetails(this.userId).subscribe(res => this.userDetails = res);
      this.courseService.getCourseDetails(this.courseId).subscribe(res => {
        this.CourseDetails = res;
        console.log('courseTerm', this.CourseDetails.courseTerm);
        
        if (this.CourseDetails.courseTerm === 'short') {
          // Fetch lessons directly for short-term courses
          this.getLessonsByCourseId(this.courseId);
        } else if (this.CourseDetails.courseTerm === 'long') {
          // Fetch modules and lessons for long-term courses
          this.getLessonModulesAndLessons(this.courseId);
        }
        this.updateCourseProgress();
      });
      
      this.courseService.getCourseModules(this.courseId).subscribe(res => {
        this.courseModules = res;
        this.updateFilteredLessons();
      });
      this.updateCourseProgress();
    }
  selectLesson(lesson: lesson) {
    this.course.currentLesson = lesson;
    this.loadVideoForLesson(lesson.id);
  }
  toggleLessonCompletion(lesson: lesson) {
    lesson.completed = !lesson.completed;
    this.updateCourseProgress();
  }
 
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-mode');
  }
 
  searchLessons() {
    this.updateFilteredLessons();
  }
 
  updateFilteredLessons() {
    this.filteredLessons = this.course.modules
      .flatMap(module => module.lessons)
      .filter(lesson =>
        lesson.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        lesson.transcript.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
  }
 
  // nextLesson() {
  //   this.navigateLesson(1);
  // }
 
  // previousLesson() {
  //   this.navigateLesson(-1);
  // }
 
  addComment() {
    if (this.newComment.trim()) {
      this.comments.push({ user: 'Current User', text: this.newComment, timestamp: new Date() });
      this.newComment = '';
    }
  }
 
 
 
  addBookmark() {
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    this.bookmarks.push({ time: videoElement.currentTime, note: `Bookmark at ${videoElement.currentTime.toFixed(2)}s` });
  }
 
  jumpToBookmark(time: number) {
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    videoElement.currentTime = time;
  }
  nextVideo() {
    if (this.hasNextVideo()) {
      this.currentVideoIndex++;
      this.updateCurrentVideo();
    } else {
      this.nextLesson();
    }
  }

  previousVideo() {
    if (this.hasPreviousVideo()) {
      this.currentVideoIndex--;
      this.updateCurrentVideo();
    } else {
      this.previousLesson();
    }
    
  }

  nextLesson() {
    const currentModule = this.lessonModules[this.currentModuleIndex];
    const currentLessons = this.lessonsByModule[currentModule.id];

    if (this.currentLessonIndex < currentLessons.length - 1) {
      this.currentLessonIndex++;
      this.currentVideoIndex = 0;
    } else {
      this.nextModule();
    }
    this.updateCurrentLesson();
  }

  previousLesson() {
    if (this.currentLessonIndex > 0) {
      this.currentLessonIndex--;
      this.currentVideoIndex = 0;
    } else {
      this.previousModule();
    }
    this.updateCurrentLesson();
  }

  nextModule() {
    if (this.currentModuleIndex < this.lessonModules.length - 1) {
      this.currentModuleIndex++;
      this.currentLessonIndex = 0;
      this.currentVideoIndex = 0;
      this.updateCurrentLesson();
    }
  }

  previousModule() {
    if (this.currentModuleIndex > 0) {
      this.currentModuleIndex--;
      const currentModule = this.lessonModules[this.currentModuleIndex];
      const currentLessons = this.lessonsByModule[currentModule.id];
      this.currentLessonIndex = currentLessons.length - 1;
      this.currentVideoIndex = 0;
      this.updateCurrentLesson();
    }
  }

  // updateCurrentLesson() {
  //   const currentModule = this.lessonModules[this.currentModuleIndex];
  //   const currentLessons = this.lessonsByModule[currentModule.id];
  //   this.selectedLesson = currentLessons[this.currentLessonIndex];
  //   this.updateCurrentVideo();
  // }

  updateCurrentVideo() {
    const currentVideos = this.videosByLesson[this.selectedLesson.id];
    this.currentVideo = currentVideos[this.currentVideoIndex];
    this.watchVideo(this.currentVideo);
  }

  // watchVideo(video: any) {
  //   this.currentVideo = video;
  //   this.showVideoPlayer = true;
  //   this.videoProgress = 0;
  // }
  watchVideo(video: any) {
    this.currentVideo = video;
    this.showVideoPlayer = true;
    
    // Fetch initial progress from the server
    if (this.userId && video.id) {
      this.courseService.getProgress(this.userId, video.id).subscribe(
        progress => {
          this.lastSavedProgress = progress;
          this.videoProgress = progress;
        },
        error => {
          console.error('Error fetching initial progress:', error);
          this.lastSavedProgress = 0;
          this.videoProgress = 0;
        }
      );
    } else {
      this.lastSavedProgress = 0;
      this.videoProgress = 0;
    }
  }
  
  
  hasNextVideo(): boolean {
    const currentVideos = this.videosByLesson[this.selectedLesson.id];
    return this.currentVideoIndex < currentVideos.length - 1 || this.hasNextLesson();
  }

  hasPreviousVideo(): boolean {
    return this.currentVideoIndex > 0 || this.hasPreviousLesson();
  }

  hasNextLesson(): boolean {
    const currentModule = this.lessonModules[this.currentModuleIndex];
    const currentLessons = this.lessonsByModule[currentModule.id];
    return this.currentLessonIndex < currentLessons.length - 1 || this.hasNextModule();
  }

  hasPreviousLesson(): boolean {
    return this.currentLessonIndex > 0 || this.hasPreviousModule();
  }

  hasNextModule(): boolean {
    return this.currentModuleIndex < this.lessonModules.length - 1;
  }

  hasPreviousModule(): boolean {
    return this.currentModuleIndex > 0;
  }



   loadVideoForLesson(lessonId: number) {
    this.courseService.getVideoByLessonID(lessonId).subscribe(
      (res) => {
        if (res && res.s3Url) {
          this.videoUrl = res.s3Url;
          this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
        } else {
          console.warn('Video URL not found for the given lesson ID.');
        }
      },
      (error) => {
        console.error('Error fetching video for lesson:', error);
      }
    );
  }
 
   navigateLesson(direction: number) {
    const allLessons = this.course.modules.flatMap(module => module.lessons);
    const currentLesson = this.course.currentLesson;
 
    if (currentLesson) {
      const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLesson.id);
      const newIndex = currentIndex + direction;
 
      if (newIndex >= 0 && newIndex < allLessons.length) {
        this.course.currentLesson = allLessons[newIndex];
      } else {
        console.warn('New lesson index is out of bounds.');
      }
    } else {
      console.warn('No current lesson available to navigate.');
    }
  }
 
 
 
 
  updateCourseProgress() {
    this.courseService.getCourseProgress(this.userId, this.courseId).subscribe(
      (progress: number) => {
        this.CourseDetails.progress = Math.round(progress);
      },
      error => {
        console.error('Error fetching course progress:', error);
      }
    );
  }

  downloadFile(documentBase64: string, title: string) {
    let blob: Blob;
    if (typeof documentBase64 === 'string') {
      blob = this.base64ToBlob(documentBase64, 'application/pdf');
    } else {
      console.error('Invalid document type:', typeof documentBase64);
      return;
    }
 
    try {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'document'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating object URL:', error);
    }
  }
 
  previewFile(documentBase64: string) {
    let blob: Blob;
    if (typeof documentBase64 === 'string') {
      blob = this.base64ToBlob(documentBase64, 'application/pdf');
    } else {
      console.error('Invalid document type:', typeof documentBase64);
      return;
    }
 
    try {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error creating object URL:', error);
    }
  }
 
  private base64ToBlob(base64: string, type: string = 'application/pdf'): Blob {
    const base64Data = base64.replace(/^data:application\/pdf;base64,/, "");
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
 
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }
 
    return new Blob(byteArrays, { type });
  }
 
  
  private loadAssignments() {
    if (this.currentLesson && this.currentLesson.id) {
      this.courseService.getAssignmentsByLessonId(this.currentLesson.id).subscribe(
        (res: any) => {
          this.assignments = res;
        },
        (error) => {
          console.error('Error fetching assignments:', error);
          this.assignments = []; // Reset assignments on error
        }
      );
    } else {
      this.assignments = []; // Reset assignments if no lesson is selected
    }
  }
  getUserIdFromLocalStorage(): number | null {
    const userId = localStorage.getItem('id');
    const parsedUserId = userId ? parseInt(userId) : null;
 
    console.log('Retrieved User ID from Local Storage:', parsedUserId);
   
    return parsedUserId;
  }
 
 
///////////////////////////////////my-nots///////////////////

submitNotes() {
  // Retrieve userId from localStorage
  const storedUserId = localStorage.getItem('id');
  if (storedUserId) {
    this.userId = storedUserId;
  } else {
    console.error('User ID is not available in localStorage');
    return;
  }

  // Check if video and userId are available
  if (!this.currentVideo || !this.currentVideo.id) {
    console.error('No video is currently playing');
    return;
  }

  if (!this.userId) {
    console.error('User ID is not available');
    return;
  }

  const videoId = this.currentVideo.id;

  this.courseService.createNoteByVideo(this.userId, videoId, this.myNotes).subscribe(
    response => {
      console.log('Note submitted successfully', response);
      this.clearNotes();
    },
    error => {
      console.error('Error submitting note', error);
    }
  );
}
printUserId() {
  const userId = localStorage.getItem('id');
  if (userId) {
    console.log('User ID:', userId);
  } else {
    console.log('User ID not found in localStorage');
  }
}


clearNotes() {
  this.myNotes = '';


}

//////////////////////////////////////////////assignmentDetais//////////////////////


getQuizIdFromContext(): number {
  // Replace with actual logic to get the quizId, e.g., from route parameters
  const quizId = 1; // Example value, replace with actual logic
  console.log('Retrieved Quiz ID is :', quizId);
  return quizId;
}
 //////////////////////////////////////////////////////
  //////////////get quiz 2///////////////////
  loadQuizzes(lessonId: number): void {
    this.courseService.fetchQuizzesByLessonId(lessonId).subscribe(
      (data) => {
        this.quizzes = data;
        console.log("Quizzes loaded successfully");
        console.log(data);
      },
      (error) => {
        console.error('Error fetching quizzes:', error);
        this.quizzes = []; // Reset quizzes on error
      }
    );
    
  }

  startQuiz(quizId: number): void {
    this.selectedQuizId = quizId;
    this.selectedQuizName = this.quizzes.find((q: { id: number; }) => q.id === quizId)?.quizName || 'Quiz';
    this.loadQuestions(quizId);
  }

  loadQuestions(quizId: number): void {
    this.courseService.fetchQuestionsForQuiz(quizId).subscribe(
      (data) => {
        this.questions = data;
        console.log('getting quiz questions successful', data);
        this.quizStarted = true;
      },
      (error) => {
        console.error('Error fetching quiz questions:', error);
      }
    );
  }
  // submitQuiz(): void {
  //   const answers = this.questions.map((question: { [x: string]: any; id: any; }) => {
  //     const selectedOption = (document.querySelector(`input[name="question-${question.id}"]:checked`) as HTMLInputElement)?.value;
      
  //     return {
  //       questionId: question.id,
  //       selectedAnswer: selectedOption ? question[selectedOption] : null
  //     };
  //   }).filter((answer: { selectedAnswer: null; }) => answer.selectedAnswer !== null); // Filter out unanswered questions
  
  //   if (answers.length === 0) {
  //     console.error('No answers selected');
  //     return;
  //   }
  
  //   this.courseService.submitQuizAnswers(this.selectedQuizId, this.userId, answers).subscribe(
  //     (response) => {
  //       console.log('Quiz submitted successfully', response);
  //       // Handle success (e.g., show a confirmation message or redirect)
  //     },
  //     (error) => {
  //       console.error('Error submitting quiz:', error);
  //       // Handle error (e.g., show an error message)
  //     }
  //   );
  // }
  
  submitQuiz(): void {
    const userId = this.getUserIdFromLocalStorage();  // Get the user ID from local storage
  
    if (!userId) {
      console.error('User ID not found in local storage');
      return;
    }
  
    const answers = this.questions.map((question: { [x: string]: any; id: any; }) => {
      const selectedOption = (document.querySelector(`input[name="question-${question.id}"]:checked`) as HTMLInputElement)?.value;
  
      return {
        question: { id: question.id },  // Include the question ID inside a nested question object
        selectedAnswer: selectedOption ? question[selectedOption] : null
      };
    }).filter((answer: { selectedAnswer: null; }) => answer.selectedAnswer !== null);  // Filter out unanswered questions
  
    if (answers.length === 0) {
      console.error('No answers selected');
      return;
    }
  
    console.log('Submitting answers:', answers);  // Log the payload to ensure it's correct
  
    this.courseService.submitQuizAnswers(this.selectedQuizId, userId, answers).subscribe(
      (response) => {
        console.log('Quiz submitted successfully', response);
        console.log('User ID is:', userId);
        this.fetchQuizResults(); // Call fetchQuizResults after successful submission

        // Handle success (e.g., show a confirmation message or redirect)
      },
      (error) => {
        console.error('Error submitting quiz:', error);
        // Handle error (e.g., show an error message)
      }
    );
    this.isPopupVisible = true;
    this.quizStarted = false;
    this.quizStart = false;

    // this.fetchQuizResults();///get result//////
  }
  
  ///////////////////////////////////////////
  ///////////////////get quiz result/////////////////
  fetchQuizResults(): void {
    const userId:any = this.getUserIdFromLocalStorage();  // Get the user ID from local storage
    const quizId = this.selectedQuizId;
    console.log('userId is..',userId);
    console.log('quizId is..',quizId);

    this.courseService.getCorrectAnswerPercentage(quizId, userId).subscribe({
      next: (percentage) => {
        this.correctAnswerPercentage = percentage;
        console.log('quiz percentage get successful',percentage);
      },
      error: (error) => {
        console.error('Error fetching percentage:', error);
      }
    });

    this.courseService.getCorrectAnswerRatio(quizId, userId).subscribe({
      next: (ratio) => {
        this.correctAnswerRatio = ratio;
        console.log('quiz ratio get successful', ratio);
      },
      error: (error) => {
        console.error('Error fetching ratio:', error);
      }
    });
  }
  closePopup() {
    this.isPopupVisible = false;
  }
  ////////////////////////////////////////////////////assignmentPost///////////////

  
onFileSelected2(event: any) {
  this.selectedFile = event.target.files[0];
}
submitAssignment() {
  if (this.selectedFile) {
    this.courseService.submitAssignment(this.currentLesson.id, this.userId, this.selectedFile)
      .subscribe(response => {
        console.log('Assignment submitted successfully', response);
      }, error => {
        console.error('Error submitting assignment', error);
      });
  } else {
    console.error('No file selected');
  }
}
onFileChange(event: any) {
  this.selectedFile = event.target.files[0];
}
 
////////////////////////////////////////////chatbot////////////////



 
// isVideoContainerExpanded = false;
// userQuery2: string = '';
// response: string | null = null;
 
// toggleVideoContainer() {
//   this.isVideoContainerExpanded = !this.isVideoContainerExpanded;
// }
 
// closeChatBox() {
//   this.isVideoContainerExpanded = false;
//   this.response = null; 
// }
 
 
// sendQuery2() {
//   if (this.userQuery2.trim()) {
//     this.courseService.sendQuery2(this.userQuery2)
//       .subscribe(
//         (responseObj: any) => { // Assuming response is an object
//           this.response = responseObj.response; // Accessing the 'response' field
//           this.userQuery2 = ''; // Clear user query after sending
//         },
//         (error: any) => {
//           console.error('Error occurred while sending query:', error);
//         }
//       );
//   }
// }
 
 ////////////////////////////////////////////chatbot////////////////
 
 
 userQueryDisplay: any;
 
isVideoContainerExpanded = false;
userQuery2: string = '';
response: string | null = null;
 
toggleVideoContainer() {
  this.isVideoContainerExpanded = !this.isVideoContainerExpanded;
}
 
closeChatBox() {
  this.isVideoContainerExpanded = false;
  this.response = null; // Clear the response when closing the chat box
  this.userQueryDisplay = null;
}
 
 
// sendQuery2() {
//   if (this.userQuery2.trim()) {
//     this.userQueryDisplay = this.userQuery2;
//     this.courseService.sendQuery2(this.userQuery2)
//       .subscribe(
//         (responseObj: any) => { // Assuming response is an object
//           this.response = responseObj.response;
//           this.userQuery2 = ''; // Clear user query after sending
//         },
//         (error: any) => {
//           console.error('Error occurred while sending query:', error);
//         }
//       );
//   }
// }
sendQuery2() {
  if (this.userQuery2.trim()) {
    console.log('User Query:', this.userQuery2); // Debugging: Log the user query

    // Set the selected video as the current video
    this.currentVideo = this.selectedVideo;
    console.log('Selected Video:', this.selectedVideo); // Debugging: Log the selected video

    // Extract the ID from the current video
    const videoId = this.currentVideo.id;
    console.log('Current Video ID:', videoId); // Debugging: Log the current video ID

    // Display the user query
    this.userQueryDisplay = this.userQuery2;
    console.log('User Query Display:', this.userQueryDisplay); // Debugging: Log the displayed user query

    // Call the service method to send the query and the current video ID
    this.courseService.sendQuery2(videoId, this.userQuery2)
      .subscribe(
        (responseObj: any) => {
          console.log('Service Response:', responseObj); // Debugging: Log the response object
          
          this.response = responseObj.response;
          console.log('Extracted Response:', this.response); // Debugging: Log the extracted response

          // Clear the user query after sending
          this.userQuery2 = '';
        },
        (error: any) => {
          console.error('Error occurred while sending query:', error); // Debugging: Log any errors
        }
      );
  } else {
    console.warn('User query is empty.'); // Debugging: Warn if the user query is empty
  }
}




shouldBlink: boolean = false;
 
// Method to start blinking
startBlinking() {
  this.shouldBlink = true;
}
 
// Method to stop blinking
stopBlinking() {
  this.shouldBlink = false;
}
 
 
 
 
// =================== ai assignment ===========================
assignment: any;
question: string = '';

// startAssignment(userId:number,courseId: number, lessonId: number): void {
//   const currentUserId = Number(this.authService.getId());

//   this.courseService.generateAssignment(userId, courseId, lessonId).subscribe(
//     response => {
//       console.log('Assignment generated:', response);
//       this.router.navigate(['/aiassignment']);
//     },
//     error => {
//       console.error('Error generating assignment:', error);
//     }
//   );
// }
startAssignment(userId: number, courseId: number, lessonId: number): void {
  const currentUserId = Number(this.authService.getId());
  console.log("userid",userId,"courseid",courseId,"lessonid",lessonId);

  this.courseService.generateAssignment(userId, courseId, lessonId).subscribe(
    response => {
      console.log('Assignment generated:', response);
      if (response && response.ai_assignment_id) {
        console.log('Navigating to AI Assignment component');
        this.router.navigate(['/aiassignment'], { 
          queryParams: { 
            assignmentId: response.ai_assignment_id, 
            question: response.question 
          } 
        });
      } else {
        console.error('Invalid response from generateAssignment:', response);
      }
    },
    error => {
      console.error('Error generating assignment:', error);
    }
  );
}
navigatetoAIQuiz(){
  this.router.navigate(['/aiquiz'],
    {
      queryParams: {
        courseId: this.courseId,
        lessonId: this.lessonId,
        userId: this.userId
      }
    }
  );
}

}
 
 




 
 
 
 
 
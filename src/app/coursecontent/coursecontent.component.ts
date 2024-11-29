import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { compileNgModule } from '@angular/compiler';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FusionService } from '../fusion.service';


export interface  LessonModule {
  id: number;
  name: string;
  lessons: Lesson[];
}
export interface Video {
  id: number;
  courseId: number;
  fileName: string;
  fileUrl: string;
 
  // Add other relevant fields here
}
export interface Lesson {
  id: number;
  title: string;
  description: string;
  content:string;
  // Add other relevant fields here
}
interface Course {
  videos: Video[];
}
@Component({
  selector: 'app-coursecontent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coursecontent.component.html',
  styleUrl: './coursecontent.component.css'
})
export class CoursecontentComponent {
 
    @ViewChild('videoElement', { static: true })
  videoElementRef!: ElementRef<HTMLVideoElement>;
 
  isSidebarClosed = false;
  videos: Video[] = [];
  courseId: number = 11; // Replace with the actual course ID or get it dynamically
 
 
  course = {
    videos: [
      { fileName: 'Introduction', fileUrl:'../../assets/video2.mp4' },
      { fileName: 'Chapter 1', fileUrl:'../../assets/video1.mp4'  },
      { fileName: 'Chapter 2', fileUrl: '../../assets/video2.mp4' }
      // src\assets\video2.mp4    
      ]
  };
  currentVideoUrl: string = this.course.videos[0].fileUrl;
 
  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
  playVideo(videoUrl: string) {
    this.currentVideoUrl = videoUrl;
  }
  activeButton: string = 'overview';
 
  showContent(buttonType: string) {
    this.activeButton = buttonType;
  }
 
  lessons: Lesson[] = [];
 
  private videoElement: HTMLVideoElement | null = null;
  private progressBar: HTMLElement | null = null;
  private previousProgress = 0;
  private previousTime = 0;
  private manualSeek = false;
  private isSeeking = false;
  private intervalId: any;  
  videoUrl: string = '';
  videoId: number = 1;
  userId = 1; // Example userId, replace this with actual userId
  selectedVideo: any;
  @ViewChild('myModal') myModal!: ElementRef; // ViewChild decorator to get reference to the modal
video: any;
 
  constructor(private http: HttpClient,private router:Router,private fusionService:FusionService) { }
 
  ngOnInit(): void {
    this.initializeVideoPlayer();
    this.loadVideoProgress();
    // this.loadVideosContent(11)
    // this.loadLessons();
 
    // this.getAllVideos();
  }
 
  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
 
  private async loadVideoProgress() {
    try {
      const progress = await this.fusionService.getWatchedPercentage().toPromise();
      if (progress) {
        this.previousProgress = progress.watchedPercentage;
        this.previousTime = progress.lastWatchedTime;
        if (this.videoElement) {
          this.videoElement.currentTime = this.previousTime;
        }
      }
    } catch (error) {
      console.error('Error loading video progress:', error);
    }
  }
  // private saveVideoProgress() {
  //   if (this.videoElement) {
  //     const progress = {
  //       userId: this.userId,
  //       videoId: this.videoId,
  //       watchedPercentage: this.previousProgress,
  //       lastWatchedTime: this.videoElement.currentTime
  //     };
  //     this.FusionService.saveProgress().subscribe({
  //       next: response => console.log('Progress saved:', response),
  //       error: error => console.error('Error saving progress:', error)
  //     });
  //   }
  // }
 



  
  private initializeVideoPlayer() {
    setTimeout(() => {
      this.videoElement = document.getElementById('video') as HTMLVideoElement;
      this.progressBar = document.getElementById('progress-bar') as HTMLElement;
 
      console.log('Initializing video player:', this.videoElement, this.progressBar);
 
      if (this.videoElement && this.progressBar) {
        this.videoElement.addEventListener('timeupdate', this.updateProgressBar.bind(this));
        this.videoElement.addEventListener('ended', this.onVideoEnded.bind(this));
        console.log('Event listeners added');
      } else {
        console.error('Video element or progress bar not found');
      }
    }, 1000);
  }
 
  private updateProgressBar() {
    if (!this.videoElement || !this.progressBar) return;
 
    const duration = this.videoElement.duration;
    const currentTime = this.videoElement.currentTime;
    const progress = Math.round((currentTime / duration) * 100);
 
    console.log(`Progress: ${progress}%, Current Time: ${currentTime}, Duration: ${duration}`);
 
    if (progress >= this.previousProgress) {
      this.progressBar.style.width = progress + '%';
      const percentageWatchedElement = document.getElementById('percentage-watched');
      if (percentageWatchedElement) {
        percentageWatchedElement.textContent =  progress + '%'  + ""+"" +   '  COMPLETED ';
      }
 
      if (progress >= 100) {
        this.progressBar.style.backgroundColor = 'green';
      } else {
        this.progressBar.style.backgroundColor = 'red';
      }
 
      const totalWatchedTimeElement = document.getElementById('total-watched-time');
      const remainingTimeElement = document.getElementById('remaining-time');
      if (totalWatchedTimeElement && remainingTimeElement) {
        totalWatchedTimeElement.textContent = 'Total watched time: ' + this.formatTime(currentTime);
        remainingTimeElement.textContent = 'Remaining time: ' + this.formatTime(duration - currentTime);
      }
 
      console.log(`Total watched time: ${this.formatTime(currentTime)}`);
      console.log(`Remaining time: ${this.formatTime(duration - currentTime)}`);
 
      this.previousProgress = progress;
    }
  }
 
  private onVideoEnded() {
    if (this.progressBar) {
      this.progressBar.style.width = '100%';
      this.progressBar.style.backgroundColor = 'green';
      console.log('Video ended');
    }
  }
 
  private formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
 
  // loadVideosContent(courseId:number): void {
  //   this.fusionService.getVideosByCourse(courseId).subscribe(
  //     (videos: Video[]) => {
  //       this.videos = videos;
  //     },
  //     (error) => {
  //       console.error('Error fetching videos:', error);
  //     }
  //   );
  // }
  // loadLessons(): void {
  //   this.fusionService.getLessonsByCourse(this.courseId).subscribe(
  //     (lessons: Lesson[]) => {
  //       this.lessons = lessons;
  //     },
  //     (error) => {
  //       console.error('Error fetching lessons:', error);
  //     }
  //   );
  // }
//   getVideoById(id: number) {
//     // this.employeeService.getVideoById(id).subscribe(
//     //   (response: any) => { // Change type from any[] to any
//     //     this.selectedVideo = response; // Update assignment to match the structure of the response
//     //   },
//     //   (error) => {
//     //     console.error('Error fetching video by ID:', error);
//     //   }
//     // );
//   }
 
  // playVideo(video: any) {
  //   this.selectedVideo = video;
  //   this.initializeVideoPlayer(); // Re-initialize video player for new video
  // }
 
  dashboard(){
    this.router.navigate(['/profile/:id'])
  }
  coursePage(){
    this.router.navigate(['/learningPage'])
  }
 
  closeModal() {
    this.myModal.nativeElement.classList.remove('show'); // Remove 'show' class to hide the modal
    this.myModal.nativeElement.setAttribute('aria-hidden', 'true');
    this.myModal.nativeElement.style.display = 'none';
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      document.body.removeChild(modalBackdrop); // Remove modal backdrop
    }
  }
}
 
 
 
 

 
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FieldsetModule } from 'primeng/fieldset';
import { MatSnackBar } from '@angular/material/snack-bar'
import { response } from 'express';
import { AuthService } from '../auth.service';
import { ActivatedRoute, NavigationExtras, Router, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { CourselandpageService } from '../courselandpage.service';
import { Fusion2Service } from '../fusion2.service';
import { Mentor1Service } from '../mentor1.service';
interface Review {
  id: number;
  rating: number;
  comment: string;
  timestamp: string;
}
export interface Video {
  title: string;
  url: string; // URL of the video
}
interface Skill {
  id: number;
  name: string;
  description: string;
  unlocked: boolean;
}
interface Course {
  id: number;
  title: string;
  instructor: string;
  description: string;
  rating: number;
  studentsEnrolled: number;
  price: number;
  imageUrl: string;
  level: string;
  duration: string;
  topics: string[];
  syllabus: { week: number; title: string }[];
}
interface RoadmapModule {
  id: number;
  name: string;
}
 
@Component({
  selector: 'app-courselandpage',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './courselandpage.component.html',
  styleUrl: './courselandpage.component.css'
 
})
export class CourselandpageComponent implements OnInit{
  selectedVideo: any = null;
  safeCourseImageUrl: SafeUrl | null = null; 
  course: any;
 
  isEnrolled: boolean = false;
 
  lockOn: boolean = false;
 
  enrolling: boolean = false;
// ------------------ for buttons--------------
items :any;
  displaySection: String = "skills";
  modalTemplate: any;
  courseDetails: any;
  enrollmentCount: any;
  reviewCount: any;
  averageRating: any;
  review: any;
  lesson: any;
  csvString: any;
  splitString: any;
  videoUrl: any ;
  sanitizedUrl: any;
  tools: any;
  imageUrl: any;
  videos: any;
  learn: any;
  levelKeys: any;
  locked= false;
  assignement: any;
  quiz: any;
  ciel: any;
  demo: any;
  instructorDetails: any;
  learning:any;
  MentorDetails: any;
  userId: any;
  MentorId: any;
  courseLevel: any;
  connections: any[] = [];
  selectedCourse: any = null;
  courses: any;
  dynamicWidth: any;
  scrollToRight: ElementRef | null = null;
  courseTTrailer: any;
  level: any;
  courseModules: any;
  selectedModule: any;
  openlesson: any = false;
  lessonList: any;
  courseDetail: any;
  splitArray: any;
  tool: any;
  roadmapLesson: any;
  courseTerm: any;
  coursesDemo: any;
 
  ngAfterViewInit(): void {
    if (this.scrollToRight) {
      this.scrollToRight.nativeElement.scrollIntoView({ behavior: 'smooth', inline: 'end' });
    }
  }
 
  // ---------------------------------------------
  constructor(
    private route: ActivatedRoute,
    public http :  HttpClient,private sanitizer: DomSanitizer,private authservices:AuthService ,private router: Router,private mentorService: Mentor1Service
    ,private courselandpageService: CourselandpageService,private fusion2service:Fusion2Service,
  ) {
   
  }
 
    getCourseDetails(id: number): void {
 
        this.fusion2service.getCourseDetails(id).subscribe(course => {
   
          this.course = course;
   
          console.log(course); // Print the course details in the console
   
   
        }, error => {
   
          console.error('Error fetching course details', error);
   
        });
  }
  loadMockCourse() {
    this.course = {
      id: 1,
      title: 'Angular for Beginners',
      instructor: 'John Doe',
      description: 'Learn the basics of Angular from scratch.',
      rating: 4.5,
      studentsEnrolled: 1500,
      price: 199.99,
      imageUrl: '../../assets/cloude1.jpg',
      level: 'Beginner',
      duration: '30 hours',
      topics: ['Introduction', 'Components', 'Services', 'Routing'],
      syllabus: [
        { week: 1, title: 'Getting Started' },
        { week: 2, title: 'Components and Templates' }
      ]
    };
  }
 getCourseTrailer(courseId:any){
  this.level = ['Beginner', "intermediate", "advanced"];
this.courseTTrailer = [];
 

 this.http.get(`${environment.apiBaseUrl}/api/course/getCourseTrailer/${courseId}`).subscribe((res)=>{
  this.coursesDemo = res;
  console.log(this.coursesDemo[0].s3Url,"courseTrailers......")
 })
// This will log before all requests are completed due to asynchronous nature
console.log(this.courseTTrailer, "Final courseTrailer array");
 }
  checkEnrollmentStatus(courseId: number) {
    // Mock check for enrollment status
    this.isEnrolled = false; // Mocking that the user is not enrolled in the course
  }
 
  // -------------------------------------------------below code is for round buttons--------------------------
 
// ==================below code is for toogle the section like skills , tools ,what you learn etc -------------
isLocked(){
  this.locked = true;
 }
 lockedClose(){
  this.locked = false;
 }
 
  showCard() {
    console.log("isEnrolled")
    this.isEnrolled = true;
   
  }
 
  hideCard() {
    this.isEnrolled = false;
  }
  courseId :any;
 
  circles = [1, 2, 3];
 
  toggleSection(section: string): void {
    this.displaySection = this.displaySection === section ? 'skills' : section;
  }
  async ngOnInit(): Promise<void> {
    const courseId = this.route.snapshot.queryParamMap.get('courseId');
    this.fetchVideos(courseId);
    if (courseId) {
      this.getData(courseId);
    } else {
      console.error("Course ID not found in query parameters.");
    }
    this.getLessonBymoudleId(26);
    this.getData(courseId);
    this.getCourseTrailer(courseId);
    //
      this.route.queryParams.subscribe(params => {
 
            const courseId = +params['courseId']; // The '+' converts the string to a number
     
            this.getCourseDetails(courseId);
     
          });
    this.getRoadmap(this.courseDetails)
    console.log( ((this.courses.length)*100)+100,"length")
    this.dynamicWidth =  ((this.courses.length)*100)+100;
    this.courseCurruculum.forEach((topic:any, index:any) => {
      if (index > 0) {
        const previousTopic = this.courseCurruculum[index - 1];
        if (!previousTopic.progress) {
          topic.locked = true;
        } else {
          topic.locked = false;
        }
      }
    });
    this. getModuleByCourseId(courseId)
 
    this.getRoadmap(courseId);
    this.getCourseLevels();
    this.loadMockCourse();
    
    //
     this.courseId = this.route.snapshot.paramMap.get('id');
    console.log()
    if (courseId) {
      this.checkEnrollmentStatus(+this.courseId);
    }
    this.userId = window.localStorage.getItem('id');
    this.http.get(`${environment.apiBaseUrl}/enrollment/user/${this.userId}/course/${courseId}`).subscribe(
      (res) => {
        console.log("enrollment", res);
 
        this.lockOn = true
        console.log("enrolled", this.locked);
      },
      (error) => {
        console.log(error)
        if (error.status === 404) {
          this.lockOn = false;
          console.log("NotEnrolled", this.locked);
        } else {
          this.locked = false;
          console.error("Error:", error);
        }
      }
    );
    this.getDemoVidoeUrl()
   
    console.log("bye",this.courseDetails)
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
    // this.getEnrollment()
   }
 
   
   getData(courseId:any) {
    this.http.get(`${environment.apiBaseUrl}/course/getBy/` + courseId).subscribe((res) => {
      console.log("Course Details:", res);
      this.courseDetails = res;
      console.log("Prerequisite Course Details:", this.courseDetails);
 
      this.courseTerm = this.courseDetails.courseTerm;
      console.log("Course Term:", this.courseTerm);
 
      if (this.courseTerm === 'long') {
        this.courseModules = this.courseDetails.modules || [];
        console.log("Modules (from courseDetails):", this.courseModules);
      } else if (this.courseTerm === 'short') {
        this.fetchVideos(courseId);
      }
 
      this.MentorId = this.courseDetails.user.id;
      console.log(this.MentorId, "Mentor ID")
      this.http.get(`${environment.apiBaseUrl}/user/find/` + this.MentorId).subscribe((res) => {
        console.log("Mentorsdetails", res)
        this.MentorDetails = res;
 
      });
      // Fetch modules explicitly if needed
      this.getModuleByCourseId(courseId);
 
 
    });
    console.log(this.MentorId, "MentD")
    this.http.get(`${environment.apiBaseUrl}/courseTools/course/` + courseId).subscribe((res) => {
      this.tools = res;
      //
      this.splitArray = this.tools[0].coursePrerequisites.split(",");
      console.log("toolsss", this.tools[0].skillName);
      console.log("toolsss-----------------------", this.splitArray);
      console.log("tools", this.tools[0].toolImage);
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${this.tools[0].toolImage}`);
      console.log("image", this.imageUrl);
    });
    // --------------the below code for duration-----------
    this.http.get(`${environment.apiBaseUrl}/course/lessons/`+ courseId).subscribe((res)=>{
      console.log("hlei",res)
      this.lesson = res;
    })
    // -------------------below code is for ----------
    this.http.get(`${environment.apiBaseUrl}/video/courses/videos/`+courseId).subscribe((res)=>{
      console.log("video",res)
      console.log("lesson",this.courseCurruculum.lesson.id)
    })
    // ------------------------- below code is for  why this learn------------------
    this.http.get(`${environment.apiBaseUrl}/course/getBy/`+courseId).subscribe((res)=>{
      console.log("hlei",res)
      this.learn = res;
      this.levelKeys = Object.keys(this.learn).filter(key => key.startsWith('level_'));
 
  this.levelKeys.forEach((key: string | number) => {
    console.log("key,vqlue",`${key}: ${this.learn[key]}`);
  });
  console.log("levelKeys",this.levelKeys,this.learn)
    })
    this.http.get(`${environment.apiBaseUrl}/video/courses/videos/`+courseId).subscribe((res)=>{
     
      this.videos= res;
    })
    this.http.get(`${environment.apiBaseUrl}/course/enrollments/`+courseId).subscribe(  (res) => {
      this.enrollmentCount = res;
      console.log("Enrollment count:", this.enrollmentCount.length);
      let totalRating :any;
 
  console.log("totalRating",totalRating)
 
    },
    (error) => {
      console.error("Error fetching enrollments:", error);
    })
    // ---- below code is for counting the review and counting ratings------------
    this.http.get<Review[]>(`${environment.apiBaseUrl}/course/reviews/`+courseId).subscribe(
      (res) => {
        if (Array.isArray(res)) {
          this.reviewCount = res.length;
          this.review = res;
   
          // Calculate the average rating with error handling
          const ratings: number[] = res.map((review: any) => review.rating);
          let averageRating = 0;
   
          if (ratings.length > 0) {
            try {
              this.averageRating = ratings.reduce((acc: number, rating: number) => acc + rating, 0) / ratings.length;
            } catch (error) {
              console.error("Error calculating average rating:", error);
              // Handle potential errors during calculation (e.g., non-numeric ratings)
              this.averageRating = NaN; // Set to Not a Number for display or further handling
            }
          }
   
          console.log("tot:", this.review[0].rating); // Log first rating (optional)
          console.log("Review count:", this.reviewCount);
          console.log("Average rating:", this.averageRating);
          this.ciel= Math.ceil(this.averageRating);
        } else {
          console.error("Unexpected response format:", res);
        }
      },
      (error) => {
        console.error("Error fetching reviews:", error);
      }
    );
   
  //  below code for instrucor------------------------------------
  console.log("instructor")
  this.http.get(`${environment.apiBaseUrl}/course/getBy/5`).subscribe((res)=>{
      console.log(res);
      this.MentorDetails = res
   
  })
 
   }
   assignments(lessonId:any){
    this.http.get(`${environment.apiBaseUrl}/lesson/`+lessonId).subscribe((res)=>{
      console.log()
      this.assignement= res;
      console.log("assignments",this.assignement)
    })
   
   }
 
   
  dropdownActive: { [key: number]: { [key: string]: boolean } } = {};
   
  toggleDropdown(topicNumber: number, section: string) {
   
  //  this.getEnrollment();
    if (!this.dropdownActive[topicNumber]) {
      this.dropdownActive[topicNumber] = {};
    }
    this.dropdownActive[topicNumber][section] = !this.dropdownActive[topicNumber][section];
  }
  showLessonsforRoadmap(module: any,lessonId:any) {
    console.log(module,lessonId)
     this.getLessonBymoudleId(lessonId)
    this.selectedModule = module;
    this.openlesson = !this.openlesson
  }
  lessondropdown(){
   
  }
  image(toolImage: string) {
    return this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${toolImage}`);
  }
  isDropdownActive(topicNumber: number, section: string): boolean {
    return this.dropdownActive[topicNumber] ? this.dropdownActive[topicNumber][section] : false;
  }
  getLessonBymoudleId(lessonId:any){
    console.log("----------------------------------")
    this.http.get(`${environment.apiBaseUrl}/lesson/module/${lessonId}`).subscribe((res)=>
    {
      this.lessonList = res;
      console.log(this.lessonList,"lesonlist------------------------------------------------")
    })
  }
  hideLesson(){
    this.openlesson = !this.openlesson
  }
   
  getArrowImage(topicNumber: number, section: string): string {
    return this.isDropdownActive(topicNumber, section) ? '../../assets/up.png' : '../../assets/down.png';
  }
  calculateAverageRating(reviews: Review[]): number {
    if (!reviews || reviews.length === 0) {
      return 0; // Handle case with no reviews
    }
 
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    return averageRating;
  }
  quizz(lessonId:any){
    console.log(lessonId)
    this.http.get(`${environment.apiBaseUrl}/api/quizzes/lesson/`+lessonId).subscribe((res)=>{
     
      this.quiz= res;
      console.log("quizz",this.quiz)
    })
  }
  getDemoVidoeUrl(){
    this.http.get(`${environment.apiBaseUrl}/video/courses/videos/`+this.courseId).subscribe((res)=>{
     
      this.demo= res;
      console.log("demo",this.demo.s3Url)
      // this.videoUrl = this.demo[0].s3Url
    })
  }
  getinstructor(){
    this.http.get(`${environment.apiBaseUrl}/video/courses/videos/` +this.courseId).subscribe((res)=>{
     
      this.instructorDetails= res;
      console.log("demo",this.instructorDetails)
      // this.videoUrl = this.demo[0].s3Url
    })
  }
   
      // Sanitize the URL if desired
  //  -----------------video url
 
  // ---------
  generateStars(rating: number): string { // stars
   
       
   
    let stars = '';
    for (let i = 0; i < rating; i++) {
      stars += '★';
    }
    for (let i = rating; i < 5; i++) {
      stars += '☆';
    }
    return stars;
  }
  navigateToEnrollForm(){
    if (this.authservices.isLogged()) {
      const navigationExtras: NavigationExtras = {
        queryParams: { courseId: this.courseId }
      };
     
      this.router.navigate(['/enrollpaymentform'], navigationExtras);
    }else{
      alert("Your not logged in")
    }
  }
  getEnrollment(){
   
    console.log("userId",this.userId,"courseId",this.courseId,"-------------------------------------------")
   
    this.http.get(`${environment.apiBaseUrl}/enrollment/user/${this.userId}/course/${this.courseId}`).subscribe(
      (res) => {
        console.log("enrollment", res);
 
        this.locked = false;
        console.log("enrolled", this.locked);
      },
      (error) => {
        console.log(error)
        if (error.status === 404) {
          this.locked = true;
          console.log("NotEnrolled", this.locked);
        } else {
          this.locked = false;
          console.error("Error:", error);
        }
      }
    );
    this.router.navigate(['/coursecontent'])
 
  }
  gotoCourseContnt(){
    this.router.navigate(['/coursecontent'])
  }
  navigateToCourseContent(){
    this.router.navigate(['/coursecontent', this.courseId]);
  }
  getCourseLevels(){
    this.courseLevel = [
      {
      "id": 1,
      "src":"../../assets/java.png",
      "name": "Beginner"
    },
      {
      "id": 2,
      "src":"../../assets/java-training.jpg",
      "name": "intermediate"
    },
      {
      "id": 3,
      "src":"../../assets/java-training.jpg",
      "name": "Advance"
    }
      ,{
      "id": 4,
      "src":"../../assets/java.png",
      "name": "All Level"
    }
  ]
  }
 
  // ----------------------------RoadMap----------------
 
  private mapResponseToRoadmapModules(response: any[]): RoadmapModule[] {
    return response.map(item => ({
      id: item.id,
      name: item.name || item.moduleName
    }));
  }
 getRoadmap(courseId:any){
  this.http.get<Course[]>(`${environment.apiBaseUrl}/getModuleByCourse/${courseId}`).subscribe(
    (res) => {
      this.courses = this.mapResponseToRoadmapModules(res);
      console.log(this.courses, "coursesRoadmap");
     
 
  console.log(this.courses,"roadmap")
  this.courseDetail =this.returncourseDetails(this.courseId)
  console.log(this.courseDetail )
  let x = 100;
  let y = 100;
  let yOffset = 100;
 
  for (let i = 0; i < this.courses.length; i++) {
    this.courses[i].x = x;
    this.courses[i].y = (i % 2 === 0) ? y : y + yOffset;
 
    x += 100;
  }
 
  for (let i = 0; i < this.courses.length - 1; i++) {
    const connection = {
      start: this.courses[i],
      end: this.courses[i + 1]
    };
    this.connections.push(connection);
  }
 
  console.log(this.courses);
  console.log(this.connections,"connections");
    },
    (error) => {
      console.error('Error fetching courses:', error);
    }
  );
 
  this.courses  = [
    { id: 1, name: 'Math 101' },
    { id: 2, name: 'Physics 101' },
    { id: 3, name: 'Chemistry 101' },
    { id: 4, name: 'Biology 101' },
    { id: 4, name: 'Biology 101' },
    { id: 4, name: 'Biology 101' },
    { id: 4, name: 'Biology 101' },
    { id: 4, name: 'Biology 101' },
    { id: 5, name: 'Biology 102' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' },
    { id: 6, name: 'Biology 103' }
   
  ];
  
}
 

lessonList2: any;
selectedModule2: any;
 
showLessons2(module: any, moduleId: any) {
  if (this.selectedModule2 !== moduleId) {
    this.selectedModule2 = moduleId;
    console.log("Module Object:", module); // Log the module object
 
    if (this.courseTerm === 'long') {
      this.courselandpageService.getLessonsByModule(moduleId).subscribe((res) => {
        this.lessonList2 = res;
        console.log("Lesson List:", this.lessonList); // Log the lessons
      }, (error) => {
        console.error('Error fetching lessons:', error);
      });
    }
  } else {
    this.selectedModule2 = null;
    this.lessonList2 = [];
  }
}
 
 
 
 returncourseDetails(courseId:any){
  this.http.get(`${environment.apiBaseUrl}/course/getBy/` + courseId).subscribe((res) => {
    console.log("hi", res);
    this.courseDetails = res;
    console.log("courseDetailsss22222", this.courseDetails);
    return this.courseDetails
   
     
    })
 }
 
    // Initialize connections after courses are defined
   
 
 
  selectCourse(course: any) {
    this.selectedCourse = course;
    this.getRoadMapLessons(course.id)
    console.log("-----------------------------------------",course)
  }
  getRoadMapLessons(moduleId:any){
    this.http.get(`${environment.apiBaseUrl}/lesson/module/${moduleId}`).subscribe((res)=>{
      this.roadmapLesson = res
    })
  }
  closeCourse(){
    this.selectedCourse = null;
  }
  // -------------------------------------------------------------skill tree------------------
  skillTree: Skill[][] = [
    [{ id: 1, name: 'Basic Math', description: 'Fundamentals of mathematics', unlocked: true }],
    [
      { id: 2, name: 'Algebra', description: 'Study of mathematical symbols and rules', unlocked: false },
      { id: 3, name: 'Geometry', description: 'Study of shapes and spaces', unlocked: false }
    ],
    [
      { id: 4, name: 'Calculus', description: 'Study of continuous change', unlocked: false },
      { id: 5, name: 'Statistics', description: 'Study of data collection and analysis', unlocked: false }
    ],
  ];
 
  selectedSkill: Skill | null = null;
 
  selectSkill(skill: Skill) {
    if (skill.unlocked) {
      this.selectedSkill = skill;
    } else {
      alert('This skill is locked. Unlock previous skills first.');
    }
  }
 
  unlockSkill(skill: Skill) {
    if (this.canUnlock(skill)) {
      skill.unlocked = true;
    }
  }
 
 
  greet(number:any){
    return "hello"
  }
  courseCurruculum: any = [
    { week: 1, title: 'Getting Started', locked: false, progress: true },
    { week: 2, title: 'Components and Templates', locked: true, progress: false },
    { week: 3, title: 'Services', locked: true, progress: false },
    { week: 4, title: 'Routing', locked: true, progress: false },
    // ...
  ];
 
  // ...
 
  unlockTopic(topic: any) {
    if (this.canUnlock(topic)) {
      topic.locked = false;
    } else {
      alert('Please complete the previous topic first.');
    }
  }
 
  canUnlock(topic: any): boolean {
    const previousTopic = this.courseCurruculum.find((t:any, index:any) => index === topic.week - 2);
    return previousTopic && !previousTopic.locked;
  }
  alertIfLocked(topic: any) {
    if (topic.locked) {
      alert('Please complete the previous lesson before proceeding.');
    }
  }
  // ----------------------------------------course wheel----------------------------------------------
 
   getModuleByCourseId(courseId: any) {
    this.courselandpageService.getModulesByCourse(courseId).subscribe((res) => {
      this.courseModules = res;
      console.log("Modules (explicit fetch):", this.courseModules);
    },
      (error) => {
        console.error('Error fetching modules:', error);
      });
  }
 
showLessons(module: any, moduleId: any) {
    if (this.selectedModule !== moduleId) {
      this.selectedModule = moduleId;
      console.log("Module Object:", module); // Log the module object
 
      if (this.courseTerm === 'long') {
        this.courselandpageService.getLessonsByModule(moduleId).subscribe((res) => {
          this.lessonList = res;
          console.log("Lesson List:", this.lessonList); // Log the lessons
        }, (error) => {
          console.error('Error fetching lessons:', error);
        });
      }
 
      this.openlesson = true;
    } else {
      this.selectedModule = null;
      this.lessonList = [];
      this.openlesson = false;
    }
 
    console.log("Selected Module:", this.selectedModule);
    console.log("Open Lesson:", this.openlesson);
    console.log("Current Course Term:", this.courseTerm);
    console.log("Lesson List:", this.lessonList);
  }
 
 
 fetchVideos(courseId: any): void {
  this.mentorService.getVideosByCourse(courseId).subscribe(
    (videos) => {
      this.courseTTrailer = videos;
      console.log('Fetched videos with S3 URLs:', this.courseTTrailer.map((v:any) => v.s3Url));
    },
    (error) => {
      console.error('Error fetching videos', error);
    }
  );
}
playVideo(index: number): void {
  console.log('Playing video:', this.courseTTrailer[index]);
  this.courseTTrailer[index].isPlaying = true;
}
 
sanitizeUrl(s3Url: string): SafeResourceUrl {
  console.log('Sanitizing URL:', s3Url);
  if (!s3Url) {
    console.error('S3 URL is undefined or null');
    return '';
  }
  return this.sanitizer.bypassSecurityTrustResourceUrl(s3Url);
}
showVideo(index: number): void {
  this.selectedVideo = this.coursesDemo[index];
}
closeVideo(): void {
  this.selectedVideo = null;
}
 
defaultImage(event: any) {
  event.target.src = ''; 
}
}
 
 
 
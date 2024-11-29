import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FusionService } from '../fusion.service';
// import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
// import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { environment } from '../../environments/environment';

interface Reply {
  user: string;
  text: string;
  date: Date;
}

interface Comment {
  user: string;
  comment: string;
  date: Date;
  replies: Reply[];
}

interface Lesson {
  id: string;
  name: string;
}

interface CoursesData {
  [key: string]: Lesson[];
}

interface Question {
  id: number;
  question: string;
  selectedOption: string;
  correctOption: string;
}

interface QuizAttemptData {
  userName: string;
  quizTitle: string;
  questions: Question[];
}
export interface Video {
  id: string;
  title: string;
  src: string;
 
  likes: number;
  share: number;
  timestamp: string;
  comments: any[];
  showComments: boolean;
  liked: boolean;
  showShareMenu: boolean;
  saved: boolean;
  profileImage: string;
  profileName: string;
  content: string;
  showFullContent: boolean;
  showShareModal: boolean;
  isImage: boolean;
  isArticle: boolean;
}
////////////////////////////////////////////////////////////////////////////////////////////
interface ActivityCourse {
  id: number;
  name: string;
}
interface ActivityQuizResult {
  userName: string;
  userId: string;
  marks: number;
}
interface ActivityQuestion {
  question: string;
  selectedOption: string;
  correctOption: string;
}
 
interface ActivityQuizAttemptData {
  userName: string;
  quizTitle: string;
  questions: ActivityQuestion[];
}


interface ActivityModule {
  id: number;
  name: string;
  courseId: number;
}
 
interface ActivityLesson {
  id: number;
  name: string;
  moduleId?: number;
  courseId?: number;
}
 
interface ActivityQuiz {
  id: number;
  name: string;
  lessonId: number;
}
 
interface ActivityAssessment {
  id: number;
  name: string;
  lessonId: number;
}
interface QuizAttemptData {
  userName: string;
  quizTitle: string;
  questions: Question[];
}
interface QuizResult {
  userName: string;
  userId: string;
  marks: number;
}
export interface Enrollment {
  id: number;
  courseId: number;
  enrollmentDate: string; // Adjust type as needed based on backend response
  progress: number;
}
 
///////////////////////////////////////////////////////////////////////////////////////////
@Component({
  selector: 'app-menotperspectve',
  standalone: true,
  imports: [FormsModule, CommonModule,MatCardModule, MatIconModule, MatButtonModule,HttpClientModule, MatListModule],
  templateUrl: './menotperspectve.component.html',
  styleUrls: ['./menotperspectve.component.css']
})
export class MenotperspectveComponent implements OnInit {

  newImage: SafeUrl | null = null;

  enrollments: Enrollment[] = [];
  userImage: SafeUrl | null = null;
  name: string | null = '';
  CoursesList: any[] = [];
  enrollmentData: { [courseId: number]: any[] } = {};
  enrollmentCount: any;
  enrollmentCounts: { [courseId: number]: number } = {};

  // Id = '123456';
  // number = '123-456-7890';
  // userID = 'hh66h8h7';
  imageUrl = ''; // Replace with actual image path
  currentTab = 'Dashboard';
  showPopup = false;
  designation = 'Java Trainee';
  role :any;

  courseTitle: string = 'Java Full Stack';
  numberOfUsers = 120;
  averageRating = 4.5; // Example star rating
  numberOfCompletedUsers = 80;

  // course card
  courses: any[] = [];
  userId: any; // Replace with actual user ID, perhaps from authentication service

  selectedCourseType: string = 'in-progress'; // Default selection
  filteredCoursesList: any[] = [];


  lessons: Lesson[] = [];
  selectedCourse: string = '';
  selectedLesson: string = '';
  // Performance metrics
  numberOfQuizzes: number = 0;
  numberOfAttempts: number = 0;
  averageMarks: number = 0;
  averagePerformance: string = '';
  welcomeMessage: string = '';
  // Activities
  selectedCourseId: string = '';
  selectedLessonId: string = '';
  selectedQuizId: string = '';
  showQuizList = false;
  showQuizResults = false;
  showQuizReport = false;
  greetMessage: string = '';

  quizzes: any[] = [];
  quizResults: any[] = [];
  feedbackMessage: string = '';
  level: any;
  courseDescription: any;
  language: any;
  courseDuration: any;
  courseType: any;
  level_1: any;
  level_2: any;
  level_3: any;
  level_4: any;
  level_5: any;
  level_6: any;
  level_7: any;
  level_8: any;
  courseImage: any;

  private subscriptions: Subscription = new Subscription();
  // Tab selection
  tabs = [
    'Dashboard',
    'StudentAnalytics',
    'Activities',
    // 'Announcenments',
    // 'Addshort',
    'AccountSettings',
    'ProfileSettings',
    // 'Logout'
  ];
  usersId:any;
  // CoursesList: any;
  

  setCurrentTab(tab: string) {
    this.currentTab = tab;
  }

  // Reply functionality
  showReplyInput: boolean[] = [];
  replyText: string[] = [];

  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  constructor(
    private fusionService: FusionService,
    private router: Router,
    public authService: AuthService,
    private sanitizer: DomSanitizer
  ) { }
  image(toolImage:any){
    return this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${toolImage}`);
   
  }
  ngOnInit(): void {
    
    const userIdString = localStorage.getItem('id');
    if (userIdString) {
      this.userId = Number(userIdString); // Parse userId from string to number
      this.getDashboardOverview(this.userId);
    } else {
      console.error('User ID not found in local storage');
    }

    this.fetchUserDetails();
    this.loadShortVideos();
    this.fetchCoursesAndEnrollments();

    // this.loadUserCourses();
    this.usersId = localStorage.getItem('id');
    this.getCourseByUserId()
    this.subscriptions.add(
      this.authService.getNameObservable().subscribe(name => {
        this.name = name;
        this.userImage = this.imageUrl
      })
    );
    this.setWelcomeMessage();
    this.loadCourses();
  }

  setWelcomeMessage() {
    const currentTime = new Date().getHours();
    if (currentTime >= 0 && currentTime < 12) {
      this.welcomeMessage = 'Good morning!';
    } else if (currentTime >= 12 && currentTime < 18) {
      this.welcomeMessage = 'Good afternoon!';
    } else {
      this.welcomeMessage = 'Good evening!';
    }
  }
// courses card
// loadUserCourses(): void {
//   this.fusionService.getCoursesByUserId(this.userId).subscribe(
//     (data) => {
//       this.courses = data;
//     },
//   );
// }

  selectedQuiz: any; // Property to store the selected quiz
  quizOptions = [
    { label: 'Quiz 1', numberOfAttempts: 50, averageMarks: 70, averagePerformance: 'B' },
    { label: 'Quiz 2', numberOfAttempts: 40, averageMarks: 80, averagePerformance: 'B' },
    { label: 'Quiz 3', numberOfAttempts: 30, averageMarks: 60, averagePerformance: 'A' },
    { label: 'Quiz 4', numberOfAttempts: 20, averageMarks: 50, averagePerformance: 'A' },
    { label: 'Quiz 5', numberOfAttempts: 10, averageMarks: 90, averagePerformance: 'A+' },
    // Add more quizzes as needed
  ];

  onQuizChange() {
    // Update number of attempts, average marks, and average performance based on the selected quiz
    this.numberOfAttempts = this.selectedQuiz.numberOfAttempts;
    this.averageMarks = this.selectedQuiz.averageMarks;
    this.averagePerformance = this.selectedQuiz.averagePerformance;
  }
 // Method to filter courses based on the selected radio button
 filterCourses(): void {
  if (this.selectedCourseType === 'completed') {
    // Include courses with exactly 100% completion using a range check
    this.filteredCoursesList = this.CoursesList.filter((course: { coursePercentage: number; }) => Math.abs(course.coursePercentage - 100) < 0.01);
  } else {
    // Filter for in-progress or less than 100% completion
    this.filteredCoursesList = this.CoursesList.filter((course: { coursePercentage: number; }) => course.coursePercentage < 100);
  }
  console.log('Filtered Courses:', this.filteredCoursesList); // Add this line to log filtered courses
}
// Call this method when the radio button value changes
onCourseTypeChange(): void {
  this.filterCourses();
}



  get sortedComments() {
    return this.feedbackComments.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  feedbackComments: Comment[] = [
    { user: 'User1', comment: 'Great course!', date: new Date('2023-06-01'), replies: [] },
    { user: 'User2', comment: 'Very informative.', date: new Date('2023-06-02'), replies: [] },
    { user: 'User3', comment: 'Helped me a lot.', date: new Date('2023-06-03'), replies: [] },
    // Add more comments as needed
  ];

  likeComment(index: number) {
    return;
    // Implement logic to handle liking a comment
  }

  toggleReplyInput(index: number) {
    this.showReplyInput[index] = !this.showReplyInput[index];
    if (!this.showReplyInput[index]) {
      this.replyText[index] = '';
    }
  }

  sendReply(index: number) {
    const reply = this.replyText[index];
    if (reply) {
      const newReply: Reply = {
        user: this.name || 'Anonymous', // Provide a default value if this.name is null
        text: reply,
        date: new Date()
      };
      this.feedbackComments[index].replies.push(newReply);
      this.showReplyInput[index] = false;
      this.replyText[index] = '';
    }
  }

  loadCourses() {
    this.fusionService.getCourses().subscribe(data => {
      this.courses = data;
    });
  }

  onCourseChange() {
    if (this.selectedCourse) {
      // this.loadLessons();
    } else {
      this.lessons = [];
      this.selectedLesson = '';
    }
  }
getCourseByUserId(){
  this.fusionService.getCourseByUserId(this.usersId).subscribe((res)=>{
    console.log("userId",this.userId);
    console.log(res)
    this.CoursesList = res;
  })
}
  // loadLessons() {
  //   this.fusionService.getLessons(this.selectedCourse).subscribe(data => {
  //     this.lessons = data;
  //   });
  // }

  onLessonChange() {
    // Reset quiz-related data when lesson changes
    this.quizzes = [];
    this.selectedQuizId = '';
    this.showQuizList = false;
    this.showQuizResults = false;
    this.showQuizReport = false;
  }

  openQuizList() {
    this.loadQuizzes();
    this.showQuizList = true;
  }

  closeQuizList() {
    this.showQuizList = false;
  }

  loadQuizzes() {
    // TODO: Fetch quizzes for the selected lesson from a service
    this.quizzes = [
      { id: '1', name: 'Quiz 1' },
      { id: '2', name: 'Quiz 2' },
      // Add more quizzes as needed
    ];
  }

  onQuizSelect() {
    if (this.selectedQuizId) {
      this.loadQuizResults();
      this.showQuizList = false;
      this.showQuizResults = true;
    }
  }

  loadQuizResults() {
    // TODO: Fetch quiz results from a service
    this.quizResults = [
      { userName: 'John Doe', userId: 'JD001', marks: 85 },
      { userName: 'Jane Smith', userId: 'JS002', marks: 92 },
      // Add more results as needed
    ];
  }

  closeQuizResults() {
    this.showQuizResults = false;
  }

  viewQuizReport(result: any) {
    // TODO: Load detailed quiz report for the selected user
    this.showQuizResults = false;
    this.showQuizReport = true;
  }

  closeQuizReport() {
    this.showQuizReport = false;
    this.showQuizResults = true; // Go back to results table
  }

  sendGreeting() {
    if (this.greetMessage) {
      // TODO: Implement sending greeting logic
      console.log('Sending greeting:', this.greetMessage);
      this.greetMessage = ''; // Clear the message after sending
    }
  }
  //////////////////////////////Announcements//////////////////////////


  // scrollableContent = [
  //   { title: 'Title 1', description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id necessitatibus sapiente debitis mollitia facere! Nostrum iure suscipit dolorum ab aperiam quos laudantium assumenda dolorem ipsum,' },
  //   { title: 'Title 2', description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id necessitatibus sapiente debitis mollitia facere! Nostrum iure suscipit dolorum ab aperiam quos laudantium assumenda dolorem ipsum,' },
  //   { title: 'Title 3', description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id necessitatibus sapiente debitis mollitia facere! Nostrum iure suscipit dolorum ab aperiam quos laudantium assumenda dolorem ipsum,' },
  //   { title: 'Title 4', description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id necessitatibus sapiente debitis mollitia facere! Nostrum iure suscipit dolorum ab aperiam quos laudantium assumenda dolorem ipsum,' }
  // ];

  scrollableContent: { title: string, description: string , timestamp: Date}[] = [];
  newPostTitle: string = '';
  newPostDescription: string = '';

  addPost() {
    if (this.newPostTitle && this.newPostDescription) {
      this.scrollableContent.push({
        title: this.newPostTitle,
        description: this.newPostDescription,
        timestamp: new Date() 
      });
      // Clear the input fields after adding the post
      this.newPostTitle = '';
      this.newPostDescription = '';
    }
  }


  //////////////////////////quiz data///////////////////////////
  quizAttemptData = {
    userName: 'John Doe',
    quizTitle: 'Math Quiz',
    questions: [
      {
        id: 1,
        question: 'What is 2 + 2?',
        selectedOption: 'Option A',
        correctOption: 'Option B'
      },
      {
        id: 2,
        question: 'What is the capital of France?',
        selectedOption: 'Paris',
        correctOption: 'Paris'
      },
      // Add more questions as needed
    ]
  };

  openQuizReport() {
    // Simulate fetching quiz attempt data from an API or service
    // Replace with actual data retrieval logic
    // Example: this.quizAttemptData = this.quizService.getQuizAttemptData(userId, quizId);
    this.showQuizReport = true; // Display the popup
  }

  calculateOverallMarks(): number {
    let totalMarks = 0;
    if (this.quizAttemptData && this.quizAttemptData.questions) {
      this.quizAttemptData.questions.forEach((question: Question) => {
        if (question.selectedOption === question.correctOption) {
          totalMarks += 1; // Increment for correct answer
        }
      });
    }
    return totalMarks;
  }

  sendFeedback() {
    // Placeholder logic for sending feedback
    console.log('Feedback Message:', this.feedbackMessage);
    // Replace with actual API call or service method for feedback submission
    this.feedbackMessage = ''; // Clear input field after submission
  }
  // navCourse() {
  //   this.router.navigate(['/addcourse  module']);
  // }
  navCourse() {
    this.router.navigate(['/module']);
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
  deleteCoureseByCouseID(courseId:any){
    console.log(courseId)
        this.fusionService.deleteCourseById(courseId).subscribe((res)=>{
          console.log(res)
        })
  }

  // add shorts

  shortVideos: Video[] = [];
  selectedFile: File | null = null;

  onUpload(): void {
    if (this.selectedFile) {
      const userId = 1; // Replace with the actual user ID
      this.fusionService.uploadShortVideo2(userId, this.selectedFile).subscribe(
        response => {
          console.log('Video uploaded successfully:', response);
          this.loadShortVideos();
        },
        error => {
          console.error('Failed to upload short video:', error);
        }
      );
    }
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }
  loadShortVideos(): void {
    this.fusionService.getAllShortVideos2().subscribe(
      data => {
        this.shortVideos = data.map(item => this.transformToVideoFormat(item));
      },
      error => {
        console.error('Failed to load short videos:', error);
      }
    );
  }
  transformToVideoFormat(item: any): Video {
    const baseTransform: Video = {
      id: item.id,
      title: '',
      src: '',
      likes: item.shortVideoLikes || 0,
      share: item.shortVideoShareCount || 0,
      timestamp: item.createdAt || new Date().toISOString(),
      comments: [],
      showComments: false,
      liked: false,
      showShareMenu: false,
      saved: false,
      profileImage: '../../assets/MicrosoftTeams-image (1).png',
      profileName: item.user?.name || 'Unknown User',
      content: '',
      showFullContent: false,
      showShareModal: false,
      isImage: false,
      isArticle: false
    };
 
    return {
      ...baseTransform,
      title: item.shortVideoTitle || '',
      src: item.s3Url || '',
      content: item.shortVideoDescription || ''
    };
  }

  navigateToUpdateCoursID(courseId: string) {
    this.router.navigate(['/updatecourse', courseId]);
  }
 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 


 activityCourses: ActivityCourse[] = [
     { id: 1, name: 'Course 1' },
     { id: 2, name: 'Course 2' },
     { id: 3, name: 'Course 3' }
   ];
  
   termTypes = ['Short Term', 'Long Term'];
   activityModules: ActivityModule[] = [];
   activityLessons: ActivityLesson[] = [];
   activityQuizzes: ActivityQuiz[] = [];
   activityAssessments: ActivityAssessment[] = [];
   results = '';
  
   selectedActivityCourse: ActivityCourse | null = null;
   selectedTermType: string | null = null;
   selectedActivityModule: ActivityModule | null = null;
   selectedActivityLesson: ActivityLesson | null = null;
   selectedQuizOrAssessment: 'quiz' | 'assessment' | null = null;
   selectedActivityQuiz: ActivityQuiz | null = null;
   selectedActivityAssessment: ActivityAssessment | null = null;

  
   onQuizOrAssessmentChange(event: Event) {
     const selectElement = event.target as HTMLSelectElement;
     this.selectedQuizOrAssessment = selectElement.value as 'quiz' | 'assessment';
     this.resetResults();
  
     if (this.selectedActivityLesson) {
       if (this.selectedQuizOrAssessment === 'quiz') {
         this.fetchActivityQuizzes(this.selectedActivityLesson.id);
       } else {
         this.fetchActivityAssessments(this.selectedActivityLesson.id);
       }
     }
   }
  
   resetSelections() {
     this.selectedActivityModule = null;
     this.resetLessonAndBelow();
   }
  
   resetLessonAndBelow() {
     this.selectedActivityLesson = null;
     this.resetQuizAndAssessment();
   }
  
   resetQuizAndAssessment() {
     this.selectedQuizOrAssessment = null;
     this.selectedActivityQuiz = null;
     this.selectedActivityAssessment = null;
     this.resetResults();
   }
  
   resetResults() {
     this.results = '';
   }
  
   fetchActivityModules(courseId: number) {
     // Mock data
     this.activityModules = [
       { id: 1, name: 'Module 1', courseId: courseId },
       { id: 2, name: 'Module 2', courseId: courseId },
       { id: 3, name: 'Module 3', courseId: courseId },
     ];
   }
  
   fetchActivityLessons(courseId?: number, moduleId?: number) {
     // Mock data
     if (courseId) {
       this.activityLessons = [
         { id: 1, name: 'Lesson 1', courseId: courseId },
         { id: 2, name: 'Lesson 2', courseId: courseId },
         { id: 3, name: 'Lesson 3', courseId: courseId },
       ];
     } else if (moduleId) {
       this.activityLessons = [
         { id: 4, name: 'Lesson 1', moduleId: moduleId },
         { id: 5, name: 'Lesson 2', moduleId: moduleId },
         { id: 6, name: 'Lesson 3', moduleId: moduleId },
       ];
     }
   }
  
   fetchActivityQuizzes(lessonId: number) {
     // Mock data
     this.activityQuizzes = [
       { id: 1, name: 'Quiz 1', lessonId: lessonId },
       { id: 2, name: 'Quiz 2', lessonId: lessonId },
       { id: 3, name: 'Quiz 3', lessonId: lessonId },
     ];
   }
  
   fetchActivityAssessments(lessonId: number) {
     // Mock data
     this.activityAssessments = [
       { id: 1, name: 'Assessment 1', lessonId: lessonId },
       { id: 2, name: 'Assessment 2', lessonId: lessonId },
       { id: 3, name: 'Assessment 3', lessonId: lessonId },
     ];
   }
  
   fetchResults(type: 'quiz' | 'assessment', id: number) {
     this.results = `Results for ${type} ${id}`;
   }
  
  
   activityResults = true; // Set to true for demonstration
   showActivityQuizResults = false;
   showActivityQuizReport = false;
   activityQuizResults: ActivityQuizResult[] = [
     { userName: 'John Doe', userId: 'JD001', marks: 80 },
     { userName: 'Jane Smith', userId: 'JS002', marks: 75 },
     { userName: 'Bob Johnson', userId: 'BJ003', marks: 90 }
   ];
   activityQuizAttemptData: ActivityQuizAttemptData = {
     userName: '',
     quizTitle: '',
     questions: []
   };
   activityFeedbackMessage = '';

   getUserIdFromLocalStorage(): string | null {
     return localStorage.getItem('userId');
   }
  
  
  
  




fetchCourseData(courseId: number): void {
    this.fusionService.fetchCourseByUserId(courseId, this.userId).subscribe(
      (response: any) => {
        console.log('Course data fetched:', response);
        this.courseTitle = response.courseTitle;
        this.level = response.level;
        this.courseDescription = response.courseDescription;
        this.language = response.language;
        this.courseDuration = response.courseDuration;
        this.courseType = response.courseType;
 
        this.level_1 = response.level_1;
        this.level_2 = response.level_2;
        this.level_3 = response.level_3;
        this.level_4 = response.level_4;
        this.level_5 = response.level_5;
        this.level_6 = response.level_6;
        this.level_7 = response.level_7;
        this.level_8 = response.level_8;
 
        if (response.courseImage) {
          this.courseImage = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${response.courseImage}`);
        }
 
        this.onFieldChange();
      },
      (error: any) => {
        console.error('Error fetching course data:', error);
      }
    );
  }
  onFieldChange() {
    // Logic based on the fetched course data
    console.log('Field change triggered: ', {
      title: this.courseTitle,
      level: this.level,
      description: this.courseDescription,
      language: this.language,
      duration: this.courseDuration,
      type: this.courseType,
    });
   
    // Additional logic can be added here as needed
  }
  onActivityCourseChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const courseId = +selectElement.value;
    this.selectedActivityCourse = this.activityCourses.find(course => course.id === courseId) || null;
    this.resetSelections();
 
    if (this.selectedActivityCourse) {
      this.fetchCourseData(this.selectedActivityCourse.id);
    }
  }
  
 
  onTermTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedTermType = selectElement.value;
    this.resetSelections();
 
    if (this.selectedActivityCourse) {
      if (this.selectedTermType === 'Short Term') {
        this.fetchActivityLessons(this.selectedActivityCourse.id);
      } else {
        this.fetchActivityModules(this.selectedActivityCourse.id);
      }
    }
  }
 
  onActivityModuleChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const moduleId = +selectElement.value;
    this.selectedActivityModule = this.activityModules.find(module => module.id === moduleId) || null;
    this.resetLessonAndBelow();
 
    if (this.selectedActivityModule) {
      this.fetchActivityLessons(undefined, moduleId);
    }
  }
 
  onActivityLessonChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const lessonId = +selectElement.value;
    this.selectedActivityLesson = this.activityLessons.find(lesson => lesson.id === lessonId) || null;
    this.resetQuizAndAssessment();
  }
  onActivityQuizChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const quizId = +selectElement.value;
    this.selectedActivityQuiz = this.activityQuizzes.find(quiz => quiz.id === quizId) || null;
    this.fetchResults('quiz', quizId);
  }
 
  onActivityAssessmentChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const assessmentId = +selectElement.value;
    this.selectedActivityAssessment = this.activityAssessments.find(assessment => assessment.id === assessmentId) || null;
    this.fetchResults('assessment', assessmentId);
  }
 
  openActivityQuizResults() {
    this.showActivityQuizResults = true;
  }
 
  closeActivityQuizResults() {
    this.showActivityQuizResults = false;
  }
 
  openActivityQuizReport(result: ActivityQuizResult) {
    this.showActivityQuizReport = true;
    this.showActivityQuizResults = false; // Close the results popup
    // Simulating fetching quiz attempt data
    this.activityQuizAttemptData = {
      userName: result.userName,
      quizTitle: 'Sample Activity Quiz',
      questions: [
        { question: 'What is 2+2?', selectedOption: '4', correctOption: '4' },
        { question: 'What is the capital of France?', selectedOption: 'Paris', correctOption: 'Paris' },
        { question: 'Who wrote Romeo and Juliet?', selectedOption: 'Shakespeare', correctOption: 'Shakespeare' }
      ]
    };
  }
  closeActivityQuizReport() {
    this.showActivityQuizReport = false;
    this.showActivityQuizResults = true; // Reopen the results popup
  }
 
  calculateActivityOverallMarks(): number {
    return this.activityQuizAttemptData.questions.filter(q => q.selectedOption === q.correctOption).length;
  }
 
  sendActivityFeedback() {
    console.log('Sending activity feedback:', this.activityFeedbackMessage);
    this.activityFeedbackMessage = '';
    // Implement actual feedback sending logic here
  }
  ////////////////////////////newly added content////////////////////////////////////////////////////////
  totalCourses: any;
  activeStudents:any;
  upcomingClasses: any;
  pendingAssignments: any;
 
  // Mock data for charts
  courseDistribution = [
    { name: 'Course A', students: 30 },
    { name: 'Course B', students: 25 },
    { name: 'Course C', students: 20 },
    { name: 'Course D', students: 35 },
    { name: 'Course E', students: 10 }
  ];
 
  upcomingClassesList = [
    { name: 'Introduction to Angular', date: '2024-07-12', time: '10:00 AM' },
    { name: 'Advanced CSS Techniques', date: '2024-07-13', time: '2:00 PM' },
    { name: 'Web Security Fundamentals', date: '2024-07-14', time: '11:00 AM' }
  ];
   ////////////////////////////newly added content////////////////////////////////////////////////////////
  //  fetchEnrollments(): void {
  //   this.fusionService.getAllEnrollments()
  //     .subscribe(
  //       enrollments => {
  //         this.enrollments = enrollments;
  //         console.log('All Enrollments:', this.enrollments);
  //       },
  //       error => {
  //         console.error('Error fetching enrollments:', error);
       
  //       }
  //     );
  // }
//   getenrolment(coursseID:any){
   
//  this.http.get(`${environment.apiBaseUrl}/course/enrollments/`+coursseID).subscribe(  (res) => {
//       this.enrollmentCount = res;
//       console.log("Enrollment count:", );
     
     
//       })
//       return this.enrollmentCount.length;
//   }
 
 
 
 
getCurrentUserId(): number {
  // Implement this method to return the current user's ID
  // This could be from a user service or stored in local storage
  return this.userId; // Placeholder - replace with actual user ID retrieval
  console.log(this.userId);
}
 
 
 
// fetchEnrollment(userId: number, courseId: number): void {
//   this.fusionService.getEnrollmentByUserAndCourse(userId, courseId)
//     .subscribe(
//       data => {
//         console.log('Enrollment Data:', data);
//       },
//       error => {
//         console.error('Error fetching enrollment data', error);
//       }
//     );
// }
fetchCoursesAndEnrollments() {
  this.fusionService.getCourses().subscribe(
    (courses) => {
      this.CoursesList = courses;
      this.fetchEnrollmentsForCourses();
    },
    (error) => {
      console.error('Error fetching courses:', error);
    }
  );
}
fetchEnrollmentsForCourses() {
  this.CoursesList.forEach(course => {
    this.fusionService.getCourseEnrollments(course.id).subscribe(
      (enrollments) => {
        this.enrollmentData[course.id] = enrollments;
        console.log(`Enrollments for course ${course.courseTitle}:`, enrollments);
      },
      (error) => {
        console.error(`Error fetching enrollments for course ${course.id}:`, error);
      }
    );
  });
}
getEnrollmentCount(courseId: number): number {
  return this.enrollmentData[courseId]?.length || 0;
}
 
navigateToProfile() {
  this.router.navigate(['/profile'])
}

user:any;
originalImage: SafeUrl | null = null; // Store the original image URL
userDescription:any;

fetchUserDetails(): void {
  const userId = localStorage.getItem('id');
  if (userId) {
    this.fusionService.getUserById(userId).subscribe({
      next: (data) => {
        this.user = data;
        this.userId = data.id; // Set userId based on fetched user data
        this.role = data.role;
        this.userDescription = data.userDescription;

        // Create SafeUrl for user image
        if (data.userImage) {
          const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${data.userImage}`);
          this.userImage = sanitizedUrl;
          this.originalImage = sanitizedUrl; // Set original image
        }
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      }
    });
  } else {
    console.error('User ID not found in local storage');
  }
}


getDashboardOverview(userId: number): void {
   
  this.fusionService.getOverview(userId).subscribe(
    (data: any) => {
      console.log('Dashboard Overview:', data);
      this.activeStudents = data.activeStudents;
      this.pendingAssignments = data.pendingAssignments;
      this.totalCourses = data.totalCourses;
      this.upcomingClasses = data.upcomingClasses;
    
    },
    error => {
      console.error('Error fetching dashboard overview', error);
    }
  );
}


}

 
 
 
 
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AssignmentDetailsComponent } from '../assignment-details/assignment-details.component';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Fusion2Service } from '../fusion2.service';
import { FormsModule } from '@angular/forms';
interface Activity {
  id: number;
  name: string;
  type: 'quiz' | 'assignment' | 'project';
  status: 'not_started' | 'in_progress' | 'completed';
  dueDate: Date;
  progress: number;
}
export interface Project {
  projectDeadline: Date;
  projectId: any;
  courseTitle: string;
  course: any;
  id: number;
  projectTitle: string;
  name: string;
  description: string;
  projectDescription: any;
  gitUrl: any;
  maxTeam: number;
  startDate: Date;
  reviewMeetDate: Date;
  projectDocument: any;
  status: string; // Add this line
  sno?: number;
 
}
 
 
interface Course {
  id: number;
  name: string;
  progress: number;
  activities: Activity[];
}
interface ProgressCache {
  [key: string]: {
    value: number | string;
    timestamp: number;
  };
}
interface Assignment {
  sno: number;
  lessonId:number;
  id:any;
  courseTitle: string;
  assignmentTitle: string;
  status: string;
  assignmentId: number;
}
/////////////////////////////////
export interface LessonModule {
  id: number;
  moduleName: string;
  // Add other fields as needed
}
export interface Lesson {
  id: number;
  lessonTitle: string;
  content: string;
  description: string;
  duration: number;
  // Add other fields as needed
}
export interface Quiz {
  id: number;
  courseTitle: string;
  lessonTitle: string;
  quizTitle: string;
  status: string;
}
 
// export interface QuizProgressDetails {
//   courseTitle: string;
//   quizTitle: string;
//   quizzes: Quiz[];
//   progressPercentage: number;
//   completedQuizzesCount: number;
//   totalQuizzesCount: number;
// }
interface QuizProgressDetails {
  courseTitle: string;
  lessonTitle: string;
  quizzes: Array<{
    quizId: string;
    courseTitle: string;
    lessonTitle: string;
    quizTitle: string;
    status: string;
  }>;
  progressPercentage: number;
  submittedQuizzesCount: number;
  totalQuizzesCount: number;
  unsubmittedQuizzesCount: number;
}
 
interface Assignment2 {
  id: number;
  title: string;
  status: string;
  disabled: boolean;
}
 
interface ProgressDetails {
  courseTitle: string;
  lessonTitle: string;
  assignments: Assignment2[]; // List of assignments with status
  progressPercentage: number; // Calculated based on submission counts
  submittedAssignmentsCount: number; // Number of submitted assignments
  totalAssignmentsCount: number; // Total assignments for the lesson
  unsubmittedAssignmentsCount: number; // Unsubmitted assignments count
  submittedAssignmentIds: number[]; // IDs of the submitted assignments
  lessonId:number;
}
export interface Project2 {
  projectId:any;
  id: number;
  courseTitle: string;
  projectTitle: string;
  status: string;
}

export interface ProjectProgressDetails2 {
  courseTitle: string;
  projects: Project2[];
  progress: number;  // Changed from progressPercentage to progress
  completedProjectsCount: number;
  totalProjectsCount: number;
}
 
@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule ,AssignmentDetailsComponent, MatProgressBarModule,  MatCardModule,  MatOptionModule,
    MatSelectModule,FormsModule, MatIconModule, MatListModule,MatToolbarModule,HttpClientModule],
  templateUrl: './candidate-dashboard.component.html',
  styleUrl: './candidate-dashboard.component.css',
 
})
export class CandidateDashboardComponent implements OnInit {
  courseDetails: any;
  projects: Project[] = [];
  assessments: any[] = [];
 
  // projectProgress: number = 0;
  individualQuizzes: { sno: number; courseTitle: string; quizTitle: string; quizId: number; courseId: number; quizStatus: string; }[] = [];
  courseProgressMap: { [key: number]: number } = {};
  courseProgress: number = 0;  // Add this line
 
  quizProgressMap: { [key: number]: number } = {};
  assessmentProgressMap: { [key: number]: number } = {};
  projectProgressMap: { [key: number]: number } = {};
 
  private cache: ProgressCache = {};
  userId: any;
  activityType: string | null = null;
 
  // userId: string | null = null;
  // quizzes: any[] = [];
  quizzes: Array<{
    quizId: number;
    quizTitle: string;
    quizDate: Date;
  }> = [];
 
  param1: any;
  courseId: any;
  lessonId: number = 0; // or any other default value
  individualAssignments: Assignment[] = [];
  individualProjects: Project[] = [];
  id: any;
  CourseId: any;
  courseById: any;
  activityView: 'course' | 'individual' = 'course';
  individualQuizProgress: number = 0;
  individualAssignmentProgress: number = 0;
  individualProjectProgress: number = 0;
  // individualQuizzes: any[] = [];
  // individualQuizzes: Array<{
  //   sno: number;
  //   courseTitle: string;
  //   quizTitle: string;
  // }> = [];
  // individualAssignments: any[] = [];
  // individualAssignments: Array<{
  //   sno: number;
  //   courseTitle: string;
  //   assignmentTitle: string;
  // }> = [];
  // individualProjects: any[] = [];
  // individualProjects: Array<{
  //   sno: number;
  //   courseTitle: string;
  //   projectTitle: string;
  // }> = [];
 
  projectProgressDetails: ProjectProgressDetails2 = {
      courseTitle: '',
      projects: [],
      progress: 0,
      completedProjectsCount: 0,
      totalProjectsCount: 0
    };
   
    isLoading: boolean = true;
    error: string | null = null;
  teachairId: any;
    getProgressPercentage(): number {
      return (this.projectProgressDetails.progress || 0);
    }
   
    getProgressBarWidth(): string {
      return `${this.getProgressPercentage()}%`;
    }
  constructor(private http: HttpClient,private cdr: ChangeDetectorRef, private router: Router,private route: ActivatedRoute,private fusion2Service: Fusion2Service) {}
 
  ngOnInit(): void {
    this.userId = localStorage.getItem('id');
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.activityType = params.get('activityType');
 
      this.courseId = id ? +id : null;
      this.getCourseMentor(this.courseId)
      this.fetchAssignmentProgress();
      this.fetchProjectProgress();
      
      // this.fetchQuizProgress(this.teachairId);
      // this.loadProjectProgress3();
 
 
 
 
 
      if (this.courseId !== null && this.userId) {
        this.loadCourseDetails();
        this.loadCourseProgress();
        this.loadProjects();
        this.loadProjectProgress();
        this.loadQuizzes();
        this.loadQuizProgress();
        this.loadAssessments(); // Add this line to load assessments
        this.loadAssessmentProgress();
        this.fetchAssignmentProgress();
        this.fetchProjectProgress();
        
        this.loadLessonModules();
        this.loadAssignmentModules();
        this.loadLessonModules();
        this.loadAssignmentModules();
        this.loadProjectProgress3();
        this.loadLessonsByCourseId(this.courseId)
 
 
 
 
 
 
      } else {
        console.error('No valid course ID or user ID provided');
      }
    });
  }

loadAllData(): void {
    this.isLoading = true;
    this.error = null;
 
    Promise.all([
      this.loadCourseDetails(),
      this.loadProjectProgress3(),
      // Add other data loading methods here
    ]).then(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    }).catch(error => {
      console.error('Error loading data:', error);
      this.error = 'Failed to load data. Please try again.';
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }
 
  updateProgressMap(courseId: number, progress: number, map: any) {
    if (progress >= 0 && progress <= 100) {
      map[courseId] = progress;
      this.cdr.detectChanges(); // Ensure Angular detects changes
    } else {
      console.error('Invalid progress value:', progress);
    }
  }
  getActivityStatus(progress: number): string {
    if (progress === 0) {
      return 'Not yet started';
    } else if (progress > 0 && progress < 100) {
      return 'Continue';
    } else {
      return 'Completed';
    }
  }
 
  getStatusClass(progress: number): string {
    if (progress === 0) {
      return 'status-not-started';
    } else if (progress > 0 && progress < 100) {
      return 'status-continue';
    } else {
      return 'status-completed';
    }
  }
 
  getButtonText(progress: number): string {
    if (progress === 0) {
      return 'Start';
    } else if (progress > 0 && progress < 100) {
      return 'Continue';
    } else {
      return 'completed';
    }
  }
  private getCachedValue(key: string): number | string | null {
    const cachedItem = this.cache[key];
    if (cachedItem && Date.now() - cachedItem.timestamp < 300000) { // 5 minutes cache
      return cachedItem.value;
    }
    return null;
  }
 
  private setCachedValue(key: string, value: number | string): void {
    this.cache[key] = {
      value: value,
      timestamp: Date.now()
    };
  }
 
 
  loadAllProgress(): void {
    this.courseDetails.forEach((course:any) => {
      this.getCourseProgress(course.id);
      this.getQuizProgress(course.id);
      this.getAssessmentProgress(course.id);
      // this.getProjectProgress(course.id);
    });
  }
 
  getCourseProgress(courseId: number): number {
    const cacheKey = `courseProgress_${courseId}`;
    const cachedValue = this.getCachedValue(cacheKey);
    if (cachedValue !== null) {
      this.courseProgressMap[courseId] = cachedValue as number;
      return cachedValue as number;
    }
 
    this.http.get<string>(`${environment.apiBaseUrl}/video/progress/percentage/user/${this.userId}/course/${courseId}`).subscribe(
      (progress) => {
        const [numerator, denominator] = progress.split('/');
        const percentage = (parseInt(numerator) / parseInt(denominator)) * 100;
        this.setCachedValue(cacheKey, percentage);
        this.courseProgressMap[courseId] = percentage;
        console.log(this.courseProgressMap[courseId],"progress")
      },
      (error) => {
        console.error('Error fetching course progress:', error);
        this.courseProgressMap[courseId] = 0;
      }
    );
 
    return this.courseProgressMap[courseId] || 0;
  }
  getCourseMentor(courseID:any){
    this.http.get(`${environment.apiBaseUrl}/course/getBy/${courseID}`).subscribe((res:any)=>{
      this.teachairId = res.user.id;
      console.log(this.teachairId,"teachairID")
      this.fetchQuizProgress(this.teachairId);
    })
  }
 
  getQuizProgress(courseId: number): number {
    const cacheKey = `quizProgress_${courseId}`;
    const cachedValue = this.getCachedValue(cacheKey);
    if (cachedValue !== null) {
      this.quizProgressMap[courseId] = cachedValue as number;
      return cachedValue as number;
    }
 
    this.http.get(`${environment.apiBaseUrl}/api/quizzes/progress/ratio/user/${this.userId}/lessonModule/${courseId}`, { responseType: 'text' }).subscribe(
      (progress) => {
        const [numerator, denominator] = progress.split('/');
        if (denominator == '0'){
          this.quizProgressMap[courseId] = 0;
        } else{
          const percentage = (parseInt(numerator) / parseInt(denominator)) * 100;
        console.log(percentage,"percentage")
        this.setCachedValue(cacheKey, percentage);
        this.quizProgressMap[courseId] = percentage;
      
        console.log(this.quizProgressMap[courseId],"progressssbar-----------")
         
        }
       
      },
      (error) => {
        console.error('Error fetching quiz progress:', error);
        this.quizProgressMap[courseId] = 0;
      }
    );
 
    return this.quizProgressMap[courseId] || 0;
  }
 
  getAssessmentProgress(courseId: number): number {
    const cacheKey = `assessmentProgress_${courseId}`;
    const cachedValue = this.getCachedValue(cacheKey);
    if (cachedValue !== null) {
      this.assessmentProgressMap[courseId] = cachedValue as number;
      return cachedValue as number;
    }
 
    this.http.get(`${environment.apiBaseUrl}/submittedByTotal/${courseId}?userId=${this.userId}`, { responseType: 'text' }).subscribe(
      (progress) => {
        const [numerator, denominator] = progress.split('/');
        const percentage = (parseInt(numerator) / parseInt(denominator)) * 100;
        this.setCachedValue(cacheKey, percentage);
        this.assessmentProgressMap[courseId] = percentage;
        console.log()
      },
      (error) => {
        console.error('Error fetching assessment progress:', error);
        this.assessmentProgressMap[courseId] = 0;
      }
    );
 
    return this.assessmentProgressMap[courseId] || 0;
  }
 
 
 
  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in_progress': return '#FFC107';
      case 'not_started': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  }
 
  getActivityIcon(type: string): string {
    switch (type) {
      case 'quiz': return 'fa-question-circle';
      case 'assignment': return 'fa-tasks';
      case 'project': return 'fa-project-diagram';
      default: return 'fa-file';
    }
  }
 
  // startActivity(courseId: number): void {
  //   this.router.navigate(['/activity', courseId]);
  // }
 
  navigate(courseId: any): void {
    // this.router.navigate(['/activity', courseId]);
  }
  startActivity(courseId: number, activityType: string): void {
    alert(activityType)
    // You can use the activityType to navigate to the specific activity
    this.router.navigate(['/activity', courseId, activityType]);
  }
 
  loadCourseDetails() {
    if (this.courseId === null) {
      console.error('Attempting to load course details with null ID');
      return;
    }
    this.fusion2Service.getCourseById(this.courseId).subscribe(
      (course: Course) => {
        this.courseDetails = course;
        this.initializeProgressMaps();
        console.log('Course details:', this.courseDetails);
      },
      error => {
        console.error('Error fetching course details:', error);
      }
    );
  }
 
  initializeProgressMaps() {
    if (this.courseDetails) {
      this.courseProgressMap[this.courseDetails.id] = 0;
      this.quizProgressMap[this.courseDetails.id] = 0;
      this.assessmentProgressMap[this.courseDetails.id] = 0;
      this.projectProgressMap[this.courseDetails.id] = 0;
      // You might want to calculate these values based on actual progress data
    }
  }
  loadCourseProgress() {
    if (this.courseId === null || this.userId === null) {
      console.error('Attempting to load course progress with null courseId or userId');
      return;
    }
    this.fusion2Service.getCourseProgressByLesson(this.userId, this.courseId).subscribe(
      (progress: number) => {
        const percentage = Math.max(0, Math.min(progress, 100));
        this.updateProgressMap(this.courseId, percentage, this.courseProgressMap);
        this.courseProgress = percentage;
        console.log('Course progress updated123:', percentage);
      },
      error => {
        console.error('Error fetching course progress:', error);
        this.updateProgressMap(this.courseId, 0, this.courseProgressMap);
        this.courseProgress = 0;
      }
    );
  }
  loadProjects(): void {
    if (this.courseId === null) {
      console.error('Course ID is null');
      return;
    }
 
    this.fusion2Service.getProjectsByCourse(this.courseId).subscribe(
      (projects: any[]) => { // Use 'any' type for the raw response
        this.projects = projects.map(project => ({
          ...project,
          projectDeadline: new Date(project.projectDeadline), // Convert to Date object
          startDate: new Date(project.startDate),
          reviewMeetDate: new Date(project.reviewMeetDate)
        }));
        console.log('Projects loaded:', this.projects);
      },
      error => {
        console.error('Error fetching projects:', error);
      }
    );
  }
 
 
  // Method to format deadline
  formatDate(deadline: any): string {
    // Assuming deadline is an array or object with date information
    let date = new Date(deadline); // Convert to Date object
    return date.toLocaleDateString(); // Format the date
  }
  // goToProjectDetails(courseId: any,activityType:any): void {
  //   console.log('Navigating to project with ID:', courseId,activityType);
  //   if (courseId) {
  //     this.router.navigate(['/activity', courseId, activityType]);
  //       } else {
  //     console.error('Invalid projectId:', courseId);
  //   }
  // }
  loadProjectProgress(): void {
    if (this.courseId === null || this.userId === null) {
      console.error('Attempting to load project progress with null courseId or userId');
      return;
    }
    this.fusion2Service.getProjectProgress(this.courseId, +this.userId).subscribe(
      (progress: number) => {
        const percentage = Math.max(0, Math.min(progress * 100, 100)); // Convert to percentage and clamp between 0 and 100
        this.updateProgressMap(this.courseId, percentage, this.projectProgressMap);
        console.log('Project progress updated:', percentage);
      },
      error => {
        console.error('Error fetching project progress:', error);
        this.updateProgressMap(this.courseId, 0, this.projectProgressMap);
      }
    );
  }
  loadQuizzes(): void {
    if (this.courseId === null) {
      console.error('Course ID is null');
      return;
    }
 
    this.fusion2Service.getQuizzesByCourse(this.courseId).subscribe(
      (quizzes: any[]) => {
        this.quizzes = quizzes.map(quiz => ({
          quizId: quiz.id, // Assuming there's an id field
          quizTitle: quiz.quizName, // Assuming there's a title field
          quizDate: quiz.createdAt // Assuming there's a date field
        }));
        console.log('Quizzes loaded:', this.quizzes);
      },
      error => {
        console.error('Error fetching quizzes:', error);
      }
    );
  }
  goToQuizDetails(quizId: number,courseId:any): void {
    // Define the activity type, which in this case is 'quiz'
    console.log(quizId,"quizId---------")
    const activityType = 'quiz';
    this.router.navigate(['/activity',courseId,"course","quiz",quizId])
    // Navigate with both id (quizId) and activityType
    // this.router.navigate(['/activity', quizId, activityType]);
  }
  
 
  loadQuizProgress(): void {
    if (this.courseId === null || this.userId === null) {
      console.error('Course ID or User ID is null');
      return;
    }
 
    this.fusion2Service.getQuizProgress(+this.userId, this.courseId).subscribe(
      (progress: number) => {
        const percentage = Math.max(0, Math.min(progress, 100)); // Clamp between 0 and 100
        this.quizProgressMap[this.courseId] = percentage;
        this.cdr.detectChanges(); // Ensure Angular detects changes
        console.log('Quiz progress updated:', percentage);
      },
      error => {
        console.error('Error fetching quiz progress:', error);
        this.quizProgressMap[this.courseId] = 0;
      }
    );
  }
  goToAssessmentDetails(assessmentId: any): void {
    this.router.navigate(['/assessment-details', assessmentId]);
  }
  loadAssessments(): void {
    if (this.courseId === null || this.userId === null) {
      console.error('Course ID or User ID is null');
      return;
    }
 
    this.fusion2Service.getAssessmentsByCourse(this.userId, this.courseId).subscribe(
      (assessments: any[]) => {
        this.assessments = assessments.map(assessment => ({
          ...assessment,
          dueDate: new Date(assessment.dueDate)
        }));
        console.log('Assessments loaded:', this.assessments);
      },
      error => {
        console.error('Error fetching assessments:', error);
      }
    );
  }
  goToAssignmentDetails2(assignmentId: number,courseId:any): void {
    // Define the activity type, which in this case is 'assignment'
    const activityType = 'assessment';
        console.log(assignmentId)
    // Navigate with both id (assignmentId) and activityType
    this.router.navigate(['/activity',courseId,"course",activityType,assignmentId])
    // this.router.navigate(['/activity', assignmentId, activityType]);
    // console.log('Navigating to assignment details for ID:', assignmentId, 'and type:', activityType);
    // console.log(`Navigating to assignment with ID: ${assignmentId}`);
 
  }
  goToAssignmentDetails(assignments: any, courseId: any,assignmentDetails:any): void {
    console.log(assignments,assignmentDetails)
    const lessondId = assignmentDetails.lessonId
    const assignment = this.individualAssignments.find(a => a.sno === assignments.id);
    console.log(assignments)
    localStorage.setItem('lessonId',lessondId)
   
    

    if (assignments && assignments.status !== 'Completed') {
      const activityType = 'assessment';
      console.log(assignments.id);
      this.router.navigate(['/activity', courseId, "course", activityType, assignments.id]);
    }
  }
  goToAssignmentDetailsind(assignmentId: number,courseId:any): void {
    // Define the activity type, which in this case is 'assignment'
    const activityType = 'assessment';
        console.log(assignmentId)
    // Navigate with both id (assignmentId) and activityType
    this.router.navigate(['/activity',courseId,"individual",activityType,assignmentId])
    // this.router.navigate(['/activity', assignmentId, activityType]);
    // console.log('Navigating to assignment details for ID:', assignmentId, 'and type:', activityType);
    // console.log(`Navigating to assignment with ID: ${assignmentId}`);
 
  }
 
  loadAssessmentProgress(): void {
    if (this.courseId === null || this.userId === null) {
      console.error('Course ID or User ID is null');
      return;
    }
 
    this.fusion2Service.getAssessmentProgress(+this.userId, this.courseId).subscribe(
      (response: { progressPercentage?: number }) => {
        const progress = response.progressPercentage || 0;
        const percentage = Math.max(0, Math.min(progress, 100)); // Clamp between 0 and 100
        this.assessmentProgressMap[this.courseId] = percentage;
        this.cdr.detectChanges(); // Ensure Angular detects changes
        console.log('Assessment progress updated:', percentage);
      },
      error => {
        console.error('Error fetching assessment progress:', error);
        this.assessmentProgressMap[this.courseId] = 0;
      }
    );
  }
  onActivityViewChange(): void {
    console.log('Activity view changed to:', this.activityView);
    if (this.activityView === 'individual') {
      this.fetchAssignmentProgress();
    }
  }
  startIndividualActivity(type: string) {
    console.log('Starting individual activity:', type);
  }
 
  // goToIndividualQuizDetails(quizId: number,courseId:any): void {
  //   // console.log(activity,projectId,"ProjectId======")
  //   // Implement navigation to project details page
  //   this.router.navigate(['/activity',courseId,"course","individual",quizId])
  //   // console.log('Navigating to project details:', projectId);
  // }
  goToIndividualAssignmentDetails(assignmentId: number): void {
    console.log('Navigating to individual assignment:', assignmentId);
  }
 
  goToIndividualProjectDetails2(projectId: number,courseID:any): void {
    // console.log(activity,projectId,"ProjectId======")
    // Implement navigation to project details page
    this.router.navigate(['/activity',courseID,"course","individual",projectId])
    console.log('Navigating to project details:', projectId);
    console.log('Navigating to individual project:', projectId);
  }
  goToIndividualProjectDetails(projectId: number, courseId: any): void {
    const project = this.individualProjects.find(p => p.sno === projectId);
    if (project && project.status !== 'Completed') {
      const activityType = 'project';
      console.log(projectId);
      this.router.navigate(['/activity', courseId, "course", activityType, projectId]);
    }
  }
  fetchAssignmentProgress() {
    if (this.courseId === null || this.userId === null) {
      console.error('Course ID or User ID is null');
      return;
    }
  
    this.fusion2Service.getAssignmentProgress(this.userId, this.courseId).subscribe(
      (response: Map<string, any>) => {
        console.log('individual course by Assignment Progress Response:', response);
  
        const courseTitle = response.get('courseTitle') || 'N/A';
       
        const assignments = response.get('assignments') || [];
        
      
        this.individualAssignmentProgress = response.get('progressPercentage') || 0;
  
        this.individualAssignments = assignments.map((assignment: any, index: number) => ({
          sno: index + 1,
          id:assignment.assignment_id,
          courseTitle: courseTitle,
          assignmentTitle: assignment.assignmentTitle,
          status: assignment.status
        }));
  
        console.log('Processed Individual Assignments:', this.individualAssignments);
  
        this.cdr.detectChanges(); // Ensure the view updates
      },
      (error) => {
        console.error('Error fetching assignment progress:', error);
        this.individualAssignmentProgress = 0;
        this.individualAssignments = [];
      }
    );
  }

  fetchProjectProgress() {
    if (this.courseId === null || this.userId === null) {
      console.error('Course ID or User ID is null');
      return;
    }
  
    this.fusion2Service.getProjectProgress2(this.userId, this.courseId).subscribe(
      (response: Map<string, any>) => {
        console.log('individual by course Project Progress IBP:', response);
  
        const courseTitle = response.get('courseTitle') || 'N/A';
    
        const projects = response.get('projects') || [];
       
   
        this.individualProjectProgress = response.get('progressPercentage') || 0;
  
        this.individualProjects = projects.map((project: any, index: number) => ({
          sno: index + 1,
          courseTitle: courseTitle,
          projectTitle: project.projectTitle,
          status: project.status
        }));
  
        console.log('Processed Individual Projects:', this.individualProjects);
  
        this.cdr.detectChanges(); // Ensure the view updates
      },
      (error) => {
        console.error('Error fetching project progress:', error);
        this.individualProjectProgress = 0;
        this.individualProjects = [];
      }
    );
  }
  goToIndividualQuizDetails(quizId: number, courseId: any): void {
    console.log(quizId, "quizId---------")
   
    // this.router.navigate(['/activity',courseId,"individual",activityType,assignmentId])
    this.router.navigate(['/activity', courseId, "individual", "quiz", quizId])
  }
  fetchQuizProgress(teacherId:any) {
    console.log(teacherId,"teachairID--")
    if (this.courseId === null || this.userId === null) {
      console.error('Course ID or User ID is null');
      return;
    }
    this.fusion2Service.getQuizProgress2(this.userId, this.courseId,teacherId).subscribe(
      (response: Map<string, any>) => {
        console.log('Quiz Progress:', response);
        // Update quiz progress
        this.individualQuizProgress = response.get('progressPercentage') || 0;
        
        // Extract course title and quiz titles
        const courseTitle = response.get('quizzes')[0].courseTitle || 'N/A';
        const quizzes = response.get('quizzes') || [];
        
        // Create individual quizzes array
        this.individualQuizzes = quizzes.map((quiz: any, index: number) => ({
          sno: index + 1,
          courseTitle: courseTitle,
          quizTitle: quiz.quizTitle,
          quizId: quiz.quizId, // Assuming 'id' is the property name for quiz ID
          courseId: this.courseId, // Use the courseId from the component
          quizStatus: quiz.quizStatus // Assuming 'status' is the property name for quiz status
        }));
        console.log(this.individualQuizzes, "individualQuizzes")
        this.cdr.detectChanges(); // Ensure the view updates
      },
      (error) => {
        console.error('Error fetching quiz progress:', error);
        this.individualQuizProgress = 0;
        this.individualQuizzes = [];
      }
    );
  }
  //////////////////////////////////////////////////////////////
  lessonModules: LessonModule[] = [];
  lessons: Lesson[] = [];
  quizzes2: Quiz[] = [];
  assignments: Assignment2[] = [];
  selectedModuleId: number | null = null;
  selectedLessonId: number | null = null;
  assignmentModules: any[] = [];
  assignmentLessons: any[] = [];
  selectedAssignmentModuleId: number | null = null;
  selectedAssignmentLessonId: number | null = null;
  // progressDetails: any = {};
  progressDetails: ProgressDetails = {
    courseTitle: '',
    lessonTitle: '',
    assignments: [],
    progressPercentage: 0,
    submittedAssignmentsCount: 0,
    totalAssignmentsCount: 0,
    unsubmittedAssignmentsCount: 0,
    submittedAssignmentIds: []  ,
    lessonId:0
  };
 
  // quizProgressDetails: QuizProgressDetails = {
  //   courseTitle: '',
  //   quizTitle: '',
  //   quizzes: [],
  //   progressPercentage: 0,
  //   completedQuizzesCount: 0,
  //   totalQuizzesCount: 0
  // };
  quizProgressDetails: QuizProgressDetails = this.getDefaultQuizProgressDetails()
  // projectProgressDetails: ProjectProgressDetails2 = {
  //   courseTitle: '',
  //   projects: [],
  //   progressPercentage: 0,
  //   completedProjectsCount: 0,
  //   totalProjectsCount: 0
  // };
 
  selectModule(moduleId: number): void {
    this.selectedModuleId = moduleId;
    this.selectedLessonId = null;
    this.loadLessons(moduleId);
  }
 
  selectLesson(lessonId: number): void {
    this.selectedLessonId = lessonId;
    this.loadQuizzes2(lessonId);
    this.loadAssignments(lessonId);
  }
 
 
 
 
  loadLessonModules(): void {
    if (this.courseId) {
      this.fusion2Service.getLessonModulesByCourseId(this.courseId).subscribe(
        (modules: LessonModule[]) => {
          this.lessonModules = modules;
          console.log('Fetched lesson modules:', this.lessonModules);
         
          if (this.lessonModules.length > 0) {
            // Scenario 1: Course has modules
            console.log('Course has modules. Loading lessons for the first module.');
            this.selectModule(this.lessonModules[0].id);
          } else {
            // Scenario 2: Course doesn't have modules
            console.log('Course has no modules. Loading lessons directly by course ID.');
            this.loadLessonsByCourseId(this.courseId);
          }
        },
        error => {
          console.error('Error fetching lesson modules:', error);
          // In case of an error, try loading lessons directly by course ID
          console.log('Error occurred. Attempting to load lessons directly by course ID.');
          this.loadLessonsByCourseId(this.courseId);
        }
      );
    }
  }
  loadLessonsByCourseId(courseId: number): void {
    this.fusion2Service.getLessonsByCourseId(courseId).subscribe(
      (lessons: Lesson[]) => {
        this.lessons = lessons;
        console.log('Fetched lessons by course ID:', this.lessons);
        if (this.lessons.length > 0) {
          this.selectLesson(this.lessons[0].id);
        }
      },
      error => {
        console.error('Error fetching lessons by course ID:', error);
      }
    );
  }
 
  loadLessons(moduleId: number): void {
    this.fusion2Service.getLessonsByLessonModuleId(moduleId).subscribe(
      (lessons: Lesson[]) => {
        this.lessons = lessons;
        console.log('Fetched lessons:', this.lessons);
        if (this.lessons.length > 0) {
          this.selectLesson(this.lessons[0].id);
        }
      },
      error => {
        console.error('Error fetching lessons:', error);
      }
    );
  }
 
  loadQuizzes2(lessonId: number): void {
    if (this.userId) {
      this.fusion2Service.getQuizProgressDetails(lessonId, this.userId).subscribe(
        (details: QuizProgressDetails) => {
          // Directly assign the fetched details to quizProgressDetails
          this.quizProgressDetails = details;
          console.log('Fetched quiz progress details for lesson:', lessonId, this.quizProgressDetails);
        },
        (error: HttpErrorResponse) => {
          console.error('Error fetching quiz progress details for lesson:', lessonId, error);
 
          if (error.status === 404) {
            // Handle 404 error and display appropriate message in UI
            console.log('No course associated with the lesson or no quizzes available.');
            this.quizProgressDetails = this.getDefaultQuizProgressDetails(); // Set default details
            this.showNoQuizzesMessage(); // Optional: Display a message in the UI
          } else {
            // Handle other errors (e.g., 500, 403, etc.)
            console.error('An unexpected error occurred:', error.message);
          }
        }
      );
    } else {
      console.error('User ID is not available');
      this.quizProgressDetails = this.getDefaultQuizProgressDetails();
    }
  }
  showNoQuizzesMessage(): void {
    // Display a message in your component if no quizzes are found
    alert('No quizzes available for this lesson.');
  }
  getDefaultQuizProgressDetails(): QuizProgressDetails {
    return {
      courseTitle: '',
      lessonTitle: '',
      quizzes: [],
      progressPercentage: 0,
      submittedQuizzesCount: 0,
      totalQuizzesCount: 0,
      unsubmittedQuizzesCount: 0,
    };
  }
  private mapQuizProgressDetails(details: any): QuizProgressDetails {
    return {
      courseTitle: details.courseTitle || '',
      lessonTitle: details.lessonTitle || '',
      quizzes: details.quizzes || [],
      progressPercentage: details.progressPercentage || 0,
      submittedQuizzesCount: details.submittedQuizzesCount || 0,
      totalQuizzesCount: details.totalQuizzesCount || 0,
      unsubmittedQuizzesCount: details.unsubmittedQuizzesCount || 0,
    };
  }
  getQuizStatus(quizId: number, submittedQuizzesCount: number, totalQuizzesCount: number): string {
    return (submittedQuizzesCount >= totalQuizzesCount) ? 'completed' : 'pending';
  }
 
    // New methods for assignments
    selectAssignmentModule(moduleId: number): void {
      this.selectedAssignmentModuleId = moduleId;
      this.selectedAssignmentLessonId = null; // Reset selected assignment lesson
      this.loadAssignmentLessons(moduleId);
    }
 
    selectAssignmentLesson(lessonId: number): void {
      this.selectedAssignmentLessonId = lessonId;
      this.loadAssignments(lessonId);
    }
 
    loadAssignmentModules(): void {
      if (this.courseId) {
        this.fusion2Service.getLessonModulesByCourseId(this.courseId).subscribe(
          (modules: any[]) => {
            this.assignmentModules = modules;
            console.log('Fetched assignment modules:', this.assignmentModules);
            if (this.assignmentModules.length > 0) {
              this.selectAssignmentModule(this.assignmentModules[0].id);
            }
          },
          error => {
            console.error('Error fetching assignment modules:', error);
          }
        );
      }
    }
 
    loadAssignmentLessons(moduleId: number): void {
      this.fusion2Service.getLessonsByLessonModuleId(moduleId).subscribe(
        (lessons: any[]) => {
          this.assignmentLessons = lessons;
          console.log('Fetched assignment lessons:', this.assignmentLessons);
          if (this.assignmentLessons.length > 0) {
            this.selectAssignmentLesson(this.assignmentLessons[0].id);
          }
        },
        error => {
          console.error('Error fetching assignment lessons:', error);
        }
      );
    }
 
    // ... (existing methods) ...
 
    loadAssignments(lessonId: number): void {
      if (this.userId) {
          this.fusion2Service.getAssignmentbyCourseDetails(lessonId, this.userId).subscribe(
              (details: any) => {
                  this.progressDetails = this.mapProgressDetails(details);
                  console.log('Fetched progress details:', this.progressDetails);
              },
              error => {
                  console.error('Error fetching progress details:', error);
              }
          );
      } else {
          console.error('User ID is not available');
      }
  }
 
  mapProgressDetails(details: any): ProgressDetails {
    // Map assignments from API response
    const assignments: Assignment2[] = Array.isArray(details.assignments)
      ? details.assignments.map((assignment: any) => ({
          id: Number(assignment.assignmentId), // Use assignmentId from the API response
          title: assignment.assignmentTitle, // Use assignmentTitle from the API response
          status: assignment.status, // Completed or Incomplete
          disabled: assignment.status === 'Completed' // Disable if completed
        }))
      : [];
 
    return {
      courseTitle: details.courseTitle || '', // Course title from API response
      lessonTitle: details.lessonTitle || '', // Lesson title from API response
      assignments: assignments,
      progressPercentage: (details.submittedAssignmentsCount / details.totalAssignmentsCount) * 100 || 0, // Calculate progress
      submittedAssignmentsCount: details.submittedAssignmentsCount || 0,
      totalAssignmentsCount: details.totalAssignmentsCount || 0,
      unsubmittedAssignmentsCount: details.unsubmittedAssignmentsCount || 0,
      submittedAssignmentIds: details.submittedAssignmentIds || [], // Keep track of submitted assignment IDs
      lessonId:details.lessonId
    };
  }
  getAssignmentStatus(assignmentId: number, submittedAssignmentIds: number[] | undefined): string {
    return submittedAssignmentIds && submittedAssignmentIds.includes(assignmentId) ? 'completed' : 'pending';
  }



    loadProjects2(courseId: number): void {
          console.log('loadProjects2 called with courseId:', courseId);
          if (this.userId) {
            this.fusion2Service.getProjectDetailsByCourseIdAndUserId(courseId, this.userId).subscribe(
              (details: any) => {
                this.projectProgressDetails = this.mapProjectProgressDetails(details);
                console.log('Fetched project progress details:', this.projectProgressDetails);
              },
              error => {
                console.error('Error fetching project progress details:', error);
              }
            );
          } else {
            console.error('User ID is not available');
          }
        }
     
    mapProjectProgressDetails(details: any): ProjectProgressDetails2 {
      console.log('Mapping project details:', details);
   
      const projects = Array.isArray(details.projects)
        ? details.projects.map((project: any) => ({
            id: project.id,
            courseTitle: project.courseTitle,
            projectTitle: project.projectTitle,
            status: project.status
          }))
        : [];
   
      return {
        courseTitle: details.courseTitle || '',
        projects: projects,
        progress: details.progress || 0,
        completedProjectsCount: details.completedProjectsCount || 0,
        totalProjectsCount: details.totalProjectsCount || 0
      };
    }
 
    getProjectStatus(projectId: number): string {
      const project = this.projectProgressDetails.projects.find(p => p.id === projectId);
      return project ? project.status : 'Unknown';
    }
 
    goToProjectDetails(projectId: any,courseId:any): void {
      const activity = "project"
      console.log(activity,projectId,"ProjectId======")
      // Implement navigation to project details page
      this.router.navigate(['/activity',courseId,"course",activity,projectId])
      console.log('Navigating to project details:', projectId);
    }
   
loadProjectProgress3(): Promise<void> {
      return new Promise((resolve, reject) => {
        if (this.courseId === null || this.userId === null) {
          reject('Course ID or User ID is null');
          return;
        }
   
        this.fusion2Service.getProjectProgress3(this.courseId, +this.userId).subscribe({
          next: (progress: ProjectProgressDetails2) => {
            console.log('Project progress loaded successfully:', progress);
            this.projectProgressDetails = {
              ...progress,
              progress: isNaN(progress.progress) ? 0 : progress.progress
            };
            console.log('Updated projectProgressDetails:', this.projectProgressDetails);
            this.cdr.detectChanges();
            resolve();
          },
          error: (error) => {
            console.error('Error loading project progress:', error);
            reject(error);
          }
        });
      });
    }
 
   
   
      // this.router.navigate(['/studentdashboard'])
      navigateToback() {
        this.router.navigate(['/studentdashboard'], { queryParams: { activeTab: 'courses' } });
      }
   
   
  }
 
 
 
 
 
  
 
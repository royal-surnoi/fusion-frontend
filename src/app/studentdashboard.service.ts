import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { Quiz } from './fusion.service';
export interface Answer {
  question: { id: number }; // Change questionId to question object with id
  selectedAnswer: string; // Change selectedOption to selectedAnswer
  quiz: { id: number }; // Already correct
  user: { id: number }; // Change user from number to object with id
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  // Add any other properties that your Question model might have
}
 
 

@Injectable({
  providedIn: 'root'
})
export class StudentdashboardService {

constructor(private http: HttpClient){

}
  private candidateData = {
    name: 'John Doe',
    avatar: 'assets/avatar.jpg',
    role: 'Full Stack Developer',
    completedCourses: 5,
    averageGrade: 92.5,
    totalAchievements: 12,
    overallProgress: [
      { name: 'Completed', value: 65 },
      { name: 'In Progress', value: 25 },
      { name: 'Not Started', value: 10 }
    ],
    recentActivities: [
      { icon: 'school', description: 'Completed "Advanced JavaScript" course', date: new Date('2023-07-10') },
      { icon: 'assignment_turned_in', description: 'Submitted "React Project" assignment', date: new Date('2023-07-08') },
      { icon: 'emoji_events', description: 'Earned "JavaScript Ninja" badge', date: new Date('2023-07-05') }
    ],
    enrolledCourses: [
      {
        id: 1,
        name: 'Advanced React Patterns',
        instructor: 'Jane Smith',
        description: 'Learn advanced React patterns and best practices',
        imageUrl: 'assets/react-course.jpg',
        progress: 75
      },
      {
        id: 2,
        name: 'Node.js Microservices',
        instructor: 'Mike Johnson',
        description: 'Build scalable microservices with Node.js',
        imageUrl: 'assets/nodejs-course.jpg',
        progress: 30
      },
      {
        id: 3,
        name: 'Machine Learning Fundamentals',
        instructor: 'Sarah Lee',
        description: 'Introduction to machine learning algorithms',
        imageUrl: 'assets/ml-course.jpg',
        progress: 10
      }
    ],
    skillProgress: [
      { name: 'JavaScript', level: 90 },
      { name: 'React', level: 85 },
      { name: 'Node.js', level: 75 },
      { name: 'Python', level: 60 },
      { name: 'Machine Learning', level: 40 }
    ],
    upcomingAssignments: [
      { id: 1, title: 'React Performance Optimization', dueDate: new Date('2023-07-25') },
      { id: 2, title: 'Node.js API Security', dueDate: new Date('2023-08-01') },
      { id: 3, title: 'Machine Learning Model Deployment', dueDate: new Date('2023-08-10') }
    ],
    completedAssignments: [
      { id: 4, title: 'JavaScript Async Programming', grade: 'A' },
      { id: 5, title: 'React State Management', grade: 'A-' },
      { id: 6, title: 'RESTful API Design', grade: 'B+' }
    ],
    achievements: [
      { id: 1, name: 'JavaScript Ninja', description: 'Mastered advanced JavaScript concepts', icon: 'code', unlocked: true, progress: 100 },
      { id: 2, name: 'React Guru', description: 'Built 10 React applications', icon: 'web', unlocked: true, progress: 80 },
      { id: 3, name: 'Node.js Explorer', description: 'Completed all Node.js courses', icon: 'dns', unlocked: false, progress: 60 },
      { id: 4, name: 'Python Enthusiast', description: 'Wrote 1000 lines of Python code', icon: 'psychology', unlocked: true, progress: 100 },
      { id: 5, name: 'AI Apprentice', description: 'Implemented 5 machine learning models', icon: 'smart_toy', unlocked: false, progress: 40 }
    ]
  };
 
  getCandidateData(): Observable<any> {
    return of(this.candidateData).pipe(delay(1000)); // Simulate network delay
  }
 
  enrollCourse(courseId: number): Observable<any> {
    // Simulate enrolling in a course
    const course = this.candidateData.enrolledCourses.find(c => c.id === courseId);
    if (course) {
      course.progress = 0;
    }
    return of({ success: true }).pipe(delay(500));
  }
 
  startAssignment(assignmentId: number): Observable<any> {
    // Simulate starting an assignment
    return of({ success: true, message: 'Assignment started' }).pipe(delay(500));
  }
 
  submitAssignment(assignmentId: number, submission: any): Observable<any> {
    // Simulate submitting an assignment
    return of({ success: true, message: 'Assignment submitted successfully' }).pipe(delay(1000));
  }
 
  updateSkillProgress(skillName: string, newLevel: number): Observable<any> {
    // Simulate updating skill progress
    const skill = this.candidateData.skillProgress.find(s => s.name === skillName);
    if (skill) {
      skill.level = newLevel;
    }
    return of({ success: true }).pipe(delay(500));
  }
 
  unlockAchievement(achievementId: number): Observable<any> {
    // Simulate unlocking an achievement
    const achievement = this.candidateData.achievements.find(a => a.id === achievementId);
    if (achievement) {
      achievement.unlocked = true;
      achievement.progress = 100;
    }
    return of({ success: true, message: 'Achievement unlocked!' }).pipe(delay(500));
  }
 
 
 
 
  private courses = [
    { id: 1, name: 'Introduction to Web Development', description: 'Learn the basics of HTML, CSS, and JavaScript', progress: 75, enrolled: true },
    { id: 2, name: 'Data Science Fundamentals', description: 'Explore data analysis and machine learning concepts', progress: 30, enrolled: true },
    { id: 3, name: 'Mobile App Development', description: 'Build native mobile apps for iOS and Android', progress: 0, enrolled: false },
    { id: 4, name: 'Cloud Computing', description: 'Learn about cloud services and deployment', progress: 50, enrolled: true },
  ];
 
  private overallProgress = 65;
 
  private activities = [
    { id: 1, name: 'JavaScript Quiz', dueDate: new Date('2023-07-20'), type: 'quiz' },
    { id: 2, name: 'Data Visualization Project', dueDate: new Date('2023-07-25'), type: 'project' },
    { id: 3, name: 'React Components Assignment', dueDate: new Date('2023-07-30'), type: 'assignment' },
  ];
 
  private feedback = [
    { id: 1, activity: 'HTML Basics Quiz', grade: 'A', feedback: 'Excellent work! You have a solid understanding of HTML.' },
    { id: 2, activity: 'CSS Layout Project', grade: 'B+', feedback: 'Good job on the layout. Consider improving the responsiveness.' },
    { id: 3, activity: 'JavaScript Functions Assignment', grade: 'A-', feedback: 'Great use of functions. Try to make your code more DRY.' },
  ];
 
  private notifications = [
    { id: 1, message: 'New course available: Advanced React Patterns', date: new Date('2023-07-15') },
    { id: 2, message: 'Your project "Data Visualization" has been graded', date: new Date('2023-07-16') },
    { id: 3, message: 'Upcoming live session: "Career in Web Development" on July 25th', date: new Date('2023-07-17') },
  ];
 
  private resources = [
    { id: 1, name: 'Web Development Roadmap', description: 'A comprehensive guide to becoming a web developer', url: 'http://example.com/webdev-roadmap' },
    { id: 2, name: 'Data Science Handbook', description: 'Essential concepts and techniques in data science', url: 'http://example.com/datascience-handbook' },
    { id: 3, name: 'Mobile App Design Principles', description: 'Best practices for creating user-friendly mobile apps', url: 'http://example.com/mobile-design' },
  ];
 
  getEnrolledCourses(id:any) {
     return this.http.get(`${environment.apiBaseUrl}/enrollment/user/${id}`)
  }
  getEnrolledCourseActivitesTitles(id:any){
    return this.http.get(`${environment.apiBaseUrl}/course/course/detail-by-user?userId=${id}`)
  }   
  getNotifications(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/api/notifications/user/${userId}`);
  }
 
  // enrollCourse(courseId: number): Observable<any> {
  //   const course = this.courses.find(c => c.id === courseId);
  //   if (course) {
  //     course.enrolled = true;
  //     course.progress = 0;
  //   }
  //   return of({ success: true }).pipe(delay(500));
  // }
 
  getOverallProgress(): Observable<number> {
    return of(this.overallProgress).pipe(delay(500));
  }
 
  getCourseProgress(): Observable<any[]> {
    return of(this.courses.filter(c => c.enrolled)).pipe(delay(500));
  }
 
  getUpcomingActivities(): Observable<any[]> {
    return of(this.activities).pipe(delay(500));
  }
 
  getFeedbackAndGrades(): Observable<any[]> {
    return of(this.feedback).pipe(delay(500));
  }
 
  // getNotifications(): Observable<any[]> {
  //   return of(this.notifications).pipe(delay(500));
  // }
 
  markNotificationAsRead(notificationId: number): Observable<any> {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    return of({ success: true }).pipe(delay(500));
  }
 
  getResources(): Observable<any[]> {
    return of(this.resources).pipe(delay(500));
  }
  // getCandidateData(): Observable<any> {    
  //   return of(this.candidateData).pipe(delay(1000));
  // }
  // getCandidateData(): Observable<any> {
  //  Student course completesion api
  getCourseCompletionFraction(userId: any, courseId: any, courseTerm: any): Observable<any> {
    console.log(userId, courseId, "pppppppppp");
  
    if (courseTerm === 'long') {
      // http://34.230.34.88:8080/
      return this.http.get(`${environment.apiBaseUrl}/video/progressOfCourse/user/${courseId}/course/${userId}`);
    } else if (courseTerm === 'short') {
      
      return this.http.get(`${environment.apiBaseUrl}/video/progressOfCourseOfUser/user/${courseId}/course/${userId}`);
    } else if (!courseTerm || courseTerm === null || courseTerm === undefined) {
      return of(0); // Return an Observable that emits 0
    } else {
      return throwError('Invalid courseTerm value');
    }
  }
  
  getFeedbackByUSerID(id:any){
    return this.http.get(`${environment.apiBaseUrl}/teacherFeedback/gradesByUser/${id}`)
  }
  getCandidateDetails(id:any){
    return this.http.get(`${environment.apiBaseUrl}/user/find/${id}`)
  }
  getUpcomingAssignment(id:any){
    return this.http.get(`${environment.apiBaseUrl}/upcoming/${id}`)
  }
  getCompletedAssignment(id:any){
    return this.http.get(`${environment.apiBaseUrl}/assignmentSubmissions/${id}`)
  }
  getFile(id:any){
    return this.http.get(`${environment.apiBaseUrl}/course/getBy/${id}`)
  }
  getUpcomingActivies(id:any){
    return this.http.get(`${environment.apiBaseUrl}/api/dashboard/upcoming-items?userId=${id}`)
  }
 
 
// ==================================    QUIZZES     =====================================================
 
getQuizzesByCourseId(lessonId: number): Observable<Quiz[]> {
  return this.http.get<Quiz[]>(`${environment.apiBaseUrl}/api/quizzes/lesson/${lessonId}`);
}
 
getQuestionsForQuiz(quizId: number): Observable<Question[]> {
  return this.http.get<Question[]>(`${environment.apiBaseUrl}/api/quizzes/${quizId}/questions`);
}
// submitAnswers(quizId: number, userId: number, answers: Answer[]): Observable<Answer[]> {
//   const url = `${environment.apiBaseUrl}/api/quizzes/${quizId}/users/${userId}/submitAnswers`;
//   return this.http.post<Answer[]>(url, answers);
// }

// quizz answer
submitAnswers(quizId: number, userId: number, answers: Answer[], courseType: string, p0?: { responseType: "json"; }): Observable<Answer[]> {
  let url: string;

  if (courseType === 'course') {
    url = `${environment.apiBaseUrl}/api/quizzes/${quizId}/users/${userId}/submitAnswers`;
  } else if (courseType === 'individual') {
    url = `${environment.apiBaseUrl}/api/quizzes/${quizId}/users/${userId}/submitAnswers`;
  } else {
    throw new Error('Invalid courseType. Must be either "course" or "individual".');
  }

  return this.http.post<Answer[]>(url, answers, { responseType: 'text' as 'json' });
}
 
 
}
 


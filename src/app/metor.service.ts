
 
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { FeedbackPayload } from './assement/assement.component';
 
interface Student {
  id: number;
  name: string;
  email: string;
  enrolledCourses: string[];
  overallProgress: number;
}
export interface FeedbackResponse {
  // Define properties based on your API response
  // Example:
  id: number;
  comments: string;
  createdAt: string;
  updatedAt: string;
}
 
 
interface Course {
  id: number;
  name: string;
  description: string;
  enrolledStudents: number;
  averageProgress: number;
}
 
interface Assessment {
  id: number;
  title: string;
  courseId: number;
  dueDate: Date;
  submittedCount: number;
  totalCount: number;
  status: 'Open' | 'Closed';
}
 
@Injectable({
  providedIn: 'root'
})
export class MentorService {
 
 
  private messages = [
    { id: 1, from: 'John Doe', to: 'Mentor', subject: 'Question about the course', date: new Date('2023-07-15T10:30:00'), content: 'Hello, I have a question about the latest assignment. Can you provide more clarification on the requirements?' },
    { id: 2, from: 'Jane Smith', to: 'Mentor', subject: 'Assignment submission', date: new Date('2023-07-14T15:45:00'), content: 'I have submitted my assignment for the Web Development module. Please let me know if you need any additional information.' },
    { id: 3, from: 'Mike Johnson', to: 'Mentor', subject: 'Extension request', date: new Date('2023-07-13T09:20:00'), content: 'Due to unforeseen circumstances, I would like to request a short extension for the upcoming project deadline. I would greatly appreciate your consideration.' },
    { id: 4, from: 'Sarah Williams', to: 'Mentor', subject: 'Feedback on quiz', date: new Date('2023-07-12T14:10:00'), content: 'I recently completed the quiz on Data Structures and I have some questions about the feedback I received. Would it be possible to schedule a brief meeting to discuss?' },
    { id: 5, from: 'David Brown', to: 'Mentor', subject: 'Study group formation', date: new Date('2023-07-11T11:05:00'), content: 'I am interested in forming a study group for the upcoming exam. Do you have any suggestions on how to best organize this?' }
  ];
 
  private students: Student[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', enrolledCourses: ['Web Development', 'Python Basics'], overallProgress: 75 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', enrolledCourses: ['Data Science', 'Machine Learning'], overallProgress: 85 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', enrolledCourses: ['Mobile App Development'], overallProgress: 60 },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', enrolledCourses: ['Web Development', 'UI/UX Design'], overallProgress: 90 },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', enrolledCourses: ['Python Basics', 'Data Science'], overallProgress: 70 }
  ];
 
  private courses: Course[] = [
    { id: 1, name: 'Web Development', description: 'Learn modern web development techniques', enrolledStudents: 50, averageProgress: 75 },
    { id: 2, name: 'Data Science', description: 'Explore data analysis and machine learning', enrolledStudents: 40, averageProgress: 60 },
    { id: 3, name: 'Mobile App Development', description: 'Build native mobile apps for iOS and Android', enrolledStudents: 30, averageProgress: 80 },
    { id: 4, name: 'Python Basics', description: 'Introduction to Python programming', enrolledStudents: 60, averageProgress: 70 },
    { id: 5, name: 'UI/UX Design', description: 'Learn principles of user interface and experience design', enrolledStudents: 35, averageProgress: 65 }
  ];
 
  private assessments: Assessment[] = [
    { id: 1, title: 'JavaScript Basics Quiz', courseId: 1, dueDate: new Date('2023-08-15'), submittedCount: 15, totalCount: 20, status: 'Open' },
    { id: 2, title: 'Python Data Structures Assignment', courseId: 4, dueDate: new Date('2023-08-20'), submittedCount: 8, totalCount: 25, status: 'Open' },
    { id: 3, title: 'React Components Project', courseId: 1, dueDate: new Date('2023-08-10'), submittedCount: 18, totalCount: 18, status: 'Closed' },
    { id: 4, title: 'Machine Learning Algorithms Quiz', courseId: 2, dueDate: new Date('2023-08-25'), submittedCount: 0, totalCount: 15, status: 'Open' },
  ];
 
  private apiBaseUrl = environment.apiBaseUrl;
  getData: any;
 
 
  constructor(private http: HttpClient) { }
 
 
  // Student-related methods
  getStudents(): Observable<Student[]> {
    return of(this.students).pipe(delay(500));
  }
 
  getStudentById(id: number): Observable<Student> {
    const student = this.students.find(s => s.id === id);
    if (student) {
      return of(student).pipe(delay(300));
    } else {
      return throwError('Student not found');
    }
  }
 
  addStudent(student: Omit<Student, 'id'>): Observable<Student> {
    const newId = Math.max(...this.students.map(s => s.id)) + 1;
    const newStudent: Student = { ...student, id: newId, enrolledCourses: [] };
    this.students.push(newStudent);
    return of(newStudent).pipe(delay(500));
  }
 
  updateStudent(id: number, updatedStudent: Partial<Student>): Observable<Student> {
    const index = this.students.findIndex(s => s.id === id);
    if (index !== -1) {
      this.students[index] = { ...this.students[index], ...updatedStudent };
      return of(this.students[index]).pipe(delay(500));
    } else {
      return throwError('Student not found');
    }
  }
 
  deleteStudent(id: number): Observable<boolean> {
    const initialLength = this.students.length;
    this.students = this.students.filter(s => s.id !== id);
    if (this.students.length < initialLength) {
      return of(true).pipe(delay(500));
    } else {
      return throwError('Student not found');
    }
  }
 
  enrollStudentInCourse(studentId: number, courseName: string): Observable<Student> {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      if (!student.enrolledCourses.includes(courseName)) {
        student.enrolledCourses.push(courseName);
        return of(student).pipe(delay(500));
      } else {
        return throwError('Student already enrolled in this course');
      }
    } else {
      return throwError('Student not found');
    }
  }
 
  updateStudentProgress(studentId: number, newProgress: number): Observable<Student> {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      student.overallProgress = newProgress;
      return of(student).pipe(delay(500));
    } else {
      return throwError('Student not found');
    }
  }
 
  // Course-related methods
  getCourses(): Observable<Course[]> {
    return of(this.courses).pipe(delay(500));
  }
 
  getCourseById(id: number): Observable<Course> {
    const course = this.courses.find(c => c.id === id);
    if (course) {
      return of(course).pipe(delay(300));
    } else {
      return throwError('Course not found');
    }
  }
 
  addCourse(course: Omit<Course, 'id'>): Observable<Course> {
    const newId = Math.max(...this.courses.map(c => c.id)) + 1;
    const newCourse: Course = { ...course, id: newId, enrolledStudents: 0, averageProgress: 0 };
    this.courses.push(newCourse);
    return of(newCourse).pipe(delay(500));
  }
 
  updateCourse(id: number, updatedCourse: Partial<Course>): Observable<Course> {
    const index = this.courses.findIndex(c => c.id === id);
    if (index !== -1) {
      this.courses[index] = { ...this.courses[index], ...updatedCourse };
      return of(this.courses[index]).pipe(delay(500));
    } else {
      return throwError('Course not found');
    }
  }
 
  deleteCourse(id: number): Observable<boolean> {
    const initialLength = this.courses.length;
    this.courses = this.courses.filter(c => c.id !== id);
    if (this.courses.length < initialLength) {
      return of(true).pipe(delay(500));
    } else {
      return throwError('Course not found');
    }
  }
 
  // Assessment-related methods
  getAssessments(): Observable<Assessment[]> {
    return of(this.assessments).pipe(delay(500));
  }
 
  getAssessmentById(id: number): Observable<Assessment> {
    const assessment = this.assessments.find(a => a.id === id);
    if (assessment) {
      return of(assessment).pipe(delay(300));
    } else {
      return throwError('Assessment not found');
    }
  }
 
  addAssessment(assessment: Omit<Assessment, 'id'>): Observable<Assessment> {
    const newId = Math.max(...this.assessments.map(a => a.id)) + 1;
    const newAssessment: Assessment = { ...assessment, id: newId, submittedCount: 0, totalCount: 0, status: 'Open' };
    this.assessments.push(newAssessment);
    return of(newAssessment).pipe(delay(500));
  }
 
  updateAssessment(id: number, updatedAssessment: Partial<Assessment>): Observable<Assessment> {
    const index = this.assessments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.assessments[index] = { ...this.assessments[index], ...updatedAssessment };
      return of(this.assessments[index]).pipe(delay(500));
    } else {
      return throwError('Assessment not found');
    }
  }
 
  deleteAssessment(id: number): Observable<boolean> {
    const initialLength = this.assessments.length;
    this.assessments = this.assessments.filter(a => a.id !== id);
    if (this.assessments.length < initialLength) {
      return of(true).pipe(delay(500));
    } else {
      return throwError('Assessment not found');
    }
  }
 
  // Additional helper methods
  sendMessageToStudent(studentId: number, message: string): Observable<any> {
    // Simulate sending a message
    console.log(`Sending message to student ${studentId}: ${message}`);
    return of({ success: true, message: 'Message sent successfully' }).pipe(delay(500));
  }
  getMessages(): Observable<any[]> {
    return of(this.messages).pipe(delay(500));
  }
 
  sendMessage(message: any): Observable<any> {
    const newMessage = {
      id: this.messages.length + 1,
      from: 'Mentor',
      to: message.to,
      subject: message.subject,
      date: new Date(),
      content: message.content
    };
    this.messages.unshift(newMessage);
    console.log('Sending message:', newMessage);
    return of({ success: true, message: newMessage }).pipe(delay(500));
  }
 
  deleteMessage(messageId: number): Observable<any> {
    const index = this.messages.findIndex(m => m.id === messageId);
    if (index !== -1) {
      this.messages.splice(index, 1);
      console.log('Deleting message:', messageId);
      return of({ success: true }).pipe(delay(500));
    } else {
      console.log('Message not found:', messageId);
      return of({ success: false, error: 'Message not found' }).pipe(delay(500));
    }
  }
  // addAssessment(assessment: any): Observable<any> {
 
  //   const newAssessment = { ...assessment, id: this.sampleAssessments.length + 1 };
 
  //   this.sampleAssessments.push(newAssessment);
 
  //   return of(newAssessment).pipe(delay(500));
 
  // }
 
  // updateAssessment(assessmentId: number, assessmentData: any): Observable<any> {
 
  //   const index = this.sampleAssessments.findIndex(a => a.id === assessmentId);
 
  //   if (index !== -1) {
 
  //     this.sampleAssessments[index] = { ...this.sampleAssessments[index], ...assessmentData };
 
  //     return of(this.sampleAssessments[index]).pipe(delay(500));
 
  //   }
 
  //   return of(null).pipe(delay(500));
 
  // }
 
  // deleteAssessment(assessmentId: number): Observable<boolean> {
 
  //   const initialLength = this.sampleAssessments.length;
 
  //   this.sampleAssessments = this.sampleAssessments.filter(a => a.id !== assessmentId);
 
  //   return of(this.sampleAssessments.length < initialLength).pipe(delay(500));
 
  // }
 
  // Additional methods
 
  // enrollStudentInCourse(studentId: number, courseId: number): Observable<boolean> {
 
  //   const student = this.sampleStudents.find(s => s.id === studentId);
 
  //   const course = this.sampleCourses.find(c => c.id === courseId);
 
  //   if (student && course) {
 
  //     student.enrolledCourses += 1;
 
  //     course.enrolledStudents += 1;
 
  //     return of(true).pipe(delay(500));
 
  //   }
 
  //   return of(false).pipe(delay(500));
 
  // }
 
  gradeAssessment(assessmentId: number, grade: number): Observable<boolean> {
    // Simulate a successful grading operation
    return of(true).pipe(delay(500));
  }
  createAssessment(assessment: any): Observable<any> {
 
    const newAssessment = {
 
      id: this.assessments.length + 1,
 
      ...assessment,
 
      submittedCount: 0,
 
      totalCount: 0,
 
      status: 'Open'
 
    };
 
    this.assessments.push(newAssessment);
 
    return of(newAssessment).pipe(delay(500));
 
  }
 
 
  fetchCourseByUserId(userId: string): Observable<any> {
     return this.http.get<any>(`${this.apiBaseUrl}/course/user/${userId}`);
   }
  
    
    
    
   ///////////////////////////////////////////////////////////////////////////////////////////////
   fetchActivityModules(courseId: number): Observable<any> {
     return this.http.get(`${this.apiBaseUrl}/getModuleByCourse/${courseId}`);
   }
   fetchLessons(moduleId: number): Observable<any> {
     return this.http.get(`${this.apiBaseUrl}/lesson/module/${moduleId}`);
   }
  
   fetchActivityLessons(courseId: number): Observable<any> {
     return this.http.get(`${this.apiBaseUrl}/lesson/course/${courseId}`);
   }
  
   fetchQuizzesByLessonId(lessonId: number): Observable<any> {
     return this.http.get<any>(`${this.apiBaseUrl}/api/quizzes/lesson/${lessonId}`);
   }
  
   // Service method to fetch quizzes based on module and lesson IDs
 fetchQuizzesByModuleAndLesson(moduleId: number, lessonId: number): Observable<any> {
   return this.http.get<any>(`${this.apiBaseUrl}/api/quizzes/byLessonAndModule?lessonId=${lessonId}&lessonModuleId=${moduleId}`);
 }
  
 // Service method to fetch assessments based on module and lesson IDs
 fetchAssessmentsByModuleAndLesson(moduleId: number, lessonId: number): Observable<any> {
   return this.http.get<any>(`${this.apiBaseUrl}/byLessonAndModule?lessonId=${lessonId}&lessonModuleId=${moduleId}`);
 }
  
  
 fetchEnrollersByQuizId(quizId: number): Observable<any> {
   return this.http.get<any>(`${this.apiBaseUrl}/api/quizzes/${quizId}/submittedUsers`);
 }
  
   fetchAssessmentsByLessonId(lessonId: number): Observable<any[]> {
     return this.http.get<any[]>(`${this.apiBaseUrl}/lesson/${lessonId}`);
   }
  
  
  
  
  
  
   fetchEnrollersByAssessmentId(assignmentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/submitted-students/${assignmentId}`);
  }
   fetchEnrollerScore(quizId: number, userId: number): Observable<number> {
     return this.http.get<number>(`${this.apiBaseUrl}/api/quizzes/${quizId}/users/${userId}/percentage`);
   }
   // getAssignmentGrade(assignmentId: number, studentId: number): Observable<string> {
   //   return this.http.get<string>(`${this.apiBaseUrl}/${assignmentId}/students/${studentId}/grade`, { responseType: 'text' as 'json' });
   // }
  
   getQuizResponses(quizId: number, userId: number): Observable<any> {
     return this.http.get<any>(`${this.apiBaseUrl}/api/quizzes/${quizId}/users/${userId}/submittedAnswers`);
   }
   // getAssignmentFile(assessmentId: number, userId: number): Observable<any> {
   //   return this.http.get<any>(`${this.apiBaseUrl}/getSubmitAssignmentBy/${assessmentId}/${userId}`);
   // }
   getAssignmentFile(assessmentId: number, userId: number): Observable<any> {
     const url = `${this.apiBaseUrl}/getSubmitAssignmentBy/${assessmentId}/${userId}`;
     return this.http.get(url, { responseType: 'json' }); // Ensure correct responseType
   }
  
  
   // submitFeedback(studentId: number, quizId: number, teacherId: number, comments: string): Observable<FeedbackResponse> {
   //   const endpoint = `${this.apiBaseUrl}/teacherFeedback/${teacherId}/students/${studentId}/quizzes/${quizId}`;
   //   const body = { comments };
   //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
   //   return this.http.post<FeedbackResponse>(endpoint, body, { headers }).pipe(
   //     catchError((error: HttpErrorResponse) => {
   //       console.error('Error in submitFeedback:', error.message);
   //       return throwError(error);
   //     })
   //   );
   // }
  
 //   fetchEnrollerProgress(courseId: number, userId: number): Observable<{ overallProgress: number }> {
 //     return this.http.get<{ overallProgress: number }>(`${this.apiBaseUrl}/progress/course/${courseId}/user/${userId}`);
 // }
 fetchEnrollerProgress(courseId: number, userId: number): Observable<{ overallProgress: number }> {
   return this.http.get<{ overallProgress: number }>(`${this.apiBaseUrl}/progress/course/${courseId}/user/${userId}`);
 }
 createFeedback(feedbackData: FeedbackPayload): Observable<any> {
   let params = new HttpParams()
     .set('teacherId', feedbackData.teacherId.toString())
     .set('studentId', feedbackData.studentId.toString())
     .set('feedback', feedbackData.feedback)
     .set('grade', feedbackData.grade || '');
  
   if (feedbackData.courseId !== undefined) {
     params = params.set('courseId', feedbackData.courseId.toString());
   }
   if (feedbackData.lessonId !== undefined) {
     params = params.set('lessonId', feedbackData.lessonId.toString());
   }
   if (feedbackData.quizId !== undefined) {
     params = params.set('quizId', feedbackData.quizId.toString());
   }
   if (feedbackData.assignmentId !== undefined) {
     params = params.set('assignmentId', feedbackData.assignmentId.toString());
   }
  
   const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
  
   return this.http.post<any>(`${this.apiBaseUrl}/teacherFeedback/create`, params.toString(), { headers });
 }
  
  
  
 getSubmittedAssignmentsByTeacherId(teacherId: number,studentId: number): Observable<any[]> {
   return this.http.get<any[]>(`${this.apiBaseUrl}/get/assignments/teacher/${teacherId}/student/${studentId}`);
 }
 getAssignmentFile1(assignmentId: number): Observable<any> {
   return this.http.get<any>(`${this.apiBaseUrl}/get/assignment/${assignmentId}`);
 }
 getSubmitAssignmentBy(assignmentId: number, userId: number): Observable<any> {
  const url = `${this.apiBaseUrl}/getSubmitAssignmentBy/${assignmentId}/${userId}`;
  return this.http.get<any>(url);
}
 
  
}
 
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { DatePipe } from '@angular/common';

export interface Quiz {
  quizId: number;
  quizTitle: string;
  quizDate: Date; // Adjust the type based on the API response
  // Add other fields as necessary
}
export interface QuizProgressDetails {
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
export interface ProgressDetails {
  courseTitle: string;
  lessonTitle: string;
  assignments: Assignment2[]; // List of assignments with status
  progressPercentage: number; // Calculated based on submission counts
  submittedAssignmentsCount: number; // Number of submitted assignments
  totalAssignmentsCount: number; // Total assignments for the lesson
  unsubmittedAssignmentsCount: number; // Unsubmitted assignments count
  submittedAssignmentIds: number[]; // IDs of the submitted assignments
}
// export interface Quiz {
//   quizId: string;
//   courseTitle: string;
//   lessonTitle: string;
//   quizTitle: string;
//   status: string;
// }
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
interface Assignment2 {
  id: number;
  title: string;
  status: string;
  disabled: boolean;
}
export interface Course {
  id: number;
  courseTitle: string;
  courseDescription: string;
  language: string;
  level: string;
  name: string;        // Added as per error message
  progress: number;    // Added as per error message
  activities: any[];   // Added as per error message, adjust the type if you know the specific structure
  // Keep any other existing properties
}
 
export interface Course {
  id: number;
  courseTitle: string;
  courseDescription: string;
  language: string;
  level: string;
  // Add other properties as needed
}
 

export interface Project {
  courseType: any;
    projectId:any;
    courseTitle: string;  // Make sure these match your actual model
    course:any;
    id: number;
    projectTitle: string; // Ensure this matches the backend API
    name: string;
    description: string;
    projectDescription:any;
    gitUrl:any;
    maxTeam:number;
    projectDeadline:Date;
    startDate:Date;
    reviewMeetDate:Date;
    projectDocument:any;
    status: string; // Add this line
    sno?: number;
   
    // Add other fields as necessary
  }

export interface Course {
  id: number;
  courseTitle: string;
  courseDescription: string;
  language: string;
  level: string;
  // Add other properties as needed
}




export interface Assignment {

  courseType:any 
  course:any;
  id: number;
  // assignmentTitle: string;
  maxScore:number;
  sno: number;
  courseTitle: string;
  assignmentTitle: string;
  status: string;
  assignmentId: number;
  
  // Add other properties as needed
}
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserEnrollmentResponse {
  user: User;
  courseTitles: string[];
}

export interface Video1234 {
  id: number;
  videoTitle: string;
  s3Key: string;
  s3Url: string;
}

@Injectable({
  providedIn: 'root'
})
export class Fusion2Service {

  private apiBaseUrl = environment.apiBaseUrl;
  handleError: any;

  constructor(private http: HttpClient) { }

  ////////// getting course project extra /////////////////
// getProjectsByTeacherId(teacherId: number): Observable<Project[]> {
//   return this.http.get<Project[]>(`${this.apiBaseUrl}/project/projectByTeacher/${teacherId}`);
// }


// getAssignmentsByUserId(userId: number): Observable<Assignment[]> {
//   const params = new HttpParams().set('teacherId', userId.toString());
//   return this.http.get<Assignment[]>(`${this.apiBaseUrl}/byTeacherId`, { params });
// }

  // Method to fetch assignment by ID
  // getcourseAssignmentById(assignmentId: number): Observable<any> {
  //   return this.http.get<any>(`${this.apiBaseUrl}/getAssignment/${assignmentId}`);
  // }
  getcourseAssignmentById(assignmentId: number): Observable<any> {
    const url = `${this.apiBaseUrl}/getAssignment/${assignmentId}`;
    return this.http.get(url);
  }
  // Method to update assignment details
  updateAssignment(teacherId: number, assignmentId: number, formData: FormData): Observable<any> {
    const url = `${this.apiBaseUrl}/${teacherId}/${assignmentId}/updateAssignmentDetails`;
    return this.http.put(url, formData);
  }

////////////delete assignment 
deleteAssignment(assignmentId: number): Observable<void> {
  return this.http.delete<void>(`${this.apiBaseUrl}/deleteAssignment/${assignmentId}`);
}

/////////// getting course project by teacherId 

getcourseProjectsByTeacherId(teacherId: number): Observable<Project[]> {
  return this.http.get<Project[]>(`${this.apiBaseUrl}/project/projectByTeacher/${teacherId}`);
}
///////////dalete project
deleteProject(projectId: number): Observable<void> {
  return this.http.delete<void>(`${this.apiBaseUrl}/project/delete/${projectId}`);
}
/////////////////// getting the project 
getProjectById(id: number): Observable<Project> {
  return this.http.get<Project>(`${this.apiBaseUrl}/project/getBy/${id}`);
}
////////////////// update the project
updateProject(teacherId: string | null, projectId: string | null, formData: FormData): Observable<any> {
  return this.http.put(`${this.apiBaseUrl}/project/${teacherId}/${projectId}/updateDetails`, formData);
}

getCourseById(id: number): Observable<Course> {
  if (id === undefined || id === null) {
    throw new Error('Invalid course ID');
  }
  return this.http.get<Course>(`${this.apiBaseUrl}/course/getBy/${id}`);
}
getCourseProgress(userId: number, courseId: number): Observable<number> {
  return this.http.get<number>(`${this.apiBaseUrl}/video/progress/user/${userId}/course/${courseId}`);
}
// getCourseProgressPercentage(userId: any, courseId: any): Observable<number> {
//   return this.http.get<number>(`${this.apiBaseUrl}/video/progress/percentage/user/${userId}/course/${courseId}`).pipe(
//     tap(progress => {
//       console.log(`Course progress for courseId ${courseId} is ${progress}%`);
//     })
//   );
// }
getProjectsByCourse(courseId: number): Observable<Project[]> {
  return this.http.get<Project[]>(`${this.apiBaseUrl}/project/course/${courseId}`);
}
getProjectProgress(courseId: number, userId: number): Observable<number> {
  return this.http.get<number>(`${environment.apiBaseUrl}/project/projectProgress/${courseId}/user/${userId}`);
}
getQuizzesByCourse(courseId: number): Observable<Quiz[]> {
  return this.http.get<Quiz[]>(`${this.apiBaseUrl}/api/quizzes/course/${courseId}`);
}
 
getQuizProgress(userId: number, courseId: number): Observable<number> {
  return this.http.get<number>(`${this.apiBaseUrl}/api/quizzes/progress/percentage/user/${userId}/course/${courseId}`);
}
getAssessmentsByCourse(userId: number, courseId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiBaseUrl}/byUserAndCourse/${userId}/${courseId}`);
}
// getAssessmentProgressPercentage(courseId: number, userId: number): Observable<Map<string, number>> {
//   return this.http.get<Map<string, number>>(`${this.apiBaseUrl}/progress/course/${courseId}/user/${userId}`);
// }
getAssessmentProgress(userId: number, courseId: number): Observable<{ progressPercentage?: number }> {
  return this.http.get<{ progressPercentage?: number }>(`${this.apiBaseUrl}/progress/course/${courseId}/user/${userId}`);
}
// getCourseById(id: number): Observable<Course> { 

//     return this.http.get<Course>(`${this.apiBaseUrl}/courses/${id}`); 
  
//   } 
  
  getCourseDetails(id: number): Observable<any> { 
  
    const url = `${this.apiBaseUrl}/course/getBy/${id}`; 
  
    return this.http.get<any>(url); 
  
  } 
//////////////////////// get enrollments data in graph //////////
getMonthlyStats(courseId: number): Observable<any> {
  return this.http.get<any>(`${this.apiBaseUrl}/course/${courseId}/monthlyStats`);
}
//////////////// getting total students of mentor//////////

getEnrolledStudents(instructorId: number): Observable<UserEnrollmentResponse[]> {
  return this.http.get<UserEnrollmentResponse[]>(`${this.apiBaseUrl}/api/dashboard/enrolled-students`, {
    params: new HttpParams().set('instructorId', instructorId.toString())
  });
}

// Method to check if a user is enrolled in a course
isUserEnrolled(userId: number, courseId: number): Observable<boolean> {
  return this.http.get<any>(`${this.apiBaseUrl}/user/${userId}/course/${courseId}`).pipe(
    map(response => response !== null),
    catchError(error => {
      console.error('Error checking enrollment status:', error);
      return of(false);
    })
  );
}
getAssignmentProgress(userId: number, courseId: number): Observable<Map<string, Object>> {
  return this.http.get<Map<string, Object>>(`${this.apiBaseUrl}/progressByStudentId?studentId=${userId}&courseId=${courseId}`)
    .pipe(
      map(response => new Map(Object.entries(response as Object)))
    );
}
getProjectProgress2(userId: number, courseId: number): Observable<Map<string, any>> {
  return this.http.get<Map<string, any>>(`${this.apiBaseUrl}/project/projectProgressByStudentId?studentId=${userId}&courseId=${courseId}`)
    .pipe(
      map(response => new Map(Object.entries(response)))
    );
}
// getQuizProgress2(studentId: number, courseId: number): Observable<Map<string, any>> {
//   return this.http.get<any>(`${this.apiBaseUrl}/api/quizzes/teacherToStudentProgress?studentId=${studentId}&courseId=${courseId}`)
//     .pipe(
//       map(response => new Map(Object.entries(response)))
//     );
// }


// getUsersCourseProgress(userId: number, courseId: number): Observable<number> {
//     return this.http.get<number>(`${this.apiBaseUrl}/video/progressOfCourse/user/${userId}/course/${courseId}`);
//   }
//   getUsersLessonModuleProgress(userId: number, lessonModuleId: number): Observable<number> {
//     return this.http.get<number>(`${this.apiBaseUrl}/video/progressOfModule/user/${userId}/lessonModule/${lessonModuleId}`);
//   }
// getUsersCourseProgressByLesson(userId: number, courseId: number): Observable<number> {
//     return this.http.get<number>(`${this.apiBaseUrl}/video/courseProgressByLesson/user/${userId}/course/${courseId}`);
//   }
  
  getUsersCourseProgress(userId: number, courseId: number): Observable<number> {
     return this.http.get<number>(`${this.apiBaseUrl}/video/progressOfCourse/user/${userId}/course/${courseId}`);
   }
   getUsersLessonModuleProgress(userId: number, lessonModuleId: number): Observable<number> {
     return this.http.get<number>(`${this.apiBaseUrl}/video/progressOfModule/user/${userId}/lessonModule/${lessonModuleId}`);
   }
 getUsersCourseProgressByLesson(userId: number, courseId: number): Observable<number> {
     return this.http.get<number>(`${this.apiBaseUrl}/video/courseProgressByLesson/user/${userId}/course/${courseId}`);
   }
   
// getUsersCourseProgress(userId: number, courseId: number): Observable<number> {
//   return this.http.get<number>(`${this.apiBaseUrl}/video/progressOfCourse/user/${userId}/course/${courseId}`);
// }
// getUsersLessonModuleProgress(userId: number, lessonModuleId: number): Observable<number> {
//   return this.http.get<number>(`${this.apiBaseUrl}/video/progressOfModule/user/${userId}/lessonModule/${lessonModuleId}`);
// }
// getUsersCourseProgressByLesson(userId: number, courseId: number): Observable<number> {
//   return this.http.get<number>(`${this.apiBaseUrl}/video/courseProgressByLesson/user/${userId}/course/${courseId}`);
// }
  // -------------------------------- course activites----------------
  
////////////////////////////////////////////////////
getLessonModulesByCourseId(courseId: number): Observable<LessonModule[]> {
  return this.http.get<LessonModule[]>(`${this.apiBaseUrl}/getModuleByCourse/${courseId}`);
}
getLessonsByLessonModuleId(lessonModuleId: number): Observable<Lesson[]> {
  return this.http.get<Lesson[]>(`${this.apiBaseUrl}/lesson/module/${lessonModuleId}`);
}
getQuizzesByLessonId(lessonId: number): Observable<Quiz[]> {
  return this.http.get<Quiz[]>(`${this.apiBaseUrl}/api/quizzes/lesson/${lessonId}`);
}
getAssignmentsByLessonId(lessonId: number): Observable<Assignment2[]> {
  return this.http.get<Assignment2[]>(`${this.apiBaseUrl}/lesson/${lessonId}`);
}
getAssignmentProgressDetails(lessonId: number, userId: string): Observable<any> {
  return this.http.get<any>(`${this.apiBaseUrl}/details/${lessonId}?userId=${userId}`)
    .pipe(
      tap(response => console.log('API response:', response))
    );
}
getQuizProgressDetails(lessonId: number, userId: number): Observable<any> {
  return this.http.get<any>(`${this.apiBaseUrl}/api/quizzes/progress/details/${lessonId}?userId=${userId}`);
}
getProjectProgressDetails(courseId: number, userId: number): Observable<any> {
  return this.http.get(`${this.apiBaseUrl}/project/projects/progress/${courseId}/${userId}`);
}
getProjectDetailsByCourseIdAndUserId(courseId: number, userId: number): Observable<any> {
  console.log(`Calling API with courseId: ${courseId}, userId: ${userId}`);
  return this.http.get(`${this.apiBaseUrl}/project/details/byCourse/${courseId}?userId=${userId}`).pipe(
    tap(response => console.log('API response:', response)),
    catchError(error => {
      console.error('API error:', error);
      return throwError(error);
    })
  );
}
getProjectProgress3(courseId: number, userId: number): Observable<any> {
  return this.http.get<any>(`${this.apiBaseUrl}/project/details/byCourse/${courseId}?userId=${userId}`);
}


///////////////// getting course videos /////////////////
getVideosByCourse(courseId: number): Observable<Video1234[]> {
  return this.http.get<Video1234[]>(`${this.apiBaseUrl}/video/courses/videos/${courseId}`);
}




 
getCourseProgressByLesson(userId: number, courseId: number): Observable<number> {
  return this.http.get<number>(`${this.apiBaseUrl}/video/courseProgressByLesson/user/${userId}/course/${courseId}`);
}
getLessonsByCourseId(courseId: number): Observable<Lesson[]> {
  return this.http.get<Lesson[]>(`${this.apiBaseUrl}/lesson/course/${courseId}`);
}
getCourseProgressnew(userId: number, courseId: number): Observable<number> {
  return this.http.get<number>(`${this.apiBaseUrl}/video/progressOfCourse/user/${userId}/course/${courseId}`);
}

getCourseProgressByLessonnew(userId: number, courseId: number): Observable<number> {
  return this.http.get<number>(`${this.apiBaseUrl}/video/courseProgressByLesson/user/${userId}/course/${courseId}`);
}

// getLessonsByCourseId(courseId: number): Observable<Lesson[]> {
//   return this.http.get<Lesson[]>(`${this.apiBaseUrl}/lesson/course/${courseId}`);
// }
getProgressDetails(lessonId: number, userId: string): Observable<any> {
  return this.http.get<any>(`${this.apiBaseUrl}/details/${lessonId}?userId=${userId}`)
    .pipe(
      tap(response => console.log('API response:', response))
    );
}
getAssignmentbyCourseDetails(lessonId: number, userId: string): Observable<any> {
  return this.http.get<any>(`${this.apiBaseUrl}/assignmentsDetails/${lessonId}?userId=${userId}`)
    .pipe(
      tap(response => console.log('API response:', response))
    );
}
createAssignment(data: FormData): Observable<any> {
  const url = `${this.apiBaseUrl}/createMultipleAssignment`;
  return this.http.post(url, data);
}
getQuizProgress2(studentId: number, courseId: number,teachairID:any): Observable<Map<string, any>> {
  // ${this.apiBaseUrl}/api/quizzes/teacherToStudentProgress?studentId=${studentId}&courseId=${courseId}
  // 
  return this.http.get<any>(`${environment.apiBaseUrl}/api/quizzes/teacher/${teachairID}/student/${studentId}/statistics`)
    .pipe(
      map(response => new Map(Object.entries(response)))
    );
}
////////////////////////////////////////////////////////////////
getAssignmentsByUserId(userId: number): Observable<Assignment[]> {
  return this.http.get<Assignment[]>(`${this.apiBaseUrl}/assignmentsByTeacher/${userId}`);
}
 getProjectsByTeacherId(teacherId: number): Observable<Project[]> {
    // Ensure this method fetches data that matches the Project model
    return this.http.get<Project[]>(`${this.apiBaseUrl}/project/postedByCourseByTeacher/${teacherId}`);
  }
  getQuizzsByTeacherId(teacherId: number): Observable<Project[]> {
    // The API endpoint that retrieves the projects based on teacherId
    return this.http.get<Project[]>(`${this.apiBaseUrl}/api/quizzes/teacher/${teacherId}`);
  }

}

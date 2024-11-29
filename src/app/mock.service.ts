import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { TrainingRoom } from './mentoronline.service';
 
export interface Assignment {
  assignment_id: string;
  title: string;
  submittedAt: number[]; // Assuming this is the structure
  // Add other relevant properties
}
 
export interface Project {
  project_id: string;
  title: string;
  submittedAt: number[]; // Assuming this is the structure
  // Add other relevant properties
}
@Injectable({
  providedIn: 'root'
})
export class MockService {
  private apiBaseUrl = environment.apiBaseUrl;
 
  constructor(private http: HttpClient) { }
 
  saveSlot(slot: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/api/slots/saveSlot`, slot);
  }
 
  getAllCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/course/allCourses`);
  }
 
  // createMockTestInterview(mockTest: FormData): Observable<any> {
  //   return this.http.post(`${this.apiBaseUrl}/saveNewMock`, mockTest);
  // }
 
  createMockTestInterview(mockTest: FormData): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/saveNewMock`, mockTest);
  }
 
  // createProjectByMock(formData: FormData): Observable<any> {
  //   return this.http.post(`${this.apiBaseUrl}project/createProjectByMock`, formData);
  // }
 
 
  getCoursesByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/course/user/${userId}`);
  }
 
  createAssignmentByMock(formData: FormData): Observable<string> {
    return this.http.post(`${this.apiBaseUrl}/createAssignmentByMock`, formData, {
      responseType: 'text'
    }).pipe(
      catchError(this.handleError)
    );
  }
private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
 
 
 
   /////////// mock project /////////
 createProjectByMock(
  projectTitle: string,
  projectDescription: string,
  projectDocument: File,
  mockId: number,
  teacherId: number
): Observable<string> {
  const formData = new FormData();
  formData.append('projectTitle', projectTitle);
  formData.append('projectDescription', projectDescription);
  formData.append('file', projectDocument);
  formData.append('mockId', mockId.toString());
  formData.append('teacherId', teacherId.toString());
 
  return this.http.post<string>(`${this.apiBaseUrl}/project/createProjectByMock`, formData);
}
 
 
////////// MOCK INTERVIEW /////////////////
createRoomForMock(
  name: string,
  teacherId: number,
  mockId: number,
  scheduledTime: string
): Observable<TrainingRoom> {
  const params = new HttpParams()
    .set('name', name)
    .set('teacherId', teacherId.toString())
    .set('mockId', mockId.toString())
    .set('scheduledTime', scheduledTime);
 
  return this.http.post<TrainingRoom>(`${this.apiBaseUrl}/api/training-rooms/createForMock`, null, { params });
}
 
 
 
// student perspective
 
 
 
  // ... any other methods you might have
 
  getSubmissionsByTeacher(teacherId: string): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/project/submissionsByTeacher/${teacherId}`);
  }
  // createFeedback(
  //   teacherId: string,
  //   studentId: string,
  //   feedback: string,
  //   grade: string,
  //   courseId?: number,
  //   quizId?: number,
  //   assignmentId?: number,
  //   projectId?: number,
  //   lessonId?: number,
  //   lessonModuleId?: number
  // ): Observable<any> {
  //   return this.http.post<any>('/teacherFeedback/create', {
  //     teacherId,
  //     studentId,
  //     courseId,
  //     quizId,
  //     assignmentId,
  //     projectId,
  //     lessonId,
  //     lessonModuleId,
  //     feedback,
  //     grade
  //   });
  // }
 
//   createFeedback(feedbackData: any,teacherId:any,studentId:any): Observable<any> {
//     return this.http.post<any>(`${this.apiBaseUrl}/teacherFeedback/create?teacherId=${teacherId}&studentId=${studentId}&feedback=${feedbackData.feedback}&grade=${feedbackData.grade}`,"");
// }
createFeedback(feedbackData: any, testType: string): Observable<any> {
  let url = `${this.apiBaseUrl}/teacherFeedback/create?teacherId=${feedbackData.teacherId}&studentId=${feedbackData.studentId}&feedback=${feedbackData.feedback}&grade=${feedbackData.grade}`;
 
  // Append the appropriate ID based on the test type
  if (testType === 'project' && feedbackData.projectId) {
    url += `&projectId=${feedbackData.projectId}`;
  } else if (testType === 'assignment' && feedbackData.assignmentId) {
    url += `&assignmentId=${feedbackData.assignmentId}`;
  }
 
  console.log('API Request URL:', url); // Debugging output
 
  // Send the request with responseType: 'text'
  return this.http.post(url, {}, { responseType: 'text' }).pipe(
    map(response => {
      try {
        // Try to parse the response as JSON
        const jsonResponse = JSON.parse(response);
        return jsonResponse;
      } catch (e) {
        console.error('Response is not valid JSON:', response);
        // Returning the raw response for further analysis
        return { error: 'Invalid JSON response', rawResponse: response };
      }
    }),
    catchError(error => {
      console.error('Error occurred:', error);
      return throwError(error);
    })
  );
}
 
getMockTestById(mockId: number): Observable<any> {
  return this.http.get<any>(`${this.apiBaseUrl}/getDetails/${mockId}`);
}
 
 
 
 
}
 
 
 
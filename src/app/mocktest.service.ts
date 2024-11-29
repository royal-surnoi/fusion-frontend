import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../environments/environment';
 
 
// Define the interface for the response of getMockStatus
 
export interface SubmitAssignmentResponse {
  id: number;
  submitAssignment: string | Blob; // Adjust type depending on what the API returns
  submittedAt: string; // Use 'Date' if you parse it into a Date object
  userAssignmentAnswer: string;
  isSubmitted: boolean;
  // Add other fields that match your API response
}
export interface MockStatusResponse {
  enrollmentStatus: {
    isEnrolled: boolean;
    isCompleted: boolean;
  };
  freeTrialsExceeded: boolean;
  mock_id:any;
}
 
export interface MockTestInterview {
  id: number;
  mock_id:any;
  title: string;
  description: string;
  courseId: number;
  fee: number;
  freeAttempts: number;
  testType: string;
  image: string;
  document?: string;
  topicName?: string;
}
export interface Slot {
  id: number;
  slotName: string;
  slotTime: string; // Change to Date
  endTime: string;  // Change to Date
  booked: boolean;
  mockTestInterview: {
    id: number;
    // Add other properties of MockTestInterview if needed
  };
}
 
export interface BookingRequest {
  slotId: number;
  userId: number;
}
 
export interface BookedMockTestInterview {
  id: number;
  slot: {
    id: number;
    slotName: string;
    slotTime: string; // Change to Date if needed
    endTime: string;  // Change to Date if needed
    booked: boolean;
    mockTestInterview: {
      id: number;
    };
  };
  user: {
    id: number;
    name: string;
    // Add other properties of User if needed
  };
  bookingTime: string; // Change to Date if needed
}
// export interface BookedSlot {
//   id: number;
//   slotName: string;
//   slotTime: string;
//   endTime: string;
//   booked: boolean;
// }
// Define interfaces to match the expected data structure
// Interface for the mock test interview details
// interface BookedSlot {
//   id: number;
//   mockTestTitle: string;
//   slotTime: number[];
//   endTime: number[];
//   testType: string;
//   mockId: number;
// }
export interface BookedSlot {
  id: number;
  title: string;
  slotDate: number[];
  endDate: number[];
  type: string;
  mockId: number;
}
 
 
 
 
 
@Injectable({
  providedIn: 'root'
})
export class MockTestService {
  joinSlot(slotId: number) {
    throw new Error('Method not implemented.');
  }
  private apiBaseUrl = environment.apiBaseUrl;
 
  constructor(private http: HttpClient) {}
 
  getMockTests(): Observable<MockTestInterview[]> {
    return this.http.get<MockTestInterview[]>(`${this.apiBaseUrl}/getAllSelectedFields`).pipe(
      tap(response => console.log('Mock Tests Response:', response)),
      catchError(error => {
        console.error('Error fetching mock tests:', error);
        return throwError(error);
      })
    );
  }
 
 
 
  getMockStatus(userId: number, courseId: number, mockId: number): Observable<MockStatusResponse> {
    let params = new HttpParams()
      .set('userId', userId.toString())
      .set('courseId', courseId.toString())
      .set('mockId', mockId.toString());
 
    return this.http.get<MockStatusResponse>(`${this.apiBaseUrl}/getMockStatus`, { params }).pipe(
      tap(response => console.log('Mock Status Response:', response)),
      catchError(error => {
        console.error('Error fetching mock status:', error);
        return throwError(error);
      })
    );
  }
 
  getAvailableSlots(mockId: number): Observable<Slot[]> {
    return this.http.get<Slot[]>(`${this.apiBaseUrl}/api/slots/available/${mockId}`).pipe(
      tap(response => console.log('Available Slots Response:', response)),
      catchError(error => {
        console.error('Error fetching available slots:', error);
        return throwError(error);
      })
    );
  }
 
 
  bookSlot(slotId: number, userId: number): Observable<any> {
    const bookingRequest: BookingRequest = { slotId, userId };
    return this.http.post<any>(`${this.apiBaseUrl}/api/bookings/book`, bookingRequest);
}
 
getBookedSlotsByUserId(userId: number): Observable<BookedMockTestInterview[]> {
  return this.http.get<BookedMockTestInterview[]>(`${this.apiBaseUrl}/api/bookings/User/${userId}`);
}
getBookedSlotsByStudentId(userId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiBaseUrl}/api/bookings/User/${userId}`);
}
// getMockTestById(id: number): Observable<MockTestInterview> {
//   return this.http.get<MockTestInterview>(`${this.apiBaseUrl}/getMock/${id}`);
// }
getMockTestDetails(mockId: number): Observable<any> {
  return this.http.get<any>(`${this.apiBaseUrl}/getDetails/${mockId}`);
}
 
 
 
getMockTestById(mockId: number): Observable<any> {
  return this.http.get<any>(`${this.apiBaseUrl}/getDetails/${mockId}`);
}
 
 
// submitAssignmentByMock(formData: FormData): Observable<SubmitAssignmentResponse> {
//   return this.http.post<SubmitAssignmentResponse>(`${environment.apiBaseUrl}/submitAssignmentByMock`, formData)
//     .pipe(
//       catchError((error: HttpErrorResponse) => {
//         // Handle the error here
//         console.error('Error in submitAssignmentByMock:', error);
//         return throwError(() => new Error(error.message || 'Server Error'));
//       })
//     );
// }
 
submitAssignmentByMock(
  studentId: number,
  assignmentId: number,
  mockId: number,
  submitAssignment: File | null,
  userAssignmentAnswer: string
): Observable<any> {
  const formData = new FormData();
  formData.append('studentId', studentId.toString());
  formData.append('assignmentId', assignmentId.toString());
  formData.append('mockId', mockId.toString());
  if (submitAssignment) {
    formData.append('submitAssignment', submitAssignment);
  }
  if (userAssignmentAnswer) {
    formData.append('userAssignmentAnswer', userAssignmentAnswer);
  }
 
  return this.http.post<any>(`${this.apiBaseUrl}/submitAssignmentByMock`, formData).pipe(
    tap(response => console.log('Submit Assignment Response:', response)),
    catchError(this.handleError)
  );
}
 
submitProjectByMock(studentId: number, projectId: number, mockId: number, file: File, userAnswer: string): Observable<SubmitAssignmentResponse> {
  const formData = new FormData();
  formData.append('studentId', studentId.toString());
  formData.append('projectId', projectId.toString());
  formData.append('mockId', mockId.toString());
  formData.append('file', file);
  if (userAnswer) {
    formData.append('userAnswer', userAnswer);
  }
 
  return this.http.post<SubmitAssignmentResponse>(`${this.apiBaseUrl}/submitProjectByMock`, formData)
    .pipe(
      catchError(this.handleError)
    );
}
 
private handleError(error: HttpErrorResponse) {
  console.error('An error occurred:', error);
  return throwError(() => new Error('Something went wrong; please try again later.'));
}
 
downloadDocument(documentUrl: string): Observable<Blob> {
  return this.http.get(documentUrl, { responseType: 'blob' }).pipe(
    catchError(this.handleError)
  );
}
 
 
}
 
 
 
 
 
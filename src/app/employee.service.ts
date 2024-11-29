import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
// import { Employee } from "./employee";
import { catchError, map, tap, throwError } from "rxjs";
import { environment } from "../environments/environment";
import { Injectable } from "@angular/core";
import { Employee } from "./employee";
interface ProgressData {
  currentStep: number;
  completedSteps: number;
}
  
 
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  updateWatchedPercentage(userId: number, videoId: number, previousProgress: number) {
    throw new Error('Method not implemented.');
  }
 
 
 
  private apiBaseUrl = environment.apiBaseUrl;
 
  constructor(private http:HttpClient) { }
 
  createEmployee(employee: Employee): Observable<object>{
    return this.http.post(`${this.apiBaseUrl}/basicInfo/add`,employee);
  }
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiBaseUrl}/basicInfo/get/${id}`);
  }
 
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiBaseUrl}/fusion/api/getEmployees`);
  }
  getAllEmployeeshome(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiBaseUrl}/fusion/api/getEmployees`);
  }
  getAllEmployeesContact(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiBaseUrl}/contact/all`);
  }
  getAllEmployeePayment(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiBaseUrl}/api/fusionall`);
  }
 
  deleteEmployee(id: number): Observable<object> {
    return this.http.delete(`${this.apiBaseUrl}/basicInfo/delete/${id}`);
  }
  updateJobStatus(employeeId: number, jobStatus: string): Observable<string> {
    const url = `${this.apiBaseUrl}/employee/updateJobStatus/${employeeId}`;
    const params = { jobStatus };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
       
      })
    };
   
    return this.http.put<string>(url, null, { params });
  }
  getShortlistedEmployees(): Observable<Employee[]> {
    const url = `${this.apiBaseUrl}/employee/getByJobStatus/shortlisted`;
 
   
 
    return this.http.get<Employee[]>(url);
  }
 getbyid(id:any): Observable<any>{
  return this.http.get<any>(`${this.apiBaseUrl}/user/find/${id}`);
 }
  getProgressData(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/candidate/progress/`);
  }
 
  updateProgressData(currentStep: number, completedSteps: number): Observable<any> {
    const url = `${this.apiBaseUrl}/candidate/updateProgress`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
       
      })
    };
    const params = new HttpParams()
      .set('currentStep', currentStep.toString())
      .set('completedSteps', completedSteps.toString());
 
    return this.http.put<any>(url, null, { params, ...httpOptions });
  }
  getProgressDataById(id: number): Observable<ProgressData> {
    const url = `${this.apiBaseUrl}/candidate/progress/${id}`;
    return this.http.get<ProgressData>(url).pipe(
      catchError(this.handleError<ProgressData>('getProgressDataById'))
    );
  }
 
  updateProgressDataById(id: number, currentStep: number, completedSteps: number): Observable<any> {
    const url = `${this.apiBaseUrl}/candidate/updateProgress/${id}`;
    const progressData = { currentStep, completedSteps };
    return this.http.put(url, progressData, { observe: 'response', responseType: 'text' }).pipe(
      map((response: { status: number; body: any; statusText: any; }) => {
        if (response.status === 200) {
          return response.body; // Return the response body as a string
        } else {
          throw new Error(`Server responded with ${response.status} ${response.statusText}`);
        }
      }),
      catchError(this.handleError<any>('updateProgressDataById'))
    );
  }
 
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return error;
    };
  }
  saveEmployee(employee: Employee): Observable<object> {
    return this.http.put(`${this.apiBaseUrl}/basicInfo/update/image/{id}`, employee, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  updateBasicInfo(id: number, employee: Employee): Observable<Employee> {
    const url = `${this.apiBaseUrl}/basicInfo/update/${id}`;
    return this.http.put<Employee>(url, employee).pipe(
      catchError(error => {
        console.error('Error updating basic info:', error);
        throw error; // Rethrow the error for further handling
      })
    );
  }

  getWatchedPercentage(id:number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/progress/${id}`);
  }

  saveProgress(id: number, progress: any): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/api/videos/progress/${id}`, null, {
      params: {
        watchedPercentage: progress.watchedPercentage,
        lastWatchedTime: progress.lastWatchedTime
      }
    });
  }
  

  completeVideo(progress: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/progress/complete`, progress);
  } 
  resetPassword(email: string, currentPassword: string, newPassword: string): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('currentPassword', currentPassword)
      .set('newPassword', newPassword);
  
    return this.http.put(`${this.apiBaseUrl}/basicInfo/update-password`, null, { params, responseType: 'text' });
  }
  
  
  getVideosByCourseId(courseId: number): Observable<any[]> {
    // Adjust the endpoint and parameters according to your API
    const url = `${this.apiBaseUrl}/api/courses/videos/${courseId}`;

    return this.http.get<any[]>(url);
  }
  


  getVideoById(id: number) {
    return this.http.get(`${this.apiBaseUrl}/api/videos/3`);
  }
  uploadProfilePicture(id:number,formData: FormData): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/basicInfo/update/image/${id}`, formData);
  }
  uploadVideo(courseID: number, formData: FormData): Observable<any> {
    const url = `${this.apiBaseUrl}/upload/${courseID}`;
    return this.http.post<any>(url, formData).pipe(
      catchError(this.handleError<any>('uploadVideo'))
    );
  }
  getEnrolledCourses(candidateId: string): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/enroll/user/${candidateId}`);
  }
  getCourseContent(courseId: string): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/courses/${courseId}/content`);
  }

addEmployee(employee:Employee):Observable<Employee>{
  return this. http.post<Employee>(`${this.apiBaseUrl}/Employee/addEmployee` ,employee)

}
getEmployees():Observable<Employee[]>{
  return this.http.get<Employee[]>(`${this.apiBaseUrl}`,)
}
  deleteEmloyees():Observable<Employee>{
    return this.http.delete<Employee>(`${this.apiBaseUrl}`,)
  }
  editEmployee(id:number,employee:Employee):Observable<Employee>{
    return this.http.put<Employee>(`${this.apiBaseUrl}/${id}`,employee)
  }
}

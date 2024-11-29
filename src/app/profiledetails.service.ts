import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { Employee } from './personal-details/personal-details.component';
 
 
export interface WorkExperience1 {
  id: number;
  workCompanyName: string;
  workStartDate: string; // Use string to match backend's format
  workEndDate: string | null; // Use string or null
  workDescription: string;
  workRole: string;
  currentlyWorking: boolean;
  isEditing?: boolean;
  // cardId:number;
}
export interface User {
  id: number;
  name: string;
  email:string;
  isFollowed: boolean;
  followRequested: boolean;
  profilePic?: string; // Changed to profileImage
  role?: string;
  userImage?: string | null;
  profession:string ;
  followingCount?:number;
}
@Injectable({
  providedIn: 'root'
})
export class ProfiledetailsService {
 
 
 
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
    return this.http.delete(`${this.apiBaseUrl}/employee/delete/${id}`);
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
  return this.http.get<any>(`${this.apiBaseUrl}/basicInfo/get/${id}`);
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
 
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return error;
    };
  }
  saveEmployee(employee: Employee): Observable<object> {
    return this.http.post(`${this.apiBaseUrl}/basicInfo/add`, employee, {
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
  createPersonalDetails(userId: number, personalDetails: any): Observable<any> {
    const url = `${this.apiBaseUrl}/personalDetails/create/${userId}`;
    return this.http.post<any>(url, personalDetails).pipe(
      catchError(error => {
        console.error('Error creating personal details:', error);
        return throwError(error); // Rethrow the error for further handling
      })
    );
  }
  savePersonalInfo(userId: string, personalInfo: any): Observable<any> {
    const url = `${this.apiBaseUrl}/personalDetails/create/${userId}`;
    return this.http.post(url, personalInfo);
  }
  saveWorkExperience(personalDetailsId: number, workExperience: WorkExperience1): Observable<WorkExperience1> {
    return this.http.post<WorkExperience1>(`${this.apiBaseUrl}/create/${personalDetailsId}`, workExperience);
  }
 
  getWatchedPercentage(id: number, videoId: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/WatchedPercentage/progress/${id}`);
  }
 
  saveProgress(id:number,progress: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}api//videos/progress/${id}`   , progress);
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
 
  getVideosByCourseId(courseId: string): Observable<any[]> {
    // Adjust the endpoint and parameters according to your API
    const url = `${this.apiBaseUrl}/api/course/videos/${courseId}`;
 
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
  getEnrolledCourses(candidateId: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/enroll/user/${candidateId}`);
  }
  getCourseContent(courseId: string): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/courses/${courseId}/content`);
  }
 
// ============= personal info ==================
 
updatePersonalDetails(personalDetailsId: number, personalDetails: any): Observable<any> {
  const url = `${this.apiBaseUrl}/personalDetails/update/${personalDetailsId}`;
  return this.http.put<any>(url, personalDetails).pipe(
    catchError(error => {
      console.error('Error updating personal details:', error);
      return throwError(error);
    })
  );
}
 
// ========================= education =================
 
createEducation(currentUserId: number, education: any): Observable<any> {
  return this.http.post(`${this.apiBaseUrl}/education/create/user/${currentUserId}`, education)
    .pipe(
      map(response => {
        console.log('Create education response:', response); // Debugging
        return response;
      })
    );
}
// Update education details
updateEducation(id: number, education: any): Observable<any> {
  return this.http.put(`${this.apiBaseUrl}/education/update/${id}`, education)
    .pipe(
      map(response => {
        console.log('Update education response:', response); // Debugging
        return response;
      })
    );
}
getEducationDetails(currentUserId: number): Observable<any> {
  return this.http.get<any>(`${this.apiBaseUrl}/education/user/${currentUserId}`);
}
 
 
getPersonalDetailsById(userId: number): Observable<any> {
  return this.http.get<any>(`${this.apiBaseUrl}/personalDetails/get/user/${userId}`);
}
 
// ================ experience ==========================================
 
getWorkExperience(id: number, currentUserId: number): Observable<WorkExperience1> {
return this.http.get<WorkExperience1>(`${this.apiBaseUrl}workExperience/user/${currentUserId}/workExperience/${id}`);
}
getAllWorkExperiences(currentUserId: number): Observable<WorkExperience1[]> {
return this.http.get<WorkExperience1[]>(`${this.apiBaseUrl}/workExperience/user/${currentUserId}`);
}
 
updateWorkExperience(id: number, workExperience: WorkExperience1): Observable<any> {
return this.http.put(`${this.apiBaseUrl}/workExperience/update/${id}`, workExperience);
}
createWorkExperience(currentUserId: number, workExperience: WorkExperience1): Observable<WorkExperience1> {
return this.http.post<WorkExperience1>(`${this.apiBaseUrl}/workExperience/user/${currentUserId}`, workExperience);
}
 
 
 // ======================= profile pic ============================
 
 updateUserProfileImage(userId: number, formData: FormData): Observable<any> {
  const headers = new HttpHeaders();
 
  return this.http.put<any>(`${this.apiBaseUrl}/update/${userId}`, formData, { headers });
}
getUserDetails(userId: number): Observable<User> {
  return this.http.get<User>(`${this.apiBaseUrl}/user/find/${userId}`);
}
updateUserName(userId: number, name: string): Observable<string> {
  const params = new HttpParams().set('name', name);
  return this.http.patch<string>(`${this.apiBaseUrl}/user/${userId}/name`, null, { params: params });
}
uploadUserImage(userId: number, image: File) {
  const formData = new FormData();
  formData.append('image', image, image.name);
  return this.http.post<string>(`${this.apiBaseUrl}/user/${userId}/uploadImage`, formData);
}
 
}
 
 
 
 
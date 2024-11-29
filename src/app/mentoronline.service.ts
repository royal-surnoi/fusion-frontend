import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import moment from 'moment-timezone';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  preferences: any;
  profession: string;
  language: string;
  otp: string;
  otpGeneratedTime: string;
  createdAt: string;
  updatedAt: string;
  userImage: string;
  onlineStatus: string;
  lastSeen: [number, number, number, number, number, number, number];
  userDescription: string;
}
export interface UserEnrollmentResponse {
  user: User;
  courseTitles: string[];
}

export interface Course {
  courseLanguage:any;
  id: number;
  courseTitle: string;
  courseDescription: string;
  language: string;
  level: string;
  courseDuration: string;
  createdAt: string;
  updatedAt: string;
  lessons: any;
  submissions: any;
  user: User;
  enrollments: any;
  videos: any;
  reviews: any;
  projects: any;
  assignments: any;
  courseTools: any;
  submitProjects: any;
  announcements: any;
  quizzes: any;
  answers: any;
  courseFee: any;
  discountFee: any;
  discountPercentage: any;
  currency: any;
  promoCodeExpiration: string;
  level_1: string;
  level_2: string;
  level_3: string;
  level_4: string;
  level_5: string;
  level_6: string;
  level_7: string;
  level_8: string;
  promoCode: string;
  courseType: any;
  coursePercentage: string;
  courseTerm: string;
  courseImage: string;
  courseDocument: any;
}
export interface TrainingRoom {
  id: number;
  name: string;
  conferenceUrl:any
  scheduledTime:any
  // Add other fields as necessary
}
export interface Enrollment {
  id: number;
  user: User;
  course: Course;
}
export interface Project {
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
  // Add other fields as necessary
}

@Injectable({
  providedIn: 'root'
})
export class MentoronlineService {


  private apiBaseUrl = environment.apiBaseUrl;
  handleError: any;

  constructor(private http: HttpClient) { }

  //////////// getting online courses by mentor ////////////
getOnlineCoursesByMentor(userId: number): Observable<Course[]> {
  return this.http.get<Course[]>(`${this.apiBaseUrl}/course/online/byMentor/${userId}`);
}

/////////////////////////////////
getCourseById(id: number): Observable<Course> {
  return this.http.get<Course>(`${this.apiBaseUrl}/course/getBy/${id}`);
}

createRoom(name: string, courseId: number, scheduledTime: Date): Observable<any> {
  const userId = localStorage.getItem('id');
 
  if (!userId) {
    throw new Error('User ID not found in localStorage');
  }
 
  // Convert scheduledTime to IST and format to 'YYYY-MM-DDTHH:mm:ssZ' (ISO 8601 format)
  const istScheduledTime = moment.tz(scheduledTime, 'Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ssZ');
 
  let params = new HttpParams()
    .set('name', name)
    .set('userId', userId)
    .set('courseId', courseId.toString())
    .set('scheduledTime', istScheduledTime);
 
  return this.http.post(`${this.apiBaseUrl}/api/training-rooms/create`, null, { params });
}
 
//////////// get online classes by courseId ///////////////

getRoomsByCourse(courseId: number, teacherId: number): Observable<TrainingRoom[]> {
  return this.http.get<TrainingRoom[]>(`${this.apiBaseUrl}/api/training-rooms/by-course/${courseId}/${teacherId}`);
}
/////////// get course by userId //////////
   // Method to fetch courses by userId
   getCoursesByUserId(): Observable<Course[]> {
    const userId = localStorage.getItem('id'); // Retrieve userId from localStorage
    const url = `${this.apiBaseUrl}/course/getByUser/${userId}`;
    return this.http.get<Course[]>(url);
  }
  
  // Method to fetch enrollments by courseId
  getEnrollmentsByCourseId(courseId: number): Observable<Enrollment[]> {
    const url = `${this.apiBaseUrl}/enrollment/course/${courseId}`;
    return this.http.get<Enrollment[]>(url);
  }

    // Method to create multiple projects
    createMultipleProjects(
      courseId: number,
      studentIds: number[],
      projectTitle: string,
      projectDescription: string,
      teacherId: number,
      projectDocument: File,
      projectDeadline: string,
      startDate: string,
      reviewMeetDate: string,
      gitUrl?: string
    ): Observable<any> {
      const formData = new FormData();
    
      // Append file and data to FormData
      formData.append('projectDocument', projectDocument);
      formData.append('courseId', courseId.toString());
      formData.append('studentIds', studentIds.join(','));
      formData.append('projectTitle', projectTitle);
      formData.append('projectDescription', projectDescription);
      formData.append('teacherId', teacherId.toString());
      formData.append('projectDeadline', projectDeadline);
      formData.append('startDate', startDate);
      formData.append('reviewMeetDate', reviewMeetDate);
    
      if (gitUrl) {
        formData.append('gitUrl', gitUrl);
      }
    
      return this.http.post(`${this.apiBaseUrl}/project/createMultipleProjects`, formData);
    }
    
  

  // Method to create a training room and assign it to users
  createRoomToUsers(formData: any): Observable<TrainingRoom> {
    const url = `${this.apiBaseUrl}/api/training-rooms/createRoomToUsers`;
   
    // Convert the form data to query parameters using HttpParams
    let params = new HttpParams();
 
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
 
      if (Array.isArray(value)) {
        // Append each array item as separate query parameters
        value.forEach((item: any) => {
          params = params.append(key, item.toString());
        });
      } else {
        // Append non-array values directly
        params = params.append(key, value);
      }
    });
 
    return this.http.post<TrainingRoom>(url, null, { params });
  }
 
 
  // createMultipleAssignment(
  //   teacherId: number,
  //   studentId: number,
  //   formData: FormData
  // ): Observable<any> {
  //   return this.http.post(`${this.apiBaseUrl}/createMultipleAssignment`, formData, {
  //     params: {
  //       teacherId: teacherId.toString(),
  //       studentIds: studentId.toString(),
  //     }
  //   });
  // }
  // createMultipleAssignment(formData: FormData): Observable<any> {
  //   return this.http.post(`${this.apiBaseUrl}/createMultipleAssignment`, formData);
  // }
  createAssignment(data: FormData): Observable<any> {
    const url = `${this.apiBaseUrl}/createMultipleAssignment`;
    return this.http.post(url, data);
  }
  getEnrolledStudents(instructorId: number): Observable<UserEnrollmentResponse[]> {
    return this.http.get<UserEnrollmentResponse[]>(`${this.apiBaseUrl}/api/dashboard/enrolled-students`, {
      params: new HttpParams().set('instructorId', instructorId.toString())
    });
  }
  createMultipleAssignments(
    courseId: number,
    studentIds: number[],
    assignmentTitle: string,
    assignmentTopicName: string,
    assignmentDescription: string,
    teacherId: number,
    assignmentDocument: File,
    startDate: string,
    endDate: string,
    reviewMeetDate: string,
    maxScore: number,
    gitUrl?: string
  ): Observable<any> {
    const formData = new FormData();
   
    // Append file and data to FormData
    formData.append('assignmentDocument', assignmentDocument);
    formData.append('courseId', courseId.toString());
    formData.append('studentIds', studentIds.join(','));
    formData.append('assignmentTitle', assignmentTitle);
    formData.append('assignmentTopicName', assignmentTopicName);
    formData.append('assignmentDescription', assignmentDescription);
    formData.append('teacherId', teacherId.toString());
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('reviewMeetDate', reviewMeetDate);
    formData.append('maxScore', maxScore.toString());
 
    if (gitUrl) {
      formData.append('gitUrl', gitUrl);
    }
 
    return this.http.post(`${this.apiBaseUrl}/createMultipleAssignment`, formData);
  }
 
 
  // createMultipleAssignment(formData: any): Observable<any> {
  //   return this.http.post('/createMultipleAssignment', formData);
  // }
 


}  

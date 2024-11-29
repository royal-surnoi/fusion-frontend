import { Injectable } from '@angular/core';
import { delay, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../environments/environment';
// import { HttpClient } from '@angular/common/http';
export interface Video {
  title: string;
  url: string; // URL of the video
}
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class Mentor1Service {


  
  private apiBaseUrl = environment.apiBaseUrl;
  handleError: any;



  private mockData = {
    overview: {
      activeCourses: 5,
      totalStudents: 150,
      pendingAssessments: 10,
      newMessages: 7,
      enrollmentTrends: [
        { name: 'Web Development', series: [
          { name: 'Jan', value: 20 },
          { name: 'Feb', value: 25 },
          { name: 'Mar', value: 30 },
        ]},
        { name: 'Data Science', series: [
          { name: 'Jan', value: 15 },
          { name: 'Feb', value: 20 },
          { name: 'Mar', value: 22 },
        ]}
      ]
    },
    courses: [       { id: 1, name:
      'Web Development'
      , enrolledStudents: 50, averageProgress: 75, description:
      'Learn web development fundamentals'
      },       { id: 2, name:
      'Data Science'
      , enrolledStudents: 40, averageProgress: 60, description:
      'Introduction to data science and analytics'
      },       { id: 3, name:
      'Mobile App Development'
      , enrolledStudents: 30, averageProgress: 80, description:
      'Build mobile apps for iOS and Android'
      },       { id: 4, name:
      'Machine Learning'
      , enrolledStudents: 20, averageProgress: 50, description:
      'Fundamentals of machine learning algorithms'
      },       { id: 5, name:
      'Cloud Computing'
      , enrolledStudents: 10, averageProgress: 40, description:
      'Learn cloud technologies and services'
      }     ],
    students: [
      { id: 1, name:
        'John Doe'
        , email:
        'john@example.com'
        , enrolledCourses: [
        'Web Development'
        ,
        'Python Basics'
        ], overallProgress: 75 },,
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', enrolledCourses: 3, overallProgress: 85 }, { id: 2, name:
        'Jane Smith'
        , email:
        'jane@example.com'
        , enrolledCourses: [
        'Data Science'
        ,
        'Machine Learning'
        ], overallProgress: 85 },     { id: 3, name:
        'Bob Johnson'
        , email:
        'bob@example.com'
        , enrolledCourses: [
        'Mobile App Development'
        ], overallProgress: 60 },     { id: 4, name:
        'Alice Brown'
        , email:
        'alice@example.com'
        , enrolledCourses: [
        'Web Development'
        ,
        'UI/UX Design'
        ], overallProgress: 90 },     { id: 5, name:
        'Charlie Wilson'
        , email:
        'charlie@example.com'
        , enrolledCourses: [
        'Python Basics'
        ,
        'Data Science'
        ], overallProgress: 70 }
      ,
      // ... more students
    ],
   
    assessments: [
      { id: 1, title: 'JavaScript Quiz', course: 'Web Development', submittedBy: 45, pending: 5 },
      { id: 2, title: 'Python Project', course: 'Data Science', submittedBy: 35, pending: 3 },
      // ... more assessments
    ],
    messages: [
      { id: 1, from: 'John Doe', subject: 'Question about JavaScript', date: new Date(), read: false },
      { id: 2, from: 'Jane Smith', subject: 'Project submission', date: new Date(), read: true },
      // ... more messages
    ],
    analytics: {
      courseEngagement: [
        { name: 'Web Development', value: 85 },
        { name: 'Data Science', value: 72 },
        { name: 'Mobile App Development', value: 78 },
        { name: 'Machine Learning', value: 65 },
        { name: 'Cloud Computing', value: 70 }
      ],
      studentPerformance: [
        { name: 'Excellent', value: 20 },
        { name: 'Good', value: 45 },
        { name: 'Average', value: 25 },
        { name: 'Needs Improvement', value: 10 }
      ]
    }
  };
 
  getOverviewData(): Observable<any> {
    return of(this.mockData.overview).pipe(delay(500));
  }
 
  getCourses(): Observable<any[]> {
    return of(this.mockData.courses).pipe(delay(500));
  }
 
  getStudents(): Observable<any[]> {
    return of(this.mockData.students).pipe(delay(500));
  }
 
  getAssessments(): Observable<any[]> {
    return of(this.mockData.assessments).pipe(delay(500));
  }
 
  getMessages(): Observable<any[]> {
    return of(this.mockData.messages).pipe(delay(500));
  }
 
  getAnalytics(): Observable<any> {
    return of(this.mockData.analytics).pipe(delay(500));
  }
 
  // Add methods for CRUD operations
  // createCourse(course: any): Observable<any> {
 
  //   return of({ success: true }).pipe(delay(500));
  // }
 
  // updateCourse(course: any): Observable<any> {
   
  //   return of({ success: true }).pipe(delay(500));
  // }
 
  // deleteCourse(courseId: number): Observable<any> {
   
  //   return of({ success: true }).pipe(delay(500));
  // }
 
  // CRUD operations for courses
  createCourse(course:
    any
    ): Observable<
    any
    > {     const newCourse = {       id: this.mockData.courses.length + 1,       name: course.name,       enrolledStudents: 0,       averageProgress: 0,       description: course.description     };     this.mockData.courses.push(newCourse);     return of({ success: true, course: newCourse }).pipe(delay(500));   }   updateCourse(course:
    any
    ): Observable<
    any
    > {     const index = this.mockData.courses.findIndex(c => c.id === course.id);     if (index !== -1) {       this.mockData.courses[index] = { ...this.mockData.courses[index], ...course };       return of({ success: true, course: this.mockData.courses[index] }).pipe(delay(500));     }     return of({ success: false, message:
    'Course not found'
    }).pipe(delay(500));   }   deleteCourse(courseId:
    number
    ): Observable<
    any
    > {     const initialLength = this.mockData.courses.length;     this.mockData.courses = this.mockData.courses.filter(c => c.id !== courseId);     if (this.mockData.courses.length < initialLength) {       return of({ success: true, message:
    'Course deleted successfully'
    }).pipe(delay(500));     }     return of({ success: false, message:
    'Course not found'
    }).pipe(delay(500));   }  
    // Get a single course by ID
      getCourseById(courseId:
    number
    ): Observable<
    any
    > {     return this.getCourses().pipe(       map(courses => courses.find(course => course.id === courseId))     );   }  
    // Update course progress
      updateCourseProgress(courseId:
    number
    , progress:
    number
    ): Observable<
    any
    > {     const course = this.mockData.courses.find(c => c.id === courseId);     if (course) {       course.averageProgress = progress;       return of({ success: true, course }).pipe(delay(500));     }     return of({ success: false, message:
    'Course not found'
    }).pipe(delay(500));   }  
    // Enroll a student in a course
      enrollStudentInCourse(courseId:
    number
    ): Observable<
    any
    > {     const course = this.mockData.courses.find(c => c.id === courseId);     if (course) {       course.enrolledStudents += 1;       return of({ success: true, course }).pipe(delay(500));     }     return of({ success: false, message:
    'Course not found'
    }).pipe(delay(500));   }  
    // Remove a student from a course
      removeStudentFromCourse(courseId:
    number
    ): Observable<
    any
    > {     const course = this.mockData.courses.find(c => c.id === courseId);     if (course && course.enrolledStudents > 0) {       course.enrolledStudents -= 1;       return of({ success: true, course }).pipe(delay(500));     }     return of({ success: false, message:
    'Course not found or no students to remove'
    }).pipe(delay(500));   }
 
    // getStudentById(id: number): Observable<any> {
    //   const student = this.students.find(s => s.id === id);
    //   if (student) {
    //     return of(student).pipe(delay(300));
    //   } else {
    //     return throwError('Student not found');
    //   }
    // }
    sendMessageToStudent(studentId: number, message: string): Observable<any> {
      // Simulate sending a message
     console.log(`Sending message to student ${studentId}: ${message}`);
     
      // Check if the student exists
      // const student = this.students.find(s => s.id === studentId);
      // if (!student) {
      //   return throwError('Student not found');
      // }
   
      // Simulate API call with delay
      return of({
        success: true,
        message: 'Message sent successfully',
        timestamp: new Date().toISOString()
     }).pipe(delay(500));
    }
 
 
    private sampleOverviewData = {
 
      totalStudents: 150,
   
      activeCourses: 8,
   
      pendingAssessments: 12,
   
      averageProgress: 68
   
    };
   
    private sampleCourses = [
   
      { id: 1, name: 'Introduction to Web Development', enrolledStudents: 30, averageProgress: 75 },
   
      { id: 2, name: 'Advanced JavaScript', enrolledStudents: 25, averageProgress: 62 },
   
      { id: 3, name: 'React Fundamentals', enrolledStudents: 40, averageProgress: 58 },
   
      { id: 4, name: 'Node.js Backend Development', enrolledStudents: 20, averageProgress: 70 },
   
      { id: 5, name: 'Data Structures and Algorithms', enrolledStudents: 35, averageProgress: 55 }
   
    ];
   
    private sampleStudents = [
   
      { id: 1, name: 'John Doe', email: 'john@example.com', enrolledCourses: 2, overallProgress: 80 },
   
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', enrolledCourses: 3, overallProgress: 75 },
   
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', enrolledCourses: 1, overallProgress: 60 },
   
      { id: 4, name: 'Alice Brown', email: 'alice@example.com', enrolledCourses: 2, overallProgress: 85 },
   
      { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', enrolledCourses: 3, overallProgress: 70 }
   
    ];
   
    private sampleAssessments = [
   
      { id: 1, title: 'JavaScript Basics Quiz', course: 'Introduction to Web Development', dueDate: '2023-08-15', submittedCount: 25, totalCount: 30 },
   
      { id: 2, title: 'React Components Project', course: 'React Fundamentals', dueDate: '2023-08-20', submittedCount: 15, totalCount: 40 },
   
      { id: 3, title: 'Node.js API Development', course: 'Node.js Backend Development', dueDate: '2023-08-25', submittedCount: 10, totalCount: 20 },
   
      { id: 4, title: 'Data Structures Midterm', course: 'Data Structures and Algorithms', dueDate: '2023-08-30', submittedCount: 0, totalCount: 35 }
   
    ];
   
    private sampleRecentActivities = [
   
      { icon: 'assignment', description: 'New assignment submitted', date: new Date('2023-07-15T10:30:00') },
   
      { icon: 'person_add', description: 'New student enrolled', date: new Date('2023-07-14T14:45:00') },
   
      { icon: 'grade', description: 'Assessment graded', date: new Date('2023-07-13T09:15:00') },
   
      { icon: 'school', description: 'New course created', date: new Date('2023-07-12T11:00:00') },
   
      { icon: 'announcement', description: 'Announcement posted', date: new Date('2023-07-11T16:30:00') }
   
    ];
   
    private sampleTopPerformingStudents = [
   
      { name: 'John Doe', progress: 95 },
   
      { name: 'Jane Smith', progress: 92 },
   
      { name: 'Bob Johnson', progress: 88 },
   
      { name: 'Alice Brown', progress: 85 },
   
      { name: 'Charlie Wilson', progress: 82 }
   
    ];
   
    constructor(private http: HttpClient) { }
   
    getOverviewData1(): Observable<any> {
   
      return of(this.sampleOverviewData).pipe(delay(500));
   
    }
   
    getCourses1(): Observable<any[]> {
   
      return of(this.sampleCourses).pipe(delay(500));
   
    }
   
    getStudents1(): Observable<any[]> {
   
      return of(this.sampleStudents).pipe(delay(500));
   
    }
   
    getAssessments1(): Observable<any[]> {
   
      return of(this.sampleAssessments).pipe(delay(500));
   
    }
   
    getRecentActivities(): Observable<any[]> {
   
      return of(this.sampleRecentActivities).pipe(delay(500));
   
    }
   
    getTopPerformingStudents(): Observable<any[]> {
   
      return of(this.sampleTopPerformingStudents).pipe(delay(500));
   
    }
   
    // CRUD operations for courses
   
    addCourse(course: any): Observable<any> {
   
      const newCourse = { ...course, id: this.sampleCourses.length + 1 };
   
      this.sampleCourses.push(newCourse);
   
      return of(newCourse).pipe(delay(500));
   
    }
   
    updateCourse1(courseId: number, courseData: any): Observable<any> {
   
      const index = this.sampleCourses.findIndex(c => c.id === courseId);
   
      if (index !== -1) {
   
        this.sampleCourses[index] = { ...this.sampleCourses[index], ...courseData };
   
        return of(this.sampleCourses[index]).pipe(delay(500));
   
      }
   
      return of(null).pipe(delay(500));
   
    }
   
    deleteCourse1(courseId: number): Observable<boolean> {
   
      const initialLength = this.sampleCourses.length;
   
      this.sampleCourses = this.sampleCourses.filter(c => c.id !== courseId);
   
      return of(this.sampleCourses.length < initialLength).pipe(delay(500));
   
    }
   
    // CRUD operations for students
   
    addStudent(student: any): Observable<any> {
   
      const newStudent = { ...student, id: this.sampleStudents.length + 1 };
   
      this.sampleStudents.push(newStudent);
   
      return of(newStudent).pipe(delay(500));
   
    }
   
    updateStudent(studentId: number, studentData: any): Observable<any> {
   
      const index = this.sampleStudents.findIndex(s => s.id === studentId);
   
      if (index !== -1) {
   
        this.sampleStudents[index] = { ...this.sampleStudents[index], ...studentData };
   
        return of(this.sampleStudents[index]).pipe(delay(500));
   
      }
   
      return of(null).pipe(delay(500));
   
    }
   
    deleteStudent(studentId: number): Observable<boolean> {
   
      const initialLength = this.sampleStudents.length;
   
      this.sampleStudents = this.sampleStudents.filter(s => s.id !== studentId);
   
      return of(this.sampleStudents.length < initialLength).pipe(delay(500));
   
    }
   
    // CRUD operations for assessments
   
    addAssessment(assessment: any): Observable<any> {
   
      const newAssessment = { ...assessment, id: this.sampleAssessments.length + 1 };
   
      this.sampleAssessments.push(newAssessment);
   
      return of(newAssessment).pipe(delay(500));
   
    }
   
    updateAssessment(assessmentId: number, assessmentData: any): Observable<any> {
   
      const index = this.sampleAssessments.findIndex(a => a.id === assessmentId);
   
      if (index !== -1) {
   
        this.sampleAssessments[index] = { ...this.sampleAssessments[index], ...assessmentData };
   
        return of(this.sampleAssessments[index]).pipe(delay(500));
   
      }
   
      return of(null).pipe(delay(500));
   
    }
   
    deleteAssessment(assessmentId: number): Observable<boolean> {
   
      const initialLength = this.sampleAssessments.length;
   
      this.sampleAssessments = this.sampleAssessments.filter(a => a.id !== assessmentId);
   
      return of(this.sampleAssessments.length < initialLength).pipe(delay(500));
   
    }
   
    // Additional methods
   
    enrollStudentInCourse1(studentId: number, courseId: number): Observable<boolean> {
   
      const student = this.sampleStudents.find(s => s.id === studentId);
   
      const course = this.sampleCourses.find(c => c.id === courseId);
   
      if (student && course) {
   
        student.enrolledCourses += 1;
   
        course.enrolledStudents += 1;
   
        return of(true).pipe(delay(500));
   
      }
   
      return of(false).pipe(delay(500));
   
    }
   
    gradeAssessment(assessmentId: number, studentId: number, grade: number): Observable<boolean> {
   
      // In a real application, you would update the student's grade for the specific assessment
   
      // For this sample, we'll just return true to simulate successful grading
   
      return of(true).pipe(delay(500));
   
    }
    // getStudentProgressData(): Observable<any[]> {
    //   const data = [
    //     { name: 'John Doe', progress: 75 },
    //     { name: 'Jane Smith', progress: 82 },
    //     { name: 'Mike Johnson', progress: 68 },
    //     { name: 'Sarah Williams', progress: 90 },
    //     { name: 'David Brown', progress: 60 }
    //   ];
    //   return of(data).pipe(delay(500));
    // }
     
    // getCourseEnrollmentData(): Observable<any[]> {
    //   const data = [
    //     { course: 'Web Development', students: 45 },
    //     { course: 'Data Science', students: 30 },
    //     { course: 'Mobile App Development', students: 25 },
    //     { course: 'Machine Learning', students: 20 },
    //     { course: 'Cloud Computing', students: 15 }
    //   ];
    //   return of(data).pipe(delay(500));
    // }
     
    // getAssessmentCompletionData(): Observable<any[]> {
    //   const data = [
    //     { date: '2023-06-01', completed: 20, total: 30 },
    //     { date: '2023-06-08', completed: 25, total: 35 },
    //     { date: '2023-06-15', completed: 28, total: 40 },
    //     { date: '2023-06-22', completed: 32, total: 45 },
    //     { date: '2023-06-29', completed: 38, total: 50 }
    //   ];
    //   return of(data).pipe(delay(500));
    // }
    getStudentProgressData() {
      // Return sample data for demonstration purposes
      return of([
        { name: 'Student 1', progress: 80 },
        { name: 'Student 2', progress: 70 },
        { name: 'Student 3', progress: 90 },
        { name: 'Student 4', progress: 60 },
        { name: 'Student 5', progress: 85 }
      ]);
    }
  
    getCourseEnrollmentData() {
      // Return sample data for demonstration purposes
      return of([
        { course: 'Course 1', students: 20 },
        { course: 'Course 2', students: 30 },
        { course: 'Course 3', students: 25 },
        { course: 'Course 4', students: 35 },
        { course: 'Course 5', students: 28 }
      ]);
    }
  
    getAssessmentCompletionData() {
      // Return sample data for demonstration purposes
      return of([
        { date: '', completed: 0, total: 0 },
        // { date: '2022-01-02', completed: 60, total: 120 },
        // { date: '2022-01-03', completed: 70, total: 130 },
        // { date: '2022-01-04', completed: 80, total: 140 },
        // { date: '2022-01-05', completed: 90, total: 150 }
      ]);
    }

    ///////////////////////// Course Management ///////////////////////////////
    getCoursesByUserId(userId: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiBaseUrl}/course/user/${userId}`);
    }
 
    getCourseEnrollments(courseId: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiBaseUrl}/course/enrollments/${courseId}`);
    }

    getCourseProgressForAllUsers(courseId: number): Observable<Map<number, { progress: number, userName: string }>> {
      return this.http.get<Map<number, { progress: number, userName: string }>>(
        `${this.apiBaseUrl}/video/progress/percentage/course/${courseId}`
      );
    }
    getVideosByCourse(courseId: number): Observable<Video[]> {
      return this.http.get<Video[]>(`${this.apiBaseUrl}/video/courses/videos/${courseId}`);
    }

    


    uploadVideo(courseId: number, file: File): Observable<any> {
      const formData = new FormData();
      formData.append('file', file);
 
      return this.http.post<any>(`${this.apiBaseUrl}/video/upload/${courseId}`, formData, {
        headers: new HttpHeaders({
          'Accept': 'application/json'
        })
      });
  }
}

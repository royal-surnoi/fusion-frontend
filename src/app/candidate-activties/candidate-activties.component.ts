
import { catchError, Observable, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AssignmentnewComponent } from '../assignmentnew/assignmentnew.component';
import { QuiznewComponent } from '../quiznew/quiznew.component';
import { ProjectnewComponent } from '../projectnew/projectnew.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Answer, StudentdashboardService } from '../studentdashboard.service';
import { CandidateActivitiesService } from '../candidate-activities.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
interface Activity {
  id: number;
  type: 'quiz' | 'assignment' | 'project';
  name: string;
  description: string;
  dueDate: Date;
  content: any;
}
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}
interface Quiz {
  id: number;
  title: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}
 
interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
}
 
interface Project {
  id: number;
  name: string;
  description: string;
  dueDateTime: string;
  maxTeamSize: number;
  githubUrl: string;
  teamMembers: string[];
}
interface Question {
  id: number;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}
 
@Component({
  selector: 'app-candidate-activties',
  standalone: true,
  imports: [CommonModule, AssignmentnewComponent, QuiznewComponent, ProjectnewComponent, ReactiveFormsModule, FormsModule,RouterLink,
    ToastModule, ButtonModule, RippleModule
  ],
  providers: [MessageService],
  templateUrl: './candidate-activties.component.html',
  styleUrl: './candidate-activties.component.css', animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class CandidateActivtiesComponent implements OnInit {
  submissionStatus: string = "asasa";
  submittedAssignment: any | null = null;
  submittedAnswer: string | null = null;
  submittedFileName: string | null = null;
  assignmentForm!: FormGroup;
  submittedAnswers: Answer[] = [];
  quizSuccess: any;
  quizzes: Quiz[] = [];
  quizId: any;
  questions: Question[] = [];
  projectNotes: string = '';
  projectDetails: any;
  userID: any;
  assignment: any;
  courseId: any;
  activityType: any;
  submissionSuccess: boolean = false;  // Flag to check if the project is submitted successfully
  submittedProject: any = {};
  activityId: any;
  courseType: any;
  lessonId:any;
  ngOnInit(): void {
    this.userId = localStorage.getItem('id')
    this.quizForm = this.fb.group({
      answers: this.fb.array([])
    });
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('courseId');
      this.courseType = params.get('courseType'); // Added this line
      this.activityType = params.get('activityType');
      this.activityId = params.get('activityId');
    });
    console.log(this.activeTab === 'assignment' && '!submissionStatus',"checking the weather the is working or not")
    console.log(this.activityId,this.courseType,this.courseId,"activityID----------")
    this.quizId = this.activityId
    this.loadQuestions(this.quizId)
    console.log('Route params:', { courseId: this.courseId, activityType: this.activityType, quizId: this.quizId, userId: this.userId });
    this.quizForm = this.fb.group({
      answers: this.fb.array(this.questions.map(() => ['', Validators.required]))
    });
    this.getProjectBycourseId(this.courseId)
    // throw new Error('Method not implemented.');
    this.getAssignmentDetails(this.activityId)
    this.assignmentForm = this.fb.group({
      answer: ['', Validators.required]
    });
  }
  activeTab = 'quiz';
  activeModule = '';
  userId: any;
  modules = ['Module 1', 'Module 2', 'Module 3'];
  
  constructor(private http: HttpClient, private messageService: MessageService,private fb: FormBuilder, private studentdashboardService: StudentdashboardService, private route: ActivatedRoute, private candidateActivitiesService: CandidateActivitiesService,private router: Router) {
    this.quizForm = this.fb.group({
      answers: this.fb.array([])
    });
    this.userID = localStorage.getItem('id')
  }
  quizForm: FormGroup;
  assignments: Record<string, Assignment[]> = {
    'Module 1': [
      {
        id: 1,
        title: 'Create a Basic Angular Component',
        description: 'Create a simple Angular component that displays a list of items.',
        dueDate: '2024-08-15',
        dueTime: '23:59'
      }
    ],
    'Module 2': [
      {
        id: 2,
        title: 'Implement Dependency Injection',
        description: 'Create a service and inject it into a component using dependency injection.',
        dueDate: '2024-09-01',
        dueTime: '23:59'
      }
    ],
    'Module 3': [
      {
        id: 3,
        title: 'Write Unit Tests',
        description: 'Write unit tests for the component created in Module 1 using Jasmine and Karma.',
        dueDate: '2024-09-15',
        dueTime: '23:59'
      }
    ]
  };
 
  projects: Project[] = [
    {
      id: 1,
      name: 'E-commerce Website',
      description: 'Build a fully functional e-commerce website using Angular and Node.js',
      dueDateTime: '2024-09-30T18:00',
      maxTeamSize: 3,
      githubUrl: '',
      teamMembers: ['']
    }
  ];
  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.activeModule = this.modules[0];
  }
  setActiveModule(module: string) {
    this.activeModule = module;
  }
  submitQuiz() {
    alert('Quiz submitted successfully!');
  }
  addTeamMember(project: Project) {
    if (project.teamMembers.length < project.maxTeamSize) {
      project.teamMembers.push('');
    }
  }
  removeTeamMember(project: Project, index: number) {
    project.teamMembers.splice(index, 1);
  }
 
  // Add a variable to store the uploaded file
  file!: File;
 
  // Add a function to handle file upload
  uploadFile(event: any) {
    this.file = event.target.files[0];
  }
  showToast1() {
    console.log("11111111111")
    this.messageService.clear();
    this.messageService.add({ key: 'toast1', severity: 'success', summary: 'Success', detail: 'key: toast1' });
}

showToast2() {
    this.messageService.clear();
    this.messageService.add({ key: 'toast2', severity: 'warn', summary: 'Warning', detail: 'key: toast2' });
}

  loadQuestions(quizId:any): void {
    this.studentdashboardService.getQuestionsForQuiz(quizId).subscribe(
      (data: any[]) => {
        this.questions = data;
        this.initializeFormControls();
        console.log('Questions loaded:', this.questions);
      },
      error => {
        console.error('Error fetching questions:', error);
      }
    );
  }
 
  initializeFormControls() {
    const answersArray = this.quizForm.get('answers') as FormArray;
    this.questions.forEach(() => {
      answersArray.push(this.fb.control('', Validators.required));
    });
    console.log('Form controls initialized:', answersArray);
  }
 
  logSelection(index: number, option: string) {
    console.log(`Question ${index + 1} selected: ${option}`);
    console.log('Current form value:', this.quizForm.value);
  }
  onSubmit(courseType:any) {
    if (this.quizForm.valid) {
      const answersArray = this.quizForm.get('answers') as FormArray;
      const answers: Answer[] = answersArray.controls.map((control, index) => ({
        question: { id: this.questions[index].id }, // Changed questionId to question object with id
        selectedAnswer: control.value, // Make sure this matches the expected field in your backend
        quiz: { id: this.quizId },
        user: { id: this.userId } // Assuming user is also an object with id
      }));
 
      console.log('Submitting answers:', answers);
 alert(this.userId)
      this.studentdashboardService.submitAnswers(this.quizId, this.userId, answers,courseType).subscribe(
        (response) => {
          console.log('Server response:', response);
          this.submittedAnswers = answers; // Store the submitted answers
          this.activityType = 'quizSuccess'; // Change the view
          this.http.post(`${environment.apiBaseUrl}/api/quizzes/progress/${this.quizId}?userId=${this.userId}`,"").subscribe((res)=>{
            console.log(res)
          })
        },
        (error) => {
          console.error('Error submitting answers:', error);
        }
      );
    } else {
      console.log('Form is invalid');
      this.logFormErrors();
    }
  }
 
 
  logFormErrors() {
    console.log('Logging form errors:');
    Object.keys(this.quizForm.controls).forEach(key => {
      const abstractControl = this.quizForm.get(key);
      if (abstractControl instanceof FormArray) {
        this.logFormArrayErrors(abstractControl);
      } else if (abstractControl instanceof FormGroup) {
        this.logFormGroupErrors(abstractControl);
      } else {
        this.logControlErrors(key, abstractControl);
      }
    });
  }
 
  logFormArrayErrors(formArray: FormArray) {
    formArray.controls.forEach((control, index) => {
      if (control instanceof FormGroup) {
        this.logFormGroupErrors(control);
      } else {
        this.logControlErrors(`${index}`, control);
      }
    });
  }
 
  logFormGroupErrors(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      this.logControlErrors(key, control);
    });
  }
 
  logControlErrors(key: string, control: AbstractControl | null) {
    const controlErrors = control?.errors;
    if (controlErrors != null) {
      Object.keys(controlErrors).forEach(keyError => {
        console.log(`Key control: ${key}, keyError: ${keyError}, err value: `, controlErrors[keyError]);
      });
    }
  }
 
  checkControlValidity() {
    const answersArray = this.quizForm.get('answers') as FormArray;
    answersArray.controls.forEach((control, index) => {
      console.log(`Question ${index + 1} - Valid: ${control.valid}, Value: ${control.value}`);
    });
  }
 
  allQuestionsAnswered(): boolean {
    const answersArray = this.quizForm.get('answers') as FormArray;
    return answersArray.controls.every(control => control.value !== '');
  }
 
  resetForm() {
    this.quizForm.reset();
    const answersArray = this.quizForm.get('answers') as FormArray;
    answersArray.clear();
    this.initializeFormControls();
    console.log('Form reset.');
  }
  navigateToActivites(){
    this.router.navigate(['/activities']);
  }
  //---------------------------------Assignment---------------------------------
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }
  getAssignmentDetails(assignmentId: any) {
    this.http.get<any>(`${environment.apiBaseUrl}/getAssignment/${assignmentId}`).subscribe((res) => {
      this.assignment = res;
      console.log(res, "Assignments fetched:");
      alert('Assignments fetched successfully');
    },
      error => {
        console.error('Error fetching assignments', error);
        alert('Failed to fetch assignments');
      }
    );
  }
 
  selectedFile: File | null = null;
 
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('File selected:', this.selectedFile);
    }
  }
  submitAssignment(assignmentId: any, studentId: any, courseType: string): void {
    console.log('Submitting assignment with the following parameters:');
    console.log('Student ID:', studentId);
    console.log('Course ID:', this.courseId);
    console.log('Assignment ID:', assignmentId);
    console.log('Course Type:', courseType);
    
  
    if (this.assignmentForm.valid) {
      const formData = new FormData();
      const answerControl = this.assignmentForm.get('answer');
  
      if (answerControl) {
        if (courseType === 'individual') {
          formData.append('assignmentAnswer', answerControl.value);
        }else{
          formData.append('userAssignmentAnswer', answerControl.value);
        }
        
      }
  
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }
  
      if (studentId && this.courseId && assignmentId) {
        formData.append('studentId', studentId.toString());
        formData.append('courseId', this.courseId.toString());
        formData.append('assignmentId', assignmentId.toString());
  
        let url: string;
        if (courseType === 'individual') {
          url = `${environment.apiBaseUrl}/submitNewByStudentId?studentId=${studentId}&courseId=${this.courseId}&assignmentId=${assignmentId}`;
        } else if (courseType === 'course') {
          
          this.lessonId = localStorage.getItem('lessonId')
          console.log(this.lessonId)
          url =`${environment.apiBaseUrl}/submitAssignmentByUserAndLesson/${studentId}/${assignmentId}/${this.lessonId}`
          
        } else {
          console.error('Invalid courseType');
          alert('Invalid courseType. Please check your input.');
          return;
        }
        
        this.http.post(url, formData, { responseType: 'text' })
          .subscribe(
            (response: any) => {
              console.log('Assignment submitted successfully', response);
              
              this.submissionStatus = 'Assignment submitted successfully';
              this.submittedAssignment = response.assignment;
              this.submittedAnswer = answerControl ? answerControl.value : '';
              this.submittedFileName = this.selectedFile ? this.selectedFile.name : '';
              this.setActiveTab('assignment');
            },
            error => {
              if (error.status === 409) {
                console.error('Assignment already submitted', error);
                this.submissionStatus = 'Assignment already submitted';
                this.setActiveTab('assignment');
              } else {
                console.error('Error submitting assignment', error);
              }
            }
          );
      } else {
        console.error('One or more parameters are undefined');
      }
    } else {
      console.log('Form is invalid');
    }
   
  }
  // ------------------------------ project -------------------------------------
 
  // Modify the submitProject function to convert the file to a blob and send it in the POST request
  back(courseID: any) {
    
    this.router.navigate(['/activities', courseID]);
  }
  getProjectBycourseId(courseId: any): void {
    this.http.get<any>(`${environment.apiBaseUrl}/project/course/${courseId}`).pipe(
      catchError(this.handleError)
    ).subscribe(
      (res) => {
        console.log('Project details fetched:', res);
        this.projectDetails = res;
        console.log(this.projectDetails,"projectDetails---------------------------")
      },
      (error) => {
        console.error('Error fetching project details:', error);
      }
 
    );
  }
 
  submitProject(userId: number, courseId: number, projectId: number,courseType:any) {
    if (!this.selectedFile || !this.projectNotes) {
      alert('Please provide both project notes and a file.');
      return;
    }
    const formData = new FormData();
    formData.append('userAnswer', this.projectNotes);
    formData.append('file', this.selectedFile);
    this.candidateActivitiesService.submitProject(userId, courseId, projectId, formData,courseType).subscribe(
      response => {
        console.log('Project submitted successfully:', response);
        alert('Project submitted successfully!');
        this.submissionSuccess = true;  
        this.submittedProject = {
          title: this.projectDetails.find((p: { id: number; }) => p.id === projectId)?.projectTitle,
          description: this.projectDetails.find((p: { id: number; }) => p.id === projectId)?.projectDescription,
          notes: this.projectNotes,
        
        };
        this.activityType = 'submissionSuccess';  
      }, error => {
        console.error('Error submitting project:', error);
        alert('Failed to submit project.');
      }
    );
  }
 
 
 
}
 
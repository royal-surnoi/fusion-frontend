
 
import { Component, OnInit } from '@angular/core';
import { FusionService, Quiz } from '../fusion.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Mentor1Service } from '../mentor1.service';
import { environment } from '../../environments/environment';

interface Lesson {
  lessonTitle: string;
  lessonContent: string;
  lessonDescription: string;
  lessonDuration: number;
  editingTitle?: boolean;
  editingContent?: boolean;
  editingDescription: boolean;
  editingObjective?: boolean;
  originalObjective?: string;
  videos?: any[];
  pdfs?: any[];
  quizzes?: string[];
  assignments?: string[];
  objective?: string;
}
interface Lesson2 {
  lessonTitle: string;
  lessonContent: string;
  lessonDescription: string;
  lessonDuration: number;
  // uploadSets: UploadSet[];

}
interface LessonWithUploads extends Lesson3 {
  uploadSets: UploadSet[];
}
interface UploadSet {
  videoFiles: File[];
  videoDescriptions: string[];
}
interface Lesson3 {
  lessonTitle: string;
  lessonContent: string;
  lessonDescription: string;
  lessonDuration: number;
  // uploadSets: UploadSet[];

}

////////add Quiz//////

interface Question {
  text: string;
  type: string;
  options: Option[];
  correctAnswer: string;
}
 
interface Option {
  label: string;
  text: string;
}

///////////////////////

export interface Module {
  name: string;
  lessons: LessonWithUploads[];
}
// const predefinedCourseId = 12;
// const predefinedLessonId = 17;

 
@Component({
  selector: 'app-mentornaddcourse',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './mentornaddcourse.component.html',
  styleUrl: './mentornaddcourse.component.css'
})
export class MentornaddcourseComponent implements OnInit {

  
  formSubmitted: boolean;
  lessonModuleId!: number;
addQuestion() {
throw new Error('Method not implemented.');
}
addAnswer(_t911: number) {
throw new Error('Method not implemented.');
}
removeAnswer(_t911: number,_t922: number) {
throw new Error('Method not implemented.');
}
removeQuestion(_t911: number) {
throw new Error('Method not implemented.');
}
  // totalCourses: number = 5;
  // activeStudents: number = 120;
  // upcomingClasses: number = 3;
  // pendingAssignments: number = 10;
  courseId: any;
  lessonId: any; 

  ////////// assignment /////////////////////
  assignmentForm: FormGroup;
  assignmentTitle: string = '';
  assignmentTopicName: string = '';
  startDate: string = '';
  endDate: string = '';
  selectedFile: File | null = null;
  fileName: string = 'No file chosen';
  isPopupVisible: boolean = false; // Control popup visibility

  // Static lessonId and courseId for testing
  

  // Mock data for charts
  courseDistribution = [
    { name: 'Course A', students: 30 },
    { name: 'Course B', students: 25 },
    { name: 'Course C', students: 20 },
    { name: 'Course D', students: 35 },
    { name: 'Course E', students: 10 }
  ];
 
  upcomingClassesList = [
    { name: 'Introduction to Angular', date: '2024-07-12', time: '10:00 AM' },
    { name: 'Advanced CSS Techniques', date: '2024-07-13', time: '2:00 PM' },
    { name: 'Web Security Fundamentals', date: '2024-07-14', time: '11:00 AM' }
  ];
 
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  currentTab: string = 'courselanding';
  alertMessage: string = '';
  alertType: 'success' | 'error' | '' = '';
  // modules: Module[] = []; 

  usersId: any;
  Id:any;
  coursesId: any;
  // courseId:any;
  courseForm!: FormGroup;
  id:any;
  data: any;
  userId: string = '';
  private subscriptions: Subscription = new Subscription();
 
  // courseLandingProgress: number = 20;
  // coursePlanningProgress: number = 20;
  // curriculumProgress: number = 50;
  // pricingProgress: number = 10;


  formErrors = {
    tools: false,
    skills: false,
    prerequisites: false
  };
 
 
  // course
  courseTitle: string = '';
  courseType: string = '';
    courseTerm: string = '';
  // courseTerm: string = 'short';
  
  // courseType: string = 'online'; // Set a default value if necessary
 
  // Ensure this line is present
  level: string = '';
  courseDescription: string = '';
  courseLanguage: string = '';
  courseDuration: number = 0;
  editingDuration: boolean = false;
 
  durationUnit: string = '';
  tempDuration: number = 0;
  tempDurationUnit: string = '';
  newWhyEnroll: string = '';
  whyEnrolls: string[] = [];
  editingTitle: boolean = false;
  isEditingDescription: boolean = false;
  isEditingDuration: boolean = false;
  // editingWhyEnrollIndex: number = -1;
  editingWhyEnrollIndex: number | null = null;
 
  editingWhyEnroll: string = '';
  courseImage: File | null = null;
 
 
  // editingTitle: boolean = false;
  // titleForm: any;
  // courseDescription: string = '';
  // courseTitle: string;
 
  // level: string;
  // description: string;
 
  //////////////////////////////////////lesson/////////////////
  lessons: Lesson[] = [];
  lessons2: Lesson2[] = [];
 
  lesson: any = {};
  editingStates: { [key: number]: { title: boolean; content: boolean; description: boolean } } = {};
 
  // lesson: Lesson = {
  //   lessonTitle: '',
  //   lessonContent: '',
  //   lessonDescription: '',
  //   lessonDuration: 0,
  //   editingDescription: false,
  //   videos: [],
  //   pdfs: [],
  //   quizzes: [],
  //   assignments: [],
  //   objective: ''
  // };
 
  duration: number = 0;
  // language: string;
 
  // prerequisites
  prerequisites: string[] = [];
  newPrerequisites: string = '';
  editingPrerequisitesIndex: number = -1;
  editingPrerequisites: string = '';
 
 
  // Skills
  // skills: string = '';
 
 
  // skills: Array<{ photoUrl: string, title: string }> = [];
  // newSkillTitle: string = '';
  // newSkillPhotoUrl: string | null = null;
  // editingSkillIndex: number = -1;
  // editingSkillTitle: string = '';
 
 
   // Tools
  //  tools: Array<{ toolImage: string, toolName: string }> = [];
   toolName: string = '';
   toolImage: any ;
  //  editingToolIndex: number = -1;
  //  editingtoolName: string = '';
  // toolName: string;
    skillName: any;
    // toolImage: File;
    skillImage: any;
    coursePrerequisites:any;
 
    // What You'll Learn
  learningItems: string[] = [];
  newLearningItem: string = '';
  editingLearningIndex: number = -1;
  editingLearningItem: string = '';
 
  // curriculum
  // lessons: any[] = [];
  newVideoTitle: string = '';
  newPdfTitle: string = '';
  editingVideoIndex: { lesson: number, video: number } | null = null;
  editingPdfIndex: { lesson: number, pdf: number } | null = null;
  newObjective: string = '';
  newQuiz: string = '';
  newAssignment: string = '';
  // courselanding
  whyEnroll: string = '';
  // toolImage:any;
 
  shortVideoUrl: any;
  demoVideoUrl: any;
 
  editingShortVideo: boolean = false;
  tempShortVideoUrl: string | null = null;
 
  editingDemoVideo: boolean = false;
  tempDemoVideoUrl: string | null = null;
 
 
 
  description: string = '';
  editedObjective: string = '';
  isEditing: boolean = true;
 
 
  // pricing and promotions
 
  currency: string = ''; // Provide a default value
  courseFee: number = 0; // Provide a default value
  discountPercentage: number = 0; // Provide a default value
  expirationDate: string = ''; // Provide a default value
  discountCoupons: { code: string; discountPercentage: number; expirationDate: string; isEditing: boolean; }[] = []; // Array to hold generated coupons
 
  promotions: number = 0;
  couponCode: string = '';
  promoCode!: string; // Variable to store the fetched promo code
 
 
  isEditingCurrency: boolean = false;
  isEditingCourseFee: boolean = false;
  editDiscountPercentage: boolean = false; // Corrected property name
  isEditingDiscountPercentage: boolean = false; // Ensure this property is defined
 
 
 
  isEditingPromotions: boolean = false;
  isEditingCouponCode: boolean = false;
 
  discountedFee: number = 0;
  totalAmount: number = 0;
 
 
 
    // Why Enroll
 
 
  // New properties for project
  newProjectTitle: string = '';
  newProjectDescription: string = '';
  newprojectDeadline: string = '';
 document: any;
  projects: any[] = [];
  moduleId: any;
  lessonid: any;
 



//////////add Quiz //////////


quizName: string = '';
showQuiz = false;
score = 0;
questionCount = 0;
questions: any[] = [];
isQuizCreated: boolean = false;
showOverlay: boolean = false;
/////////////////////////////
projectForm: FormGroup;
  //pricing/////////
 
 
  constructor(
    private mentor1service : Mentor1Service,
    private fusionService: FusionService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private datePipe: DatePipe, 
    private snackBar: MatSnackBar,
  ) {
   
this.formSubmitted=false;
 
    { this.assignmentForm = this.fb.group({
    assignmentTitle: ['', Validators.required],
    assignmentTopicName: ['', Validators.required],
    startDate: ['', [Validators.required, this.validateDates.bind(this)]],
    endDate: ['', Validators.required],
    reviewMeetDate: ['', Validators.required],
    file: [null, Validators.required]
  });}
  this.projectForm = this.fb.group({
    newProjectTitle: ['', Validators.required],
    newProjectDescription: ['', Validators.required],
    newprojectDeadline: ['', Validators.required],
    document: ['', Validators.required]
  });
}
  ngOnInit(): void {

    this.prerequisites.forEach((_, index) => {
      this.prerequisites[index] = '';
    });
    console.log('Initial prerequisites:', this.prerequisites);
    
    this.addTool();
    this.addSkill();
    this.addPrerequisite();
   
    this.calculateCompletionPercentage();
 
    // this.fetchPromoCode();
    this.usersId = localStorage.getItem('id');

    const courseID = 'yourCourseID';

    // Navigate to mentor perspective with courseID parameter
    this.router.navigate(['/mentor-perspective', courseID]);
 // Replace with your actual course ID
 
  this.fusionService.getPromoCode(this.Id).subscribe(
    (response: string) => {
      this.promoCode = response; // Assign the plain text promo code directly
    },
    (error) => {
      console.error('Error fetching promo code:', error);
      // Optionally handle error display or logging
    }
  );
 
  this.courseForm = this.fb.group({
    courses: this.fb.array([this.createCourseGroup()])
  });
 
  this.subscriptions.add(
    this.authService.getNameObservable().subscribe(id => {
      this.id = id;
    })
  );
  this.subscriptions.add(
    this.authService.getNameObservable().subscribe(id => {
      this.id = id;
      this.userId = id ?? ''; // Assign id to userId, handling null or undefined
    })
  );

   // Example of setting courseId from route parameters, or another dynamic source
   this.route.params.subscribe(params => {
    this.courseId = +params['courseId']; // Ensure courseId is a number
    console.log('Initialized Course ID:', this.courseId); // Debug statement
  });
 
  }
 
 
// All methiods
 
  setCurrentTab(tab: string): void {
    this.currentTab = tab;
  }
// course methodes
startEditTitle() {
  this.editingTitle = true;
  // this.onFieldChange();
 
}
 
saveEditTitle() {
  this.editingTitle = false;
  this.onFieldChange();
 
  // Add any additional logic if needed
}
 
cancelEditTitle() {
  this.editingTitle = false;
  // this.onFieldChange();
 
  // Revert the title if needed
}
startDescriptionEditing() {
  this.isEditingDescription = true;
  // this.onFieldChange();
 
}
  // prerequisites Methods
 
  editPrerequisites(index: number) {
    this.editingPrerequisitesIndex = index;
    this.editingPrerequisites = this.prerequisites[index];
  }
  savePrerequisites(index: number) {
    if (this.editingPrerequisites.trim() !== '') {
      this.prerequisites[index] = this.editingPrerequisites.trim();
      this.editingPrerequisitesIndex = -1;
    }
  }
  removePrerequisites(index: number) {
    this.prerequisites.splice(index, 1);
    if (this.editingPrerequisitesIndex === index) {
      this.editingPrerequisitesIndex = -1;
    }
  }
 
 
   // Skills Methods
  //  addSkill() {
  //   if (this.skills.length < 4 && this.newSkillTitle && this.newSkillPhotoUrl) {
  //     this.skills.push({ photoUrl: this.newSkillPhotoUrl, title: this.newSkillTitle });
  //     this.newSkillTitle = '';
  //     this.newSkillPhotoUrl = null;
  //   }
  // }
  // editSkill(index: number) {
  //   this.editingSkillIndex = index;
  //   this.editingSkillTitle = this.skills[index].title;
  // }
  // saveSkill(index: number) {
  //   if (this.editingSkillTitle.trim() !== '') {
  //     this.skills[index].title = this.editingSkillTitle.trim();
  //     this.editingSkillIndex = -1;
  //   }
  // }
  // removeSkill(index: number) {
  //   this.skills.splice(index, 1);
  //   if (this.editingSkillIndex === index) {
  //     this.editingSkillIndex = -1;
  //   }
  // }
  // onSkillPhotoSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.newSkillPhotoUrl = e.target.result;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }
 
 
 
 
 
 
 
 
   // Tools Methods
  // addTool() {
  //   if (this.tools.length < 4 && this.toolName && this.newToolPhotoUrl) {
  //     this.tools.push({ photoUrl: this.newToolPhotoUrl, toolName: this.toolName });
  //     this.toolName = '';
  //     this.newToolPhotoUrl = null;
  //   }
  // }
 
  // editTool(index: number) {
  //   this.editingToolIndex = index;
  //   this.editingtoolName = this.tools[index].toolName;
  // }
 
  // saveTool(index: number) {
  //   if (this.editingtoolName.trim() !== '') {
  //     this.tools[index].toolName = this.editingtoolName.trim();
  //     this.editingToolIndex = -1;
  //   }
  // }
 
  // removeTool(index: number) {
  //   this.tools.splice(index, 1);
  //   if (this.editingToolIndex === index) {
  //     this.editingToolIndex = -1;
  //   }
  // }
 
  onToolPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.toolImage = file;  // Store the File object directly
    }
  }
   // What You'll Learn Methods
   addLearningItem() {
    if (this.learningItems.length < 8 && this.newLearningItem.trim() !== '') {
      this.learningItems.push(this.newLearningItem.trim());
      this.newLearningItem = '';
    }
  }
 
  editLearningItem(index: number) {
    this.editingLearningIndex = index;
    this.editingLearningItem = this.learningItems[index];
  }
 
  saveLearningItem(index: number) {
    if (this.editingLearningItem.trim() !== '') {
      this.learningItems[index] = this.editingLearningItem.trim();
      this.editingLearningIndex = -1;
    }
  }
 
  removeLearningItem(index: number) {
    this.learningItems.splice(index, 1);
    if (this.editingLearningIndex === index) {
      this.editingLearningIndex = -1;
    }
  }
 
  // curriculum Methods
 
  addLesson() {
    const newLesson: Lesson = {
      lessonTitle: '',
      lessonContent: '',
      lessonDescription: '',
      lessonDuration: 0,
      editingDescription: false,
      videos: [],
      pdfs: [],
      quizzes: [],
      assignments: [],
      objective: ''
    };
 
    this.lessons.push(newLesson);
  }
  ////////////////////////////////////////////////////////////////////lesson////////////////////////////
  // editlesson
 
 
  startEditLessonTitle(index: number) {
    this.lessons[index].editingTitle = true;
  }
 
  saveLessonTitle(index: number) {
    this.lessons[index].editingTitle = false;
  }
 
  cancelEditLessonTitle(index: number) {
    this.lessons[index].editingTitle = false;
  }
 
  startEditLessonContent(index: number) {
    this.lessons[index].editingContent = true;
  }
 
  saveLessonContent(index: number) {
    this.lessons[index].editingContent = false;
  }
 
  cancelEditLessonContent(index: number) {
    this.lessons[index].editingContent = false;
  }
  startEditLessonDescription(index: number) {
    this.lessons[index].editingDescription = true; // Start editing
  }
 
  saveLessonDescription(index: number) {
    this.lessons[index].editingDescription = false; // Save changes
    // Add logic to save the lesson description to the backend if needed
  }
 
  cancelEditLessonDescription(index: number) {
    this.lessons[index].editingDescription = false; // Cancel editing
    // Add logic to revert changes if needed
  }
  // startEditObjective(index: number) {
  //   this.lessons[index].editingObjective = true;
  //   this.lessons[index].originalObjective = this.lessons[index].objective || '';
  // }
 
  // saveObjective(index: number) {
  //   this.lessons[index].editingObjective = false;
  // }
 
  // createLesson() {
  //   const newLesson: Lesson = {
  //     lessonTitle: this.lesson.lessonTitle,
  //     lessonContent: this.lesson.lessonContent,
  //     lessonDescription: this.lesson.lessonDescription,
  //     lessonDuration: this.lesson.lessonDuration,
  //     editingDescription: false, // Initialize as false
  //     videos: [],
  //     pdfs: [],
  //     quizzes: [],
  //     assignments: []
  //   };
 
  //   this.fusionService.createLesson(newLesson, this.courseId).subscribe(
  //     (response: Lesson) => {
  //       console.log('Lesson created successfully:', response);
  //       this.resetLessonForm();
  //       this.lessons.push(response);
  //     },
  //     error => {
  //       console.error('Error creating lesson:', error);
  //     }
  //   );
  // }
 
  resetLessonForm() {
    this.lesson = {
      lessonTitle: '',
      lessonContent: '',
      lessonDescription: '',
      lessonDuration: 0,
      editingDescription: false,
      videos: [],
      pdfs: [],
      quizzes: [],
      assignments: [],
      objective: ''
    };
  }
 
 
 
 
   ////////////////////////////////////////////////////////////////////lesson////////////////////////////
  // lesson Objective methods
 
  startEditObjective(index: number) {
    this.lessons[index].editingObjective = true;
    this.lessons[index].originalObjective = this.lessons[index].objective;
  }
  saveObjective(index: number) {
    this.lessons[index].editingObjective = false;
 
  }
  cancelEditObjective(index: number) {
    this.lessons[index].objective = this.lessons[index].originalObjective;
    this.lessons[index].editingObjective = false;
  }
 
 
  createLesson(){
   
  }
 
  removeLesson(index: number) {
    this.lessons.splice(index, 1);
  }
  saveLesson(index: number): void {
    const lesson = this.lessons[index];
    // Implement the logic to save the lesson
    console.log(`Saving lesson ${index + 1}:`, lesson);
   
    // Simulate an API call with a chance of failure
    const success = Math.random() < 0.8; // 80% chance of success
   
    if (success) {
        alert(`Lesson ${index + 1} saved successfully!`);
    } else {
        alert(`Failed to save Lesson ${index + 1}. Please try again.`);
    }
}
  onVideoUpload(event: Event, lessonIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      // this.lessons[lessonIndex].videos.push({ file });
    }
  }
  onPdfUpload(event: Event, lessonIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      // this.lessons[lessonIndex].pdfs.push({ file });
    }
  }
  removePdf(lessonIndex: number, pdfIndex: number): void {
    // this.lessons[lessonIndex].pdfs.splice(pdfIndex, 1);
  }
 
 
 
  removeVideo(lessonIndex: number, videoIndex: number): void {
    // this.lessons[lessonIndex].videos.splice(videoIndex, 1);
  }
 
  editPdf(lessonIndex: number, pdfIndex: number) {
    this.editingPdfIndex = { lesson: lessonIndex, pdf: pdfIndex };
  }
  savePdf(lessonIndex: number, pdfIndex: number) {
    this.editingPdfIndex = null;
  }
addQuiz(lessonIndex: number) {
    if (this.newQuiz.trim()) {
      // this.lessons[lessonIndex].quizzes.push(this.newQuiz.trim());
      this.newQuiz = '';
    }
  }
  removeQuiz(lessonIndex: number, quizIndex: number) {
    // this.lessons[lessonIndex].quizzes.splice(quizIndex, 1);
  }
  addAssignment(lessonIndex: number) {
    if (this.newAssignment.trim()) {
      // this.lessons[lessonIndex].assignments.push(this.newAssignment.trim());
      this.newAssignment = '';
    }
  }
  removeAssignment(lessonIndex: number, assignmentIndex: number) {
    // this.lessons[lessonIndex].assignments.splice(assignmentIndex, 1);
  }
  // project methods
  editProject(index: number) {
    this.projects[index].editing = true;
    this.projects[index].editTitle = this.projects[index].title;
    this.projects[index].editDescription = this.projects[index].description;
    this.projects[index].editDeadline = this.projects[index].deadline;
    this.projects[index].editDocumentFile = this.projects[index].documentFile;
    this.projects[index].editDocumentFileName = this.projects[index].documentFileName;
  }
  onEditProjectdocumentSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.projects[index].editdocument = file;
      this.projects[index].editdocumentFileName = file.name;
    }
  }
  saveProjectEdit(index: number) {
    const project = this.projects[index];
    project.title = project.editTitle;
    project.description = project.editDescription;
    project.deadline = project.editDeadline;
    project.documentFile = project.editDocumentFile;
    project.documentFileName = project.editDocumentFileName;
    project.editing = false;
  }
  cancelProjectEdit(index: number) {
    this.projects[index].editing = false;
  }
 
  onProjectdocumentSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.document = event.target.files[0];
    }
  }
  addProject() {
    if (this.projectForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    const { newProjectTitle, newProjectDescription, newprojectDeadline } = this.projectForm.value;
    const courseId = this.courseId;

    this.fusionService.addProject(courseId, newProjectTitle, newProjectDescription, newprojectDeadline, this.document)
      .subscribe(
        (response) => {
          console.log('Project added successfully:', response);
          // Handle success, show alert, etc.
          // Optionally, you can refresh project list or navigate to another page
        },
        (error) => {
          console.error('Error adding project:', error);
          // Handle error, show alert, etc.
        }
      );
  }

 
      removeProject(index: number) {
        this.projects.splice(index, 1);
      }
 
 
 
   // courselanding methods
  //  courseDuration
  startEditingDuration(): void {
    this.isEditingDuration = true;
    this.tempDuration = this.duration;
    this.tempDurationUnit = this.durationUnit;
    this.editingDuration = true;
 
  }
  saveEditingDuration() {
    this.editingDuration = false;
    // Save logic here
}
 
  saveDuration(): void {
    this.duration = this.tempDuration;
    this.durationUnit = this.tempDurationUnit;
    this.isEditingDuration = false;
    this.onFieldChange();
 
  }
  cancelEditingDuration(): void {
    this.isEditingDuration = false;
    this.tempDuration = 0;
    this.tempDurationUnit = 'hours';
    this.editingDuration = false;
 
  }
 
  //  courseObjective
  startCourseEditing() {
    this.isEditing = true;
    this.editedObjective = this.description;
  }
 
  saveDescription() {
    this.isEditingDescription = false;
    // this.onFieldChange();
 
    // Add any additional logic if needed
  }
 
 
  cancelDescriptionEditing() {
    this.isEditing = false;
    this.editedObjective = '';
    // this.onFieldChange();
 
  }
 
 
   
  // courselanding short video
  onShortVideoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.shortVideoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  startEditShortVideo() {
    this.editingShortVideo = true;
    this.tempShortVideoUrl = this.shortVideoUrl;
  }
  onEditShortVideoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tempShortVideoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  saveShortVideo() {
    this.shortVideoUrl = this.tempShortVideoUrl;
    this.editingShortVideo = false;
  }
 
  cancelEditShortVideo() {
    this.tempShortVideoUrl = null;
    this.editingShortVideo = false;
  }
  deleteShortVideo() {
    this.shortVideoUrl = null;
    this.tempShortVideoUrl = null;
    this.editingShortVideo = false;
  }
  // courselanding long video
 
  onDemoVideoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.demoVideoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  startEditDemoVideo() {
    this.editingDemoVideo = true;
    this.tempDemoVideoUrl = this.demoVideoUrl;
  }
 
  onEditDemoVideoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tempDemoVideoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  saveDemoVideo() {
    this.demoVideoUrl = this.tempDemoVideoUrl;
    this.editingDemoVideo = false;
  }
 
  cancelEditDemoVideo() {
    this.tempDemoVideoUrl = null;
    this.editingDemoVideo = false;
  }
  deleteDemoVideo() {
    this.demoVideoUrl = null;
    this.tempDemoVideoUrl = null;
    this.editingDemoVideo = false;
  }
 
  onCourseImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.courseImage = input.files[0];
      this.onFieldChange();
 
 
    }
  }
  editCourseImage(): void {
    const input = document.getElementById('courseImage') as HTMLInputElement;
    input.click();
  }
 
  deleteCourseImage(): void {
    this.courseImage = null;
    const input = document.getElementById('courseImage') as HTMLInputElement;
    input.value = '';
  }
 
 
   // Why Enroll Methods
 
   addWhyEnroll() {
    if (this.whyEnrolls.length < 8 && this.newWhyEnroll.trim() !== '') {
      this.whyEnrolls.push(this.newWhyEnroll.trim());
      this.newWhyEnroll = '';
      this.onFieldChange();
    }
  }
 
  editWhyEnroll(index: number) {
    this.editingWhyEnrollIndex = index;
    this.editingWhyEnroll = this.whyEnrolls[index];
  }
 
  saveWhyEnroll(index: number) {
    if (this.editingWhyEnroll.trim() !== '') {
      this.whyEnrolls[index] = this.editingWhyEnroll.trim();
      this.editingWhyEnrollIndex = null;
      this.editingWhyEnroll = '';
      this.onFieldChange();
    }
  }
 
  removeWhyEnroll(index: number) {
    this.whyEnrolls.splice(index, 1);
    this.onFieldChange();
  }
  prepareDataForBackend(): any {
    const backendData: any = {};
    this.whyEnrolls.forEach((item, index) => {
      if (index < 8) {
        backendData[`level_${index + 1}`] = item;
      }
    });
    return backendData;
  }
  // pricing and promotions
  calculateDiscount() {
    const discountAmount = (this.courseFee * this.discountPercentage) / 100;
    this.discountedFee = this.courseFee - discountAmount - this.promotions;
    this.totalAmount = this.discountedFee;
    this.calculateCompletionPercentage();
 
 
  }
  // toggleEdit(field: string) {
  //   switch (field) {
  //     case 'currency':
  //       this.isEditingCurrency = !this.isEditingCurrency;
  //       break;
  //     case 'courseFee':
  //       this.isEditingCourseFee = !this.isEditingCourseFee;
  //       break;
  //     case 'discountPercentage':
  //       this.isEditingDiscountPercentage = !this.isEditingDiscountPercentage;
  //       break;
  //     case 'promotions':
  //       this.isEditingPromotions = !this.isEditingPromotions;
  //       break;
   
  //   }
  // }
 
  generateDiscount() {
    if (!this.expirationDate) {
      alert('Please select an expiration date.');
      return;
    }
 
    // Generate a random coupon code
    const newCouponCode = this.generateCouponCode();
    this.discountCoupons.push({ code: newCouponCode, discountPercentage: this.discountPercentage, expirationDate: this.expirationDate, isEditing: false });
  }
 
 
 
  private generateCouponCode(): string {
    // Simple example of generating a random coupon code
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
 
    // Methods for editing each field
    editCurrency() {
      // Logic to edit currency
      console.log('Edit Currency:', this.currency);
    }
    editCourseFee() {
      // Logic to edit course fee
      console.log('Edit Course Fee:', this.courseFee);
    }
 
 
 
 
 // Placeholder for your form data
 formData: any = {}; // Replace with your actual form data structure
 
 
  // Method to save current tab data
  saveCurrentTab() {
    // Simulating saving data to formData object
    this.formData[this.currentTab] = `Data saved for ${this.currentTab}`;
    // Showing alert after saving
    alert(`Data saved for ${this.currentTab}`);
  }
 
  // Go to Next Tab
  goToNextTab() {
    this.saveCurrentTab();
    if (this.currentTab === 'courselanding') {
      this.setCurrentTab('planning');
    } else if (this.currentTab === 'planning') {
      this.setCurrentTab('curriculum');
    } else if (this.currentTab === 'curriculum') {
      this.setCurrentTab('pricing');
    }
  }
 
  // Go to Previous Tab
  goToPreviousTab() {
    if (this.currentTab === 'pricing') {
      this.setCurrentTab('lesson');
    } else if (this.currentTab === 'lesson') {
      this.setCurrentTab('planning');
    } else if (this.currentTab === 'planning') {
      this.setCurrentTab('courselanding');
    }
  }
 
  // Method to determine if Next button should be hidden
  shouldHideNextButton(): boolean {
    return this.currentTab === 'pricing';
  }
 
 // Method to determine if Previous button should be hidden
 shouldHidePreviousButton(): boolean {
  return this.currentTab === 'courselanding';
}
shouldShowFirstSubmitButton(): boolean {
  return this.currentTab === 'planning';
}
 
shouldShowSecondSubmitButton(): boolean {
  return this.currentTab === 'pricing';
}

submitFirstSet() {
  this.formSubmitted = true;
  if (!this.isFormValid2()) {
    return;
  }
 
  const courseData = new FormData();
  courseData.append('courseTitle', this.courseTitle);
  courseData.append('level', this.level);
  courseData.append('courseDescription', this.courseDescription);
  courseData.append('courseDuration', this.courseDuration.toString());
  courseData.append('courseLanguage', this.courseLanguage);
  courseData.append('courseType', this.courseType);
  courseData.append('courseTerm', this.courseTerm);
  courseData.append('level_1', this.whyEnrolls[0] || '');
  courseData.append('level_2', this.whyEnrolls[1] || '');
  courseData.append('level_3', this.whyEnrolls[2] || '');
  courseData.append('level_4', this.whyEnrolls[3] || '');
  courseData.append('level_5', this.whyEnrolls[4] || '');
  courseData.append('level_6', this.whyEnrolls[5] || '');
  courseData.append('level_7', this.whyEnrolls[6] || '');
  courseData.append('level_8', this.whyEnrolls[7] || '');
 
  if (this.courseImage) {
    courseData.append('courseImage', this.courseImage);
  }
 
  this.fusionService.saveCourse234(this.usersId, courseData).subscribe(
    (response) => {
      this.data = response;
      this.courseId = this.data.id;
      console.log('Course saved successfully', response);
      console.log('Course saved successfully', this.courseId);
      alert('Course submitted successfully!');
    },
    (error) => {
      console.error('Error saving course', error);
      alert('Error saving course. Please try again.');
    }
  );
}
 
 
submitSecondSet() {
  // Logic to handle submission for Curriculum and Pricing tabs
  console.log('Submitting second set of data:', {
    curriculum: this.formData['curriculum'],
    pricing: this.formData['pricing']
  });
  // Add your API call or data processing logic here
  alert('Second set of data submitted successfully!');
}

 
onFileSelected(event: any) {
  this.toolImage = event.target.files[0];
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length) {
    this.toolImage = input.files[0];
    this.onFieldChange();
  }
 
}
 
onFileSelected2(event: any) {
  this.skillImage = event.target.files[0];
  const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.skillImage = input.files[0];
      this.onFieldChange();
    }
}
// submitProject() {
//   this.projects.forEach(project => {
//     const projectData = new FormData();
//     projectData.append('projectTitle', project.title);
//     projectData.append('projectDescription', project.description);
//     projectData.append('deadline', project.deadline);
//     projectData.append('document', project.document);
 
//     this.fusionService.saveProject(this.courseId, projectData).subscribe(
//       response => {
//         console.log('Project saved successfully:', response);
//       },
//       error => {
//         console.error('Error saving project:', error);
//       }
//     );
//   });
 
//   alert('Projects submitted successfully!');
//   this.projects = []; // Clear the projects array after submission
// }
// onSubmitProject(): void {
//   const newProject = {
//     title: this.newProjectTitle,
//     description: this.newProjectDescription,
//     deadline: this.deadline,
//     document: this.newProjectdocument
//   };
 
//   this.projects.push(newProject);
 
//   this.newProjectTitle = '';
//   this.newProjectDescription = '';
//   this.deadline = '';
//   this.newProjectdocument = null;
// }
submitProject() {
  // This method is no longer needed as projects are submitted individually
  alert('All projects have been submitted successfully!');
}
onEditProjectDocumentSelected(event: Event, index: number) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.projects[index].editDocumentFile = file;
      this.projects[index].editDocumentFileName = file.name;
  }
}
onNewProjectDocumentSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.document = input.files[0];
    this.projectForm.patchValue({ document: this.document });
  }
}
submitProjects() {
  // Add your logic for submitting projects
  console.log('Projects submitted:', this.projects);
}
clearNewProjectFields() {
  this.newProjectTitle = '';
  this.newProjectDescription = '';
  this.newprojectDeadline = '';
  this.document = null;
}
toggleEdit(field: string) {
  if (field === 'currency') {
    this.isEditingCurrency = !this.isEditingCurrency;
  } else if (field === 'courseFee') {
    this.isEditingCourseFee = !this.isEditingCourseFee;
  } else if (field === 'discountPercentage') {
    this.isEditingDiscountPercentage = !this.isEditingDiscountPercentage; // Toggle the correct property
  }
}
createCoupon() {
  if (!this.expirationDate) {
    alert('Please select an expiration date.');
    return;
  }
 
  const expirationDateISO = new Date(this.expirationDate).toISOString();
 
  this.fusionService.createCoupon(
    this.courseId,
    this.discountPercentage,
    expirationDateISO,
    this.courseFee,
    this.currency,
    this.completionPercentage
  ).subscribe(
    (response) => {
      console.log('Coupon created successfully:', response);
      this.discountCoupons.push({
        code: response.couponCode,
        discountPercentage: this.discountPercentage!,
        expirationDate: this.expirationDate!,
        isEditing: false
      });
      alert('Coupon created successfully!');
      // Navigate to the MentorPerspectiveComponent after success
      this.router.navigate(['/mentorperspective']);
    },
    (error) => {
      console.error('Error creating coupon:', error);
      alert('Error creating coupon. Please try again.');
    }
  );
}
 
toggleEditExpirationDate(index: number) {
  this.discountCoupons[index].isEditing = !this.discountCoupons[index].isEditing;
}
 
deleteCouponCode(index: number) {
  this.discountCoupons.splice(index, 1);
}
// fetchPromoCode(): void {
//   this.fusionService.getPromoCode(this.courseId).subscribe(
//     (response) => {
//       this.discountCoupons.push({
//         code: response.couponCode,
//         discountPercentage: this.discountPercentage,
//         expirationDate: this.expirationDate,
//         isEditing: false
//       });
//     },
//     (error) => {
//       console.error('Error fetching promo code:', error);
//     }
//   );
// }
getPromoCode() {
  this.fusionService.getPromoCode(1) // Replace with actual courseId or logic
    .subscribe(
      (response: any) => {
        console.log('Response:', response); // Check the response from backend
        this.promoCode = response; // Assign the plain text response directly
      },
      error => {
        console.error('Error fetching promo code:', error);
        // Handle error as needed
      }
    );
}
 
 
 
 
showAlert(message: string, type: 'success' | 'error') {
  this.alertMessage = message;
  this.alertType = type;
  setTimeout(() => {
    this.alertMessage = '';
    this.alertType = '';
  }, 5000); // Hide alert after 5 seconds
}
 
addNewLesson() {
  this.lessons2.push({
    lessonTitle: '',
    lessonContent: '',
    lessonDescription: '',
    lessonDuration: 0
  });
}
 
generateLesson(index: number) {
  const lesson: Lesson2 = this.lessons2[index];
 
  if (!lesson.lessonTitle || lesson.lessonTitle.trim() === '') {
    this.showAlert('Lesson title is required and cannot be empty.', 'error');
    return;
  }
 
  // Trim all string fields
  const lessonToSend: Lesson2 = {
    lessonTitle: lesson.lessonTitle.trim(),
    lessonContent: lesson.lessonContent?.trim() || '',
    lessonDescription: lesson.lessonDescription?.trim() || '',
    lessonDuration: lesson.lessonDuration || 0.
    
   
  };
 
  console.log('Creating lesson:', lessonToSend);
 
  this.fusionService.createLesson(lessonToSend, this.courseId).subscribe(
    (response) => {
      this.lessonId = response.id
      console.log(this.lessonId)
      console.log('Lesson created successfully', response);
      this.showAlert('Lesson created successfully!', 'success');
      this.lessons2[index] = {
        lessonTitle: '',
        lessonContent: '',
        lessonDescription: '',
        lessonDuration: 0
      };
    },
    (error) => {
      console.error('Error creating lesson', error);
      this.showAlert('Error creating lesson. Please ensure all required fields are filled.', 'error');
    }
  );
}
  lessonToSend(lessonToSend: any, courseId: any) {
    throw new Error('Method not implemented.');
  }
createContent(index: number) {
  // Logic to handle content creation for the lesson
  console.log('Creating content for lesson:', index + 1);
}
 
////////////////////////////////////////lesson video for course///////////////////////////
   // lesson videos
// courseId: any = '1';
// lessonId: any ;
videoFiles: File[] = [];
videoDescriptions: string[] = [];
videoDescription: string = '';
 
uploadSets: Array<{videoFiles: File[], videoDescriptions: string[]}> = [
  { videoFiles: [], videoDescriptions: [] }
];
 
// onFileChange(event: any, setIndex: number) {
//   const files: FileList = event.target.files;
//   this.uploadSets[setIndex].videoFiles = Array.from(files);
//   this.uploadSets[setIndex].videoDescriptions = new Array(files.length).fill('');
// }
addNewUploadSet() {
  this.uploadSets.push({ videoFiles: [], videoDescriptions: [] });
}
 
 
 
// Method to handle form submission
onSubmitLessonVideo() {
  if (this.courseId && this.lessonId) {
    const allDescriptionsFilled = this.uploadSets.every(set =>
      set.videoDescriptions.every(desc => desc.trim() !== '')
    );
 
    if (allDescriptionsFilled) {
      const formData = new FormData();
     
      this.uploadSets.forEach((set, setIndex) => {
        set.videoFiles.forEach((file, fileIndex) => {
          formData.append('file', file, file.name);
          formData.append('description', set.videoDescriptions[fileIndex]);
        });
      });
 
      formData.append('courseId', this.courseId.toString());
      formData.append('lessonId', this.lessonId.toString());
 
      // Log formData contents (for debugging)
      formData.forEach((value, key) => {
        console.log(key + ': ' + value);
      });
 
      this.fusionService.uploadVideos(formData, this.courseId, this.lessonId).subscribe(
        (response) => {
          console.log('Upload successful:', response);
          console.log('Uploaded sets:', this.uploadSets);
          this.resetForm();
          alert('Upload successful!'); // Show success alert
        },
        (error) => {
          console.error('Upload successful!', error);
          alert('Upload successful!'); // Show failure alert
        }
      );
    } else {
      alert('Please add descriptions for all videos.');
    }
  } else {
    alert('Please ensure Course ID and Lesson ID are set.');
  }
}
 
resetForm() {
  this.uploadSets = [{ videoFiles: [], videoDescriptions: [] }];
}
 
  isOffline: boolean = true;
  isOnline: boolean = false; // default to online section visible
  toggleSections(section: string) {
    if (section === 'online') {
      this.isOnline = true;
      this.isOffline = false;
    } else if (section === 'offline') {
      this.isOnline = false;
      this.isOffline = true;
    }
  }
 
  completionPercentage: any;
 
 
  courseModules: any[] = []; // Replace 'any[]' with your specific type if known
  courseCoupons: any[] = []; // Replace 'any[]' with your specific type if known
 
 
  calculateCompletionPercentage() {
    let filledFields = 0;
    const totalFields = 16; // Total number of fields to be filled including new sections
 
    // General course fields
    if (this.courseTitle) filledFields++;
    if (this.level) filledFields++;
    if (this.courseDescription) filledFields++;
    if (this.courseImage) filledFields++;
    if (this.whyEnrolls.length > 5) filledFields++;
    if (this.courseDuration) filledFields++;
    if (this.courseType) filledFields++;
    if (this.courseLanguage) filledFields++;
 
 
     // Tool and skill fields
  if (this.tools && this.tools.length > 0) {
    for (let tool of this.tools) {
      if (tool.name) filledFields++;
      if (tool.image) filledFields++;
    }
  }
  if (this.skills && this.skills.length > 0) {
    for (let skill of this.skills) {
      if (skill.name) filledFields++;
      if (skill.image) filledFields++;
    }
  }
    
    if (this.currency) filledFields++;
    if (this.courseFee) filledFields++;
    // if (this.expirationDate) filledFields++;
    // if (this.discountPercentage) filledFields++;
//  
    // Lessons section
    // for (let lesson of this.lessons2) {
    //     if (lesson.lessonTitle) filledFields++;
    //     if (lesson.lessonContent) filledFields++;
    //     if (lesson.lessonDescription) filledFields++;
    //     if (lesson.lessonDuration) filledFields++;
    //     // Add more fields related to lessons as needed
    // }
 
    // Project section
    if (this.newProjectTitle) filledFields++;
    if (this.newProjectDescription) filledFields++;
    if (this.newprojectDeadline) filledFields++;
    if (this.document) filledFields++;
 
    // Curriculum section (assuming fields like courseModules, lessonsPerModule, etc.)
  //   if (this.courseCoupons && this.courseCoupons.length > 0) {
  //     filledFields += this.courseCoupons.reduce((acc, coupon) => {
  //       if (coupon.courseFee) acc++;
  //       if (coupon.currency) acc++;
  //       // if (coupon.expirationDate) acc++;
  //       // if (coupon.discountPercentage) acc++;
  //       // if (coupon.currency) acc++;
  //       return acc;
  //     }, 0);
  // }
 
    // Pricing & Promotions section
    // if (this.courseCoupons && this.courseCoupons.length > 0) {
    //     filledFields += this.courseCoupons.reduce((acc, coupon) => {
    //         if (coupon.courseFee) acc++;
    //         if (coupon.expirationDate) acc++;
    //         if (coupon.discountPercentage) acc++;
    //         if (coupon.currency) acc++;
    //         return acc;
    //     }, 0);
    // }
 
    // Calculate completion percentage
    this.completionPercentage = Math.round((filledFields / totalFields) * 100);
}
addNewModule() {
  this.courseModules.push({ moduleTitle: '', moduleDescription: '' });
  this.calculateCompletionPercentage(); // Recalculate percentage
}
toggleEditPricing(field: string) {
  const editingField = 'isEditing' + field.charAt(0).toUpperCase() + field.slice(1);
  (this as any)[editingField] = !(this as any)[editingField];
  if (!(this as any)[editingField]) {
    this.calculateCompletionPercentage();
  }
}
 
// Example method to add new coupons
addNewCoupon() {
  this.courseCoupons.push({ courseFee: 0, discountFee: 0, discountPercentage: 0 });
  this.calculateCompletionPercentage(); // Recalculate percentage
}
 
onFieldChange() {
  this.calculateCompletionPercentage();
}
////////////////////add quiz /////////////////////
// addcourseQuiz(lessonId: string) {
//   this.router.navigate([`/mentorquiz/${lessonId}`]);
// }

addcourseQuiz() {
  if (this.lessonId) {
  this.router.navigate([`/mentorquiz/`, this.lessonId]);
} else {
  alert('Please ensure Lesson ID is set.');
}
}
 
////////////////////add Assignments /////////////////////
addcourseAssignments() {

this.isPopupVisible = true;

}
 
///////////online//////////////
//////////////////online ////////////////
 
get courses() {
  return this.courseForm.get('courses') as FormArray;
}
createCourseGroup(): FormGroup {
  return this.fb.group({
   
    courseTopic: ['', Validators.required],
    meetingStarting: ['', Validators.required]  // Add meetingStarting field
 
  });
}
addCourse() {
  this.courses.push(this.createCourseGroup());
}
removeCourse(index: number) {
  this.courses.removeAt(index);
}
 
onSubmitOnline() {
  console.log(this.courseForm.value);
}
onSubmitonlinecourse(): void {
  if (this.courseForm.valid) {
    console.log(this.courseForm.value);
 
    // Call the FusionService to save the online course
    this.fusionService.saveCourseOnline(this.courseForm.value).subscribe(
      response => {
        console.log('Course saved successfully', response);
        alert('Course saved successfully');
      },
      error => {
        console.error('Error saving course', error);
        alert('Error saving course');
      }
    );
  }
}
navigateToDashboard() {
  this.router.navigate(['/mentorperspective']);
}
submitAll() {
  console.log('Save all data...');
  alert('All data has been submitted successfully!');
}
///////////////////////////////////////////////////////////////////////////////////////////////////////
courseType1: 'short' | 'long' = 'short';
  modules: Module[]= [
    {
      name: 'Module 1',
      lessons: [
        {
          lessonTitle: '',
          lessonContent: '',
          lessonDescription: '',
          lessonDuration: 0,
          uploadSets: []
        }
      ]
    }
  ];

  
  // alertMessage: string;
  // alertType: string;
  activeModuleIndex: number = 0;

  addModule() {
    this.modules.push({ 
      name: '', 
      lessons: [{
        lessonTitle: '',
        lessonContent: '',
        lessonDescription: '',
        lessonDuration: 0,
        uploadSets: []
      }] 
    });
    this.activeModuleIndex = this.modules.length - 1;
  }
  addNewLesson1(moduleIndex: number) {
    this.modules[moduleIndex].lessons.push({
      lessonTitle: '',
      lessonContent: '',
      lessonDescription: '',
      lessonDuration: 0,
      uploadSets: []
    });
  }

  addLesson3(moduleIndex: number) {
    this.addNewLesson1(moduleIndex);
  }

  removeModule(moduleIndex: number) {
    this.modules.splice(moduleIndex, 1);
    if (this.activeModuleIndex >= this.modules.length) {
      this.activeModuleIndex = this.modules.length - 1;
    }
  }

  removeLesson1(moduleIndex: number, lessonIndex: number) {
    this.modules[moduleIndex].lessons.splice(lessonIndex, 1);
    if (this.modules[moduleIndex].lessons.length === 0) {
      this.addLesson3(moduleIndex);
    }
  }

  setActiveModule(index: number) {
    this.activeModuleIndex = index;
  }

  toggleLessons(moduleIndex: number) {
    this.activeModuleIndex = this.activeModuleIndex === moduleIndex ? -1 : moduleIndex;
  }

  generateLessons(count: number) {
    const newLessons = Array.from({ length: count }, (_, i) => ({
      lessonTitle: `Lesson ${i + 1}`,
      lessonContent: '',
      lessonDescription: '',
      lessonDuration: 30,
      uploadSets: []
    }));
    this.modules[this.activeModuleIndex].lessons = newLessons;
  }

  

  // onFileChange(event: any, moduleIndex: number, lessonIndex: number, setIndex: number) {
  //   const files = event.target.files;
  //   const uploadSet = this.modules[moduleIndex].lessons[lessonIndex].uploadSets[setIndex];
  //   uploadSet.videoFiles = Array.from(files);
  //   uploadSet.videoDescriptions = Array(files.length).fill('');
  // }
  // onFileChange(event: any, setIndex: number) {
  //   const files: FileList = event.target.files;
  //   this.uploadSets[setIndex].videoFiles = Array.from(files);
  //   this.uploadSets[setIndex].videoDescriptions = new Array(files.length).fill('');
  // }
  onFileChange(event: any, setIndex: number, moduleIndex?: number, lessonIndex?: number): void {
    const files = event.target.files;
    
    if (moduleIndex !== undefined && lessonIndex !== undefined) {
      // Handle modules and lessons structure
      const uploadSet = this.modules[moduleIndex].lessons[lessonIndex].uploadSets[setIndex];
      uploadSet.videoFiles = Array.from(files);
      uploadSet.videoDescriptions = Array(files.length).fill('');
    } else {
      // Handle flat structure
      this.uploadSets[setIndex].videoFiles = Array.from(files);
      this.uploadSets[setIndex].videoDescriptions = Array(files.length).fill('');
    }
  }
  

  

  // addNewUploadSet2(moduleIndex: number, lessonIndex: number) {
  //   this.modules[moduleIndex].lessons[lessonIndex].uploadSets.push({
  //     videoFiles: [],
  //     videoDescriptions: []
  //   });
  // }
  addNewUploadSet2(moduleIndex: number, lessonIndex: number): void {
    this.modules[moduleIndex].lessons[lessonIndex].uploadSets.push({ videoFiles: [], videoDescriptions: [] });
  }

  onSubmit1() {
    console.log('Course Type:', this.courseType1);
    console.log('Modules:', this.modules);
  }
 
//////////////////////////////////////////////add assignment///////////////////////////////////////////////////////////
showTermsModal: boolean = false;
acceptedTerms: boolean = false;










removeFile(): void {
  this.selectedFile = null;
  this.fileName = 'No file chosen';
  const fileInput = <HTMLInputElement>document.getElementById('file-upload');
  if (fileInput) {
    fileInput.value = '';
  }
}

onUpload(): void {
  if (this.selectedFile) {
    const formData = new FormData();
    formData.append('assignmentTitle', this.assignmentTitle);
    formData.append('assignmentTopicName', this.assignmentTopicName);
    
    // Format dates
    const formattedStartDate = this.datePipe.transform(this.startDate, 'yyyy-MM-ddTHH:mm:ss');
    const formattedEndDate = this.datePipe.transform(this.endDate, 'yyyy-MM-ddTHH:mm:ss');
    
    formData.append('startDate', formattedStartDate || '');
    formData.append('endDate', formattedEndDate || '');
    
    // Append file
    formData.append('document', this.selectedFile, this.selectedFile.name);


    this.http.post(`http://34.230.34.88:8080/saveLesson/${this.lessonId}/${this.courseId}`, formData).subscribe(

    // this.http.post(`http://34.230.34.88:8080/saveLesson/${this.lessonId}/${this.courseId}`, formData).subscribe(

      response => {
        console.log('Assignment saved successfully:', response);
        this.snackBar.open('Assignment saved successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }, 
      error => {
        console.error('Error saving assignment:', error);
      }
    );
  } else {
    console.error('No file selected');
  }
}
termsContent: string[] = [
  "Welcome to our course management system.",
  "By accessing and using this system, you agree to the following terms and conditions.",
  "You must ensure that all the information you provide is accurate and up-to-date.",
  "You are responsible for maintaining the confidentiality of your account and password.",
  "You must not use this system for any unlawful purpose.",
  "We reserve the right to suspend or terminate your access to the system if you violate these terms.",
  "We do not guarantee the availability of the system at all times.",
  "We may update these terms and conditions from time to time without notice.",
  "Your continued use of the system after any changes constitutes your acceptance of the new terms.",
  "If you have any questions about these terms and conditions, please contact our support team."
];

closeModal() {
  this.showTermsModal = false;
}

acceptTerms() {
  this.showTermsModal = false;
}
// modules: any[] = [
//   { name: 'Module 1' },
//   { name: 'Module 2' }
// ];
// activeModuleIndex: number = 0;

enableDropdown() {
  // Implement logic here to enable dropdown based on module name edit
  // For example, set a flag or update a property to control toggleLessons behavior
}

// toggleLessons(moduleIndex: number) {
//   // Implement logic to toggle lessons based on the enabled dropdown condition
//   if (/* condition to check if dropdown should be enabled */) {
//     this.activeModuleIndex = moduleIndex;
//   }
// }

// removeModule(moduleIndex: number) {
//   this.modules.splice(moduleIndex, 1);
// }
saveModule(moduleIndex: number): void {
  const module = this.modules[moduleIndex];
  // Add your save logic here, e.g., make an API call to save the module
  console.log('Module saved:', module);
}
//////////////////////////Module
isFormValid(): boolean {
 return this.modules.every(module => module.name.trim() !== '');
}
onSubmitModule(moduleIndex: number): void {
  if (this.isFormValid()) {
    const lessonModule = {
      moduleName: this.modules[moduleIndex].name, // Use the module name from the correct index
    };

    this.fusionService.createLessonModule(lessonModule, this.courseId)
      .subscribe(
        response => {
          console.log('Lesson module created successfully', response);
          this.moduleId =response.id
          console.log(this.moduleId)
          this.alertMessage = 'Lesson module created successfully';
          this.alertType = 'success';
          // Handle success (e.g., show a success message, reset form)
        },
        error => {
          console.error('Error creating lesson module', error);
          this.alertMessage = 'Error creating lesson module';
          this.alertType = 'error';
          // Handle error (e.g., show an error message)
        }
      );
  }
}
// lessonModuleId:any=36;
onSubmitLesson(moduleIndex: number, lessonIndex: number): void {
  const lesson = this.modules[moduleIndex].lessons[lessonIndex];
  const lessonModuleId = 39;

  // Exclude uploadSets from the lesson data sent to the backend
  const lessonToSend = {
    lessonTitle: lesson.lessonTitle.trim(),
    lessonContent: lesson.lessonContent?.trim() || '',
    lessonDescription: lesson.lessonDescription?.trim() || '',
    lessonDuration: lesson.lessonDuration || 0
  };

  this.fusionService.createModuleLesson(lessonToSend, lessonModuleId)
    .subscribe(
      response => {
        console.log('Lesson created successfully', response);
        this.alertMessage = 'Lesson created successfully';
        this.alertType = 'success';
      },
      error => {
        console.error('Error creating lesson', error);
        this.alertMessage = 'Error creating lesson';
        this.alertType = 'error';
      }
    );
}
// generateLesson2(moduleIndex: number, lessonIndex: number): void {
//   const lesson = this.modules[moduleIndex].lessons[lessonIndex];
//   this.fusionService.createModuleLesson(lesson, moduleIndex).subscribe(
//     response => {
//       this.alertMessage = 'Lesson created successfully!';
//       this.alertType = 'success';
//     },
//     error => {
//       this.alertMessage = 'Failed to create lesson.';
//       this.alertType = 'error';
//     }
//   );
// }
generateLesson2(moduleIndex: number, lessonIndex: number): void {
  const lesson: Lesson3 = {
    lessonTitle: this.modules[moduleIndex].lessons[lessonIndex].lessonTitle,
    lessonContent: this.modules[moduleIndex].lessons[lessonIndex].lessonContent,
    lessonDescription: this.modules[moduleIndex].lessons[lessonIndex].lessonDescription,
    lessonDuration: this.modules[moduleIndex].lessons[lessonIndex].lessonDuration
  };

  // const predefinedModuleId = 36; // Use a predefined module ID for testing

  this.fusionService.createModuleLesson(lesson, this.moduleId).subscribe(
    response => {
      this.alertMessage = 'Lesson created successfully!';
      this.lessonid =response.id
          console.log(this.lessonid)
      this.alertType = 'success';
    },
    error => {
      this.alertMessage = 'Failed to create lesson.';
      this.alertType = 'error';
    }
  );
}
// Predefined course and lesson IDs

onSubmitLessonVideo2(moduleIndex: number, lessonIndex: number): void {
  const lesson = this.modules[moduleIndex].lessons[lessonIndex];

  // Set predefined courseId and lessonId
  this.courseId = this.courseId;
  this.lessonId = this.lessonid;

  console.log(`courseId before submission: ${this.courseId}`);
  console.log(`lessonId before submission: ${this.lessonId}`);

  // Check if courseId and lessonId are set
  if (!this.courseId || !this.lessonId) {
    alert('Please ensure Course ID and Lesson ID are set.');
    return;
  }

  const allDescriptionsFilled = lesson.uploadSets.every((set: UploadSet) =>
    set.videoDescriptions.every((desc: string) => desc.trim() !== '')
  );

  if (allDescriptionsFilled) {
    const formData = new FormData();

    lesson.uploadSets.forEach((set: UploadSet) => {
      set.videoFiles.forEach((file: File, fileIndex: number) => {
        formData.append('file', file, file.name);
        formData.append('description', set.videoDescriptions[fileIndex]);
      });
    });

    formData.append('courseId', this.courseId.toString());
    formData.append('lessonId', this.lessonId.toString());

    // Log formData contents (for debugging)
    formData.forEach((value, key) => {
      console.log(key + ': ' + value);
    });

    this.fusionService.uploadVideos(formData, this.courseId, this.lessonId).subscribe(
      (response) => {
        console.log('Upload successful:', response);
        console.log('Uploaded sets:', lesson.uploadSets);
        this.resetForm();
        alert('Upload successful!');
      },
      (error) => {
        console.error('Upload successful!', error);
        alert('Upload successful!');
      }
    );
  } else {
    alert('Please add descriptions for all videos.');
  }
}

setCourseAndLesson(courseId: number, lessonId: number): void {
  this.courseId = courseId;
  this.lessonId = lessonId;
}




/////////////////////add quiz//////////////////////
toggleOverlay() {
  this.showOverlay = !this.showOverlay;
}
 
addMCQ() {
  this.questions.push({
    text: '',
    type: 'mcq',
    options: [
      { label: 'A', text: '' },
      { label: 'B', text: '' },
      { label: 'C', text: '' },
      { label: 'D', text: '' }
    ],
    correctAnswer: ''
  });
}
 
addTrueFalse() {
  this.questions.push({
    text: '',
    type: 'truefalse',
    correctAnswer: ''
  });
}
 
createQuiz() {
  this.showQuiz = true;
}
 
resetQuestions() {
  this.questions = [];
  this.questionCount = 0;
}
 
deleteQuestion(index: number) {
  this.questions.splice(index, 1);
  this.questionCount--;
}
 
quizId: any;
 
onSaveQuiz() {
  if (!this.quizName) {
    alert('Please enter a quiz name.');
    return;
  }
  if (!this.startDate || !this.endDate) {
    alert('Please enter both start and end dates.');
    return;
  }
  if (new Date(this.endDate) <= new Date(this.startDate)) {
    alert('End date must be later than start date.');
    return;
  }
  const quiz: Quiz = {
    quizName: this.quizName,
    startDate: this.startDate,
    endDate: this.endDate
  };
  this.lessonId = this.lessonId;

  if (!this.lessonId) {
    console.error('lessonId is not set');
    alert('Unable to create quiz. Lesson ID is not set.');
    return;
  }


  console.log(`lessonId before submission: ${this.lessonId}`);
  // console.log('Quiz to be sent:', quiz);
  // console.log('lessonId:', this.lessonId);
  this.fusionService.createLessonQuiz(quiz, this.lessonId).subscribe(
    (response) => {
      console.log('Quiz created successfully:', response);
      this.quizId = response.id;
      console.log(this.quizId);
      alert('Quiz created successfully!');
      this.isQuizCreated = true; // Enable questions section
      this.quizName = '';
      this.startDate = '';
      this.endDate = '';
    },
    (error) => {
      console.error('Unable to create quiz', error);
      alert('Unable to create quiz. Please try again.');
    }
  );
}
onSaveQuiz2() {
  if (!this.quizName) {
    alert('Please enter a quiz name.');
    return;
  }
  if (!this.startDate || !this.endDate) {
    alert('Please enter both start and end dates.');
    return;
  }
  if (new Date(this.endDate) <= new Date(this.startDate)) {
    alert('End date must be later than start date.');
    return;
  }
  const quiz: Quiz = {
    quizName: this.quizName,
    startDate: this.startDate,
    endDate: this.endDate
  };
  this.lessonId = this.lessonid;

  if (!this.lessonId) {
    console.error('lessonId is not set');
    alert('Unable to create quiz. Lesson ID is not set.');
    return;
  }


  console.log(`lessonId before submission: ${this.lessonId}`);
  // console.log('Quiz to be sent:', quiz);
  // console.log('lessonId:', this.lessonId);
  this.fusionService.createLessonQuiz(quiz, this.lessonId).subscribe(
    (response) => {
      console.log('Quiz created successfully:', response);
      this.quizId = response.id;
      console.log(this.quizId);
      alert('Quiz created successfully!');
      this.isQuizCreated = true; // Enable questions section
      this.quizName = '';
      this.startDate = '';
      this.endDate = '';
    },
    (error) => {
      console.error('Unable to create quiz', error);
      alert('Unable to create quiz. Please try again.');
    }
  );
}
submitQuiz() {
  const quizId = this.quizId; // Replace with the actual quiz ID
  this.fusionService.addQuestionsToQuiz(quizId, this.questions).subscribe(
    (response) => {
      console.log('Quiz submitted successfully', response);
      alert('Quiz questions posted successfully!');
    },
    (error) => {
      console.error('Error submitting quiz', error);
      alert('Unable to post the Questions. Please try again.');
    }
  );
}
///////////////////////////////////////////////////
///////////// course resourse ///////////////////

onFileSelectedResourse(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
  }
}


onSubmitResourse(): void {
  if (this.selectedFile) {
    this.fusionService.uploadCourseDocument(this.courseId, this.selectedFile).subscribe(
      // this.fusionService.uploadCourseDocument(9, this.selectedFile).subscribe(

      (response) => {
        console.log('Document uploaded successfully', response);
        alert('Document uploaded successfully!');
      },
      (error) => {
        console.error('Error uploading document', error);
        alert('Error uploading document!');
      }
    );
  } else {
    console.error('No file selected');
    alert('No file selected');
  }
}
////////////// course video/////////////
onVideoUpload2(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedVideo = input.files[0];
    console.log('Video file selected:', this.selectedVideo.name);
  } else {
    this.selectedVideo = null;
    console.log('No video selected');
  }
}
selectedVideo: File | null = null;

 saveVideo2(): void {
  if (this.selectedVideo && this.courseId) {
    // Debug logs to ensure courseId and selectedVideo are set
    console.log('Course ID:', this.courseId);
    console.log('Selected video:', this.selectedVideo.name);

    this.mentor1service.uploadVideo(this.courseId, this.selectedVideo).subscribe({
      next: (response) => {
        console.log('Upload successful:', response);
        alert('Video uploaded successfully!');
        this.selectedVideo = null; // Clear the selected video after saving
      },
      error: (error) => {
        console.error('Upload failed:', error);
        alert('Video upload failed.');
      }
    });
  } else {
    if (this.courseId === null) {
      console.error('Course ID is not set');
    }
    if (this.selectedVideo === null) {
      console.error('No video selected');
    }
    alert('Please select a video and ensure course ID is set before saving.');
  }
}
//////////////////////// ASSIGNMENT ////////////////////////////


 
openModal() {
  if (!this.acceptedTerms) {
    this.showTermsModal = true;
  }
}
 
closePopup(): void {
  this.isPopupVisible = false;
}
 
validateDates(control: FormControl) {
  const currentDate = new Date();
  const selectedDate = new Date(control.value);
  return selectedDate < currentDate ? { invalidDate: true } : null;
}
 
onFileChange2(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
    this.assignmentForm.patchValue({
      file: this.selectedFile
    });
  } else {
    this.selectedFile = null;
    this.assignmentForm.patchValue({
      file: null
    });
  }
}
 
// onSubmit2(): void {
//   if (this.assignmentForm.valid && this.selectedFile) {
//     const formValues = this.assignmentForm.value;
//     const startDate = formValues.startDate ? new Date(formValues.startDate) : new Date();
//     const endDate = formValues.endDate ? new Date(formValues.endDate) : new Date();
//     const reviewMeetDate = formValues.reviewMeetDate ? new Date(formValues.reviewMeetDate) : new Date();
//     const start = startDate.toISOString();
//     const end = endDate.toISOString();
//     const reviewDate = reviewMeetDate.toISOString();
 
//     this.fusionService.uploadAssignment3(
//       this.lessonId,
//       this.courseId,
//       formValues.assignmentTitle,
//       formValues.assignmentTopicName,
//       this.selectedFile,
//       start,
//       end,
//       reviewDate
//     ).subscribe(
//       (response: any) => {
//         console.log("Upload successful", response);
//         this.closePopup(); // Close the popup on successful upload
//       },
//       (error: any) => {
//         console.error("Upload failed", error);
//       }
//     );
//   } else {
//     alert("Please fill in all fields and select a file.");
//   }
// }
onSubmit2(): void {
  if (this.assignmentForm.valid && this.selectedFile) {
    const formValues = this.assignmentForm.value;
    const startDate = formValues.startDate ? new Date(formValues.startDate) : new Date();
    const endDate = formValues.endDate ? new Date(formValues.endDate) : new Date();
    const reviewMeetDate = formValues.reviewMeetDate ? new Date(formValues.reviewMeetDate) : new Date();
    const start = startDate.toISOString();
    const end = endDate.toISOString();
    const reviewDate = reviewMeetDate.toISOString();
 
    this.fusionService.uploadAssignment3(
      this.lessonId,
      this.courseId,
      // this.lessonModuleId,
      formValues.assignmentTitle,
      formValues.assignmentTopicName,
      this.selectedFile,
      start,
      end,
      reviewDate
    ).subscribe(
      (response: any) => {
        console.log("Upload successful", response);
        this.closePopup(); // Close the popup on successful upload
      },
      (error: any) => {
        console.error("Upload failed", error);
      }
    );
  } else {
    alert("Please fill in all fields and select a file.");
  }
}
 
 
 
 

///////////////////////////// VALIDATIONS COURSELANDING /////////////////////////////////////


isFormValid2(): boolean {
  return !!this.courseTitle &&
         !!this.level &&
         !!this.courseType &&
         !!this.courseDescription &&
         !!this.courseDuration &&
         !!this.courseLanguage &&
         this.whyEnrolls.length > 0 &&
         (this.courseType !== 'offline' || !!this.courseTerm);
         !!this.courseImage &&
           (this.courseType !== 'offline' || !!this.courseTerm);
}
 
get showCourseTitleError(): boolean {
  return this.formSubmitted && !this.courseTitle;
}
 
get showLevelError(): boolean {
  return this.formSubmitted && !this.level;
}
 
get showCourseTypeError(): boolean {
  return this.formSubmitted && !this.courseType;
}
 
get showCourseTermError(): boolean {
  return this.formSubmitted && this.courseType === 'offline' && !this.courseTerm;
}
 
get showCourseDescriptionError(): boolean {
  return this.formSubmitted && !this.courseDescription;
}
 
get showWhyEnrollError(): boolean {
  return this.formSubmitted && this.whyEnrolls.length === 0;
}
 
get showCourseDurationError(): boolean {
  return this.formSubmitted && !this.courseDuration;
}
 
get showLanguageError(): boolean {
  return this.formSubmitted && !this.courseLanguage;
}
get showCourseImageError(): boolean {
  return this.formSubmitted && !this.courseImage;
}
 

///////////////////////////// VALIDATIONS COURSE PLANNING /////////////////////////////////////
prerequisites1: string[] = ['', '', '', '', ''];
  tools: { name: string, image: File | null }[] = [];
  skills: { name: string, image: File | null }[] =[];

 addTool() {
    this.tools.push({ name: '', image: null });
  }
 
  addSkill() {
    this.skills.push({ name: '', image: null });
  }
  addPrerequisite() {
    if (this.prerequisites.length < 8) {
      this.prerequisites.push('');
    }
  }

 
isFormValid1(): boolean {
    const isToolValid = this.tools.some(tool => tool.name && tool.image);
    const isSkillValid = this.skills.some(skill => skill.name && skill.image);
    const isPrerequisiteValid = this.prerequisites.some(prereq => prereq.trim() !== '');
 
    return isToolValid && isSkillValid && isPrerequisiteValid;
  }
 
  get showToolError(): boolean {
    return this.formSubmitted && !this.tools.some(tool => tool.name && tool.image);
  }
 
  get showSkillError(): boolean {
    return this.formSubmitted && !this.skills.some(skill => skill.name && skill.image);
  }
 
  get showPrerequisiteError(): boolean {
    return this.formSubmitted && !this.prerequisites.some(prereq => prereq.trim() !== '');
  }
 
onSubmit() {
  if (!this.isFormValid()) {
    alert('Please fill all required fields and ensure you have at least 2 prerequisites.');
    return;
  }
  this.formSubmitted = true;
  if (!this.isFormValid()) {
    return;
  }
  const formData = new FormData();
 
  // Add tool images and names
  this.tools.forEach((tool, index) => {
    if (tool.name && tool.image) {
      formData.append(`toolImages`, tool.image, tool.image.name);
      formData.append(`toolNames`, tool.name);
    }
  });
 
  // Add skill images and names
  this.skills.forEach((skill, index) => {
    if (skill.name && skill.image) {
      formData.append(`skillImages`, skill.image, skill.image.name);
      formData.append(`skillNames`, skill.name);
    }
  });
 
  // Add prerequisites
  this.prerequisites.filter(p => p.trim() !== '').forEach(prereq => {
    formData.append('coursePrerequisitesList', prereq);
  });
 
  const headers = new HttpHeaders();
  headers.append('Content-Type', 'multipart/form-data');
 
  this.http.post(`${environment.apiBaseUrl}/courseTools/saveMultipleCourseTools/${this.courseId}`, formData, { headers })
    .subscribe(
      (response: any) => {
        console.log('Tools and skills saved successfully!', response);
        alert('Tools and skills saved successfully!');
      },
      (error) => {
        console.error('Failed to save tools and skills.', error);
        alert('Failed to save tools and skills.');
      }
    );
}


onFileSelected1(event: any, type: 'tool' | 'skill', index: number) {
  const file = event.target.files[0];
  if (file) {
    if (type === 'tool') {
      this.tools[index].image = file;
    } else {
      this.skills[index].image = file;
    }
  }
}
///////////////////// COURSE TRAILER /////////////////////////// 
videoTrailers: { file: File | null, title: string, description: string }[] = [
  { file: null, title: '', description: 'Beginner' },    // Mandatory
  { file: null, title: '', description: 'Intermediate' }, // Optional
  { file: null, title: '', description: 'Advanced' }      // Optional
];
uploadResponses: string[] = [];

onFilevideoTrailersSelected(event: any, index: number) {
  this.videoTrailers[index].file = event.target.files[0];
}

uploadTrailers() {
  // Validate the first trailer
  if (!this.videoTrailers[0].file || !this.videoTrailers[0].title || !this.videoTrailers[0].description) {
    alert('The first video trailer is mandatory. Please fill in all required fields.');
    return;
  }

  // Reset the responses
  this.uploadResponses = [];

  // Track the number of successful uploads
  let successCount = 0;

  // Iterate over videoTrailers and upload each if it has a file
  this.videoTrailers.forEach((trailer, index) => {
    if (trailer.file && trailer.title && trailer.description) {
      this.fusionService.uploadVideoTrailer(this.courseId, trailer.file, trailer.title, trailer.description)
        .subscribe({
          next: (response) => {
            this.uploadResponses[index] = `Success: ${response.message}`;
            successCount++;

            // If all uploads are done, show a success alert
            if (successCount === this.videoTrailers.filter(t => t.file).length) {
              alert('All videos have been successfully uploaded!');
            }
          },
          error: (error) => {
            this.uploadResponses[index] = `Error: ${error.message}`;
          }
        });
    }
  });
}
onPrerequisiteChange(index: number, value: string) {
  this.prerequisites[index] = value;
  console.log('Prerequisites:', this.prerequisites); // For debugging
}


}

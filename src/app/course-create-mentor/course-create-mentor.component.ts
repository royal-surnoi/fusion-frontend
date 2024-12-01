import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Assignment, CourseDocuments, CourseVideoTrailer, FusionService, Lesson1, Project12, Quiz } from '../fusion.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Mentor1Service } from '../mentor1.service';
import { environment } from '../../environments/environment';
import { Fusion2Service } from '../fusion2.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { SafePipe } from "../mock-activity/mock-activity.component";
import { MatIconModule } from '@angular/material/icon';
// import { DomSanitizer } from '@angular/platform-browser';

async function urlToFile(url: string, filename: string, mimeType: string) {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], filename, { type: mimeType });
}
interface Video234 {
  id: number;
  title: string;
  url: string;
  description?: string;
  videoTitle:string;
  videoDescription:string;
  s3Url:string;
}
 
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
  id?: number; // Add the id property
  lessonTitle: string;
  lessonContent: string;
  lessonDescription: string;
  lessonDuration: number;
  // uploadSets: UploadSet[];

}
interface LessonWithUploads extends Lesson3 {
  uploadSets: UploadSet[];
  videos?: Video234[];
// Add the videos property here
  isVideosFetched?: boolean; // New property to track if videos were fetched
}
interface UploadSet {
  videoFiles: File[];
  videoDescriptions: string[];
}
interface Lesson3 {


  lessonId?: number; // Add lessonId here
 
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
  moduleId?: number;
  name: string;
  lessons: LessonWithUploads[];
}
///////////// Celebrations////////////////
interface FlowerPetal {
  cx: number;
  cy: number;
  transform: string;
}
 
interface Flower {
  petals: FlowerPetal[];
  color: string;
  petalColor: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
}
interface CelebrationItem {
  type: string;
  color: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
  size: number;
  strokeWidth: string; // Add this new property
 
}
 
@Component({
  selector: 'app-course-create-mentor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SafePipe],
  templateUrl: './course-create-mentor.component.html',
  styleUrl: './course-create-mentor.component.css'
})
export class CourseCreateMentorComponent implements OnInit {
  formSubmitted: boolean;
  addQuestion() {
    throw new Error('Method not implemented.');
  }
  addAnswer(_t911: number) {
    throw new Error('Method not implemented.');
  }
  removeAnswer(_t911: number, _t922: number) {
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
  // lessonId:any;
  lessonModuleId: any;
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
  Id: any;
  coursesId: any;
  // courseId:any;
  courseForm!: FormGroup;
  id: any;
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
  courseImage: any;


  // editingTitle: boolean = false;
  // titleForm: any;
  // courseDescription: string = '';
  // courseTitle: string;

  // level: string;
  // description: string;

  //////////////////////////////////////lesson/////////////////
  lessons: any[] = [];
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
  toolImage: any;
  //  editingToolIndex: number = -1;
  //  editingtoolName: string = '';
  // toolName: string;
  skillName: any;
  // toolImage: File;
  skillImage: any;
  coursePrerequisites: any;

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
  shortVideoUrl: any;
  demoVideoUrl: any;
  editingShortVideo: boolean = false;
  tempShortVideoUrl: string | null = null;
  editingDemoVideo: boolean = false;
  tempDemoVideoUrl: string | null = null;
  description: string = '';
  editedObjective: string = '';
  isEditing: boolean = true;
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
  // New properties for project
  newProjectTitle: string = '';
  newProjectDescription: string = '';
  newprojectDeadline: string = '';


  projectTitle: string = '';
  projectDescription: string = '';
  projectDeadline: string = '';
  projectDocumentName: string = ''; // Assuming this is where you store the document file name


  document: any;
  projects: any[] = [];
  moduleId: any;
  lessonid!: number;




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
    private mentor1service: Mentor1Service,
    private fusionService: FusionService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,


    // private fusionService: FusionService,
    // private http: HttpClient,
    // private router: Router,
    // private fb: FormBuilder,
    // private authService: AuthService,
    // private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private fusion2service: Fusion2Service
  ) {

    this.formSubmitted = false;

    {
      this.assignmentForm = this.fb.group({
        assignmentTitle: ['', Validators.required],
        assignmentTopicName: ['', Validators.required],
        startDate: ['', [Validators.required, this.validateDates.bind(this)]],
        endDate: ['', Validators.required],
        reviewMeetDate: ['', Validators.required],
        file: [null, Validators.required]
      });
    }
    this.projectForm = this.fb.group({
      newProjectTitle: ['', Validators.required],
      newProjectDescription: ['', Validators.required],
      newprojectDeadline: ['', Validators.required],
      document: ['', Validators.required],
      documentUrl: [''] // For preview URL
    });
  }
  ngOnInit(): void {

    console.log('Component initialized');
    // this.generateFlowers();
    this.generateCelebrationItems();
 
    this.triggerCelebration();

    this.getLessons();

    // Retrieve courseId from the route parameters
    this.route.params.subscribe(params => {
      this.courseId = +params['id']; // Convert to number using '+'
      console.log('Course ID:', this.courseId);
    });

    this.route.params.subscribe(params => {
      this.courseId = +params['id']; // Convert to number using '+'
      this.getLessons();
    });

    // Fetch courseId from the navigation URL
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchModules();
    this.loadDocuments();

    // Fetch data from backend
    this.getCourseToolsData();
    this.getCourseFeeDetails(this.courseId);

    // this.getProjectDetails(this.courseId);
    this.route.params.subscribe(params => {
      const courseId = +params['id']; // The '+' converts the string to a number
      if (courseId) {
        this.getProjectDetails(courseId);
      } else {
        console.error('No courseId found in URL');
        // Handle the error appropriately, maybe redirect to a 404 page or show an error message
      }
    });

    this.fetchCourseData();
    this.route.params.subscribe(params => {
      this.courseId = +params['id']; // Convert to number
      this.loadCourseData();
      // this.submitFirstSet5();
    });
    this.route.paramMap.subscribe(params => {
      const courseId = +params.get('id')!;
      this.fetchVideoTrailers(courseId);
    });
    this.addTool();
    this.addSkill();
    this.addPrerequisite();
    this.calculateCompletionPercentage();
    this.usersId = localStorage.getItem('id');

    //   const courseID = 'yourCourseID';
    //   this.router.navigate(['/mentor-perspective', courseID]);
    // this.fusionService.getPromoCode(this.Id).subscribe(
    //   (response: string) => {
    //     this.promoCode = response;
    //   },
    //   (error) => {
    //     console.error('Error fetching promo code:', error);
    //   }
    // );

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
    this.route.params.subscribe(params => {
      this.courseId = +params['id']; // Ensure courseId is a number
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
  }

  saveEditTitle() {
    this.editingTitle = false;
    this.onFieldChange();
  }

  cancelEditTitle() {
    this.editingTitle = false;
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


  createLesson() {

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
          // Navigate to the 'pricing' tab
          this.updatePercentage();
          this.setCurrentTab('pricing');
          // Handle success, show alert, etc.
          // Optionally, you can refresh project list or navigate to another page
        },
        (error) => {
          console.error('Error adding project:', error);
          // Handle error, show alert, etc.
        }
      );
  }
  /////// fetch project 


  selectedProject: Project12 | null = null;
  documentUrl: SafeResourceUrl | null = null; // Document preview URL



  // Fetch project details by courseId
 // Fetch project details by courseId and enable update mode
 getProjectDetails(courseId: number): void {
  this.fusionService.getProjectsByCourse(courseId).subscribe(
    (projects: Project12[]) => {
      this.projects = projects;
      if (this.projects.length > 0) {
        this.selectedProject = this.projects[0]; // Select the first project by default

        if (this.selectedProject) {
          this.patchProjectForm(this.selectedProject); // Patch the form with project data
        }
      }
    },
    error => {
      console.error('Error fetching projects:', error);
    }
  );
}
  /////////////// update project ////////////

updateProject(): void {
  if (!this.selectedProject) return;

  // Extract form values
  const {
    newProjectTitle,
    newProjectDescription,
    newProjectDeadline,
    reviewMeetDate,
    maxTeam,
    gitUrl,
  } = this.projectForm.value;
  
  const document: File = this.projectForm.get('document')?.value;

  // Prepare FormData object
  const formData = new FormData();
  
  // Append fields only if they are provided (non-null)
  if (newProjectTitle) {
    formData.append('projectTitle', newProjectTitle);
  }
  if (newProjectDescription) {
    formData.append('projectDescription', newProjectDescription);
  }
  if (newProjectDeadline) {
    const deadlineISO = new Date(newProjectDeadline).toISOString(); // Convert date to ISO format
    formData.append('projectDeadline', deadlineISO);
  }
  if (reviewMeetDate) {
    const reviewMeetISO = new Date(reviewMeetDate).toISOString(); // Convert date to ISO format
    formData.append('reviewMeetDate', reviewMeetISO);
  }
  if (maxTeam) {
    formData.append('maxTeam', maxTeam.toString()); // Convert number to string
  }
  if (gitUrl) {
    formData.append('gitUrl', gitUrl);
  }
  
  // Append project document if provided
  if (document) {
    formData.append('projectDocument', document);
  }

  // Call the service to update the project
  this.fusionService.updateProjects(this.selectedProject.id!, formData).subscribe(
    response => {
      console.log('Project updated successfully:', response);
      this.updatePercentage();  // Update any percentage or UI after successful update
      this.setCurrentTab('pricing');  // Switch to another tab if needed
    },
    error => {
      console.error('Error updating project:', error);
    }
  );
}

  

  // Convert projectDeadline array to YYYY-MM-DD string
  convertDateArrayToISO(dateArray: number[]): string {
    const [year, month, day] = dateArray;
    return `${year}-${this.pad(month)}-${this.pad(day)}`;
  }

  // Add leading zero for single-digit months and days
  pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  // Patch form with selected project data
   // Patch form with selected project data
   patchProjectForm(project: Project12): void {
    this.projectForm.patchValue({
      newProjectTitle: project.projectTitle || '',
      newProjectDescription: project.projectDescription || '',
      newprojectDeadline: project.projectDeadline ? this.convertDateArrayToISO(project.projectDeadline) : '',
      document: null, // File input can't be patched, so left as null
    });
    this.documentUrl = project.projectDocument ? this.sanitizeUrl(this.getDocumentUrl(project.projectDocument)) : null;
  }

  // Generate a URL for document preview
  // Generate document URL for preview
  getDocumentUrl(documentData: string): string {
    try {
      const binaryData = atob(documentData);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error generating document URL:', error);
      return '';
    }
  }

  // Sanitize the URL for preview
  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // Download the document
  downloadDocument(documentData: string) {
    const binaryData = atob(documentData);
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.pdf'; // Adjust the file name and extension as needed
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /////////////////////////////////////////////////////////////

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

  loadCourseData() {
    if (this.courseId) {
      this.fusionService.getCourseById(this.courseId).subscribe(
        (courseData) => {
          // Populate form fields with existing course data
          this.level = courseData.level;
          this.courseType = courseData.courseType;
          this.courseTerm = courseData.courseTerm;
          this.courseDescription = courseData.courseDescription;
          this.whyEnrolls = [
            courseData.level_1, courseData.level_2, courseData.level_3,
            courseData.level_4, courseData.level_5, courseData.level_6,
            courseData.level_7, courseData.level_8
          ].filter(item => item); // Remove empty entries
          this.courseDuration = courseData.courseDuration;
          this.courseLanguage = courseData.courseLanguage;
          // ... populate other fields as needed
        },
        (error) => {
          console.error('Error loading course data', error);
          alert('Error loading course data. Please try again.');
        }
      );
    }
  }

  submitFirstSet5() {
    console.log('submitFirstSet5 called');
    this.formSubmitted = true;

    if (!this.isFormValid2()) {
      console.log('Form is not valid');
      return;
    }

    console.log('Preparing course data');
    const courseData = new FormData();
    courseData.append('courseDescription', this.courseDescription);
    courseData.append('courseLanguage', this.courseLanguage);
    courseData.append('level', this.level);
    courseData.append('level_1', this.whyEnrolls[0] || '');
    courseData.append('level_2', this.whyEnrolls[1] || '');
    courseData.append('level_3', this.whyEnrolls[2] || '');
    courseData.append('level_4', this.whyEnrolls[3] || '');
    courseData.append('level_5', this.whyEnrolls[4] || '');
    courseData.append('level_6', this.whyEnrolls[5] || '');
    courseData.append('level_7', this.whyEnrolls[6] || '');
    courseData.append('level_8', this.whyEnrolls[7] || '');
    courseData.append('courseDuration', this.courseDuration.toString());
    courseData.append('courseType', this.courseType);
    courseData.append('courseTerm', this.courseTerm);
    courseData.append('coursePercentage', this.coursePercentage);


    if (this.courseImage) {
      courseData.append('courseImage', this.courseImage);
    }

    if (!this.courseId) {
      console.error('Course ID is missing');
      alert('Error: Course ID is missing. Please try again.');
      return;
    }

    console.log('Calling updateCourseById with courseId:', this.courseId);

    this.fusionService.updateCourseById(this.courseId, courseData).subscribe(
      (response) => {
        this.data = response;
        console.log('Course updated successfully', response);
        alert('Course updated successfully!');
        // Now call the updatePercentage() method after successfully updating the course
        this.updatePercentage();
        this.setCurrentTab('coursetrailer');  // Switch to the 'coursetrailer' tab
      },
      (error) => {
        console.error('Error updating course', error);
        alert('Error updating course. Please try again.');
      }
    );
  }
  //////////////save course Trailer & material/////////////
  saveAllAndNavigate() {
    // Call both methods
    this.uploadTrailers();
    this.uploadResourseDocuments()
    // this.onSubmitResourse();

    // Navigate to the 'Course Planning' tab after the operations
    this.setCurrentTab('planning');
  }
  ////////////////////////////////////////////////////////



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
  ////////////// 
  createCoupon() {
    if (!this.expirationDate) {
      alert('Please select an expiration date.');
      return;
    }

    const expirationDateISO = new Date(this.expirationDate).toISOString();

    this.fusionService.createCoupons(
      this.courseId,
      this.discountPercentage,
      expirationDateISO,
      this.courseFee,
      this.currency,
      // this.completionPercentage
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

        // Now call the updatePercentage() method after successfully updating the course
        this.updatePercentage();
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
  getCourseFeeDetails(id: number): void {
    this.fusionService.getCourseFeeDetails(this.courseId).subscribe((course) => {
      this.currency = course.currency;
      this.courseFee = course.courseFee;
      this.discountPercentage = course.discountPercentage;
      this.expirationDate = course.promoCodeExpiration;
      this.promoCode = course.promoCode

    });
  }
  /////////////////////////////////////
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
  // getPromoCode() {
  //   this.fusionService.getPromoCode(1) // Replace with actual courseId or logic
  //     .subscribe(
  //       (response: any) => {
  //         console.log('Response:', response); // Check the response from backend
  //         this.promoCode = response; // Assign the plain text response directly
  //       },
  //       error => {
  //         console.error('Error fetching promo code:', error);
  //         // Handle error as needed
  //       }
  //     );
  // }




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
        this.lessonId = response.id;
        console.log('Lesson created successfully', response);
        this.showAlert('Lesson created successfully!', 'success');
        this.lessons2[index] = {
          lessonTitle: '',
          lessonContent: '',
          lessonDescription: '',
          lessonDuration: 0
        };

        // Fetch videos for the created lesson
        this.getVideosByLessonId(this.lessonId);
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
  /////////////// get short lessons ////////////////////


  getLessons(): void {
    this.fusionService.getLessonsByCourseId(this.courseId).subscribe(
      (lessons2: Lesson1[]) => {
        this.lessons2 = lessons2;
        console.log('Fetched lessons:', lessons2);

        // Fetch videos for each lesson
        lessons2.forEach((lesson) => {
          this.getVideosByLessonId(lesson.id);
          
          // this.getAssignmentsForLesson(lesson.id);

        });
      },
      (error: any) => {
        console.error('Error fetching lessons:', error);
      }
    );
  }



  //////////////////////////////////////////////////////
  ////////////////////////////////////////lesson video for course///////////////////////////
  // lesson videos
  // courseId: any = '1';
  // lessonId: any ;
  videoFiles: File[] = [];
  videoDescriptions: string[] = [];
  videoDescription: string = '';

  uploadSets: Array<{ videoFiles: File[], videoDescriptions: string[] }> = [
    { videoFiles: [], videoDescriptions: [] }
  ];

  // onFileChange(event: any, setIndex: number) {
  //   const files: FileList = event.target.files;
  //   this.uploadSets[setIndex].videoFiles = Array.from(files);
  //   this.uploadSets[setIndex].videoDescriptions = new Array(files.length).fill('');
  // }
  // Add new upload set for a specific lesson
  addNewUploadSet(): void {
    this.uploadSets.push({ videoFiles: [], videoDescriptions: [] });
  }



  // Method to handle form submission 
  onSubmitLessonVideo(lessonId: number | undefined): void {
    if (this.courseId && lessonId) {
      // Ensure video descriptions are filled and proceed with upload
      const allDescriptionsFilled = this.uploadSets.every((set: { videoDescriptions: string[] }) =>
        set.videoDescriptions.every((desc: string) => desc.trim() !== '')
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
        formData.append('lessonId', lessonId.toString());  // Use lessonId from the method parameter

        this.fusionService.uploadVideos(formData, this.courseId, lessonId).subscribe(
          (response) => {
            console.log('Upload successful:', response);
          
            alert('Upload successful!');
          },
          (error) => {
            console.error('Upload failed:', error);
            alert('Upload failed!');
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
  //////////////////// getting short lesson vedios /////////////

  videos: Video234[] = [];
  videosByLessonId: { [lessonId: number]: Video234[] } = {}; // Store videos by lesson ID


  // Method to fetch videos by lessonId
  getVideosByLessonId(lessonId: number): void {
    this.fusionService.getVideosByLessonId(lessonId).subscribe(
      (videos: Video234[]) => {
        this.videosByLessonId[lessonId] = videos; // Store videos for this lesson
        console.log(`Fetched videos for lesson ${lessonId}:`, videos);
      },
      (error: any) => {
        console.error('Error fetching videos for lesson ' + lessonId, error);
      }
    );
  }
  //////////////////// delete short lesson vedios /////////////
  deleteVideo(videoId: number): void {
    this.fusionService.deleteVideo(videoId).subscribe({
      next: (response) => {
        console.log('Video deleted successfully:', response);
        // Optionally refresh the list or perform other actions

        // Show alert after successful deletion
        alert('Video deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting video:', error);
        // Optionally handle errors or display messages to the user
        alert('Error deleting video. Please try again.');
      }
    });
  }

  //////////////////////////////////////////////////////////////////////////// 
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
    let totalFields = 10; // Total number of fields to be filled including new sections

    // General course fields
    if (this.courseTitle) filledFields++;
    if (this.level) filledFields++;
    if (this.courseTerm) filledFields++;
    if (this.courseDescription) filledFields++;
    if (this.courseImage) filledFields++;
    if (this.whyEnrolls.length > 2) filledFields++;
    if (this.courseDuration) filledFields++;
    if (this.courseType) filledFields++;
    if (this.courseLanguage) filledFields++;

    // Tool and skill fields
    if (this.tools && this.tools.length > 0) {
      for (let tool of this.tools) {
        if (tool.name) {
          filledFields++;
          totalFields++;
        }
        if (tool.image) {
          filledFields++;
          totalFields++;
        }
      }
    }
    if (this.skills && this.skills.length > 0) {
      for (let skill of this.skills) {
        if (skill.name) {
          filledFields++;
          totalFields++;
        }
        if (skill.image) {
          filledFields++;
          totalFields++;
        }
      }
    }

    if (this.currency) filledFields++;
    if (this.courseFee) filledFields++;

    // Project section
    const projectForm = this.projectForm;
    if (projectForm) {
      totalFields += 4; // Add 4 to total fields for project section
      if (projectForm.get('newProjectTitle')?.value) filledFields++;
      if (projectForm.get('newProjectDescription')?.value) filledFields++;
      if (projectForm.get('newprojectDeadline')?.value) filledFields++;
      if (projectForm.get('document')?.value) filledFields++;
    }

    // Calculate completion percentage
    this.completionPercentage = Math.round((filledFields / totalFields) * 100);
    console.log(this.completionPercentage);
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
  currentLessonId: number | null = null;
  addcourseAssignments12(lessonId: number, courseId: number): void {
    this.isPopupVisible = true;
    this.currentLessonId = lessonId;
  }
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
  modules: Module[] = [
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
      this.http.post(`${environment.apiBaseUrl}/saveLesson/${this.lessonId}/${this.courseId}`, formData).subscribe(



      // this.http.post(`http://34.230.34.88:8080/saveLesson/${this.lessonId}/${this.courseId}`, formData).subscribe(

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
            this.moduleId = response.id
            console.log(this.moduleId + "hiiiiii how are")
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
          this.lessonId = response.id;
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

    this.fusionService.createModuleLesson(lesson, this.moduleId,).subscribe(
      response => {
        this.alertMessage = 'Lesson created successfully!';
        this.lessonId = response.id

        console.log(this.lessonId, 'this was the lesson ID')
        this.alertType = 'success';
      },
      error => {
        this.alertMessage = 'Failed to create lesson.';
        this.alertType = 'error';
      }
    );
  }

  // Predefined course and lesson IDs

  onSubmitLessonVideo2(moduleIndex: number, lessonIndex: number, lessonId: any): void {
    const lesson = this.modules[moduleIndex].lessons[lessonIndex];
   
    // Check if videos have been fetched before (allow additional uploads)
    if (!lesson.isVideosFetched) {
      // Fresh upload, set the predefined courseId and lessonId
      this.courseId = this.courseId;
      this.lessonId = lessonId;
      console.log(`courseId before submission: ${this.courseId}`);
      console.log(`lessonId before submission: ${this.lessonId}`);
    } else {
      // Reuse the lessonId if it's stored in the lesson object
      this.lessonId = lesson.lessonId || this.lessonId; // Use lesson.lessonId if available
      console.log('Reusing lessonId for additional upload:', this.lessonId);
    }
   
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
          this.resetForm();
          alert('Upload successful!');
          // Fetch the updated list of videos
          this.getVideosByLessonIdlong(this.lessonId, moduleIndex, lessonIndex);
          // Set the isVideosFetched flag to true after successful upload
          lesson.isVideosFetched = true;
          lesson.lessonId = this.lessonId; // Ensure lessonId is stored for future uploads
        },
        (error) => {
          console.error('Upload failed!', error);
          alert('Upload failed. Please try again.');
        }
      );
    } else {
      alert('Please add descriptions for all videos.');
    }
  }
   
//////////////////// get long lesson videos

getVideosByLessonIdlong(lessonId: number, moduleIndex: number, lessonIndex: number): void {
  if (!lessonId || moduleIndex === undefined || lessonIndex === undefined) {
    console.error('Invalid parameters:', { lessonId, moduleIndex, lessonIndex });
    return;
  }

  console.log('Fetching videos for lesson ID:', lessonId);

  this.fusionService.getVideosByLessonId(lessonId).subscribe(
    (videos: Video234[]) => {
      if (videos && videos.length > 0) {
        if (this.modules[moduleIndex] && this.modules[moduleIndex].lessons[lessonIndex]) {
          // Store the fetched videos in the lesson object
          this.modules[moduleIndex].lessons[lessonIndex].videos = videos;
          this.modules[moduleIndex].lessons[lessonIndex].isVideosFetched = true; // Mark videos fetched
          this.modules[moduleIndex].lessons[lessonIndex].lessonId = lessonId; // Store lessonId here
          console.log(`Fetched videos for lesson ${lessonId}:`, videos);
        } else {
          console.error('Invalid module or lesson index:', { moduleIndex, lessonIndex });
        }
      } else {
        console.warn(`No videos found for lesson ${lessonId}`);
      }
    },
    (error: any) => {
      console.error('Error fetching videos for lesson ' + lessonId, error);
    }
  );
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

  onSaveQuiz11() {
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






  ///////////////////////////// VALIDATIONS COURSELANDING /////////////////////////////////////


  isFormValid2(): boolean {
    console.log('Validating form');
    return !!this.level &&
      !!this.courseType &&
      !!this.courseDescription &&
      !!this.courseDuration &&
      !!this.courseLanguage &&
      this.whyEnrolls.length > 0 &&
      (this.courseType !== 'offline' || !!this.courseTerm) &&
      !!this.courseImage;
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

  prerequisites: string[] = [];
  tools: { name: string, image: SafeUrl | null, file: File | null }[] = [];
  skills: { name: string, image: SafeUrl | null, file: File | null }[] = [];

  addTool() {
    this.tools.push({ name: '', image: null, file: null });
  }

  addSkill() {
    this.skills.push({ name: '', image: null, file: null });
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
      alert('Please fill all required fields.');
      return;
    }

    this.formSubmitted = true;
    const formData = new FormData();

    // Add tools
    this.tools.forEach((tool) => {
      if (tool.name && tool.file) {
        formData.append('toolImages', tool.file); // Add the actual file
        formData.append('toolNames', tool.name);
      }
    });

    // Add skills
    this.skills.forEach((skill) => {
      if (skill.name && skill.file) {
        formData.append('skillImages', skill.file); // Add the actual file
        formData.append('skillNames', skill.name);
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
          // Now call the updatePercentage() method after successfully updating the course
          this.updatePercentage();

          // Navigate to Curriculum tab
          this.setCurrentTab('lesson');
        },
        (error) => {
          console.error('Failed to save tools and skills.', error);
          alert('Failed to save tools and skills.');
        }
      );
  }



  // Handle file selection for both tools and skills
  onFileSelected1(event: any, type: 'tool' | 'skill', index: number) {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));

      if (type === 'tool') {
        this.tools[index].image = fileUrl; // Display image
        this.tools[index].file = file; // Store the file for submission
      } else if (type === 'skill') {
        this.skills[index].image = fileUrl; // Display image
        this.skills[index].file = file; // Store the file for submission
      }
    }
  }


  // Method to fetch course tools, skills, and prerequisites data
  getCourseToolsData(): void {
    this.http.get(`${environment.apiBaseUrl}/courseTools/course/${this.courseId}`).subscribe(
      (response: any) => {
        if (response && response.length > 0) {
          response.forEach((item: any) => {
            // Add tool data, converting base64 string to safe URL and setting file to null
            this.tools.push({
              name: item.toolName,
              image: item.toolImage ? this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${item.toolImage}`) : null,
              file: null // Set file to null since it is not available from the backend
            });

            // Add skill data, converting base64 string to safe URL and setting file to null
            this.skills.push({
              name: item.skillName,
              image: item.skillImage ? this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${item.skillImage}`) : null,
              file: null // Set file to null
            });

            // Add prerequisite
            this.prerequisites.push(item.coursePrerequisites);
          });
        }
      },
      (error) => {
        console.error('Failed to fetch course tools data.', error);
        alert('Failed to fetch course tools data.');
      }
    );
  }

  ///////////////////// COURSE TRAILER /////////////////////////// 
  videoTrailers: { file: File | null, videoTrailerTitle: string, description: string }[] = [
    { file: null, videoTrailerTitle: ' ', description: 'Beginner' }, // Mandatory fields
    { file: null, videoTrailerTitle: ' ', description: 'Intermediate' }, // Optional
    { file: null, videoTrailerTitle: ' ', description: 'Advanced' } // Optional
  ];
  




  uploadResponses: string[] = [];

  onFilevideoTrailersSelected(event: any, index: number) {
    console.log(event.target.files[0]);  // Log the selected file
    this.videoTrailers[index].file = event.target.files[0];
    console.log('Updated trailer:', this.videoTrailers[index]); // Log trailer object
  }




  uploadTrailers() {
    console.log('Video trailers array:', this.videoTrailers); // Log the entire array to verify values

    const firstTrailer = this.videoTrailers[0];
    if (!firstTrailer.file || !firstTrailer.videoTrailerTitle || !firstTrailer.description) {
      console.log('First trailer fields:', firstTrailer); // Log the first trailer's fields
      alert('The first video trailer is mandatory. Please fill in all required fields.');
      return;
    }

    // Reset the responses
    this.uploadResponses = [];

    // Track the number of successful uploads
    let successCount = 0;

    // Iterate over videoTrailers and upload each if it has a file
    this.videoTrailers.forEach((trailer, index) => {
      if (trailer.file && trailer.videoTrailerTitle && trailer.description) {
        this.fusionService.uploadVideoTrailer(this.courseId, trailer.file, trailer.videoTrailerTitle, trailer.description)
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



  videoTrailerss: CourseVideoTrailer[] = []; // Correct type here

  fetchVideoTrailers(courseId: number): void {
    this.fusionService.getVideoTrailersByCourseId(courseId).subscribe({
      next: (response: CourseVideoTrailer[]) => { // Ensure correct type is used
        this.videoTrailerss = response;
      },
      error: (error) => {
        console.error('Error fetching video trailers:', error);
      }
    });
  }


  deleteVideoTrailer(id: number): void {
    if (confirm('Are you sure you want to delete this video trailer?')) {
      this.fusionService.deleteVideoTrailerById(id).subscribe({
        next: () => {
          // Remove the trailer from the list
          this.videoTrailerss = this.videoTrailerss.filter(trailer => trailer.id !== id);
          alert('Video trailer deleted successfully.');
        },
        error: (error) => {
          console.error('Error deleting video trailer:', error);
          alert('Error deleting video trailer.');
        }
      });
    }
  }
/////////////////////////////////////////////////////////////////////////////////////////////////
  //////////// fetch course 
  level_1: any;
  level_2: any;
  level_3: any;
  level_4: any;
  level_5: any;
  level_6: any;
  level_7: any;
  level_8: any;
  // courseImage: any;
  fetchCourseData(): void {
    this.fusionService.getCourseById(this.courseId).subscribe(
      (response: any) => {
        console.log('Course data fetched:', response);

        this.courseTitle = response.courseTitle;
        this.level = response.level;
        this.courseDescription = response.courseDescription;
        this.courseLanguage = response.courseLanguage;
        this.courseDuration = response.courseDuration;
        this.courseType = response.courseType;
        this.courseTerm = response.courseTerm;
        // this.courseTerm = response.courseTer

        this.level_1 = response.level_1;
        this.level_2 = response.level_2;
        this.level_3 = response.level_3;
        this.level_4 = response.level_4;
        this.level_5 = response.level_5;
        this.level_6 = response.level_6;
        this.level_7 = response.level_7;
        this.level_8 = response.level_8;
        this.level_2 = response.level_2;
        this.level_2 = response.level_2;
        this.level_2 = response.level_2;



        if (response.courseImage) {
          this.courseImage = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${response.courseImage}`);
        }




        this.onFieldChange();
      },
      (error: any) => {
        console.error('Error fetching course data:', error);
      }
    );
  }

/////////////////////////////////////
  onSubmit23(lessonId: number): void {
    if (this.assignmentForm.valid && this.selectedFile) {
      const formValues = this.assignmentForm.value;
      const startDate = new Date(formValues.startDate).toISOString().slice(0, 19);
      const endDate = new Date(formValues.endDate).toISOString().slice(0, 19);
      const reviewMeetDate = new Date(formValues.reviewMeetDate).toISOString().slice(0, 19);

      this.fusionService.uploadAssignment3(
        lessonId,
        this.courseId,
        formValues.assignmentTitle,
        formValues.assignmentTopicName,
        this.selectedFile,
        startDate,
        endDate,
        reviewMeetDate
      ).subscribe(
        response => {
          console.log('Upload successful', response);
          this.closePopup();
        },
        error => {
          console.error('Upload failed', error);
        }
      );
    } else {
      alert('Please fill in all fields and select a file.');
    }
  }
  // Fetch assignments by lessonId
    // Method to get assignments for a specific lesson
    assignments: Assignment[] = [];  // Store assignments here

    // getAssignmentsForLesson(lessonId: number): void {
    //   this.fusionService.getAssignmentsByLessonId(lessonId).subscribe(
    //     (assignments: Assignment[]) => {
    //       console.log(`Assignments for lesson ${lessonId}:`, assignments);
    //       this.assignments = assignments;  // Store or process assignments as needed
    //     },
    //     (error: any) => {
    //       console.error('Error fetching assignments:', error);
    //     }
    //   );
    // }
  /////////////////////////////////////////////

  onSubmit2(): void {
    if (this.assignmentForm.valid && this.selectedFile) {
      const formValues = this.assignmentForm.value;

      const startDate = formValues.startDate ? new Date(formValues.startDate) : new Date();
      const endDate = formValues.endDate ? new Date(formValues.endDate) : new Date();
      const reviewMeetDate = formValues.reviewMeetDate ? new Date(formValues.reviewMeetDate) : new Date();

      // Convert dates to format yyyy-MM-ddTHH:mm:ss
      const start = startDate.toISOString().slice(0, 19);
      const end = endDate.toISOString().slice(0, 19);
      const reviewDate = reviewMeetDate.toISOString().slice(0, 19);

      this.fusionService.uploadAssignment3(
        this.lessonId,
        this.courseId,
        formValues.assignmentTitle,
        formValues.assignmentTopicName,
        this.selectedFile,
        start,
        end,
        reviewDate,
        // Pass lessonModuleId if available
        this.lessonModuleId
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
  //////////// getting long course ///////////////

  selectedModuleId: number | null = null;

  fetchModules() {
    if (this.courseId) {
      this.fusionService.getLessonModulesByCourseId(this.courseId).subscribe(
        (response: any) => {
          this.modules = response.map((moduleData: any) => ({
            moduleId: moduleData.id,
            name: moduleData.moduleName,
            lessons: []
          }));
          console.log('Modules fetched successfully', this.modules);

          if (this.modules.length > 0 && this.modules[0].moduleId) {
            this.fetchLessonsByModuleId(this.modules[0].moduleId);
          }
        },
        (error) => {
          console.error('Error fetching modules', error);
        }
      );
    }
  }

  fetchLessonsByModuleId(moduleId: number) {
    if (moduleId !== null) {
      this.selectedModuleId = moduleId;
     
      console.log('Fetching lessons for module:', moduleId);
     
      this.fusionService.getLessonsByModuleId(moduleId).subscribe(
        (lessons: any[]) => {
          const moduleIndex = this.modules.findIndex(module => module.moduleId === moduleId);
         
          if (moduleIndex !== -1) {
            this.modules[moduleIndex].lessons = lessons.map((lesson: any, lessonIndex: number) => {
              const mappedLesson = {
                lessonId: lesson.id,
                lessonTitle: lesson.lessonTitle,
                lessonContent: lesson.lessonContent,
                lessonDescription: lesson.lessonDescription,
                lessonDuration: lesson.lessonDuration,
                uploadSets: lesson.uploadSets || [],
                videos: lesson.videos || []
              };
   
              // Fetch videos for each lesson
              this.getVideosByLessonIdlong(lesson.id, moduleIndex, lessonIndex);
   
              return mappedLesson;
            });
   
            console.log(`Lessons fetched successfully for module ${moduleId}`, this.modules[moduleIndex].lessons);
          } else {
            console.error(`Module with id ${moduleId} not found in this.modules array.`);
          }
        },
        (error) => {
          console.error(`Error fetching lessons for module ${moduleId}`, error);
        }
      );
    } else {
      console.error('Invalid moduleId: null');
    }
  }
   
   

  // Fetch videos by lesson ID
  // Modify the getVideosLongByLessonId function to match the UploadSet structure
  async getVideosLongByLessonId(lessonId: number, moduleIndex: number) {
    this.fusionService.getVideosLongByLessonId(lessonId).subscribe(
      async (videos: Video234[]) => {
        const lessonIndex = this.modules[moduleIndex].lessons.findIndex(lesson => this.lesson.lessonId === lessonId);
        if (lessonIndex !== -1) {
          // Convert URLs to File objects
          const uploadSets = await Promise.all(videos.map(async (video) => ({
            videoFiles: [await urlToFile(video.s3Url, video.videoTitle, 'video/mp4')],
            videoDescriptions: [`Description for ${video.videoTitle}`]
          })));

          this.modules[moduleIndex].lessons[lessonIndex].uploadSets = uploadSets;
        }
        console.log(`Videos fetched successfully for lesson ${lessonId}`, videos);
      },
      (error) => {
        console.error(`Error fetching videos for lesson ${lessonId}`, error);
      }
    );
  }



  fetchVideos1(lessonId: number): void {
    console.log(`Fetching videos for lessonId: ${lessonId}`); // Debug log
    this.fusionService.getVideosByLessonId(lessonId).subscribe(
      (response: Video234[]) => {
        console.log('Fetched videos successfully:', response);
        this.videos = response;
      },
      (error) => {
        console.error('Error fetching videos:', error);
      }
    );
  }
  // Method to fetch videos by lessonId
  getVideosByLessonIdforlongcourse(lessonId: number): void {
    this.fusionService.getVideosByLessonId(lessonId).subscribe(
      (videos: Video234[]) => {
        this.videos = videos;
        console.log('Fetched videos:', videos);
      },
      (error: any) => {
        console.error('Error fetching videos:', error);
      }
    );
  }
  ///////////// post course resourse document //////

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;

  selectedFiles: File[] = [];


  // Trigger file input click to open file dialog
  triggerResourseFileInput(): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }
  onResourseFileChange(event: any): void {
    const files: File[] = Array.from(event.target.files);
    this.selectedFiles.push(...files); // Append the new files to the selectedFiles array
  }

  removeResourseFile(index: number): void {
    this.selectedFiles.splice(index, 1); // Remove file by index
  }


  uploadResourseDocuments(): void {
    if (this.selectedFiles.length > 0) {
      this.fusionService.uploadResourseDocuments(this.courseId, this.selectedFiles).subscribe(
        (response) => {
          console.log('Documents uploaded successfully', response);
          alert('Documents uploaded successfully!');
        },
        (error) => {
          console.error('Error uploading documents', error);
        }
      );
    } else {
      alert('Please select files to upload.');
    }
  }

  ///////////// getting course resourse document //////
  documents: CourseDocuments[] = [];


  loadDocuments(): void {
    this.fusionService.getDocumentsByCourseId(this.courseId).subscribe(
      (response) => {
        this.documents = response;
      },
      (error) => {
        console.error('Error fetching documents', error);
      }
    );
  }
  downloadCourseDocument(documentData: string): void {
    // Convert the base64 document data into a binary format
    const binaryData = atob(documentData);

    // Convert the binary data into an array of bytes
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }

    // Create a Blob from the byte array and set the type to the correct document type
    const blob = new Blob([bytes], { type: 'application/pdf' });

    // Create a temporary download link and simulate a click
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.pdf'; // You can adjust this file name dynamically if needed
    a.click();

    // Clean up the URL object after download
    window.URL.revokeObjectURL(url);
  }
  ///////////// delete course resourse document //////
  deleteDocument(documentId: number): void {
    if (confirm('Are you sure you want to delete this document?')) {
      this.fusionService.deleteDocumentById(documentId).subscribe(
        () => {
          // Remove the document from the array after successful deletion
          this.documents = this.documents.filter(doc => doc.id !== documentId);
          console.log(`Document with ID ${documentId} deleted successfully.`);
        },
        (error) => {
          console.error('Error deleting document', error);
        }
      );
    }
  }
  // ================================== update course persentage ============================================
  coursePercentage: any;

  // Function to update course percentage
  updatePercentage() {
    this.fusionService.updateCoursePercentage(this.courseId, this.completionPercentage)
      .subscribe(
        response => {
          console.log('Course percentage updated successfully:', response);
          alert('Course percentage updated successfully!');
        },
        error => {
          console.error('Error updating course percentage:', error);
        }
      );
  }


  //////////////////// Instructions //////////////////





    isOverlayVisible = false;

    istoggleOverlay() {
      this.isOverlayVisible = !this.isOverlayVisible;
    }
  
    onOk() {
      // Handle OK action here
      this.isOverlayVisible = false;
      console.log('OK clicked');
    }
  
    onCancel() {
      // Handle Cancel action here
      this.isOverlayVisible = false;
      console.log('Cancel clicked');
    }
//////////////////////////// Celebrations /////////////////////////////
    showCelebration = false;
  flowers: Flower[] = [];
  celebrationItems: CelebrationItem[] = [];
 
  triggerCelebration() {
    this.showCelebration = true;
    setTimeout(() => {
      this.showCelebration = false;
    }, 6000); // Celebration lasts for 6 seconds
  }
  generateCelebrationItems() {
    const types = ['flower', 'star', 'circle', 'heart', 'triangle', 'diamond', 'hexagon', 'spiral', 'moon','moon','moon','moon', 'lightning'];
    const colors = ['#ff9999', '#ffcc99', '#99ff99', '#99ccff', '#cc99ff', '#ff6666', '#ff9966', '#66ff66', '#6699ff', '#9966ff'];
   
    for (let i = 0; i < 100; i++) {
      this.celebrationItems.push({
        type: types[Math.floor(Math.random() * types.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        left: `${Math.random() * 100}%`,
        animationDuration: `${2 + Math.random() * 2}s`, // Between 2-4 seconds
        animationDelay: `${Math.random() * 2}s`, // Delay up to 2 seconds
        size: 15 + Math.random() * 20, // Size between 10-30
        strokeWidth: (Math.random() * 2 + 1).toFixed(1) // Stroke width between 1 and 3
      });
    }
  }
 
 
  getCoordinate(index: number, total: number, type: 'sin' | 'cos'): number {
    const angle = (index / total) * 2 * Math.PI;
    return type === 'sin' ? Math.sin(angle) : Math.cos(angle);
  }
 
 
}

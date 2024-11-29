
 
import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FusionService, Lesson1, Project12, Video234 } from '../fusion.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
 

export interface Video {
  id: number;
  name: string;
  description: string;
  s3Url: string;
  courseId: number;
}
export interface Lesson {
  id: number;
  lessonTitle: string;
  lessonContent: string;
  lessonDescription: string;
  lessonDuration: number;
  // Ensure to include all other required properties from your API response
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
export interface Module {
  moduleId: number;

  name: string;
  lessons: LessonWithUploads[];
}

@Component({
  selector: 'app-updateaddcourse',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './updateaddcourse.component.html',
  styleUrl: './updateaddcourse.component.css'
})
export class UpdateaddcourseComponent implements OnInit  {
 
  currentTab: string = 'courselanding';
    // course
    course: any = {};
    courseTitle: any;
    courseType: string = '';
    courseTerm: string = '';
    level: string = '';
    courseDescription: string = '';
    language: string = '';
    newWhyEnroll: string = '';
    whyEnrolls: string[] = [];
    courseDuration: number = 0;
    courseImage: any;
    completionPercentage: any;
    editingWhyEnroll: string = '';
    editingWhyEnrollIndex: number | null = null;
    formData: any = {}; // Replace with your actual form data structure
    usersId: any;
    data: any;
    courseId: any;
  toolFile: any;
  skillFile: any;
  document: File | null | undefined;
project: any;
 
level_1:any;
level_2:any;
level_3:any;
level_4:any;
level_5:any;
level_6:any;
level_7:any;
level_8:any;
  lessonId: any;
 
 
    constructor(
      private fusionService: FusionService,
      private http: HttpClient,
      private router: Router,
      private fb: FormBuilder,
      private authService: AuthService,
      private route: ActivatedRoute,
      private sanitizer: DomSanitizer
 
    )  {}
 
  setCurrentTab(tab: string): void {
    this.currentTab = tab;
  }
  ngOnInit(): void {
    
    this.fetchVideos1(49);
        this.courseId = 95; 
   
    this.fetchModules();

    // this.courseId = '2'; // Set this to the appropriate value
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('courseId');
      if (this.courseId) {
        this.fetchCourseData();
      }
    });
    // this.route.params.subscribe(params => {
    //   this.courseId = +params['courseId']; // Assuming 'id' is the parameter name, convert to number if needed
    //   this.fetchCourseTools();
    // });
        // Optionally, fetch tools data on component initialization
        this.fetchCourseTools();
    // this.fetchCourseData();
    this.route.params.subscribe(params => {
      this.courseId = +params['courseId']; // The '+' operator converts the string to a number
      this.getCourseFeeDetails(this.courseId);
    });
 
    //////////////////////////////////////
    const courseId = this.getCourseId();
    this.getProjectDetails(courseId);
    //////////////////////////////////////
 
    // this.route.params.subscribe(params => {
    //   this.courseId = +params['courseId'];
    //   this.getProjectDetails(this.courseId);
    // });
    this.route.params.subscribe(params => {
      const courseId = +params['courseId']; // The '+' converts the string to a number
      if (courseId) {
        this.getProjectDetails(courseId);
      } else {
        console.error('No courseId found in URL');
        // Handle the error appropriately, maybe redirect to a 404 page or show an error message
      }
    });
    // this.lessons.push(this.createEmptyLesson());
 
    this.route.params.subscribe(params => {
      this.courseId = +params['courseId']; // Convert to number using '+'
      this.getLessons();
    });
 
   
    this.route.params.subscribe(params => {
      this.courseId = +params['courseId'];
      this.fetchVideos();
    });
 
this.updateCourseFee()
 
 
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id && !isNaN(+id)) {
        console.log(id)
        this.courseId = +id;
        this.loadCourseDetails();
      } else {
        console.error('Invalid course ID');
        this.router.navigate(['/courses']);
      }
    });
 
 
   
    this.courseId = this.route.snapshot.params['courseId'];
 
    this.courseId = +this.route.snapshot.paramMap.get('courseId')!;
   
    this.calculateCompletionPercentage();
  }
  navigateToDashboard() {
    this.router.navigate(['/mentordashboard']);
  }
  // updatecourse method
  onCourseImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.courseImage = input.files[0];
      this.onFieldChange();
 
 
    }
  }
  onFieldChange() {
    this.calculateCompletionPercentage();
 
    this.whyEnrolls = Object.values(this.formData).filter(value => value !== '') as string[];
 
  }
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
 
 
  fetchCourseData(): void {
    this.fusionService.getCourseById(this.courseId).subscribe(
      (response: any) => {
        console.log('Course data fetched:', response);
       
        this.courseTitle = response.courseTitle;
        this.level = response.level;
        this.courseDescription = response.courseDescription;
        this.language = response.language;
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
 
 
 
 
  submitUpdateCourse(): void {
    const courseData = new FormData();
    courseData.append('courseTitle', this.courseTitle || '');
    courseData.append('level', this.level || '');
    courseData.append('courseDescription', this.courseDescription || '');
    courseData.append('courseDuration', this.courseDuration.toString() || '');
    courseData.append('language', this.language || '');
    courseData.append('courseType', this.courseType || '');
    courseData.append('courseTerm', this.courseTerm || '');
    courseData.append('completionPercentage', this.completionPercentage.toString() || '');
    courseData.append('level_1', this.level_1 || '');
    courseData.append('level_2', this.level_2 || '');
    courseData.append('level_3', this.level_3 || '');
    courseData.append('level_4', this.level_4 || '');
    courseData.append('level_5', this.level_5 || '');
    courseData.append('level_6', this.level_6 || '');
    courseData.append('level_7', this.level_7 || '');
    courseData.append('level_8', this.level_8 || '');
 
 
 
    if (this.courseImage) {
      courseData.append('courseImage', this.courseImage);
    }
 
    this.fusionService.getCourseById(this.courseId).subscribe(
      (response: any) => {
        const courseId = response.courseId;
       
        console.log('Submitting course data:', courseData);
 
        this.fusionService.updateCourse(courseId, courseData).subscribe(
          (response) => {
            console.log('Course updated successfully', response);
            alert('Course updated successfully!');
          },
          (error) => {
            console.error('Error updating course', error);
            alert('Error updating course. Please try again.');
          }
        );
      },
      (error: any) => {
        console.error('Error fetching course data:', error);
        alert('Failed to fetch course data. Please try again.');
      }
    );
  }
 
 
 
 
 
  calculateCompletionPercentage() {
    let filledFields = 0;
    const totalFields = 19; // Total number of fields to be filled including new sections
 
    // General course fields
    if (this.courseTitle) filledFields++;
    if (this.level) filledFields++;
    if (this.courseDescription) filledFields++;
    if (this.courseImage) filledFields++;
    if (this.whyEnrolls.length > 5) filledFields++;
    if (this.courseDuration) filledFields++;
    if (this.courseType) filledFields++;
    if (this.courseTerm) filledFields++;
    if (this.language) filledFields++;
 
    // // Tool and skill fields
    if (this.toolName) filledFields++;
    if (this.toolImage) filledFields++;
    if (this.skillName) filledFields++;
    if (this.skillImage) filledFields++;
    if (this.coursePrerequisites) filledFields++;
    if (this.currency) filledFields++;
    if (this.courseFee) filledFields++;
    if (this.discountPercentage) filledFields++;
 
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
 
  //   // Curriculum section (assuming fields like courseModules, lessonsPerModule, etc.)
  //   if (this.courseCoupons && this.courseCoupons.length > 0) {
  //     filledFields += this.courseCoupons.reduce((acc, coupon) => {
  //       if (coupon.courseFee) acc++;
  //       if (coupon.expirationDate) acc++;
  //       if (coupon.discountPercentage) acc++;
  //       if (coupon.currency) acc++;
  //       return acc;
  //     }, 0);
  // }
 
    // // Pricing & Promotions section
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
 
 
 
// courseplanning
toolName: string = '';
skillName: string = '';
coursePrerequisites: string = '';
toolImage: File | null = null;
skillImage: File | null = null;
toolImagePreview: string | ArrayBuffer | null = null;
skillImagePreview: string | ArrayBuffer | null = null;
 
toolImageSrc: SafeUrl | undefined;
skillImageSrc: SafeUrl | undefined;
 
tool: any; // Define the tool property
 courseTools: any[] = []; // Array to hold fetched course tools
 
 imageUrl:any;
 skillImageUrl:any;
 
 
 fetchCourseTools(): void {
  this.fusionService.getCourseTools(this.courseId)
    .subscribe({
      next: (tools) => {
        if (tools.length > 0) {
          const firstTool = tools[0];
          this.toolName = firstTool.toolName;
          this.skillName = firstTool.skillName;
          this.coursePrerequisites = firstTool.coursePrerequisites;
 
          // Create SafeUrl for toolImage
          if (firstTool.toolImage) {
            this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${firstTool.toolImage}`);
          }
          if (firstTool.skillImage) {
            this.skillImageUrl = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${firstTool.skillImage}`);
          }
        }
        this.courseTools = tools;
      },
      error: (error) => {
        console.error('Error fetching course tools:', error);
      }
    });
}
createImageUrl(blobData: Blob, imageId: string): void {
  const reader = new FileReader();
  reader.onload = () => {
    const url = reader.result as string;
    this.setImageUrl(imageId, url);
  };
  reader.readAsDataURL(blobData);
}
  setImageUrl(imageId: string, url: string): void {
    switch (imageId) {
      case 'toolImage':
        this.toolImageSrc = this.sanitizer.bypassSecurityTrustUrl(url);
        break;
      case 'skillImage':
        this.skillImageSrc = this.sanitizer.bypassSecurityTrustUrl(url);
        break;
      default:
        break;
    }
  }
 
onFileChange(event: any, type: string) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (type === 'toolImage') {
        this.toolImagePreview = e.target.result;
        this.toolImage = file; // Store the file for upload
      } else if (type === 'skillImage') {
        this.skillImagePreview = e.target.result;
        this.skillImage = file; // Store the file for upload
      }
    };
    reader.readAsDataURL(file);
  }
}
 
previewFile(file: File, previewType: 'toolImagePreview' | 'skillImagePreview') {
  const reader = new FileReader();
  reader.onload = () => {
    if (previewType === 'toolImagePreview') {
      this.toolImagePreview = reader.result;
    } else if (previewType === 'skillImagePreview') {
      this.skillImagePreview = reader.result;
    }
  };
  reader.readAsDataURL(file);
}
updateCourseTools() {
  const formData = new FormData();
  formData.append('toolName', this.toolName);
  formData.append('skillName', this.skillName);
  formData.append('coursePrerequisites', this.coursePrerequisites);
  if (this.toolImage) {
    formData.append('toolImage', this.toolImage);
  }
  if (this.skillImage) {
    formData.append('skillImage', this.skillImage);
  }
 
  this.fusionService.updateCourseTools(this.courseId, formData).subscribe(
    response => {
      console.log('Course tools updated successfully', response);
    },
    error => {
      console.error('Error updating course tools', error);
    }
  );
}
 
 
 
 
 
// onToolFileSelected(event: Event): void {
//   const input = event.target as HTMLInputElement;
//   if (input.files && input.files.length > 0) {
//     this.toolImage = input.files[0];
//   }
// }
 
// onSkillFileSelected(event: Event): void {
//   const input = event.target as HTMLInputElement;
//   if (input.files && input.files.length > 0) {
//     this.skillImage = input.files[0];
//   }
// }
 
 // pricing and promotions
 
 currency: string = ''; // Provide a default value
 courseFee: number = 0; // Provide a default value
 discountPercentage: number = 0; // Provide a default value
 expirationDate: string = ''; // Provide a default value
 discountCoupons: { code: string; discountPercentage: number; expirationDate: string; isEditing: boolean; }[] = []; // Array to hold generated coupons
 
 promotions: number = 0;
 couponCode: string = '';
 promoCode!: string; // Variable to store the fetched promo code
 discountedFee: number = 0;
 totalAmount: number = 0;
 coursePercentage:any;
 
 getCourseFeeDetails(id: number): void {
  this.fusionService.getCourseFeeDetails(this.courseId).subscribe((course) => {
    this.currency = course.currency;
    this.courseFee = course.courseFee;
    this.discountPercentage = course.discountPercentage;
    this.expirationDate = course.promoCodeExpiration;
    this.promoCode=course.promoCode
 
  });
}
 
loadCourseDetails() {
  if (this.courseId !== null) {
    this.fusionService.getCourseById(this.courseId).subscribe(
      (data) => {
        this.course = data;
        console.log('Loaded course details:', this.course);
      },
      (error) => {
        console.error('Error loading course details:', error);
      }
    );
  }
}
 
 
updateCourseFee(): void {
  if (this.courseId) {
    const updateData = {
      courseFee: this.course.courseFee,
      discountPercentage: this.course.discountPercentage,
      expirationDate: this.course.expirationDate,
      coursePercentage:this.course.coursePercentage,
      currency: this.course.currency,
      promoCode: this.course.promoCode
    };
 
    this.fusionService.updateCourseFee(this.courseId, updateData).subscribe(
      (response) => {
        console.log('Course fee updated successfully:', response);
        this.loadCourseDetails(); // Reload the course details to reflect changes
      },
      (error) => {
        console.error('Error updating course fee:', error);
      }
    );
  } else {
    console.error('Cannot update course fee: Invalid course ID');
  }
}
 
 
 calculateDiscount() {
  const discountAmount = (this.courseFee * this.discountPercentage) / 100;
  this.discountedFee = this.courseFee - discountAmount - this.promotions;
  this.totalAmount = this.discountedFee;
  this.calculateCompletionPercentage();
 
 
}
 
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
submitAll() {
  console.log('Save all data...');
  alert('All data has been submitted successfully!');
}
// ////////////project //////////////
 
projects: Project12[] = [];
  selectedProject: Project12 | null = null;
 
  newProjectTitle: string = '';
  newProjectDescription: string = '';
  newprojectDeadline: string = '';
  projectDocument: File | null = null; // Adjust type as per your actual data type
 
  projectTitle: string = '';
  projectDescription: string = '';
  projectDeadline: string = '';
  projectDocumentName: string = ''; // Assuming this is where you store the document file name
 
 
  getProjectDetails(courseId: number): void {
    this.fusionService.getProjectsByCourse(courseId).subscribe(
      (projects: Project12[]) => {
        this.projects = projects;
        if (this.projects.length > 0) {
          this.selectedProject = this.projects[0]; // Select the first project by default
        }
      },
      error => {
        console.error('Error fetching projects:', error);
        // Handle the error appropriately
      }
    );
  }
  selectProject(project: Project12): void {
    this.selectedProject = project;
  }
  // updateProject(){
 
  // }
 
  updateProject(): void {
    if (!this.selectedProject) {
      return;
    }
 
    const formData = new FormData();
    formData.append('projectTitle', this.selectedProject.projectTitle);
    formData.append('projectDescription', this.selectedProject.projectDescription);
    formData.append('projectDeadline', this.selectedProject.projectDeadline);
    if (this.projectDocument) {
      formData.append('projectDocument', this.projectDocument);
    }
 
    const courseId = this.route.snapshot.paramMap.get('courseId');
    if (courseId !== null) {
      this.fusionService.updateProject(+courseId, formData).subscribe(
        response => {
          console.log('Project updated successfully', response);
          alert('Project updated successfully');
        },
        error => {
          console.error('Error updating project', error);
        }
      );
    } else {
      console.error('courseId is null');
    }
  }
  // Assuming documentFileName can be used to fetch the actual document if ne
  onNewProjectDocumentSelected(event: any): void {
    this.projectDocument = event.target.files[0];
  }
submitProjects() {
  // Add your logic for submitting projects
  console.log('Projects submitted:', this.projects);
}
private getCourseId(): number {
  // Replace with the actual logic to get the course ID
  return 1;
}
 
// updateProject(courseId: number, projectTitle: string, projectDescription: string, projectDeadline: string, document: File | null) {
//   if (!this.newProjectTitle || !this.newProjectDescription || !this.newprojectDeadline || !this.document) {
//     console.error('Missing required fields');
//     return;
//   }
 
//   this.fusionService.updateProject(courseId, this.newProjectTitle, this.newProjectDescription, this.newprojectDeadline, this.document)
//     .subscribe(
//       (response) => {
//         console.log('Project added successfully:', response);
//         // Handle success, show alert, etc.
//         // Optionally, you can refresh project list or navigate to another page
//       },
//       (error) => {
//         console.error('Error adding project:', error);
//         // Handle error, show alert, etc.
//       }
//     );
 
//   // Clear form fields after submission
//   this.clearNewProjectFields();
// }
 
////////////online & offline
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
lessonTitle: any;
lessonContent: any;
lessonDescription: any;
lessonDuration: any;
 
lesson: any = {};
  // lessons: Lesson[] = [];
 
  // lessons: Lesson1[] = [];
 
 
  getLessons(): void {
    this.fusionService.getLessonsByCourseId(this.courseId).subscribe(
      (lessons: Lesson1[]) => {
        this.lessons = lessons;
        console.log('Fetched lessons:', lessons);
        if (lessons.length > 0) {
          // Do something with the lessons if needed
        }
      },
      (error: any) => {
        console.error('Error fetching lessons:', error);
      }
    );
  }
 
 
  updateLesson(courseId: number, lessonId: number, updatedLesson: Lesson): void {
    this.fusionService.updateLesson(courseId, lessonId, updatedLesson).subscribe(
      (response: Lesson) => {
        console.log('Lesson updated successfully:', response);
        // Update lessons array if needed
        const updatedIndex = this.lessons.findIndex(l => l.id === response.id);
        if (updatedIndex !== -1) {
          this.lessons[updatedIndex] = response; // Assuming response contains updated lesson
        }
      },
      (error) => {
        console.error('Error updating lesson:', error);
      }
    );
  }
  // generateLesson(index: number) {
  //   const lesson: Lesson2 = this.lessons2[index];
   
  //   if (!lesson.lessonTitle || lesson.lessonTitle.trim() === '') {
  //     this.showAlert('Lesson title is required and cannot be empty.', 'error');
  //     return;
  //   }
   
  //   // Trim all string fields
  //   const lessonToSend: Lesson2 = {
  //     lessonTitle: lesson.lessonTitle.trim(),
  //     lessonContent: lesson.lessonContent?.trim() || '',
  //     lessonDescription: lesson.lessonDescription?.trim() || '',
  //     lessonDuration: lesson.lessonDuration || 0
  //   };
   
  //   console.log('Creating lesson:', lessonToSend);
   
  //   this.fusionService.createLesson(lessonToSend, this.courseId).subscribe(
  //     (response) => {
  //       this.lessonId = response.id
  //       console.log(this.lessonId)
  //       console.log('Lesson created successfully', response);
  //       this.showAlert('Lesson created successfully!', 'success');
  //       this.lessons2[index] = {
  //         lessonTitle: '',
  //         lessonContent: '',
  //         lessonDescription: '',
  //         lessonDuration: 0
  //       };
  //     },
  //     (error) => {
  //       console.error('Error creating lesson', error);
  //       this.showAlert('Error creating lesson. Please ensure all required fields are filled.', 'error');
  //     }
  //   );
  // }
 
 
  ////////////get videos
  // videos: Video[] = [];
  videos: Video234[] = [];
 
  fetchVideos(): void {
    this.fusionService.getVideosByCourse(this.courseId).subscribe(
      (data: Video234[]) => {
        this.videos = data;
        this.videos.forEach(video => console.log(video.s3Url)); // Log URLs for verification
      },
      error => {
        console.error('Error fetching videos:', error);
      }
    );
  }
 
  handleVideoError(event: Event, videoUrl: string): void {
    console.error('Error loading video:', event, 'URL:', videoUrl);
  }
 
  deleteLessonVideoById(id: number): void {
    this.fusionService.deleteVideoById(id).subscribe(
      response => {
        console.log('Video deleted successfully:', response);
        this.videos = this.videos.filter(video => video.id !== id);
      },
      error => {
        console.error('Error deleting video:', error);
      }
    );
  }
 
uploadSets: { videoFiles: File[], videoDescriptions: string[] }[] = [{ videoFiles: [], videoDescriptions: [] }];
onUpload(setIndex: number): void {
  const uploadSet = this.uploadSets[setIndex];
  for (const file of uploadSet.videoFiles) {
    this.fusionService.uploadVideoupdate(this.courseId, this.lessonId, file).subscribe(
      (event: any) => {
        if (event.status === 'progress') {
          console.log(`Video ${setIndex + 1}: ${event.message}% uploaded`);
        } else if (event.status === 'completed') {
          console.log(`Video ${setIndex + 1} uploaded successfully: ${event.message}`);
        }
      },
      (error: any) => {
        console.error(`Video ${setIndex + 1} upload failed: ${error}`);
      }
    );
  }
}
 
onSubmitLessonVideo(): void {
  for (const [setIndex, uploadSet] of this.uploadSets.entries()) {
    for (const file of uploadSet.videoFiles) {
      this.fusionService.uploadVideoupdate(this.courseId, this.lessonId, file).subscribe(
        (event: any) => {
          if (event.status === 'progress') {
            console.log(`Video ${setIndex + 1}: ${event.message}% uploaded`);
          } else if (event.status === 'completed') {
            console.log(`Video ${setIndex + 1} uploaded successfully: ${event.message}`);
          }
        },
        (error: any) => {
          console.error(`Video ${setIndex + 1} upload failed: ${error}`);
        }
      );
    }
  }
}
 
// onSubmitLessonVideo() {
  // if (this.courseId && this.lessonId) {
  //   const allDescriptionsFilled = this.uploadSets.every(set =>
  //     set.videoDescriptions.every(desc => desc.trim() !== '')
  //   );
 
  //   if (allDescriptionsFilled) {
  //     const formData = new FormData();
     
  //     this.uploadSets.forEach((set, setIndex) => {
  //       set.videoFiles.forEach((file, fileIndex) => {
  //         formData.append('file', file, file.name);
  //         formData.append('description', set.videoDescriptions[fileIndex]);
  //       });
  //     });
 
  //     formData.append('courseId', this.courseId.toString());
  //     formData.append('lessonId', this.lessonId.toString());
 
  //     // Log formData contents (for debugging)
  //     formData.forEach((value, key) => {
  //       console.log(key + ': ' + value);
  //     });
 
  //     this.fusionService.uploadVideos(formData, this.courseId, this.lessonId).subscribe(
  //       (response) => {
  //         console.log('Upload successful:', response);
  //         console.log('Uploaded sets:', this.uploadSets);
  //         this.resetForm();
  //         alert('Upload successful!'); // Show success alert
  //       },
  //       (error) => {
  //         console.error('Upload successful', error);
  //         alert('Upload successful'); // Show failure alert
  //       }
  //     );
  //   } else {
  //     alert('Please add descriptions for all videos.');
  //   }
  // } else {
  //   alert('Please ensure Course ID and Lesson ID are set.');
  // }
// }
 
  onFileVideoChange(event: any, setIndex: number): void {
    const files: FileList = event.target.files;
    this.uploadSets[setIndex].videoFiles = Array.from(files);
    this.uploadSets[setIndex].videoDescriptions = Array.from({ length: files.length }, () => '');
  }
 
 
addNewUploadSet() {
  this.uploadSets.push({ videoFiles: [], videoDescriptions: [] });
}
 
  lessonToSend(lessonToSend: any, courseId: any) {
    throw new Error('Method not implemented.');
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// modules: { name: string; lessons: any[] }[] = []; 
modules: Module[] = [];


activeModuleIndex: number = 0;
selectedModuleId: number | null = null;





addModule() {
  this.modules.push({ 
    moduleId: 0, // Use 0 as a placeholder for an unassigned ID
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
addLesson3(moduleIndex: number) {
  this.addNewLesson1(moduleIndex);
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
newLesson: any = {  // Define newLesson with properties
  lessonTitle: '',
  lessonContent: '',
  lessonDescription: '',
  lessonDuration: 0  // Adjust the default value based on your requirements
};
// modules: Module[]= [
//   {
//     name: 'Module 1',
//     lessons: [
//       {
//         lessonTitle: '',
//         lessonContent: '',
//         lessonDescription: '',
//         lessonDuration: 0,
//         uploadSets: []
//       }
//     ]
//   }
// ];


toggleLessons(moduleIndex: number) {
  this.activeModuleIndex = this.activeModuleIndex === moduleIndex ? -1 : moduleIndex;
}
enableDropdown() {
  // Implement logic here to enable dropdown based on module name edit
  // For example, set a flag or update a property to control toggleLessons behavior
}
removeModule(moduleIndex: number) {
  this.modules.splice(moduleIndex, 1);
  if (this.activeModuleIndex >= this.modules.length) {
    this.activeModuleIndex = this.modules.length - 1;
  }
}

// moduleId: any;
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
          
        },
        error => {
          console.error('Error creating lesson module', error);
          
          // Handle error (e.g., show an error message)
        }
      );
  }
}
isFormValid(): boolean {
 return this.modules.every(module => module.name.trim() !== '');
}
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
      },
      (error) => {
        console.error('Error fetching modules', error);
      }
    );
  }
}


moduleId:number=72;
lessons: any[] = []; // Initialize an array to hold lessons
// fetchLessons(): void {
//   if (this.moduleId) {
//     this.fusionService.getLessonsByModuleId(this.moduleId).subscribe(
//       (lessons: any[]) => {
//         this.modules = lessons.map((lesson) => ({
//           name: lesson.moduleName,
//           lessons: [{
//             lessonTitle: lesson.lessonTitle,
//             lessonContent: lesson.lessonContent,
//             lessonDescription: lesson.lessonDescription,
//             lessonDuration: lesson.lessonDuration,
//             uploadSets: [] 
//           }]
//         }));

       
//         if (this.modules.length > 0 && this.modules[0].lessons.length > 0) {
//           this.activeModuleIndex = 0; 
//         }

//         console.log('Lessons fetched successfully', this.modules);
//       },
//       (error) => {
//         console.error('Error fetching lessons', error);
//       }
//     );
//   } else {
//     console.error('moduleId is undefined');
//   }
// }
fetchLessonsByModuleId(moduleId: number) {
  if (moduleId !== null) {
    this.selectedModuleId = moduleId;
    this.fusionService.getLessonsByModuleId(moduleId).subscribe(
      (lessons: any[]) => {
        const moduleIndex = this.modules.findIndex(module => module.moduleId === moduleId);
        if (moduleIndex !== -1) {
          this.modules[moduleIndex].lessons = lessons.map((lesson: any) => ({
            lessonId: lesson.lessonId,
            lessonTitle: lesson.lessonTitle,
            lessonContent: lesson.lessonContent,
            lessonDescription: lesson.lessonDescription,
            lessonDuration: lesson.lessonDuration,
            uploadSets: lesson.uploadSets || []
          }));
        }
        console.log(`Lessons fetched successfully for module ${moduleId}`, lessons);
      },
      (error) => {
        console.error(`Error fetching lessons for module ${moduleId}`, error);
      }
    );
  }
}

saveLesson(moduleIndex: number, lessonForm: any) {
  // Implement your saveLesson logic here
  // You can use this.newLesson to access the form data and save it
  console.log('Saving lesson:', this.newLesson);
  // Example logic to save lesson to backend or update local state
  // Ensure to handle errors and success messages accordingly
}
// selectedModuleId: number | null = null; 
getModuleName(moduleId: number): string | undefined {
  const module = this.modules.find(module => module.moduleId === moduleId);
  return module ? module.name : undefined;
}
moduleIndex: any; // Add moduleIndex property

updateModule(module: any): void {
  // Prepare updated module data with predefined moduleId and new name
  const updatedModuleData = {
    id: this.moduleId, // Use predefined moduleId
    courseId: this.courseId,
    moduleName: module.name // Replace with your module name field
  };

  // Make PUT request to update module name
  this.fusionService.updateModule(updatedModuleData).subscribe(
    (updatedModule: any) => {
      console.log('Module updated successfully', updatedModule);
      // Display success alert
      alert('Module updated successfully');
    },
    (error) => {
      console.error('Error updating module', error);
      // Display error alert if updating module fails
      alert('Failed to update module');
    }
  );
}
updateLessonlong(Lesson3: any): void {
  // Create a new object with only the fields expected by the backend
  const lessonData = {
    lessonTitle: Lesson3.lessonTitle,
    lessonContent: Lesson3.lessonContent,
    lessonDescription: Lesson3.lessonDescription,
    lessonDuration: Lesson3.lessonDuration
  };
  
  console.log('Updating lesson:', lessonData);
  this.fusionService.updateLessonByLessonModuleId(72, lessonData).subscribe(
    (response) => {
      console.log('Lesson updated successfully:', response);
      alert('Lesson updated successfully');
    },
    (error) => {
      console.error('Error updating lesson:', error);
      alert('Failed to update lesson');
    }
  );
}


fetchVideos1(lessonId: number): void {
  this.fusionService.getVideosByLessonId(lessonId).subscribe(
    (response: Video234[]) => {
      console.log('Fetched videos succesfully:', response);
      this.videos = response;
    },
    (error) => {
      console.error('Error fetching videos:', error);
    }
  );
}
editVideo(video: any) {
  // Handle the edit action here
  console.log('Editing video:', video);
  // You can implement the logic to edit the video details
  // For example, open a dialog for editing the video URL
}


}
 
 
 
 